import type {
  CaptureOrderResponse,
  CreateOrderResponse,
  PayPalConfig,
  PaymentApiError,
} from '../types/payment';

const PAYPAL_API_ROUTES = {
  config: '/api/paypal/config',
  createOrder: '/api/paypal/create-order',
  captureOrder: '/api/paypal/capture-order',
} as const;

async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error('The payment service returned an invalid response.');
  }

  const data = (await response.json()) as T | PaymentApiError;

  if (!response.ok) {
    const apiError = data as PaymentApiError;
    throw new Error(apiError.error || 'The payment request failed.');
  }

  return data as T;
}

export async function getPayPalConfig(): Promise<PayPalConfig> {
  const response = await fetch(PAYPAL_API_ROUTES.config, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  return readJsonResponse<PayPalConfig>(response);
}

export async function createPayPalOrder(): Promise<CreateOrderResponse> {
  const response = await fetch(PAYPAL_API_ROUTES.createOrder, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  return readJsonResponse<CreateOrderResponse>(response);
}

export async function capturePayPalOrder(
  orderId: string
): Promise<CaptureOrderResponse> {
  const normalizedOrderId = orderId.trim();

  if (!normalizedOrderId) {
    throw new Error('A PayPal order ID is required.');
  }

  const response = await fetch(PAYPAL_API_ROUTES.captureOrder, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId: normalizedOrderId }),
  });

  return readJsonResponse<CaptureOrderResponse>(response);
}
