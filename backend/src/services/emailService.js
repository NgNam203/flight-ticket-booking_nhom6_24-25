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
		from: `"VeMayBay.vn" <${process.env.EMAIL_USER}>`,
		to: toEmail,
		subject: "Xác thực tài khoản",
		html: `
<!DOCTYPE html>
<html lang="vi">
<head>
	<meta charset="UTF-8" />
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
	<h3>Chào bạn,</h3>
	<p>Cảm ơn bạn đã đăng ký tài khoản tại VeMayBay.vn.</p>
	<p>Vui lòng xác thực tài khoản bằng cách nhấn vào nút bên dưới:</p>
	<p style="margin: 24px 0;">
		<a href="${verifyUrl}"
			style="display: inline-block; padding: 12px 24px; background-color: #0d6efd; color: #fff; text-decoration: none; border-radius: 6px;">
			Xác thực tài khoản
		</a>
	</p>
	<p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
	<p><i>Link xác thực sẽ hết hạn sau 1 giờ.</i></p>
</body>
</html>
		`,
	};

	await transporter.sendMail(mailOptions);
};

const sendBookingConfirmationEmail = async (toEmail, bookingData) => {
	const isPending = bookingData.status === "pending";
	const isPaid = bookingData.status === "paid";

	const title = isPending ? "Chờ thanh toán" : "Đặt vé thành công ✅";

	const note = isPending
		? `Đặt chỗ của bạn được giữ giá tốt, bạn cần thanh toán trước <strong>${new Date(
				bookingData.holdUntil
		  ).toLocaleString("vi-VN")}</strong>`
		: "Cảm ơn bạn đã thanh toán. Dưới đây là thông tin đặt vé của bạn:";

	const mailOptions = {
		from: `"VeMayBay.vn" <${process.env.EMAIL_USER}>`,
		to: toEmail,
		subject: `${title} - Mã đơn ${bookingData.bookingCode}`,
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
				<img src="https://vemaybay.vn/assets/images/logo-vemaybay_white.png" alt="Logo" height="40" />
				<div style="background-color: #fcefe9; padding: 12px 20px; margin-top: 10px; border-radius: 6px;">
					<strong style="color: #e06b00;">${title}</strong><br />
					${note}<br/>
					Mã đơn hàng: <strong>${bookingData.bookingCode}</strong><br />
					Ngày đặt: <strong>${new Date(bookingData.createdAt).toLocaleString(
						"vi-VN"
					)}</strong>
				</div>

				<h3>Thông tin hành trình</h3>
				<p><strong>${bookingData.flights[0].flight.from.city}</strong> → <strong>${
			bookingData.flights[0].flight.to.city
		}</strong></p>
				<p>Hãng: <strong>${bookingData.flights[0].flight.airline.name}</strong></p>
				<p>Giờ bay: <strong>${
					bookingData.flights[0].flight.departureTime
				}</strong> → <strong>${
			bookingData.flights[0].flight.arrivalTime
		}</strong></p>

				<h3>Hành khách</h3>
				<p>${bookingData.passengers[0].fullName} </p>
				<p>Ngày sinh: ${new Date(
					bookingData.passengers[0].birthDate
				).toLocaleDateString("vi-VN")}</p>
				<p>Giới tính: ${bookingData.passengers[0].gender} | Quốc tịch: ${
			bookingData.passengers[0].nationality
		}</p>

				<h3>Thông tin liên hệ</h3>
				<p>Email: ${bookingData.contact.email}</p>
				<p>Số điện thoại: ${bookingData.contact.phone}</p>

				${
					isPending
						? `<div style="margin-top: 24px;">
							<a href="${process.env.CLIENT_URL}/payment?bookingId=${bookingData._id}"
								style="background: #003d99; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
								Thanh toán ngay
							</a>
						   </div>`
						: ""
				}
			</div>
		`,
	};

	await transporter.sendMail(mailOptions);
};

module.exports = {
	sendVerificationEmail,
	sendBookingConfirmationEmail,
};
