import React from 'react';

function ResponseBox({ message }) {
  if (!message) return null;

  return (
    <div className="mt-6 p-4 border border-gray-300 rounded bg-gray-50">
      <p className="text-gray-700">{message}</p>
<button
  onClick={async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/download-qrcodes/');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificates_with_qr.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download failed:', err);
    }
  }}
  className="btn btn-outline btn-success mt-4 w-full"
>
  Download QR Code PDFs
</button>
    </div>
  );
}

export default ResponseBox;
