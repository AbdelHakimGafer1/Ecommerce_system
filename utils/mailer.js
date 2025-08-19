const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // أو smtp من Mailtrap مثلاً
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetEmail(to, resetLink) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });

  console.log("📧 Email sent:", info.messageId);
}

module.exports = { sendResetEmail };

