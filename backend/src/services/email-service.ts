import nodemailer from "nodemailer";
export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams): Promise<void> {
  await transporter.sendMail({
    from: `"PawCare" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html,
  });
}

export async function sendPetReviewStatusNotification(
  to: string,
  name: string,
  petName: string,
  status: "approved" | "rejected" | "in_review",
) {
  const statusMap = {
    approved: {
      label: "Approved",
      message: `Your pet has been approved on PawCare. You can now manage their profile, book appointments, and explore adoption listings.`,
    },
    rejected: {
      label: "Rejected",
      message: `Unfortunately, your pet was not approved at this time. Please review your submission and ensure all details are accurate before resubmitting.`,
    },
    in_review: {
      label: "Under Review",
      message: `Your pet is currently under review. Our team will assess the submission and notify you once a decision has been made.`,
    },
  };

  const {label, message} = statusMap[status];
  const year = new Date().getFullYear();
  const appUrl = process.env.CLIENT_URL ?? "";

  await sendEmail({
    to,
    subject: `Pet Review Status Update — ${petName}`,
    html: `<div style="margin:0;background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">

    <div style="background:#0f172a;padding:24px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">PawCare</h1>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:14px;">Pet registration status update</p>
    </div>

    <div style="padding:28px 24px;">

      <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#0f172a;">Hello ${name},</h2>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#475569;">
        We have an update regarding your pet <strong>${petName}</strong> on PawCare.
      </p>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px;margin-bottom:24px;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">
          Review status
        </p>
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0f172a;">${label}</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#64748b;">${message}</p>
      </div>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">
          Pet details
        </p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:5px 0;font-size:14px;color:#94a3b8;width:40%;">Pet name</td>
            <td style="padding:5px 0;font-size:14px;font-weight:600;color:#0f172a;">${petName}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:14px;color:#94a3b8;">Status</td>
            <td style="padding:5px 0;font-size:14px;font-weight:600;color:#0f172a;">${label}</td>
          </tr>
        </table>
      </div>

      <div style="text-align:center;margin-bottom:24px;">
        <a href="${appUrl}/dashboard"
          style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:13px 32px;border-radius:12px;font-size:15px;font-weight:600;">
          View your dashboard
        </a>
      </div>

      <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;text-align:center;">
        If you have any questions, feel free to reach out to our support team.
      </p>
    </div>

    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 24px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#cbd5e1;">© ${year} PawCare. All rights reserved.</p>
      <p style="margin:4px 0 0;font-size:12px;color:#cbd5e1;">This is an automated message. Please do not reply directly to this email.</p>
    </div>

  </div>
</div>`,
  });
}
export async function sendAppointmentNotification(
  to: string,
  name: string,
  service: string,
  appointmentDate: string,
  appointmentTime: string,
) {
  await sendEmail({
    to,
    subject: "Appointment reminder",
    html: `
      <div style="margin:0;background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
          <div style="background:#059669;padding:24px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;">PawCare</h1>
            <p style="margin:6px 0 0;color:#d1fae5;font-size:14px;">Appointment reminder</p>
          </div>
          <div style="padding:24px;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#0f172a;">Hello ${name},</h2>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#334155;">Your appointment is scheduled now. Please prepare for your visit.</p>
            <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:14px;padding:16px;">
              <p style="margin:0 0 8px;font-size:13px;color:#047857;font-weight:bold;">Appointment details</p>
              <p style="margin:0 0 6px;font-size:15px;color:#0f172a;"><strong>Service:</strong> ${service}</p>
              <p style="margin:0 0 6px;font-size:15px;color:#0f172a;"><strong>Date:</strong> ${appointmentDate}</p>
              <p style="margin:0;font-size:15px;color:#0f172a;"><strong>Time:</strong> ${appointmentTime}</p>
            </div>
          </div>
        </div>
      </div>
    `,
  });
}
