import { envObject } from "./enviroment.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envObject.mail.user,
    pass: envObject.mail.pass,
  },
});

// (opcional) verificar conexión al iniciar
transporter.verify().then(() => {
  console.log("📧 Mail server ready");
});

export const sendResetPasswordEmail = async (to, resetLink) => {
  const mailOptions = {
    from: `"Soporte" <${envObject.mail.user}>`,
    to,
    subject: "Recuperación de contraseña",
    html: `
      <h2>Recuperar contraseña</h2>
      <p>Hacé click en el siguiente link para restablecer tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este link expira en 15 minutos.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
