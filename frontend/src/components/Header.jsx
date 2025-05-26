// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const handleProfileClick = () => {
		navigate("/profile");
	};

	const handleLoginClick = () => {
		navigate("/login");
	};

	const handleLogoClick = () => {
		navigate("/");
	};

	return (
		<header className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-10">
			<div
				className="text-orange-500 font-bold text-xl cursor-pointer"
				onClick={handleLogoClick}>
				VEMAYBAY
			</div>

			<div className="text-gray-700 text-sm">Hotline: 0932 126 988</div>

			<div className="text-gray-700">
				{token ? (
					<FaUserCircle
						size={28}
						className="cursor-pointer"
						onClick={handleProfileClick}
					/>
				) : (
					<button
						onClick={handleLoginClick}
						className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1 rounded">
						Đăng nhập
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
