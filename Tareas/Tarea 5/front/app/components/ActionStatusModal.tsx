// @/app/components/ActionStatusModal.tsx
"use client";

interface ActionStatusModalProps {
  title: string;
  message: string;
  onClose: () => void;
  isLoading?: boolean;
  error?: boolean;
}

const ActionStatusModal = ({ title, message, onClose, isLoading, error }: ActionStatusModalProps) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title}</h2>
        <p className={error ? 'error-message' : ''}>{message}</p>
        <div className="modal-actions">
          {!isLoading && (
            <button type="button" onClick={onClose} className="button-primary">
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionStatusModal;
