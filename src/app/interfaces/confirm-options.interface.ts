export interface PickleConfirmation {
  cancelText?: string;
  confirmText?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}
