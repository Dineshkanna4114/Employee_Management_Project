import { X, AlertTriangle } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null

    const maxWidths = { sm: '420px', md: '600px', lg: '800px' }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                style={{ maxWidth: maxWidths[size] }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal confirm-dialog" onClick={e => e.stopPropagation()}>
                <div className="modal-body" style={{ padding: '2rem' }}>
                    <div className="confirm-icon">
                        <AlertTriangle size={32} color="#f43f5e" />
                    </div>
                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>{title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}
