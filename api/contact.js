// Vercel Serverless Function — Contact Form Handler
//
// Required env vars (set in Vercel project settings → Environment Variables):
//   RESEND_API_KEY     — API key from https://resend.com
//   CONTACT_TO_EMAIL   — inbox that receives form submissions
//   CONTACT_FROM_EMAIL — sender address on a domain verified with Resend
//                        (e.g. "MethodM Website <noreply@methodmlb.com>")
//
// If a different provider is chosen later, only sendEmail() needs to change.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  if (body.honeypot) {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.name || '').trim();
  const company = String(body.company || '').trim();
  const phone = String(body.phone || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  const meeting = body.meeting === true || body.meeting === 'on';

  if (!name || !company || !phone || !email) {
    return res.status(400).json({ ok: false, error: 'Missing required field.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address.' });
  }
  if (name.length > 200 || company.length > 200 || phone.length > 60 || email.length > 200 || message.length > 5000) {
    return res.status(400).json({ ok: false, error: 'Submission too long.' });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact form: missing env vars');
    return res.status(500).json({ ok: false, error: 'Server not configured.' });
  }

  const subject = `New inquiry from ${name} — ${company}${meeting ? ' (meeting requested)' : ''}`;
  const text = [
    `Name: ${name}`,
    `Company: ${company}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Meeting requested: ${meeting ? 'Yes' : 'No'}`,
    '',
    'Message:',
    message || '(none)'
  ].join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL,
        reply_to: email,
        subject,
        text
      })
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error', r.status, detail);
      return res.status(502).json({ ok: false, error: 'Could not send message.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form exception', err);
    return res.status(500).json({ ok: false, error: 'Could not send message.' });
  }
}
