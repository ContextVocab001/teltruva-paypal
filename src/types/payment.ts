import type { PaymentProductCode } from '../config/products';

export type PaymentStatus =
  | 'idle'
  | 'loading-config'
  | 'ready'
  | 'creating-order'
  | 'awaiting-approval'
  | 'capturing'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type PayPalEnvironment = 'sandbox' | 'live';

export type PayPalConfig = {
  clientId: string;
  environment: PayPalEnvironment;
  currency: string;
};

export type CreateOrderResponse = {
  orderId: string;
  status: string;
  product: {
    code: PaymentProductCode;
    amount: string;
    currency: string;
  };
};

export type CapturedAmount = {
  currency_code: string;
  value: string;
};

export type CaptureOrderResponse = {
  completed: true;
  orderId: string;
  status: 'COMPLETED';
  captureId: string;
  amount: CapturedAmount;
  paidAt: string;
};

export type PaymentReceipt = {
  productCode: PaymentProductCode;
  orderId: string;
  captureId: string;
  amount: CapturedAmount;
  paidAt: string;
  includedFollowUps: number;
};

export type PaymentApiError = {
  error: string;
  debugId?: string;
  status?: string;
};
