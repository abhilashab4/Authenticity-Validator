import { useState } from "react";
import CertificateFileUpload from "../components/CertificateFileUpload";
import CertificateCounter from "../components/CertificateCounter";

export default function UserPage() {
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
      <div className="w-full max-w-6xl">
        <h2 className="text-4xl font-bold mb-8 text-center">User Dashboard</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CertificateFileUpload onSubmit={handleFileSubmit} />
          <CertificateCounter fakeCount={fakeCount} />
        </div>

        <div className="mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl">Scan Results</h3>
              <div className="bg-base-200 p-6 rounded-lg min-h-[200px] text-sm overflow-x-auto">
                {loading && (
                  <div className="flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                    <span className="ml-2">Scanning in progress...</span>
                  </div>
                )}

                {!loading && !scanOutput && (
                  <p className="text-center text-gray-500">
                    No output yet. Upload a PDF/ZIP to start scanning.
                  </p>
                )}

                {!loading && Array.isArray(scanOutput) && (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-base-300">
                          <th>File Name</th>
                          <th>Status</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanOutput.map((result, idx) => (
                          <tr key={idx} className="hover:bg-base-300">
                            <td className="font-medium">{result.file || "-"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  result.status === "valid"
                                    ? "badge-success"
                                    : result.status === "fake"
                                    ? "badge-error"
                                    : "badge-warning"
                                }`}
                              >
                                {result.status}
                              </span>
                            </td>
                            <td>{result.issuer || result.message || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
