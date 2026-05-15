const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { naam, kontakNommer, epos, liedjieNaam } = body

  if (!naam || !kontakNommer || !epos || !liedjieNaam) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) }
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'competitions@bliximstraat.com',
      subject: `Nuwe Inskrywing: ${naam}`,
      html: `
        <h2 style="color:#00e5ff;">Nuwe Inskrywing — Sagte Hande Kompetisie</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;">
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Naam:</td><td>${naam}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Kontak:</td><td>${kontakNommer}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">E-pos:</td><td>${epos}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Liedjie:</td><td><strong>${liedjieNaam}</strong></td></tr>
        </table>
      `,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    }
  } catch (err) {
    console.error('Resend error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Kon nie e-pos stuur nie.' }),
    }
  }
}
