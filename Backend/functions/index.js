const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// Email transport configuration (use functions:config)
// Run: firebase functions:config:set mail.host="smtp.gmail.com" mail.user="YOUR_EMAIL" mail.pass="YOUR_APP_PASSWORD" mail.to="notify@example.com" mail.from="SharePlate <no-reply@shareplate>"
const mailConfig = functions.config().mail || {};
const transporter = nodemailer.createTransporter({
  host: mailConfig.host || "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: mailConfig.user || "",
    pass: mailConfig.pass || ""
  }
});

exports.loginAdmin = functions.region('asia-south2').https.onCall(async (data, context) => {
  try {
    const id = (data && data.id) || "";
    const password = (data && data.password) || "";

    console.log("Login attempt:", { id, password: "***" });

    if (!id || !password) {
      throw new functions.https.HttpsError("invalid-argument", "Missing credentials");
    }

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("id", "==", id).limit(1).get();
    
    if (snapshot.empty) {
      console.log("No user found with id:", id);
      throw new functions.https.HttpsError("permission-denied", "Invalid credentials");
    }

    const doc = snapshot.docs[0];
    const user = doc.data();
    
    console.log("User found:", { 
      id: user.id, 
      hasPassword: !!user.password, 
      hasPasswordHash: !!user.passwordHash,
      role: user.role 
    });

    // Check both password and passwordHash fields for flexibility
    const userPassword = user.password || user.passwordHash;
    const userRole = user.role;

    if (!userPassword || userPassword !== password) {
      console.log("Password mismatch");
      throw new functions.https.HttpsError("permission-denied", "Invalid credentials");
    }

    if (userRole !== "admin" && userRole !== "Admin") {
      console.log("Role mismatch:", userRole);
      throw new functions.https.HttpsError("permission-denied", "Invalid credentials");
    }

    console.log("Login successful");
    return { uid: doc.id, id: user.id, role: user.role };
  } catch (error) {
    console.error("Login error:", error);
    const msg = (error && error.message) || 'internal';
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', msg);
  }
});

exports.validateAdmin = functions.region('asia-south2').https.onCall(async (data, context) => {
  const uid = (data && data.uid) || "";
  if (!uid) {
    throw new functions.https.HttpsError("invalid-argument", "Missing uid");
  }
  const snap = await db.collection("users").doc(uid).get();
  if (!snap.exists) {
    throw new functions.https.HttpsError("not-found", "User not found");
  }
  const user = snap.data();
  if (user.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Not admin");
  }
  return { ok: true, id: user.id, role: user.role };
});

// Send email on new food contribution
exports.notifyOnFoodContribution = functions.region('asia-south2').firestore
  .document('foodContributions/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data() || {};
    const toEmail = mailConfig.to || mailConfig.user;
    if (!toEmail) {
      console.warn('Email not sent: no recipient configured');
      return null;
    }

    const subject = `New Food Contribution: ${data.providerName || 'Unknown Provider'}`;
    const createdAt = (data.createdAt && data.createdAt.toDate) ? data.createdAt.toDate() : new Date();
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="margin: 0 0 12px;">New Food Contribution</h2>
        <p style="margin: 0 0 12px; color: #555;">${createdAt.toLocaleString()}</p>
        <h3 style="margin: 16px 0 8px;">Provider</h3>
        <ul style="margin: 0; padding-left: 18px;">
          <li><strong>Name/Entity:</strong> ${data.providerName || '-'}</li>
          <li><strong>Type:</strong> ${data.providerType || '-'}</li>
          <li><strong>Location:</strong> ${data.location || '-'}</li>
        </ul>
        <h3 style="margin: 16px 0 8px;">Food Details</h3>
        <ul style="margin: 0; padding-left: 18px;">
          <li><strong>Food:</strong> ${data.foodType || '-'}</li>
          <li><strong>Quantity:</strong> ${data.quantity || '-'} ${data.unit || ''}</li>
        </ul>
        <h3 style="margin: 16px 0 8px;">Contact</h3>
        <ul style="margin: 0; padding-left: 18px;">
          <li><strong>Contact Person:</strong> ${data.contactPerson || '-'}</li>
          <li><strong>Phone:</strong> ${data.phone || '-'}</li>
        </ul>
        ${data.additionalInfo ? `<p style="margin-top:12px"><strong>Additional Info:</strong> ${data.additionalInfo}</p>` : ''}
      </div>
    `;

    const from = mailConfig.from || mailConfig.user || 'no-reply@shareplate';
    try {
      await transporter.sendMail({
        from,
        to: toEmail,
        subject,
        html
      });
      console.log('Notification email sent for foodContributions:', context.params.docId);
    } catch (err) {
      console.error('Failed to send email for foodContributions:', err);
    }
    return null;
  });

