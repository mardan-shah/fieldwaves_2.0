function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildClientConfirmationEmail(name: string, message: string): { html: string; text: string } {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message);
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Orange Header Bar -->
        <tr><td style="background-color:#FF5F1F;height:6px;"></td></tr>
        <!-- Logo -->
        <tr><td style="background-color:#141414;padding:32px 40px 24px;border-left:1px solid #333;border-right:1px solid #333;">
          <h1 style="margin:0;font-size:24px;font-weight:bold;color:#FF5F1F;letter-spacing:4px;text-transform:uppercase;">FIELDWAVES</h1>
        </td></tr>
        <!-- Main Content -->
        <tr><td style="background-color:#141414;padding:0 40px 32px;border-left:1px solid #333;border-right:1px solid #333;">
          <h2 style="color:#ffffff;font-size:20px;margin:0 0 16px;">Hello ${safeName},</h2>
          <p style="color:#B0B0B0;font-size:15px;line-height:1.6;margin:0 0 24px;">
            We have received your inquiry and our team is currently reviewing your project details.
          </p>
          <!-- Quoted Message -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="border-left:3px solid #FF5F1F;padding:16px 20px;background-color:#0a0a0a;">
              <p style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Your Message</p>
              <p style="color:#B0B0B0;font-size:14px;line-height:1.5;margin:0;white-space:pre-wrap;">${safeMessage}</p>
            </td></tr>
          </table>
          <p style="color:#B0B0B0;font-size:15px;line-height:1.6;margin:24px 0 0;">
            Our team will respond within <strong style="color:#ffffff;">24 hours</strong>. In the meantime, feel free to explore our work.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background-color:#0a0a0a;padding:24px 40px;border:1px solid #333;border-top:none;">
          <p style="color:#666;font-size:12px;margin:0;letter-spacing:1px;">
            &copy; ${new Date().getFullYear()} FieldWaves. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Hello ${name},

We have received your inquiry and our team is currently reviewing your project details.

Your Message:
${message}

Our team will respond within 24 hours.

- FieldWaves Team`;

  return { html, text };
}

export function buildAdminNotificationEmail(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
  date: string;
}): { html: string; text: string } {
  const { name, email, company, message, date } = data;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company || 'N/A');
  const safeMessage = escapeHtml(message);
  const safeDate = escapeHtml(date);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Orange Header Bar -->
        <tr><td style="background-color:#FF5F1F;height:6px;"></td></tr>
        <!-- Header -->
        <tr><td style="background-color:#141414;padding:32px 40px 24px;border-left:1px solid #333;border-right:1px solid #333;">
          <h1 style="margin:0;font-size:18px;font-weight:bold;color:#FF5F1F;letter-spacing:3px;text-transform:uppercase;">NEW CLIENT INQUIRY</h1>
          <p style="color:#666;font-size:12px;margin:8px 0 0;letter-spacing:1px;">${safeDate}</p>
        </td></tr>
        <!-- Data Table -->
        <tr><td style="background-color:#141414;padding:0 40px 24px;border-left:1px solid #333;border-right:1px solid #333;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #333;">
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #333;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px;width:100px;">Name</td>
              <td style="padding:12px 16px;border-bottom:1px solid #333;color:#fff;font-size:14px;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #333;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Email</td>
              <td style="padding:12px 16px;border-bottom:1px solid #333;color:#FF5F1F;font-size:14px;">
                <a href="mailto:${safeEmail}" style="color:#FF5F1F;text-decoration:none;">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid #333;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Company</td>
              <td style="padding:12px 16px;border-bottom:1px solid #333;color:#fff;font-size:14px;">${safeCompany}</td>
            </tr>
          </table>
        </td></tr>
        <!-- Message -->
        <tr><td style="background-color:#141414;padding:0 40px 32px;border-left:1px solid #333;border-right:1px solid #333;">
          <p style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Message</p>
          <div style="background-color:#0a0a0a;border-left:3px solid #FF5F1F;padding:20px;color:#B0B0B0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${safeMessage}</div>
        </td></tr>
        <!-- Quick Reply -->
        <tr><td style="background-color:#141414;padding:0 40px 32px;border-left:1px solid #333;border-right:1px solid #333;">
          <a href="mailto:${safeEmail}?subject=Re: Your Inquiry - FieldWaves" style="display:inline-block;background-color:#FF5F1F;color:#fff;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 24px;letter-spacing:1px;">REPLY TO ${safeName.toUpperCase()}</a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background-color:#0a0a0a;padding:24px 40px;border:1px solid #333;border-top:none;">
          <p style="color:#666;font-size:12px;margin:0;letter-spacing:1px;">FieldWaves Admin Notification System</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `NEW CLIENT INQUIRY
----------------------------------------
NAME:    ${name}
EMAIL:   ${email}
COMPANY: ${company || 'N/A'}
DATE:    ${date}

MESSAGE:
${message}
----------------------------------------`;

  return { html, text };
}
