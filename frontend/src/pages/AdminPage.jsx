import React, { useState } from 'react';
import InstitutionForm from '../components/InstitutionForm';
import FileUpload from '../components/FileUpload';
import ResponseBox from '../components/ResponseBox';

function AdminPage() {
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
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Upload Panel</h2>
      <InstitutionForm institution={institution} setInstitution={setInstitution} error={instError} />
      <FileUpload onSubmit={handleFileSubmit} error={fileError} />
      <ResponseBox message={response} />
    </div>
  );
}

export default AdminPage;
