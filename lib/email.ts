// ============================================================
// lib/email.ts — Nodemailer email service & HTML templates
// ============================================================
import nodemailer from 'nodemailer';

// ── Transporter ──────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ── Shared email wrapper ──────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"${process.env.BUSINESS_NAME || 'Atelier Noir'}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// ── Base HTML layout ──────────────────────────────────────────
function baseLayout(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Atelier Noir</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400&display=swap');
    body { margin:0; padding:0; background:#F5F0E8; font-family:'DM Sans',sans-serif; color:#0A0A0A; }
    .wrapper { max-width:580px; margin:0 auto; padding:32px 16px; }
    .card { background:#fff; border:1px solid #E2DDD5; padding:40px; }
    .logo { font-family:'Cormorant Garamond',serif; font-size:24px; letter-spacing:0.2em; text-transform:uppercase; color:#0A0A0A; margin-bottom:8px; }
    .logo span { color:#D4AF7A; }
    .divider { height:1px; background:#E2DDD5; margin:24px 0; }
    .label { font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:#8B8680; margin-bottom:6px; font-family:monospace; }
    .value { font-size:14px; color:#2C2C2C; margin-bottom:16px; }
    .highlight-box { background:#FAF7F2; border-left:3px solid #D4AF7A; padding:16px 20px; margin:20px 0; }
    .btn { display:inline-block; background:#0A0A0A; color:#F5F0E8 !important; padding:12px 28px; text-decoration:none; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; font-family:monospace; margin-top:8px; }
    .btn-accept { background:#2C7A2C; }
    .btn-decline { background:#8B0000; }
    h2 { font-family:'Cormorant Garamond',serif; font-weight:300; font-size:28px; margin:0 0 8px; }
    p { font-size:13px; line-height:1.7; color:#4A4540; margin:0 0 12px; }
    .footer { text-align:center; padding-top:24px; font-size:11px; color:#8B8680; font-family:monospace; letter-spacing:0.05em; }
    .status-confirmed { color:#2C7A2C; font-weight:600; }
    .status-cancelled { color:#8B0000; font-weight:600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div style="text-align:center;padding-bottom:24px;">
      <div class="logo">ATELIER<span>·</span>NOIR</div>
      <div style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8B8680;font-family:monospace;">
        Fashion Atelier
      </div>
    </div>
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      © Atelier Noir · All rights reserved<br/>
      <a href="mailto:${process.env.BUSINESS_EMAIL}" style="color:#D4AF7A;">${process.env.BUSINESS_EMAIL || 'hello@ateliernoir.com'}</a>
    </div>
  </div>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ══════════════════════════════════════════════════════════════

// 1. Notify BUSINESS of new appointment request
export async function sendAppointmentRequestToBusiness(apt: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  designerName: string;
  type: string;
  date: string;
  time: string;
  notes: string;
  id: string;
}) {
  const html = baseLayout(`
    <h2>New Appointment Request</h2>
    <p>A client has requested an appointment. Please review the details below and confirm or decline.</p>
    <div class="divider"></div>

    <div class="highlight-box">
      <div class="label">Client</div>
      <div class="value">${apt.customerName}</div>
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${apt.customerEmail}">${apt.customerEmail}</a></div>
      ${apt.customerPhone ? `<div class="label">Phone</div><div class="value">${apt.customerPhone}</div>` : ''}
    </div>

    <div class="label">Appointment Type</div>
    <div class="value">${apt.type}</div>
    <div class="label">Designer</div>
    <div class="value">${apt.designerName}</div>
    <div class="label">Requested Date & Time</div>
    <div class="value">${apt.date} at ${apt.time}</div>
    ${apt.notes ? `<div class="label">Client Notes</div><div class="value">${apt.notes}</div>` : ''}

    <div class="divider"></div>
    <p>Log into the admin panel to confirm or cancel this appointment.</p>
    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/appointments" class="btn">
      Manage Appointments →
    </a>
  `);

  await sendEmail(
    process.env.BUSINESS_EMAIL || process.env.EMAIL_USER || '',
    `New Appointment Request — ${apt.customerName} (${apt.date})`,
    html
  );
}

// 2. Notify CUSTOMER their appointment was confirmed
export async function sendAppointmentConfirmedToCustomer(apt: {
  customerName: string;
  customerEmail: string;
  designerName: string;
  type: string;
  date: string;
  time: string;
}) {
  const html = baseLayout(`
    <h2>Appointment Confirmed</h2>
    <p>Dear ${apt.customerName},</p>
    <p>We are delighted to confirm your appointment at Atelier Noir. We look forward to welcoming you.</p>

    <div class="highlight-box">
      <div class="label">Service</div>
      <div class="value">${apt.type}</div>
      <div class="label">Designer</div>
      <div class="value">${apt.designerName}</div>
      <div class="label">Date & Time</div>
      <div class="value" style="font-size:16px;font-weight:500;">${apt.date} at ${apt.time}</div>
    </div>

    <p>Please arrive 5–10 minutes early. If you need to reschedule, contact us at least 48 hours in advance.</p>
    <p>Should you have any questions before your visit, don't hesitate to reach out.</p>
    <div class="divider"></div>
    <a href="mailto:${process.env.BUSINESS_EMAIL || 'hello@ateliernoir.com'}" class="btn">
      Contact Us
    </a>
  `);

  await sendEmail(
    apt.customerEmail,
    `Your Appointment is Confirmed — ${apt.date} at ${apt.time}`,
    html
  );
}

// 3. Notify CUSTOMER their appointment was declined
export async function sendAppointmentDeclinedToCustomer(apt: {
  customerName: string;
  customerEmail: string;
  designerName: string;
  type: string;
  date: string;
  time: string;
}) {
  const html = baseLayout(`
    <h2>Appointment Update</h2>
    <p>Dear ${apt.customerName},</p>
    <p>We regret to inform you that we are unable to accommodate your appointment request for the requested date and time. We sincerely apologize for any inconvenience.</p>

    <div class="highlight-box">
      <div class="label">Requested Service</div>
      <div class="value">${apt.type}</div>
      <div class="label">Designer</div>
      <div class="value">${apt.designerName}</div>
      <div class="label">Requested Date & Time</div>
      <div class="value">${apt.date} at ${apt.time}</div>
      <div style="margin-top:8px;font-size:12px;" class="status-cancelled">Status: Unavailable</div>
    </div>

    <p>We encourage you to book again at a different date or time — our designers would love to work with you. You can also reach us directly to find a suitable slot.</p>
    <div class="divider"></div>
    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/customer/appointments" class="btn">
      Book Again →
    </a>
    &nbsp;
    <a href="mailto:${process.env.BUSINESS_EMAIL || 'hello@ateliernoir.com'}" class="btn" style="background:#8B8680;">
      Contact Us
    </a>
  `);

  await sendEmail(
    apt.customerEmail,
    `Regarding Your Appointment Request — Atelier Noir`,
    html
  );
}

// 4. Order confirmation to customer (no payment required)
export async function sendOrderConfirmationToCustomer(order: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: { name: string; size: string; qty: number; price: number }[];
  total: number;
  address: string;
  paymentMethod: string;
}) {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #E2DDD5;font-size:13px;">${item.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E2DDD5;font-size:12px;color:#8B8680;font-family:monospace;">Size ${item.size} × ${item.qty}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E2DDD5;font-size:13px;text-align:right;">NPR ${(item.price * item.qty).toLocaleString()}</td>
    </tr>
  `).join('');

  const html = baseLayout(`
    <h2>Order Received</h2>
    <p>Dear ${order.customerName},</p>
    <p>Thank you for your order. We have received it and will process it shortly. Our team will contact you to arrange delivery and payment.</p>

    <div class="highlight-box">
      <div class="label">Order ID</div>
      <div class="value" style="font-family:monospace;">${order.orderId}</div>
      <div class="label">Payment Method</div>
      <div class="value">${order.paymentMethod}</div>
    </div>

    <div class="label">Items Ordered</div>
    <table style="width:100%;border-collapse:collapse;margin-top:8px;">
      ${itemRows}
      <tr>
        <td colspan="2" style="padding:12px 0;font-size:12px;color:#8B8680;">Total</td>
        <td style="padding:12px 0;font-family:'Cormorant Garamond',serif;font-size:22px;text-align:right;">NPR ${order.total.toLocaleString()}</td>
      </tr>
    </table>

    <div class="label" style="margin-top:16px;">Delivery Address</div>
    <div class="value">${order.address}</div>

    <div class="divider"></div>
    <p style="font-size:12px;color:#8B8680;">Our team will reach out within 24 hours to confirm your order and arrange delivery. For urgent inquiries, please contact us directly.</p>
    <a href="mailto:${process.env.BUSINESS_EMAIL || 'hello@ateliernoir.com'}" class="btn">Contact Us</a>
  `);

  await sendEmail(
    order.customerEmail,
    `Order Received — ${order.orderId} | Atelier Noir`,
    html
  );
}
