import React from 'react';

function InstitutionForm({ institution, setInstitution, error }) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2">Institution Name</label>
      <input
        type="text"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
        placeholder="Enter institution name"
        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">Institution name is required.</p>}
    </div>
  );
}

export default InstitutionForm;
