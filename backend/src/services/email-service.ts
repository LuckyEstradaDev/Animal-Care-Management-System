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
