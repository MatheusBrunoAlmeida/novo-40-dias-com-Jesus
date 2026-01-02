import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  // TODO: Update with actual domain
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  console.log("---- RESET PASSWORD EMAIL ----");
  console.log(`To: ${email}`);
  console.log(`Link: ${resetLink}`);
  console.log("------------------------------");

  // Only send if credentials are set, otherwise just log (dev mode logic logic kept partly)
  // But unlike before, we try to send if we have a user.
  if (!process.env.EMAIL_SERVER_USER) {
    console.log("Missing EMAIL_SERVER_USER, skipping actual email sending.");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SERVER_USER,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
  } catch (error) {
    console.log("Erro ao enviar email (verifique suas credenciais):", error);
  }
};
