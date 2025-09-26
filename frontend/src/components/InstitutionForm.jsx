import React from 'react';

function InstitutionForm({ institution, setInstitution, error }) {
  return (
    <div className="mb-8">
      <label className="label">
        <span className="label-text text-base-content font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Institution Name
        </span>
      </label>
      <input
        type="text"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
        placeholder="Enter the issuing institution name"
        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
      />
      <label className="label">
        <span className="label-text-alt text-base-content/60">The organization issuing the certificates</span>
      </label>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">Institution name is required.</span>
        </label>
      )}
    </div>
  );
}

export default InstitutionForm;
