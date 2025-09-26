export default function CertificateCounter({ fakeCount }) {
  return (
    <div className="card w-full bg-base-100 shadow-xl border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-2xl mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Verification Summary
        </h3>
        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
          <div>
            <span className="text-lg font-semibold">Fake Certificates Detected:</span>
            <p className="text-sm text-base-content/60 mt-1">Total scanned files</p>
          </div>
          <div className={`badge badge-lg ${fakeCount > 0 ? 'badge-error' : 'badge-success'}`}>
            {fakeCount}
          </div>
        </div>
        {fakeCount === 0}
      </div>
    </div>
  );
}
