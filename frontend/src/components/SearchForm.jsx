import React, { useEffect, useState } from "react";
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

const SearchForm = ({ initialValues = {} }) => {
	const navigate = useNavigate();
	const [airports, setAirports] = useState([]);
	const [groupedAirports, setGroupedAirports] = useState({});
	const [activeRegion, setActiveRegion] = useState("Việt Nam");
	const [formData, setFormData] = useState({
		tripType: "oneway",
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectAirport = (airportId, isFrom = true) => {
		setFormData((prev) => ({ ...prev, [isFrom ? "from" : "to"]: airportId }));
		setShowFromDropdown(false);
		setShowToDropdown(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { from, to, departureDate, passengers } = formData;
		if (!from || !to || !departureDate) return;
		const query = new URLSearchParams({
			from,
			to,
			departureDate,
			passengers,
		}).toString();
		navigate(`/search?${query}`, { replace: true });
	};

	const getAirportLabel = (id) => {
		const ap = airports.find((a) => a._id === id);
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
						const fromAirport = airports.find((ap) => ap._id === formData.from);
						const toAirport = airports.find((ap) => ap._id === formData.to);

						// Nếu đang chọn nơi đến, và thành phố đã chọn làm nơi đi => bỏ qua
						if (!isFrom && fromAirport?.city === city) return null;

						// Nếu đang chọn nơi đi, và thành phố đã chọn làm nơi đến => bỏ qua
						if (isFrom && toAirport?.city === city) return null;

						return (
							<div
								key={city}
								className="city-item"
								onClick={() => handleSelectAirport(airport._id, isFrom)}>
								{city} ({airport.code})
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<form className="search-form" onSubmit={handleSubmit}>
			<div className="search-top">
				<select
					name="tripType"
					value={formData.tripType}
					onChange={handleChange}>
					<option value="oneway">Một chiều</option>
					<option value="roundtrip" disabled>
						Khứ hồi
					</option>
				</select>

				<select
					name="passengers"
					value={formData.passengers}
					onChange={handleChange}
					disabled // nếu bạn muốn không cho chọn khác
				>
					<option value={1}>1 Người lớn</option>
				</select>
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
