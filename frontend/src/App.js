import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://t3-086-be-118865344431.us-central1.run.app";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: #f2f2f7;
    font-family: -apple-system, 'DM Sans', BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .note-card {
    animation: fadeIn 0.35s ease both;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .note-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff);
    opacity: 0;
    transition: opacity 0.2s ease;
    border-radius: 20px 20px 0 0;
  }

  .note-card:hover {
    box-shadow: 0 8px 28px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
    transform: translateY(-2px);
  }

  .note-card:hover::before {
    opacity: 1;
  }

  .btn-edit {
    background: rgba(0, 122, 255, 0.1);
    color: #007aff;
    border: none;
    border-radius: 10px;
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease;
    font-family: inherit;
  }

  .btn-edit:hover {
    background: rgba(0, 122, 255, 0.18);
  }

  .btn-delete {
    background: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
    border: none;
    border-radius: 10px;
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease;
    font-family: inherit;
  }

  .btn-delete:hover {
    background: rgba(255, 59, 48, 0.18);
  }

  .form-input {
    width: 100%;
    padding: 13px 16px;
    border-radius: 14px;
    border: 1.5px solid rgba(0,0,0,0.08);
    background: rgba(242,242,247,0.8);
    font-size: 15px;
    font-family: inherit;
    color: #1c1c1e;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    margin-bottom: 12px;
    display: block;
  }

  .form-input::placeholder {
    color: #aeaeb2;
  }

  .form-input:focus {
    border-color: #007aff;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  }

  .submit-btn {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    border: none;
    background: #1c1c1e;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    letter-spacing: 0.01em;
  }

  .submit-btn:hover {
    background: #2c2c2e;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    transform: translateY(-1px);
  }

  .submit-btn:active {
    transform: translateY(0);
  }

  .submit-btn.edit-mode {
    background: linear-gradient(135deg, #007aff, #0055d4);
  }

  .submit-btn.edit-mode:hover {
    background: linear-gradient(135deg, #1a8aff, #1162e0);
  }

  .toast {
    animation: slideDown 0.3s ease both;
    background: rgba(28, 28, 30, 0.88);
    backdrop-filter: blur(20px);
    color: #fff;
    padding: 12px 20px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.18);
  }

  .loading-dot {
    animation: pulse 1.2s ease infinite;
    display: inline-block;
  }

  .cancel-btn {
    background: none;
    border: none;
    color: #ff3b30;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    padding: 4px 0;
    display: inline-block;
    margin-top: 6px;
  }

  .cancel-btn:hover {
    text-decoration: underline;
  }
`;

export default function App() {
  const [notes, setNotes] = useState([]);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/notes`);
      setNotes(res.data);
    } catch (e) {
      setMessage("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async () => {
    if (!judul || !isi) return alert("Isi semua field!");
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/notes/${editId}`, { judul, isi });
        setMessage("Note berhasil diupdate");
        setEditId(null);
      } else {
        await axios.post(`${API}/notes`, { judul, isi });
        setMessage("Note berhasil ditambahkan");
      }
      setJudul("");
      setIsi("");
      fetchNotes();
    } catch (e) {
      setMessage("Terjadi error");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleEdit = (note) => {
    setJudul(note.judul);
    setIsi(note.isi);
    setEditId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus note ini?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/notes/${id}`);
      setMessage("Note berhasil dihapus");
      fetchNotes();
    } catch (e) {
      setMessage("Gagal menghapus");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    return new Date(tgl).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setJudul("");
    setIsi("");
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #e8eaf0 0%, #f2f2f7 40%, #eef0f5 100%)",
        padding: "40px 20px 60px",
      }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "linear-gradient(145deg, #1c1c1e, #3a3a3c)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              marginBottom: 14,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6M9 16h6M7 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2M9 3h6a1 1 0 010 2H9a1 1 0 010-2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "#1c1c1e",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}>
              Catatan
            </h1>
            <p style={{ fontSize: "15px", color: "#8e8e93", marginTop: 4, fontWeight: 400 }}>
              {notes.length} catatan tersimpan
            </p>
          </div>

          {message && <div className="toast">{message}</div>}

          <div style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "24px",
            padding: "24px",
            marginBottom: "28px",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
          }}>
            {editId && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
                padding: "10px 14px",
                background: "rgba(0, 122, 255, 0.07)",
                borderRadius: 12,
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#007aff", flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, color: "#007aff", fontWeight: 500 }}>
                  Mode Edit
                </span>
              </div>
            )}

            <input
              className="form-input"
              placeholder="Judul catatan"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />
            <textarea
              className="form-input"
              placeholder="Tulis isinya di sini..."
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              style={{ height: "100px", resize: "none", marginBottom: 12 }}
            />
            <button
              className={`submit-btn ${editId ? "edit-mode" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <span className="loading-dot">Menyimpan...</span>
                : editId ? "Simpan Perubahan" : "Tambah Catatan"
              }
            </button>
            {editId && (
              <button className="cancel-btn" onClick={cancelEdit}>
                Batalkan edit
              </button>
            )}
          </div>

          {loading && !notes.length ? (
            <div style={{ textAlign: "center", color: "#aeaeb2", padding: "40px 0", fontSize: 14 }}>
              <span className="loading-dot">Memuat catatan...</span>
            </div>
          ) : notes.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#aeaeb2",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: "0 auto", display: "block" }}>
                  <rect x="8" y="6" width="32" height="36" rx="6" stroke="#aeaeb2" strokeWidth="2"/>
                  <path d="M16 18h16M16 24h16M16 30h10" stroke="#aeaeb2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 500 }}>Belum ada catatan</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Tambahkan catatan pertamamu di atas</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
            }}>
              {notes.map((n, i) => (
                <div
                  key={n.id}
                  className="note-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <h3 style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1c1c1e",
                    marginBottom: "6px",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.35,
                  }}>
                    {n.judul}
                  </h3>
                  <p style={{
                    fontSize: "14px",
                    color: "#3a3a3c",
                    lineHeight: 1.6,
                    fontWeight: 400,
                    marginBottom: 10,
                  }}>
                    {n.isi}
                  </p>
                  <div style={{
                    fontSize: "12px",
                    color: "#aeaeb2",
                    marginBottom: "14px",
                    fontWeight: 400,
                  }}>
                    {formatTanggal(n.tanggal_dibuat)}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn-edit" onClick={() => handleEdit(n)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(n.id)}>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}