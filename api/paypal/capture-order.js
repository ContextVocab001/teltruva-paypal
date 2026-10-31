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

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  );
  const paypalResponse = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await paypalResponse.json();
  if (!paypalResponse.ok) {
    throw new Error('Unable to authenticate with PayPal');
  }
  return data.access_token;
}

function isValidOrderId(orderId) {
  return typeof orderId === 'string' && /^[A-Z0-9]{10,30}$/i.test(orderId);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orderId = request.body?.orderId;
    if (!isValidOrderId(orderId)) {
      return response
        .status(400)
        .json({ error: 'A valid PayPal order ID is required' });
    }

    const accessToken = await getAccessToken();
    const paypalResponse = await fetch(
      `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(
        orderId
      )}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `capture-${orderId}`,
        },
        body: '{}',
      }
    );

    const capture = await paypalResponse.json();
    if (!paypalResponse.ok) {
      console.error('PayPal capture error:', {
        status: paypalResponse.status,
        name: capture?.name,
        message: capture?.message,
        debugId: capture?.debug_id,
      });
      return response.status(paypalResponse.status).json({
        error: 'Unable to complete the PayPal payment',
        debugId: capture?.debug_id,
      });
    }

    const capturedPayment =
      capture?.purchase_units?.[0]?.payments?.captures?.[0];
    if (
      capture.status !== 'COMPLETED' ||
      capturedPayment?.status !== 'COMPLETED'
    ) {
      return response.status(409).json({
        error: 'The payment has not been completed',
        status: capture.status,
      });
    }

    return response.status(200).json({
      completed: true,
      orderId: capture.id,
      status: capture.status,
      captureId: capturedPayment.id,
      amount: capturedPayment.amount,
      paidAt: capturedPayment.create_time,
    });
  } catch (error) {
    console.error(
      'Capture-order server error:',
      error instanceof Error ? error.message : error
    );
    return response
      .status(500)
      .json({ error: 'Unable to complete the payment' });
  }
}
