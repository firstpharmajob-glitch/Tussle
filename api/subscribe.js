const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function respond(res, status, payload) {
  res.status(status).json(payload);
}

module.exports = async function subscribe(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return respond(res, 405, { message: 'Method not allowed.' });
  }

  if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) {
    return respond(res, 415, { message: 'Send the signup as JSON.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return respond(res, 400, { message: 'That signup could not be read. Please try again.' });
    }
  }

  if (!body || typeof body !== 'object' || Buffer.byteLength(JSON.stringify(body)) > 2048) {
    return respond(res, 400, { message: 'That signup could not be read. Please try again.' });
  }

  if (typeof body.website === 'string' && body.website.trim()) {
    return respond(res, 400, { message: 'Signup could not be accepted.' });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return respond(res, 400, { message: 'Enter a valid email address.' });
  }

  const projectUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!projectUrl || !serviceKey) {
    return respond(res, 503, { message: 'Email signup is being set up. Please try again soon.' });
  }

  let restUrl;
  try {
    const parsedUrl = new URL(projectUrl);
    if (parsedUrl.protocol !== 'https:') {
      return respond(res, 503, { message: 'Email signup is temporarily unavailable.' });
    }
    restUrl = `${parsedUrl.origin}/rest/v1/newsletter_subscribers?on_conflict=email`;
  } catch {
    return respond(res, 503, { message: 'Email signup is temporarily unavailable.' });
  }

  try {
    const result = await fetch(restUrl, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates,return=minimal',
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(8000),
    });

    if (!result.ok) {
      console.error('Supabase newsletter insert failed with status', result.status);
      return respond(res, 502, { message: 'We could not save your email right now. Please try again.' });
    }

    return respond(res, 200, { message: 'You’re on the list. Watch your inbox.' });
  } catch (error) {
    console.error('Supabase newsletter request failed:', error.name || 'UnknownError');
    return respond(res, 502, { message: 'We could not reach the signup service. Please try again.' });
  }
};
