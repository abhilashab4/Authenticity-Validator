import { useState } from "react";
import { useAuth } from "../AuthContext";
import CertificateFileUpload from "../components/CertificateFileUpload";
import CertificateCounter from "../components/CertificateCounter";

export default function UserPage() {
  const { logout } = useAuth();
  const [fakeCount, setFakeCount] = useState(0);
  const [scanOutput, setScanOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSubmit = async (file) => {
    try {
      setLoading(true);
      setScanOutput("Scanning file...");

      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("http://localhost:8000/auth/verify/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to scan certificate");

      const data = await res.json();
      const fakeCount = data.results.filter((r) => r.status === "fake").length;

      setFakeCount(fakeCount);
      setScanOutput(data.results);
    } catch (err) {
      console.error(err);
      setScanOutput([
        { status: "error", message: "Error while scanning. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center p-4">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">User Dashboard</h2>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CertificateFileUpload onSubmit={handleFileSubmit} />
          <CertificateCounter fakeCount={fakeCount} />
        </div>

        <div className="mt-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Scan Output</h3>
              <div className="bg-base-200 p-4 rounded-lg min-h-[150px] text-sm overflow-x-auto">
                {loading && <p>⏳ Scanning in progress...</p>}

                {!loading && !scanOutput && (
                  <p>No output yet. Upload a PDF/ZIP to start scanning.</p>
                )}

                {!loading && Array.isArray(scanOutput) && (
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>File</th>
                        <th>Status</th>
                        <th>Issuer / Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanOutput.map((result, idx) => (
                        <tr key={idx}>
                          <td>{result.file || "-"}</td>
                          <td
                            className={
                              result.status === "valid"
                                ? "text-green-600 font-semibold"
                                : result.status === "fake"
                                ? "text-red-600 font-semibold"
                                : "text-yellow-600 font-semibold"
                            }
                          >
                            {result.status}
                          </td>
                          <td>{result.issuer || result.message || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {!loading &&
                  typeof scanOutput === "string" &&
                  scanOutput !== "" && <p>{scanOutput}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
