import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../Backend/firebase/config.js";
import { useNavigate, useLocation } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fromPath = (location.state && location.state.from) || "/admin/events";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("id", "==", email), where("password", "==", password), where("role", "==", "admin"));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        throw new Error("Invalid credentials or not an admin");
      }
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const session = { id: userData.id, role: userData.role, uid: userDoc.id };
      localStorage.setItem("adminSession", JSON.stringify(session));
      navigate(fromPath, { replace: true });
    } catch (err) {
      const msg = (err && err.message) || "Failed to sign in";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: 320, display: "flex", flexDirection: "column", gap: 12, border: "1px solid #ddd", borderRadius: 8, padding: 24, background: "#fff" }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Admin Login</h2>
        <label>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Email</div>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }} />
        </label>
        <label>
          <div style={{ fontSize: 14, marginBottom: 4 }}>Password</div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }} />
        </label>
        {error ? <div style={{ color: "#b00020", fontSize: 14 }}>{error}</div> : null}
        <button type="submit" disabled={loading} style={{ padding: 10, borderRadius: 6, border: "none", background: "#111827", color: "white", cursor: "pointer" }}>{loading ? "Signing in..." : "Sign In"}</button>
      </form>
    </div>
  );
}

export default AdminLogin;


