// ✅ LoginPage.jsx chuyển sang TailwindCSS hoàn toàn
import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import AlertPopup from "../components/AlertPopup";

const Login = () => {
	const [formData, setFormData] = useState({ account: "", password: "" });
	const [captchaToken, setCaptchaToken] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const recaptchaRef = useRef();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleCaptchaChange = (token) => setCaptchaToken(token);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { account, password } = formData;
		if (!account) {
			recaptchaRef.current?.reset();
			return AlertPopup.warning("Vui lòng nhập tài khoản");
		}
		if (!password) {
			recaptchaRef.current?.reset();
			return AlertPopup.warning("Vui lòng nhập mật khẩu");
		}
		if (!captchaToken) return AlertPopup.warning("Vui lòng xác nhận Captcha");

		try {
			setLoading(true);
			const res = await loginUser({ ...formData, captchaToken });
			if (res.token) {
				localStorage.setItem("token", res.token);
				localStorage.setItem("user", JSON.stringify(res.user));
				AlertPopup.success("Đăng nhập thành công!");
				navigate("/");
			} else AlertPopup.error(res.message || "Đăng nhập thất bại.");
		} catch (err) {
			AlertPopup.error(err.response?.data?.message || "Đăng nhập lỗi.");
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
					className="flex-1 text-center py-2 rounded-t-lg font-bold bg-orange-500 text-white">
					Đăng nhập
				</Link>
				<Link
					to="/register"
					className="flex-1 text-center py-2 rounded-t-lg font-bold bg-gray-200 text-gray-700">
					Đăng ký
				</Link>
			</div>

			<h2 className="text-center text-2xl font-semibold text-blue-800 mb-6">
				Đăng nhập
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="font-medium">Tài khoản*</label>
					<input
						type="text"
						name="account"
						value={formData.account}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
					/>
				</div>
				<div>
					<label className="font-medium">Mật khẩu*</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-orange-400"
					/>
				</div>
				<div className="text-right text-sm">
					<Link to="/forgot-password" className="text-blue-600 hover:underline">
						Quên mật khẩu?
					</Link>
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
					{loading ? "Đang đăng nhập..." : "Đăng nhập ➜"}
				</button>
			</form>
		</div>
	);
};

export default Login;
