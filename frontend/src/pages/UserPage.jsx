import { useState } from 'react';
import { useAuth } from '../AuthContext';
import CertificateFileUpload from '../components/CertificateFileUpload';
import CertificateCounter from '../components/CertificateCounter';

export default function UserPage() {
  const { logout } = useAuth();
  const [fakeCount, setFakeCount] = useState(0);

  const handleFileSubmit = (file) => {
    // Logic to count fake certificates will be added here later
    // For now, set a dummy count
    setFakeCount(Math.floor(Math.random() * 10)); // Dummy logic
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl">
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
      </div>
    </div>
  );
}
