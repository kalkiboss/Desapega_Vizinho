import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmationModal.css';
interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onClose
}: ConfirmationModalProps) {

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="sidebar-backdrop active" onClick={onClose} style={{ zIndex: 11000 }} />

            <div className="custom-modal-overlay">
                <div className="custom-modal-card">

                    <button className="modal-close-icon" onClick={onClose} aria-label="Fechar modal">
                        <X size={18} />
                    </button>

                    <div className="modal-alert-header">
                        <div className="modal-alert-icon">
                            <AlertTriangle size={24} />
                        </div>
                        <h3>{title}</h3>
                    </div>

                    <p className="modal-alert-message">{message}</p>

                    <div className="modal-action-row">
                        <button type="button" className="btn btn-modal-cancel" onClick={onClose}>
                            {cancelText}
                        </button>
                        <button type="button" className="btn btn-modal-confirm" onClick={onConfirm}>
                            {confirmText}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}