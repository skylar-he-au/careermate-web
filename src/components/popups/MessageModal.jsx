import Modal from "./Modal";
import "./MessageModal.css";

const messageTypes = {
  success: { icon: "✓", defaultTitle: "Success" },
  error: { icon: "×", defaultTitle: "Error" },
  warning: { icon: "!", defaultTitle: "Warning" },
  info: { icon: "i", defaultTitle: "Information" },
};

export default function MessageModal({
  open,
  type = "success",
  title,
  message,
  buttonText = "OK",
  onClose,
}) {
  const messageType = messageTypes[type] ?? messageTypes.info;

  return (
    <Modal
      open={open}
      title={title ?? messageType.defaultTitle}
      size="small"
      onClose={onClose}
      closeOnOverlay={false}
      footer={<button type="button" className="primary-button" onClick={onClose}>{buttonText}</button>}
    >
      <div className={`message-modal-content ${type}`}>
        <div className="message-modal-icon" aria-hidden="true">{messageType.icon}</div>
        <p>{message}</p>
      </div>
    </Modal>
  );
}
