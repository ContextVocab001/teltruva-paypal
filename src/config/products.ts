export const PAYMENT_PRODUCTS = {
  INITIAL_CASE: {
    code: 'INITIAL_CASE',
    name: 'Teltruva Case Support',
    description: 'One initial inquiry and two follow-up responses',
    amount: '9.99',
    currency: 'USD',
    includedInitialMessages: 1,
    includedFollowUps: 2,
    includedRevisionsPerMessage: 1,
  },
} as const;

export type PaymentProductCode = keyof typeof PAYMENT_PRODUCTS;

export const INITIAL_CASE_PRODUCT = PAYMENT_PRODUCTS.INITIAL_CASE;

// This configuration is for UI display only.
// The server remains the authoritative source for price and currency.
