import { useEffect, useRef, useState } from 'react';
import { INITIAL_CASE_PRODUCT } from '../../config/products';
import type { TeltruvaCase } from '../../types/case';
import {
  capturePayPalOrder,
  createPayPalOrder,
  getPayPalConfig,
} from '../../api/paypal';
import type {
  CaptureOrderResponse,
  PayPalEnvironment,
  PaymentStatus,
} from '../../types/payment';

type PayPalCheckoutProps = {
  language: 'en' | 'ja' | 'es';
  caseContext?: Pick<TeltruvaCase, 'internalId' | 'displayCaseId'>;
  onCompleted: (capture: CaptureOrderResponse) => void;
};

type PayPalApprovalData = {
  orderId?: string;
};

type PayPalPaymentSession = {
  start: (
    options: { presentationMode: 'auto' },
    orderPromise: Promise<{ orderId: string }>
  ) => Promise<void>;
};

type PayPalSdkInstance = {
  findEligibleMethods: (options: {
    currencyCode: string;
    amount: string;
  }) => Promise<{
    isEligible: (method: string) => boolean;
  }>;
  createPayPalOneTimePaymentSession: (callbacks: {
    onApprove: (data: PayPalApprovalData) => Promise<void>;
    onCancel: () => void;
    onError: (error: unknown) => void;
  }) => PayPalPaymentSession;
};

type PayPalBrowserSdk = {
  createInstance: (options: {
    clientId: string;
    components: string[];
  }) => Promise<PayPalSdkInstance>;
};

declare global {
  interface Window {
    paypal?: PayPalBrowserSdk;
  }
}

const SDK_ELEMENT_ID = 'teltruva-paypal-web-sdk';

const copy = {
  en: {
    loading: 'Preparing secure checkout…',
    button: 'Pay securely with PayPal',
    creating: 'Creating payment…',
    approving: 'Complete the payment in the PayPal window.',
    capturing: 'Confirming payment…',
    completed: 'Payment completed.',
    cancelled: 'Payment was cancelled. You can try again.',
    unavailable: 'PayPal is not available for this transaction.',
    failed: 'The payment could not be completed. Please try again.',
  },
  ja: {
    loading: '安全な決済を準備しています…',
    button: 'PayPalで安全に支払う',
    creating: '決済を作成しています…',
    approving: 'PayPalの画面で決済を完了してください。',
    capturing: '決済を確認しています…',
    completed: '決済が完了しました。',
    cancelled: '決済はキャンセルされました。もう一度お試しいただけます。',
    unavailable: 'この取引ではPayPalを利用できません。',
    failed: '決済を完了できませんでした。もう一度お試しください。',
  },
  es: {
    loading: 'Preparando el pago seguro…',
    button: 'Pagar de forma segura con PayPal',
    creating: 'Creando el pago…',
    approving: 'Completa el pago en la ventana de PayPal.',
    capturing: 'Confirmando el pago…',
    completed: 'El pago se completó.',
    cancelled: 'El pago fue cancelado. Puedes intentarlo de nuevo.',
    unavailable: 'PayPal no está disponible para esta transacción.',
    failed: 'No se pudo completar el pago. Inténtalo de nuevo.',
  },
} as const;

function getSdkUrl(environment: PayPalEnvironment) {
  return environment === 'sandbox'
    ? 'https://www.sandbox.paypal.com/web-sdk/v6/core'
    : 'https://www.paypal.com/web-sdk/v6/core';
}

function loadPayPalSdk(environment: PayPalEnvironment): Promise<void> {
  if (window.paypal) {
    return Promise.resolve();
  }

  const existingScript = document.getElementById(
    SDK_ELEMENT_ID
  ) as HTMLScriptElement | null;

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Unable to load PayPal.')),
        { once: true }
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SDK_ELEMENT_ID;
    script.src = getSdkUrl(environment);
    script.async = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener(
      'error',
      () => reject(new Error('Unable to load PayPal.')),
      { once: true }
    );
    document.head.appendChild(script);
  });
}

function PayPalCheckout({
  language,
  caseContext,
  onCompleted,
}: PayPalCheckoutProps) {
  const text = copy[language];
  const paymentSessionRef = useRef<PayPalPaymentSession | null>(null);
  const onCompletedRef = useRef(onCompleted);
  const caseContextRef = useRef(caseContext);
  const [status, setStatus] = useState<PaymentStatus>('loading-config');
  const [message, setMessage] = useState<string>(text.loading);

  useEffect(() => {
    onCompletedRef.current = onCompleted;
  }, [onCompleted]);

  useEffect(() => {
    caseContextRef.current = caseContext;
  }, [caseContext]);

  useEffect(() => {
    let active = true;

    async function initializePayPal() {
      try {
        setStatus('loading-config');
        setMessage(text.loading);

        const config = await getPayPalConfig();
        await loadPayPalSdk(config.environment);

        if (!active || !window.paypal) {
          return;
        }

        const sdkInstance = await window.paypal.createInstance({
          clientId: config.clientId,
          components: ['paypal-payments'],
        });

        const eligibleMethods = await sdkInstance.findEligibleMethods({
          currencyCode: config.currency,
          amount: INITIAL_CASE_PRODUCT.amount,
        });

        if (!eligibleMethods.isEligible('paypal')) {
          setStatus('failed');
          setMessage(text.unavailable);
          return;
        }

        paymentSessionRef.current =
          sdkInstance.createPayPalOneTimePaymentSession({
            onApprove: async (data) => {
              if (!data.orderId) {
                setStatus('failed');
                setMessage(text.failed);
                return;
              }

              setStatus('capturing');
              setMessage(text.capturing);

              const capture = await capturePayPalOrder(data.orderId);

              if (!active) {
                return;
              }

              setStatus('completed');
              setMessage(text.completed);
              onCompletedRef.current(capture);
            },
            onCancel: () => {
              if (!active) {
                return;
              }

              setStatus('cancelled');
              setMessage(text.cancelled);
            },
            onError: (error) => {
              console.error('PayPal checkout error:', error);

              if (!active) {
                return;
              }

              setStatus('failed');
              setMessage(text.failed);
            },
          });

        setStatus('ready');
        setMessage('');
      } catch (error) {
        console.error('PayPal initialization error:', error);

        if (!active) {
          return;
        }

        setStatus('failed');
        setMessage(error instanceof Error ? error.message : text.failed);
      }
    }

    void initializePayPal();

    return () => {
      active = false;
      paymentSessionRef.current = null;
    };
  }, [text]);

  async function startPayment() {
    const paymentSession = paymentSessionRef.current;

    if (!paymentSession || status === 'completed') {
      return;
    }

    try {
      setStatus('creating-order');
      setMessage(text.creating);

      const orderPromise = createPayPalOrder(caseContextRef.current).then((order) => ({
        orderId: order.orderId,
      }));

      setStatus('awaiting-approval');
      setMessage(text.approving);

      await paymentSession.start({ presentationMode: 'auto' }, orderPromise);
    } catch (error) {
      console.error('PayPal payment start error:', error);
      setStatus('failed');
      setMessage(error instanceof Error ? error.message : text.failed);
    }
  }

  const isBusy =
    status === 'loading-config' ||
    status === 'creating-order' ||
    status === 'awaiting-approval' ||
    status === 'capturing';

  return (
    <section className="paypal-checkout" aria-live="polite">
      <button
        type="button"
        className="paypal-checkout__button"
        onClick={startPayment}
        disabled={
          status !== 'ready' && status !== 'cancelled' && status !== 'failed'
        }
      >
        {isBusy ? text.loading : text.button}
      </button>

      {message && (
        <p
          className={`paypal-checkout__message paypal-checkout__message--${status}`}
          role={status === 'failed' ? 'alert' : 'status'}
        >
          {message}
        </p>
      )}
    </section>
  );
}

export default PayPalCheckout;
