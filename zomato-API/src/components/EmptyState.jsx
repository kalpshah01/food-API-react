export default function EmptyState({ message = 'Nothing found', icon = 'inbox' }) {
  return (
    <div className="empty-state">
      <i className={`bi bi-${icon}`}></i>
      <p>{message}</p>
    </div>
  );
}
