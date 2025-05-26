import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";

const VerifyPage = () => {
	const [searchParams] = useSearchParams();
	const [message, setMessage] = useState("Đang xác thực tài khoản...");
	const [status, setStatus] = useState("loading");

	useEffect(() => {
		const token = searchParams.get("token");
		const email = searchParams.get("email");
		const verify = async () => {
			try {
				const res = await verifyEmail(token, email);
				setMessage(res.message || "Xác thực thành công!");
				setStatus("success");
			} catch (err) {
				const msg = err.response?.data?.message;
				if (msg === "Tài khoản đã được xác thực.") {
					setStatus("success");
					setMessage(msg);
				} else {
					setStatus("error");
					setMessage(msg || "Xác thực thất bại hoặc link đã hết hạn.");
				}
			}
		};

		if (token) verify();
		else {
			setMessage("Thiếu mã xác thực.");
			setStatus("error");
		}
	}, [searchParams]);

	return (
		<div style={styles.container}>
			<h2>Xác thực email</h2>
			<p style={{ color: status === "success" ? "green" : "red" }}>{message}</p>
		</div>
	);
};

const styles = {
	container: {
		maxWidth: "500px",
		margin: "100px auto",
		padding: "2rem",
		background: "#fff",
		borderRadius: "8px",
		boxShadow: "0 0 10px rgba(0,0,0,0.1)",
		textAlign: "center",
	},
};

export default VerifyPage;
