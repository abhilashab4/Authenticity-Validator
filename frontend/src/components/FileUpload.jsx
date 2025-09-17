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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">Upload Files</label>
        <input
          type="file"
          multiple
          accept=".pdf,.zip,image/*"
          onChange={(e) => setFiles(e.target.files)}
          className={`file-input file-input-bordered w-full ${error ? 'input-error' : ''}`}
        />
        {error && <p className="text-red-500 text-sm mt-1">Please upload at least one file.</p>}
      </div>
      <button type="submit" className="btn btn-primary w-full">Upload</button>
    </form>
  );
}

export default FileUpload;
