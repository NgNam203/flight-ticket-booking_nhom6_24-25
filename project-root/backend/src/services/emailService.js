// /backend/src/services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER, // Gmail của bạn
		pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (không phải pass Gmail thường!)
	},
});

const sendVerificationEmail = async (toEmail, token) => {
	const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}&email=${toEmail}`;

	const mailOptions = {
		from: `"Flight App" <${process.env.EMAIL_USER}>`,
		to: toEmail,
		subject: "Xác thực tài khoản",
		html: `
      <h3>Chào bạn,</h3>
      <p>Vui lòng xác thực tài khoản bằng cách nhấn vào nút bên dưới:</p>
      <a href="${verifyUrl}" style="padding: 10px 20px; background: #0d6efd; color: white; border-radius: 5px; text-decoration: none;">
        Xác thực tài khoản
      </a>
      <p><i>Link sẽ hết hạn sau 1 giờ.</i></p>
    `,
	};

	await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
