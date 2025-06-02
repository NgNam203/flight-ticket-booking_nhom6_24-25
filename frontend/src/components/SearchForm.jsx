import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAirports } from "../services/airportService";
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
	const [showFromDropdown, setShowFromDropdown] = useState(false);
	const [showToDropdown, setShowToDropdown] = useState(false);
	const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

	const [formData, setFormData] = useState({
		tripType: "oneway",
		adults: 1,
		children: 0,
		from: initialValues.from || "",
		to: initialValues.to || "",
		departureDate: initialValues.departureDate || dayjs().format("YYYY-MM-DD"),
		returnDate: initialValues.returnDate || "",
	});

	useEffect(() => {
		const fetchAirports = async () => {
			const res = await getAllAirports();
			const data = res.data || res;
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

	const handleSwap = () => {
		setFormData((prev) => ({ ...prev, from: prev.to, to: prev.from }));
	};

	const handlePassengerChange = (type, delta) => {
		setFormData((prev) => {
			const newValue = Math.max(0, prev[type] + delta);
			return { ...prev, [type]: newValue };
		});
	};

	const handleSelectAirport = (airportCode, isFrom = true) => {
		setFormData((prev) => ({ ...prev, [isFrom ? "from" : "to"]: airportCode }));
		setShowFromDropdown(false);
		setShowToDropdown(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { from, to, departureDate, adults, children } = formData;
		if (!from || !to || !departureDate) return;
		const passengers = adults + children;
		const query = new URLSearchParams({
			from,
			to,
			departureDate,
			passengers,
		}).toString();
		navigate(`/search?${query}`, { replace: true });
	};

	const getAirportLabel = (code) => {
		const ap = airports.find((a) => a.code === code);
		return ap ? `${ap.city}, ${ap.country} (${ap.code})` : "";
	};

	const renderDropdown = (isFrom = true) => {
		const airportsInRegion = groupedAirports[activeRegion] || [];
		const groupedByCity = airportsInRegion.reduce((acc, ap) => {
			if (!acc[ap.city]) acc[ap.city] = ap;
			return acc;
		}, {});

		return (
			<div className="absolute z-50 mt-2 w-full rounded-lg bg-white border shadow-lg">
				<div className="flex space-x-2 p-2 overflow-x-auto">
					{REGIONS.map((region) => (
						<button
							key={region}
							onClick={() => setActiveRegion(region)}
							className={`px-3 py-1 rounded-full text-sm ${
								region === activeRegion
									? "bg-blue-600 text-white"
									: "bg-gray-200 text-gray-700"
							}`}>
							{region}
						</button>
					))}
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 max-h-64 overflow-y-auto">
					{Object.keys(groupedByCity).map((city) => {
						const airport = groupedByCity[city];
						const fromAirport = airports.find((ap) => ap._id === formData.from);
						const toAirport = airports.find((ap) => ap._id === formData.to);
						if (!isFrom && fromAirport?.city === city) return null;
						if (isFrom && toAirport?.city === city) return null;
						return (
							<button
								key={city}
								onClick={() => handleSelectAirport(airport.code, isFrom)}
								className="text-left text-sm hover:bg-blue-100 rounded p-2">
								{city} ({airport.code})
							</button>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white p-4 rounded-xl shadow-md space-y-4">
			<div className="flex flex-wrap gap-4">
				<select
					name="tripType"
					value={formData.tripType}
					onChange={handleChange}
					className="rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-500">
					<option value="oneway">✈️ Một chiều</option>
					<option value="roundtrip">🔁 Khứ hồi</option>
				</select>

				<div className="relative">
					<button
						type="button"
						onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
						className="rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-500">
						🧍 {formData.adults} Người lớn, {formData.children} Trẻ em
					</button>
					{showPassengerDropdown && (
						<div className="absolute mt-2 w-64 rounded-lg border bg-white shadow-lg z-10 p-4">
							<div className="flex justify-between items-center mb-2">
								<span>Người lớn</span>
								<div className="flex items-center gap-2">
									<button
										onClick={() => handlePassengerChange("adults", -1)}
										className="px-2 py-1 bg-gray-100 rounded">
										-
									</button>
									<span>{formData.adults}</span>
									<button
										onClick={() => handlePassengerChange("adults", 1)}
										className="px-2 py-1 bg-gray-100 rounded">
										+
									</button>
								</div>
							</div>
							<div className="flex justify-between items-center">
								<span>Trẻ em</span>
								<div className="flex items-center gap-2">
									<button
										onClick={() => handlePassengerChange("children", -1)}
										className="px-2 py-1 bg-gray-100 rounded">
										-
									</button>
									<span>{formData.children}</span>
									<button
										onClick={() => handlePassengerChange("children", 1)}
										className="px-2 py-1 bg-gray-100 rounded">
										+
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="grid grid-cols-6 gap-2 items-center">
				<div className="relative col-span-2">
					<input
						type="text"
						name="from"
						onFocus={() => setShowFromDropdown(true)}
						onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
						value={getAirportLabel(formData.from)}
						readOnly
						placeholder="Khởi hành từ"
						className="w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500 focus:outline-none"
					/>
					{showFromDropdown && renderDropdown(true)}
				</div>

				<button
					type="button"
					onClick={handleSwap}
					className="text-center text-gray-600 hover:text-gray-900">
					⇄
				</button>

				<div className="relative col-span-2">
					<input
						type="text"
						name="to"
						onFocus={() => setShowToDropdown(true)}
						onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
						value={getAirportLabel(formData.to)}
						readOnly
						placeholder="Nơi đến"
						className="w-full rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500 focus:outline-none"
					/>
					{showToDropdown && renderDropdown(false)}
				</div>

				<input
					type="date"
					name="departureDate"
					value={formData.departureDate}
					onChange={handleChange}
					className="rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500"
				/>

				<input
					type="date"
					name="returnDate"
					value={formData.returnDate}
					onChange={handleChange}
					disabled={formData.tripType === "oneway"}
					className="rounded-md border px-3 py-2 shadow-sm focus:ring-blue-500 disabled:opacity-50"
				/>

				<button
					type="submit"
					className="col-span-1 bg-orange-400 text-white rounded px-5 py-2 text-sm hover:bg-blue-700">
					🔍 Tìm kiếm
				</button>
			</div>
		</form>
	);
};

export default SearchForm;
