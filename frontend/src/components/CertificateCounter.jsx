export default function CertificateCounter({ fakeCount }) {
  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Certificate Counter</h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold">Fake Certificates Found:</span>
          <div className="badge badge-error badge-lg">{fakeCount}</div>
        </div>
      </div>
    </div>
  );
}
