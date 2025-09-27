import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Backend/firebase/config.js";
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function validate() {
      try {
        const raw = localStorage.getItem("adminSession");
        if (!raw) {
          setUser(null);
          setChecking(false);
          return;
        }
        const session = JSON.parse(raw);
        if (!session || !session.uid) {
          setUser(null);
          setChecking(false);
          return;
        }
        const userRef = doc(db, "users", session.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          setUser(null);
          setChecking(false);
          return;
        }
        const data = snap.data();
        if (data.role !== "admin") {
          setUser(null);
          setChecking(false);
          return;
        }
        setUser({ id: data.id, role: data.role, uid: snap.id });
      } finally {
        setChecking(false);
      }
    }
    validate();
  }, []);

  if (checking) {
    return <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default RequireAuth;