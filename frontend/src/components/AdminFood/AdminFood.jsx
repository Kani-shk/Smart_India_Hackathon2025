import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";

const AdminFood = () => {
  const [contributors, setContributors] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const contributorsQuery = query(collection(db, "contributors"), orderBy("lastContributionAt", "desc"));
    const unsubContributors = onSnapshot(
      contributorsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setContributors(items);
        setError("");
        setLoading(false);
      },
      (err) => {
        setError(err && err.message ? err.message : "Failed to load contributors");
        setLoading(false);
      }
    );

    const submissionsQuery = query(collection(db, "foodContributions"), orderBy("createdAt", "desc"), limit(25));
    const unsubSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecentSubmissions(items);
    });

    return () => {
      unsubContributors();
      unsubSubmissions();
    };
  }, []);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px 0"
    }}>
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        padding: "0 20px"
      }}>
        {/* Header */}
        <div style={{ 
          background: "white", 
          borderRadius: "12px", 
          padding: "24px", 
          marginBottom: "24px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <div>
              <h1 style={{ 
                margin: "0", 
                fontSize: "28px", 
                fontWeight: "700", 
                color: "#1f2937",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                🍽️ Food Contributions
              </h1>
              <p style={{ 
                margin: "8px 0 0 0", 
                color: "#6b7280", 
                fontSize: "16px" 
              }}>
                Track all food contribution submissions
              </p>
            </div>
            <button 
              onClick={() => navigate('/admin/events')}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
            >
              ← Back to Events
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div style={{ 
            background: "white", 
            borderRadius: "12px", 
            padding: "40px", 
            textAlign: "center",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}>
            <div style={{ 
              display: "inline-block", 
              width: "40px", 
              height: "40px", 
              border: "4px solid #f3f4f6", 
              borderTop: "4px solid #667eea", 
              borderRadius: "50%", 
              animation: "spin 1s linear infinite" 
            }}></div>
            <p style={{ margin: "16px 0 0 0", color: "#6b7280", fontSize: "16px" }}>Loading contributions...</p>
          </div>
        )}

        {error && (
          <div style={{ 
            background: "#fef2f2", 
            border: "1px solid #fecaca", 
            borderRadius: "12px", 
            padding: "20px", 
            marginBottom: "24px",
            color: "#dc2626"
          }}>
            <p style={{ margin: "0", fontWeight: "500" }}>❌ {error}</p>
          </div>
        )}

        {/* Table Container */}
        <div style={{ 
          background: "white", 
          borderRadius: "12px", 
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              fontSize: "14px"
            }}>
              <thead>
                <tr style={{ 
                  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  borderBottom: "2px solid #e2e8f0"
                }}>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    fontWeight: "600", 
                    color: "#374151",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>When</th>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    fontWeight: "600", 
                    color: "#374151",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Provider</th>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    fontWeight: "600", 
                    color: "#374151",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Type</th>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    fontWeight: "600", 
                    color: "#374151",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Contact</th>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    fontWeight: "600", 
                    color: "#374151",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Phone</th>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    fontWeight: "600", 
                    color: "#374151",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Food</th>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    fontWeight: "600", 
                    color: "#374151",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Qty</th>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    fontWeight: "600", 
                    color: "#374151",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((s, index) => (
                  <tr 
                    key={s.id}
                    style={{ 
                      borderBottom: "1px solid #f3f4f6",
                      transition: "all 0.2s ease",
                      background: index % 2 === 0 ? "#ffffff" : "#fafbfc"
                    }}
                    onMouseOver={(e) => {
                      e.target.parentElement.style.background = "#f0f9ff";
                    }}
                    onMouseOut={(e) => {
                      e.target.parentElement.style.background = index % 2 === 0 ? "#ffffff" : "#fafbfc";
                    }}
                  >
                    <td style={{ 
                      padding: "16px 20px", 
                      color: "#6b7280",
                      fontSize: "13px",
                      whiteSpace: "nowrap"
                    }}>
                      {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString() : ""}
                    </td>
                    <td style={{ 
                      padding: "16px 20px", 
                      color: "#374151",
                      fontWeight: "500"
                    }}>
                      {s.providerName || ""}
                    </td>
                    <td style={{ 
                      padding: "16px 20px", 
                      color: "#6b7280"
                    }}>
                      <span style={{
                        background: "#e0e7ff",
                        color: "#3730a3",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "capitalize"
                      }}>
                        {s.providerType || ""}
                      </span>
                    </td>
                    <td style={{ 
                      padding: "16px 20px", 
                      color: "#374151",
                      fontWeight: "500"
                    }}>
                      {s.contactPerson || ""}
                    </td>
                    <td style={{ 
                      padding: "16px 20px", 
                      color: "#6b7280",
                      fontFamily: "monospace"
                    }}>
                      {s.phone || ""}
                    </td>
                    <td style={{ 
                      padding: "16px 20px", 
                      color: "#374151",
                      maxWidth: "200px",
                      wordWrap: "break-word"
                    }}>
                      {s.foodType || ""}
                    </td>
                    <td style={{ 
                      padding: "16px 20px", 
                      color: "#6b7280",
                      fontWeight: "500"
                    }}>
                      {s.quantity ? `${s.quantity} ${s.unit || ""}` : ""}
                    </td>
                    <td style={{ 
                      padding: "16px 20px", 
                      color: "#6b7280",
                      maxWidth: "200px",
                      wordWrap: "break-word"
                    }}>
                      {s.location || ""}
                    </td>
                  </tr>
                ))}
                {!loading && recentSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ 
                      textAlign: "center", 
                      padding: "60px 20px", 
                      color: "#9ca3af",
                      fontSize: "16px"
                    }}>
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        gap: "12px" 
                      }}>
                        <div style={{ fontSize: "48px" }}>🍽️</div>
                        <p style={{ margin: "0", fontWeight: "500" }}>No contributions yet</p>
                        <p style={{ margin: "0", fontSize: "14px" }}>Food contributions will appear here once submitted</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        {!loading && recentSubmissions.length > 0 && (
          <div style={{ 
            background: "white", 
            borderRadius: "12px", 
            padding: "20px", 
            marginTop: "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }}>
            <div style={{ 
              display: "flex", 
              gap: "24px", 
              flexWrap: "wrap",
              justifyContent: "center"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "700", 
                  color: "#667eea",
                  marginBottom: "4px"
                }}>
                  {recentSubmissions.length}
                </div>
                <div style={{ 
                  fontSize: "14px", 
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Total Contributions
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "700", 
                  color: "#10b981",
                  marginBottom: "4px"
                }}>
                  {new Set(recentSubmissions.map(s => s.phone)).size}
                </div>
                <div style={{ 
                  fontSize: "14px", 
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  Unique Contributors
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminFood;


