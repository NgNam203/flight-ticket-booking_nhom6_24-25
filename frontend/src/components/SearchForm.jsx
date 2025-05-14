import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAirports } from "../services/airportService";
import "../assets/css/searchForm.css";
import dayjs from "dayjs";

const REGIONS = [
	"Việt Nam",
	"Châu Á",
	"Châu Âu",
	"Hoa Kỳ - Canada",
	"Châu Úc - Châu Phi",
];

const SearchForm = ({ initialValues = {}, onSubmit }) => {
	const formRef = useRef(null);
	const [showTripDropdown, setShowTripDropdown] = useState(false);
	const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
	const navigate = useNavigate();
	const [airports, setAirports] = useState([]);
	const [groupedAirports, setGroupedAirports] = useState({});
	const [activeRegion, setActiveRegion] = useState("Việt Nam");
	const [formData, setFormData] = useState({
		tripType: initialValues.tripType || "oneway",
		passengers: initialValues.passengers || 1,
		from: initialValues.from || "",
		to: initialValues.to || "",
		departureDate: initialValues.departureDate || dayjs().format("YYYY-MM-DD"),
		returnDate: initialValues.returnDate || "",
	});

	const [showFromDropdown, setShowFromDropdown] = useState(false);
	const [showToDropdown, setShowToDropdown] = useState(false);

	const handleSwap = () => {
		const temp = formData.from;
		setFormData((prev) => ({
			...prev,
			from: prev.to,
			to: temp,
		}));
	};

	useEffect(() => {
		const fetchAirports = async () => {
			const res = await getAllAirports();
			const data = res.data || res; // fallback nếu không bọc trong res.data
			setAirports(data);

			const grouped = data.reduce((acc, airport) => {
				if (!acc[airport.country]) acc[airport.country] = [];
				acc[airport.country].push(airport);
				return acc;
			}, {});
			setGroupedAirports(grouped);
		};
		fetchAirports();
		if (initialValues.departureDate) {
			setFormData((prev) => ({
				...prev,
				departureDate: initialValues.departureDate,
			}));
		}
	}, [initialValues.departureDate]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (formRef.current && !formRef.current.contains(e.target)) {
				setShowTripDropdown(false);
				setShowPassengerDropdown(false);
				setShowFromDropdown(false);
				setShowToDropdown(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectAirport = (airportCode, isFrom = true) => {
		if (isFrom && airportCode === formData.to) return; // Không chọn nơi đi trùng nơi đến
		if (!isFrom && airportCode === formData.from) return; // Không chọn nơi đến trùng nơi đi
		setFormData((prev) => ({ ...prev, [isFrom ? "from" : "to"]: airportCode }));
		setShowFromDropdown(false);
		setShowToDropdown(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { from, to, departureDate, passengers } = formData;
		if (!from || !to || !departureDate) return;

		// 👇 Gọi hàm từ cha nếu có (ở trang /search)
		if (typeof onSubmit === "function") {
			onSubmit(formData);
			return;
		}

		// Mặc định điều hướng nếu không có onSubmit (ở trang home)
		const query = new URLSearchParams({
			from,
			to,
			departureDate,
			passengers,
			...(formData.tripType === "roundtrip" && formData.returnDate
				? { returnDate: formData.returnDate }
				: {}),
		}).toString();

		navigate(`/search?${query}`, { replace: true });
	};

	const getAirportLabel = (code) => {
		const ap = airports.find((a) => a.code === code);
		return ap ? `${ap.city}, ${ap.country}` : "";
	};

	const renderDropdown = (isFrom = true) => {
		const airportsInRegion = groupedAirports[activeRegion] || [];
		const groupedByCity = airportsInRegion.reduce((acc, ap) => {
			if (!acc[ap.city]) acc[ap.city] = ap;
			return acc;
		}, {});

		return (
			<div className="dropdown-menu">
				<div className="tabs">
					{REGIONS.map((region) => (
						<div
							key={region}
							className={`tab ${region === activeRegion ? "active" : ""}`}
							onClick={() => setActiveRegion(region)}>
							{region}
						</div>
					))}
				</div>
				<div className="city-grid">
					{Object.keys(groupedByCity).map((city) => {
						const airport = groupedByCity[city];

						// Lấy sân bay đang được chọn ở bên còn lại
						// const fromAirport = airports.find((ap) => ap._id === formData.from);
						// const toAirport = airports.find((ap) => ap._id === formData.to);

						// Nếu đang chọn nơi đến, và thành phố đã chọn làm nơi đi => bỏ qua
						if (!isFrom && airport.code === formData.from) return null;

						// Nếu đang chọn nơi đi, và thành phố đã chọn làm nơi đến => bỏ qua
						if (isFrom && airport.code === formData.to) return null;

						return (
							<div
								key={city}
								className="city-item"
								onClick={() => handleSelectAirport(airport.code, isFrom)}>
								{city} ({airport.code})
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<form ref={formRef} className="search-form" onSubmit={handleSubmit}>
			<div className="search-top">
				<div className="option-box">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon"
						viewBox="0 0 20 20">
						<path
							fill="currentColor"
							d="m11.667 7.456 6.666 4.21v1.667l-6.666-2.105v4.467l2.5 1.388v1.25l-3.75-.833-3.75.833v-1.25l2.5-1.389v-4.467L2.5 13.333v-1.666l6.667-4.211v-4.54a1.25 1.25 0 1 1 2.5 0v4.54Z"></path>
					</svg>
					<div className="dropdown-box">
						<div
							className="dropdown-toggle"
							onClick={() => setShowTripDropdown(!showTripDropdown)}>
							<span className="label">
								{formData.tripType === "oneway" ? "Một chiều" : "Khứ hồi"}
							</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="arrow"
								viewBox="0 0 20 20">
								<path fill="currentColor" d="m10 13.333-5-5h10l-5 5Z" />
							</svg>
						</div>
						{showTripDropdown && (
							<div className="dropdown-menu-box">
								<div
									className={`dropdown-item ${
										formData.tripType === "oneway" ? "active" : ""
									}`}
									onClick={() => {
										setFormData((prev) => ({
											...prev,
											tripType: "oneway",
											returnDate: "",
										}));
										setShowTripDropdown(false);
									}}>
									Một chiều
								</div>
								<div
									className={`dropdown-item ${
										formData.tripType === "roundtrip" ? "active" : ""
									}`}
									onClick={() => {
										setFormData((prev) => ({ ...prev, tripType: "roundtrip" }));
										setShowTripDropdown(false);
									}}>
									Khứ hồi
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="option-box" style={{ position: "relative" }}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon"
						viewBox="0 0 24 25">
						<path
							fill="currentColor"
							d="m10.193 9.825-1.525.555v2.953H7V9.208h.012l4.39-1.598c.204-.078.425-.117.652-.11a2.18 2.18 0 0 1 2.023 1.518c.155.485.296.814.425.984a4.16 4.16 0 0 0 3.331 1.665v1.666a5.82 5.82 0 0 1-4.501-2.122l-.485 2.747 1.653 1.6v6.109h-1.667v-4.989l-1.708-1.655-.79 3.581-5.744-1.012.29-1.642 4.103.723 1.208-6.848Zm3.058-2.742a1.666 1.666 0 1 1 0-3.332 1.666 1.666 0 0 1 0 3.332Z"
						/>
					</svg>

					<div className="dropdown-box">
						<div
							className="dropdown-toggle"
							onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}>
							<span className="label">{formData.passengers} Người lớn</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="arrow"
								viewBox="0 0 20 20">
								<path fill="currentColor" d="m10 13.333-5-5h10l-5 5Z" />
							</svg>
						</div>

						{showPassengerDropdown && (
							<div className="dropdown-menu-box">
								<div className="dropdown-item">
									<div className="item-title">Người lớn</div>
									<div className="item-controls">
										<button
											type="button"
											disabled={formData.passengers <= 1}
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													passengers: Math.max(1, prev.passengers - 1),
												}))
											}>
											−
										</button>
										<span>{formData.passengers}</span>
										<button
											type="button"
											onClick={() =>
												setFormData((prev) => ({
													...prev,
													passengers: Math.min(9, prev.passengers + 1),
												}))
											}>
											+
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="search-fields">
				<div className="input-wrapper">
					<input
						type="text"
						placeholder="✈️ Khởi hành từ"
						value={getAirportLabel(formData.from)}
						readOnly
						onClick={() => {
							setShowFromDropdown(!showFromDropdown);
							setShowToDropdown(false);
						}}
					/>
					{showFromDropdown && renderDropdown(true)}
				</div>
				<span
					style={{ fontSize: "18px" }}
					type="button"
					className="swap-button"
					onClick={handleSwap}
					title="Đổi nơi đi và đến">
					⇄
				</span>
				<div className="input-wrapper">
					<input
						type="text"
						placeholder="📍 Nơi đến"
						value={getAirportLabel(formData.to)}
						readOnly
						onClick={() => {
							setShowToDropdown(!showToDropdown);
							setShowFromDropdown(false);
						}}
					/>
					{showToDropdown && renderDropdown(false)}
				</div>

				<input
					type="date"
					name="departureDate"
					value={formData.departureDate}
					onChange={handleChange}
				/>

				<input
					type="date"
					name="returnDate"
					value={formData.returnDate}
					onChange={handleChange}
					disabled={formData.tripType === "oneway"}
				/>

				<button
					type="submit"
					disabled={!formData.from || !formData.to || !formData.departureDate}>
					🔍 Tìm kiếm
				</button>
			</div>
		</form>
	);
};

export default SearchForm;
