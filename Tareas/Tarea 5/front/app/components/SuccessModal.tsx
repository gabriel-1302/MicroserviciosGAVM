// @/app/components/SuccessModal.tsx
"use client";

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal = ({ message, onClose }: SuccessModalProps) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Compra Registrada</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button button-primary">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
