import React from 'react';

function ResponseBox({ message }) {
  if (!message) return null;

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Response
        </h3>
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{message}</span>
        </div>
        <div className="card-actions justify-center mt-4">
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
            className="btn btn-success btn-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download QR Code PDFs
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResponseBox;
