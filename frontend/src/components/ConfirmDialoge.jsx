export default function ConfirmDialog({open, title, message, confirmLabel, busy, onConfirm, onCancel}){
    if(!open){
        return null;
    }
    return (
        <div className="overlay" onClick={onCancel}>
            <div className="dialog" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="actions">
                    <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
                    <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
                        {busy ? "Working..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}