// ✅ RegisterPage.jsx refactored to TailwindCSS
import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { registerUser } from "../services/authService";
import { Link } from "react-router-dom";
import AlertPopup from "../components/AlertPopup";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		password: "",
	});

	const [errors, setErrors] = useState({});
	const [captchaToken, setCaptchaToken] = useState("");
	const [loading, setLoading] = useState(false);
	const recaptchaRef = useRef();

	const validateForm = () => {
		const newErrors = {};
		if (!formData.fullName || formData.fullName.length < 5)
			newErrors.fullName = "Họ tên ít nhất 5 ký tự.";
		if (
			!formData.email ||
			!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
		)
			newErrors.email = "Vui lòng nhập đúng định dạng email.";
		if (!/^\d{9,11}$/.test(formData.phone))
			newErrors.phone = "Số điện thoại không hợp lệ.";
		if (
			!formData.password ||
			formData.password.length < 6 ||
			formData.password.length > 32
		)
			newErrors.password = "Mật khẩu từ 6-32 ký tự.";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
	};

	const handleCaptchaChange = (token) => setCaptchaToken(token);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		if (!captchaToken) {
			AlertPopup.warning("Vui lòng xác nhận tôi không phải là người máy!");
			return;
		}
		try {
			setLoading(true);
			const res = await registerUser({ ...formData, captchaToken });
			AlertPopup.success(res.message || "Đăng ký thành công!");
			setFormData({ fullName: "", email: "", phone: "", password: "" });
			setCaptchaToken("");
		} catch (err) {
			const msg =
				err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
			AlertPopup.error(msg);
			recaptchaRef.current?.reset();
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-16 bg-white shadow-lg rounded-lg p-8">
			<div className="flex mb-4">
				<Link
					to="/login"
					className="flex-1 text-center py-2 rounded-t-lg font-bold bg-gray-200 text-gray-700">
					Đăng nhập
				</Link>
				<Link
					to="/register"
					className="flex-1 text-center py-2 rounded-t-lg font-bold bg-orange-500 text-white">
					Đăng ký
				</Link>
			</div>

			<h2 className="text-center text-2xl font-semibold text-blue-800 mb-6">
				Đăng ký
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="font-medium">Họ và tên*</label>
					<input
						type="text"
						name="fullName"
						placeholder="Họ và tên"
						value={formData.fullName}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
					/>
					{errors.fullName && (
						<p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
					)}
				</div>

				<div>
					<label className="font-medium">Email*</label>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={formData.email}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
					/>
					{errors.email && (
						<p className="text-sm text-red-600 mt-1">{errors.email}</p>
					)}
				</div>

				<div>
					<label className="font-medium">Số điện thoại*</label>
					<input
						type="text"
						name="phone"
						placeholder="Số điện thoại"
						value={formData.phone}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
					/>
					{errors.phone && (
						<p className="text-sm text-red-600 mt-1">{errors.phone}</p>
					)}
				</div>

				<div>
					<label className="font-medium">Mật khẩu*</label>
					<input
						type="password"
						name="password"
						placeholder="Mật khẩu"
						value={formData.password}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
					/>
					{errors.password && (
						<p className="text-sm text-red-600 mt-1">{errors.password}</p>
					)}
				</div>

				<div className="flex justify-center">
					<ReCAPTCHA
						sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
						onChange={handleCaptchaChange}
						ref={recaptchaRef}
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded">
					{loading ? "Đang đăng ký..." : "Đăng ký"}
				</button>
			</form>
		</div>
	);
};

export default RegisterPage;
