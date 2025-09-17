import React from 'react';

function ResponseBox({ message }) {
  if (!message) return null;

  return (
    <div className="mt-6 p-4 border border-gray-300 rounded bg-gray-50">
      <p className="text-gray-700">{message}</p>
      <button
        onClick={() => window.location.href = '/download-qrcodes'}
        className="btn btn-outline btn-success mt-4 w-full"
      >
        Download QR Code PDFs
      </button>
    </div>
  );
}

export default ResponseBox;
