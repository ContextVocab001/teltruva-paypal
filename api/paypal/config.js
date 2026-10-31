export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const environment = process.env.PAYPAL_ENV || 'sandbox';

  if (!clientId) {
    return response.status(500).json({
      error: 'PAYPAL_CLIENT_ID is not configured',
    });
  }

  response.setHeader('Cache-Control', 'no-store');
  return response.status(200).json({
    clientId,
    environment,
    currency: 'USD',
  });
}
