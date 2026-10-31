import { randomUUID } from 'node:crypto';

const PAYPAL_API = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live: 'https://api-m.paypal.com',
};

function getPayPalBaseUrl() {
  const environment = process.env.PAYPAL_ENV || 'sandbox';

  if (environment !== 'sandbox' && environment !== 'live') {
    throw new Error('PAYPAL_ENV must be sandbox or live');
  }

  return PAYPAL_API[environment];
}

function isValidInternalCaseId(caseId) {
  return (
    typeof caseId === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(caseId)
  );
}

function isValidDisplayCaseId(displayCaseId) {
  return (
    typeof displayCaseId === 'string' &&
    /^TLT-[0-9]{4}-[A-Z2-9]{6}$/.test(displayCaseId)
  );
}

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('PayPal token error:', {
      status: response.status,
      error: data?.error,
      description: data?.error_description,
    });

    throw new Error('Unable to authenticate with PayPal');
  }

  return data.access_token;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { caseId, displayCaseId } = request.body || {};
    const hasCaseContext = caseId !== undefined || displayCaseId !== undefined;

    if (
      hasCaseContext &&
      (!isValidInternalCaseId(caseId) || !isValidDisplayCaseId(displayCaseId))
    ) {
      return response.status(400).json({
        error: 'Valid Teltruva case identifiers are required',
      });
    }

    const accessToken = await getAccessToken();

    const product = {
      code: 'INITIAL_CASE',
      description: 'Teltruva case support with two follow-ups',
      amount: '9.99',
      currency: 'USD',
    };

    const purchaseUnit = {
      reference_id: product.code,
      description: product.description,
      amount: {
        currency_code: product.currency,
        value: product.amount,
      },
      ...(hasCaseContext
        ? {
            custom_id: caseId,
            invoice_id: displayCaseId,
          }
        : {}),
    };

    const paypalResponse = await fetch(
      `${getPayPalBaseUrl()}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': randomUUID(),
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [purchaseUnit],
        }),
      },
    );

    const order = await paypalResponse.json();

    if (!paypalResponse.ok) {
      console.error('PayPal create-order error:', {
        status: paypalResponse.status,
        name: order?.name,
        message: order?.message,
        debugId: order?.debug_id,
      });

      return response.status(paypalResponse.status).json({
        error: 'Unable to create PayPal order',
        debugId: order?.debug_id,
      });
    }

    return response.status(200).json({
      orderId: order.id,
      status: order.status,
      caseId: hasCaseContext ? caseId : null,
      displayCaseId: hasCaseContext ? displayCaseId : null,
      product: {
        code: product.code,
        amount: product.amount,
        currency: product.currency,
      },
    });
  } catch (error) {
    console.error(
      'Create-order server error:',
      error instanceof Error ? error.message : error,
    );

    return response.status(500).json({
      error: 'Unable to create the payment order',
    });
  }
}
