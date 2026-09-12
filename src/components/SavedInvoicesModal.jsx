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
          {list.map((row) => {
            const title = row.data?.titleName || row.inv_no || "Untitled Invoice";
            const clientName = row.data?.clName ? `Client: ${row.data.clName}` : "";
            const invNum = row.data?.invNo ? `Inv #: ${row.data.invNo}` : "";
            const details = [clientName, invNum].filter(Boolean).join(" • ");

            return (
              <li key={row.id}>
                <div>
                  <div className="modal-list-title">{title}</div>
                  <div className="modal-list-sub">
                    {details ? details + " | " : ""}
                    {row.updated_at ? new Date(row.updated_at).toLocaleString("en-IN") : ""}
                  </div>
                </div>
                <div className="modal-list-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => onLoad(row.id)}>Load</button>
                  <button className="btn btn-danger" type="button" onClick={() => onDelete(row.id)}>Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
