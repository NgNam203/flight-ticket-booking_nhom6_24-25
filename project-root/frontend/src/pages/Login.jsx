// /frontend/src/pages/Login.jsx
import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/auth.css";
import { loginUser } from "../services/authService";
import AlertPopup from "../components/AlertPopup";

const Login = () => {
	const [formData, setFormData] = useState({
		account: "",
		password: "",
	});

	const [captchaToken, setCaptchaToken] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const recaptchaRef = useRef();
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleCaptchaChange = (token) => {
		setCaptchaToken(token);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { account, password } = formData;

		if (!account) {
			recaptchaRef.current?.reset();
			return AlertPopup.warning(
				"Vui lòng nhập thông tin số điện thoại hoặc email"
			);
		}
		if (!password) {
			recaptchaRef.current?.reset();
			return AlertPopup.warning("Vui lòng nhập mật khẩu");
		}
		if (!captchaToken) {
			return AlertPopup.warning(
				"Vui lòng xác nhận tôi không phải là người máy!"
			);
		}

		try {
			setLoading(true);
			const res = await loginUser({ ...formData, captchaToken });

			if (res.token) {
				localStorage.setItem("token", res.token);
				localStorage.setItem("user", JSON.stringify(res.user));
				AlertPopup.success("Đăng nhập thành công!");
				navigate("/");
			} else {
				AlertPopup.error(res.message || "Đăng nhập thất bại.");
			}
		} catch (err) {
			const msg = err.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập.";
			AlertPopup.error(msg);
			recaptchaRef.current?.reset();
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-wrapper">
			<div className="auth-tab-buttons">
				<Link to="/login" className="auth-tab-button active">
					Đăng nhập
				</Link>
				<Link to="/register" className="auth-tab-button">
					Đăng ký
				</Link>
			</div>

			<h2>Đăng nhập</h2>
			<form onSubmit={handleSubmit}>
				<label>Số điện thoại hoặc email *</label>
				<input
					type="text"
					name="account"
					placeholder="Tài khoản"
					value={formData.account}
					onChange={handleChange}
				/>

				<label>Mật khẩu *</label>
				<input
					type="password"
					name="password"
					placeholder="Mật khẩu"
					value={formData.password}
					onChange={handleChange}
				/>

				<div className="form-footer">
					<Link to="/forgot-password" className="forgot-link">
						Lấy lại mật khẩu
					</Link>
				</div>

				<div className="recaptcha">
					<ReCAPTCHA
						sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
						onChange={handleCaptchaChange}
						ref={recaptchaRef}
					/>
				</div>

				<button type="submit" disabled={loading}>
					{loading ? "Đang đăng nhập..." : "Đăng nhập ➜"}
				</button>
			</form>
		</div>
	);
};

export default Login;
