import { useState } from 'react';

export default function CertificateFileUpload({ onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (
      file.type === "application/pdf" ||
      file.type === "application/zip" ||
      file.name.endsWith(".zip")
    ) {
      setSelectedFile(file);
    } else {
      alert("Please select a valid PDF or ZIP file.");
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert("Please select a PDF or ZIP file first.");
      return;
    }
    onSubmit(selectedFile);
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-2xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Certificate
        </h3>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Select PDF or ZIP File</span>
          </label>
          <input
            type="file"
            accept=".pdf,.zip"
            className="file-input file-input-bordered file-input-primary w-full"
            onChange={handleFileChange}
          />
          <label className="label">
            <span className="label-text-alt text-base-content/60">Supported formats: PDF, ZIP</span>
          </label>
        </div>
        {selectedFile && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <p className="text-sm font-medium">Selected File:</p>
            <p className="text-sm text-primary">{selectedFile.name}</p>
            <p className="text-xs text-base-content/60 mt-1">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        <div className="card-actions justify-end mt-6">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={!selectedFile}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verify Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
