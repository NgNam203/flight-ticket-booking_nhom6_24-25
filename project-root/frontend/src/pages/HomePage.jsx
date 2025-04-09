import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";

const Home = () => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		} else {
			navigate("/login"); // nếu chưa đăng nhập → chuyển về login
		}
	}, [navigate]);

	return (
		<div className="home-wrapper">
			<Header />

			<section className="hero-banner">
				<h1>Săn vé máy bay giá rẻ cùng VEMAYBAY</h1>
				<p>Khám phá ngay những ưu đãi tốt nhất dành cho bạn!</p>

				{/* 🧩 Form tìm kiếm chuyến bay */}
				<SearchForm />
			</section>

			{/* Bạn có thể thêm phần slider, top route... ở đây sau */}
		</div>
	);
};

export default Home;
