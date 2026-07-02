const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendComplaintStatusEmail = async (resident, complaint, newStatus, note) => {
  if (!process.env.EMAIL_USER) return; // Skip if email not configured

  try {
    const transporter = createTransporter();
    const statusColors = {
      'Open': '#ef4444',
      'In Progress': '#f59e0b',
      'Resolved': '#22c55e'
    };

    await transporter.sendMail({
      from: `"${process.env.SOCIETY_NAME || 'Society Manager'}" <${process.env.EMAIL_USER}>`,
      to: resident.email,
      subject: `Complaint Update: ${complaint.title} — ${newStatus}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e293b; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">${process.env.SOCIETY_NAME || 'Society Maintenance'}</h1>
          </div>
          <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
            <p style="color: #475569; margin-top: 0;">Dear ${resident.name},</p>
            <p style="color: #475569;">Your complaint has been updated.</p>
            
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: #1e293b; margin-top: 0; font-size: 16px;">${complaint.title}</h2>
              <p style="color: #64748b; font-size: 14px; margin: 4px 0;">Category: ${complaint.category}</p>
              <div style="display: inline-block; background: ${statusColors[newStatus]}20; color: ${statusColors[newStatus]}; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-top: 8px;">
                ${newStatus}
              </div>
              ${note ? `<p style="color: #475569; margin-top: 16px; padding: 12px; background: #f1f5f9; border-radius: 6px; font-size: 14px;"><strong>Note from admin:</strong> ${note}</p>` : ''}
            </div>

            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">You can track your complaint progress by logging into the portal.</p>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

const sendImportantNoticeEmail = async (residents, notice) => {
  if (!process.env.EMAIL_USER || !residents.length) return;

  try {
    const transporter = createTransporter();

    const emails = residents.map(r => r.email).join(',');
    await transporter.sendMail({
      from: `"${process.env.SOCIETY_NAME || 'Society Manager'}" <${process.env.EMAIL_USER}>`,
      to: emails,
      subject: `📌 Important Notice: ${notice.title}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e293b; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">${process.env.SOCIETY_NAME || 'Society Maintenance'}</h1>
            <span style="background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-top: 8px; display: inline-block;">IMPORTANT NOTICE</span>
          </div>
          <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #1e293b; margin-top: 0;">${notice.title}</h2>
            <div style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${notice.content}</div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; margin-bottom: 0;">Posted on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.error('Notice email error:', err.message);
  }
};

module.exports = { sendComplaintStatusEmail, sendImportantNoticeEmail };
