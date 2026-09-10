export default function SavedInvoicesModal({ list, loading, onClose, onLoad, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Saved invoices</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {loading && <div className="modal-empty">Loading…</div>}
        {!loading && list.length === 0 && <div className="modal-empty">No saved invoices yet.</div>}

        <ul className="modal-list">
          {list.map((row) => (
            <li key={row.id}>
              <div>
                <div className="modal-list-title">{row.inv_no || "Untitled"}</div>
                <div className="modal-list-sub">
                  {row.updated_at ? new Date(row.updated_at).toLocaleString("en-IN") : ""}
                </div>
              </div>
              <div className="modal-list-actions">
                <button className="btn btn-ghost" type="button" onClick={() => onLoad(row.id)}>Load</button>
                <button className="btn btn-danger" type="button" onClick={() => onDelete(row.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
