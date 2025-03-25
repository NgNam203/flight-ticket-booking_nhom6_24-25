// /frontend/src/pages/Register.jsx
import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { registerUser } from "../services/authService";
import "../assets/css/auth.css";
import { Link } from "react-router-dom";
import AlertPopup from "../components/AlertPopup";

const Register = () => {
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

		if (!formData.fullName || formData.fullName.length < 5) {
			newErrors.fullName = "Họ tên ít nhất 5 ký tự.";
		}

		if (
			!formData.email ||
			!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
		) {
			newErrors.email = "Vui lòng nhập đúng định dạng email.";
		}

		if (!/^\d{9,11}$/.test(formData.phone)) {
			newErrors.phone = "Số điện thoại không hợp lệ.";
		}

		if (
			!formData.password ||
			formData.password.length < 6 ||
			formData.password.length > 32
		) {
			newErrors.password = "Mật khẩu từ 6-32 ký tự.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
	};

	const handleCaptchaChange = (token) => {
		setCaptchaToken(token);
	};

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
		<div className="auth-wrapper">
			<div className="auth-tab-buttons">
				<Link to="/login" className="auth-tab-button">
					Đăng nhập
				</Link>
				<Link to="/register" className="auth-tab-button active">
					Đăng ký
				</Link>
			</div>

			<h2>Đăng ký</h2>
			<form onSubmit={handleSubmit}>
				<label>Họ và tên*</label>
				<input
					type="text"
					name="fullName"
					placeholder="Họ và tên"
					value={formData.fullName}
					onChange={handleChange}
				/>
				{errors.fullName && <p className="error">{errors.fullName}</p>}

				<label>Email*</label>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
				/>
				{errors.email && <p className="error">{errors.email}</p>}

				<label>Số điện thoại*</label>
				<input
					type="text"
					name="phone"
					placeholder="Số điện thoại"
					value={formData.phone}
					onChange={handleChange}
				/>
				{errors.phone && <p className="error">{errors.phone}</p>}

				<label>Mật khẩu*</label>
				<input
					type="password"
					name="password"
					placeholder="Mật khẩu"
					value={formData.password}
					onChange={handleChange}
				/>
				{errors.password && <p className="error">{errors.password}</p>}

				<div className="recaptcha">
					<ReCAPTCHA
						sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
						onChange={handleCaptchaChange}
						ref={recaptchaRef}
					/>
				</div>

				<button type="submit" disabled={loading}>
					{loading ? "Đang đăng ký..." : "Đăng ký"}
				</button>
			</form>
		</div>
	);
};

export default Register;
