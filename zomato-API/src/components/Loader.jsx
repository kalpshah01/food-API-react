export default function Loader() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center gap-3"
      style={{ height: '400px' }}
    >
      <div
        className="spinner-border"
        role="status"
        style={{ width: '2.5rem', height: '2.5rem', color: '#d4a017', borderWidth: '3px' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading...</span>
    </div>
  );
}
