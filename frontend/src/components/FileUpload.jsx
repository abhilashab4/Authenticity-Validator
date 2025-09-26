import React, { useState } from 'react';

function FileUpload({ onSubmit, error }) {
  const [files, setFiles] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      alert('Please select at least one file.');
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-6">
        <label className="label">
          <span className="label-text text-base-content font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Certificate Files
          </span>
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,.zip,image/*"
          onChange={(e) => setFiles(e.target.files)}
          className={`file-input file-input-bordered w-full ${error ? 'file-input-error' : 'file-input-primary'}`}
        />
        <label className="label">
          <span className="label-text-alt text-base-content/60">Select multiple PDF, ZIP, or image files</span>
        </label>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">Please upload at least one file.</span>
          </label>
        )}
      </div>
      {files && files.length > 0 && (
        <div className="mb-6 p-4 bg-base-200 rounded-lg">
          <p className="text-sm font-medium mb-2">Selected Files ({files.length}):</p>
          <ul className="text-sm space-y-1">
            {Array.from(files).map((file, index) => (
              <li key={index} className="flex justify-between">
                <span>{file.name}</span>
                <span className="text-base-content/60">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button type="submit" className="btn btn-primary btn-lg w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Issue Certificates
      </button>
    </form>
  );
}

export default FileUpload;
