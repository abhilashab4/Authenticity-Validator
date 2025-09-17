import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import InstitutionForm from '../components/InstitutionForm';
import FileUpload from '../components/FileUpload';
import ResponseBox from '../components/ResponseBox';

function AdminPage() {
  const { logout } = useAuth();
  const [institution, setInstitution] = useState('');
  const [response, setResponse] = useState('');
  const [instError, setInstError] = useState(false);
  const [fileError, setFileError] = useState(false);

  const handleFileSubmit = async (formData) => {
    // Validate before submitting
    if (!institution.trim()) {
      setInstError(true);
      return;
    }
    setInstError(false);

    if (!formData.has('files')) {
      setFileError(true);
      return;
    }
    setFileError(false);

    formData.append('institutionName', institution);
    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResponse(data.message || 'Files uploaded successfully!');
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-base-100 shadow-xl rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center flex-1">Admin Upload Panel</h2>
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
      <InstitutionForm institution={institution} setInstitution={setInstitution} error={instError} />
      <FileUpload onSubmit={handleFileSubmit} error={fileError} />
      <ResponseBox message={response} />
    </div>
  );
}

export default AdminPage;
