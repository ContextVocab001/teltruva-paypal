import type { MouseEvent } from 'react';
import PaymentSummary from './PaymentSummary';
import PayPalCheckout from './PayPalCheckout';
import type { CaptureOrderResponse } from '../../types/payment';
import './payment.css';

type PaymentModalProps = {
  language: 'en' | 'ja' | 'es';
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (capture: CaptureOrderResponse) => void;
};

const copy = {
  en: {
    dialogLabel: 'Teltruva payment',
    close: 'Close payment window',
    back: 'Back to case details',
  },
  ja: {
    dialogLabel: 'Teltruvaの決済',
    close: '決済画面を閉じる',
    back: '案件内容に戻る',
  },
  es: {
    dialogLabel: 'Pago de Teltruva',
    close: 'Cerrar la ventana de pago',
    back: 'Volver a los detalles del caso',
  },
} as const;

function PaymentModal({
  language,
  isOpen,
  onClose,
  onCompleted,
}: PaymentModalProps) {
  if (!isOpen) {
    return null;
  }

  const text = copy[language];

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="payment-modal-backdrop"
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        className="payment-modal"
        role="dialog"
        aria-modal="true"
        aria-label={text.dialogLabel}
      >
        <button
          type="button"
          className="payment-modal__close"
          onClick={onClose}
          aria-label={text.close}
        >
          ×
        </button>

        <PaymentSummary language={language} />

        <PayPalCheckout language={language} onCompleted={onCompleted} />

        <button type="button" className="payment-modal__back" onClick={onClose}>
          {text.back}
        </button>
      </section>
    </div>
  );
}

export default PaymentModal;
