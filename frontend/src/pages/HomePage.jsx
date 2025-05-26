import React, { useEffect, useState } from "react";
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
			navigate("/login");
		}
	}, [navigate]);

	return (
		<div className="bg-white text-gray-800">
			<Header />

			{/* Hero Section */}
			<section className="relative w-full h-[320px] sm:h-[680px] md:h-[520px] bg-[url('https://at-assests.flightticket.vn/hero-bg.jpg')] bg-center bg-cover">
				<div className="container mx-auto max-w-[1440px] pt-20 sm:py-32 sm:space-y-10 z-10 relative">
					<div className="hidden sm:block text-white">
						<h1 className="text-3xl font-bold mb-2">
							Săn vé máy bay giá rẻ cùng VEMAYBAY
						</h1>
						<p>Khám phá ngay những ưu đãi tốt nhất dành cho bạn!</p>
					</div>

					{/* Search Form */}
					<div className="mx-auto max-w-screen-lg rounded-2xl bg-white p-4 shadow-lg relative z-[100]">
						<SearchForm />
					</div>
				</div>
			</section>

			{/* Banner Section (Slider placeholder) */}
			<section className="relative z-0 pt-10">
				<div className="container mx-auto max-w-[1440px]">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						<a
							href="https://news.vemaybay.vn/vietnam-airlines-mo-duong-bay-tp-ho-chi-minh-bac-kinh/"
							target="_blank"
							rel="noreferrer">
							<img
								className="rounded-lg w-full"
								src="https://news.vemaybay.vn/wp-content/uploads/2023/11/SGN-BK-1000-x-600-px-1.png"
								alt="banner-0"
							/>
						</a>
						<a
							href="https://news.vemaybay.vn/vietnam-airlines-khai-thac-tro-lai-duong-bay-tp-ho-chi-minh-hong-kong/"
							target="_blank"
							rel="noreferrer">
							<img
								className="rounded-lg w-full"
								src="https://news.vemaybay.vn/wp-content/uploads/2023/11/HongKong-1000-x-600-px.png"
								alt="banner-1"
							/>
						</a>
						<a
							href="https://news.vemaybay.vn/vietnam-airlines-khai-thac-lai-duong-bay-da-nang-bangkok"
							target="_blank"
							rel="noreferrer">
							<img
								className="rounded-lg w-full"
								src="https://news.vemaybay.vn/wp-content/uploads/2023/11/Banner-Duong-Bay-Da-Nang-–-Bangkok.png"
								alt="banner-2"
							/>
						</a>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
