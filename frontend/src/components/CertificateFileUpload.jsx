import { useState } from 'react';

export default function CertificateFileUpload({ onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('Please select a PDF file first.');
      return;
    }
    onSubmit(selectedFile);
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Upload PDF Certificate</h3>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select PDF File</span>
          </label>
          <input
            type="file"
            accept=".pdf"
            className="file-input file-input-bordered file-input-primary"
            onChange={handleFileChange}
          />
        </div>
        {selectedFile && (
          <div className="mt-4">
            <p className="text-sm">Selected File: {selectedFile.name}</p>
          </div>
        )}
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
