const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

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


