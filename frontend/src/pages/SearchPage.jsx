import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchFlights } from "../services/flightService";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import dayjs from "dayjs";

const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [flights, setFlights] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentDate, setCurrentDate] = useState(
		searchParams.get("departureDate")
	);
	const [weekOffset, setWeekOffset] = useState(0);

	const [from, setFrom] = useState(searchParams.get("from"));
	const [to, setTo] = useState(searchParams.get("to"));
	const [passengers, setPassengers] = useState(
		searchParams.get("passengers") || 1
	);

	const [availableAirlines, setAvailableAirlines] = useState([]);
	const [selectedAirlines, setSelectedAirlines] = useState([]);

	const [selectedFlightId, setSelectedFlightId] = useState(null);
	const [visibleSeatIndex, setVisibleSeatIndex] = useState(0);

	const [showAllSeats, setShowAllSeats] = useState(false);

	const today = dayjs().startOf("day");
	const dateList = Array.from({ length: 7 }, (_, i) =>
		today.add(i + weekOffset * 7, "day").format("YYYY-MM-DD")
	);

	const filteredFlights =
		selectedAirlines.length === 0
			? flights
			: flights.filter((f) => selectedAirlines.includes(f.airline?.name));

	useEffect(() => {
		const updatedFrom = searchParams.get("from");
		const updatedTo = searchParams.get("to");
		const updatedPassengers = searchParams.get("passengers") || 1;
		const updatedDate = searchParams.get("departureDate");

		setFrom(updatedFrom);
		setTo(updatedTo);
		setPassengers(updatedPassengers);
		setCurrentDate(updatedDate);
	}, [searchParams]);

	useEffect(() => {
		const fetchFlights = async () => {
			try {
				const data = await searchFlights({
					from,
					to,
					departureDate: currentDate,
					passengers,
				});
				setFlights(data);
				const airlines = Array.from(
					new Set(data.map((f) => f.airline?.name).filter(Boolean))
				);
				setAvailableAirlines(airlines);
			} catch (err) {
				console.error("Lỗi khi tìm chuyến bay", err);
			} finally {
				setLoading(false);
			}
		};
		if (from && to && currentDate) {
			setLoading(true);
			fetchFlights();
		}
	}, [from, to, currentDate, passengers]);

	const handleDateClick = (date) => {
		setCurrentDate(date);
		searchParams.set("departureDate", date);
		setSearchParams(searchParams);
	};

	const handlePrevWeek = () => {
		if (weekOffset > 0) setWeekOffset(weekOffset - 1);
	};

	const handleNextWeek = () => {
		setWeekOffset(weekOffset + 1);
	};

	const handleSelectFlight = (flightId) => {
		setSelectedFlightId(flightId === selectedFlightId ? null : flightId);
		setVisibleSeatIndex(0);
		setShowAllSeats(false); // reset
	};

	const handleBookFlight = (flight, seat) => {
		const totalAmount = seat.price * passengers;
		navigate("/booking", {
			state: {
				flight,
				seatClass: seat,
				totalAmount,
			},
		});
	};

	return (
		<div className="bg-[#f5f7fa] min-h-screen font-sans">
			<Header />
			<div className="max-w-5xl mx-auto mt-8 p-4 bg-white rounded-lg shadow">
				<SearchForm
					initialValues={{
						from,
						to,
						passengers: parseInt(passengers),
						departureDate: currentDate,
					}}
				/>

				<div className="flex items-center gap-2 overflow-x-auto py-2 mb-4">
					<button
						className="bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
						onClick={handlePrevWeek}
						disabled={weekOffset === 0}>
						❮
					</button>
					{dateList.map((date) => (
						<button
							key={date}
							className={`px-3 py-1 min-w-[100px] border text-sm rounded text-center whitespace-nowrap ${
								date === currentDate
									? "bg-orange-400 text-white font-bold border-orange-500"
									: "bg-white border-gray-300 hover:bg-gray-100"
							}`}
							onClick={() => handleDateClick(date)}>
							{dayjs(date).format("dd, DD/MM/YYYY")}
						</button>
					))}
					<button
						className="bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
						onClick={handleNextWeek}>
						❯
					</button>
				</div>

				<div className="flex gap-4">
					<div className="w-[240px] bg-[#f3f5f9] p-4 rounded-lg shadow text-sm">
						<h4 className="font-bold mb-3">Lọc theo hãng:</h4>
						{availableAirlines.map((airline) => (
							<label key={airline} className="block mb-2">
								<input
									type="checkbox"
									value={airline}
									checked={selectedAirlines.includes(airline)}
									onChange={(e) => {
										const value = e.target.value;
										setSelectedAirlines((prev) =>
											e.target.checked
												? [...prev, value]
												: prev.filter((a) => a !== value)
										);
									}}
									className="mr-2"
								/>
								{airline}
							</label>
						))}
					</div>

					<div className="flex-1 flex flex-col gap-4">
						{loading ? (
							<p>Đang tải...</p>
						) : filteredFlights.length === 0 ? (
							<div className="text-center py-8 text-gray-700">
								<img
									src="https://storage.deepgate.io/flight-not-found.png"
									alt="Không tìm thấy chuyến bay"
									className="w-32 mx-auto mb-4 opacity-70"
								/>
								<h3 className="text-lg font-bold mb-2">
									Không tìm thấy chuyến bay
								</h3>
								<p className="text-sm text-gray-600">
									Hãy thử chọn ngày bay khác.
								</p>
							</div>
						) : (
							filteredFlights.map((flight) => {
								const hasAvailableSeat = flight.seatClasses.some(
									(seat) => seat.availableSeats > 0
								);
								if (!hasAvailableSeat) return null;
								const cheapestClass = flight.seatClasses.find((s) => s?.name);
								const visibleClasses = flight.seatClasses.filter(
									(s) => s?.name
								);
								const isSelected = selectedFlightId === flight._id;

								return (
									<div
										className="border border-gray-300 rounded-lg p-4 bg-gray-50 hover:shadow transition"
										key={flight._id}>
										<div className="flex justify-between items-center flex-wrap gap-4">
											<div className="flex flex-col gap-1">
												<div className="flex items-center gap-2 font-bold text-gray-800">
													<img
														src={flight.airline?.logo}
														alt={flight.airline?.name}
														className="w-6 h-6 object-contain rounded"
													/>
													<span>{flight.airline?.name}</span>
												</div>
												<div className="text-sm text-gray-700">
													{flight.flightCode}
												</div>
												<div className="font-bold">
													{new Date(flight.departureTime).toLocaleTimeString(
														[],
														{
															hour: "2-digit",
															minute: "2-digit",
															hour12: false,
														}
													)}{" "}
													→{" "}
													{new Date(flight.arrivalTime).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													})}
												</div>
												<div className="text-sm text-gray-500">
													{flight.from?.code} → {flight.to?.code}
												</div>
											</div>
											<div className="flex flex-col items-end gap-2 text-right">
												<strong className="text-orange-400 text-lg">
													{cheapestClass?.price?.toLocaleString("vi-VN") || "-"}{" "}
													₫
												</strong>
												<button
													onClick={() => handleSelectFlight(flight._id)}
													className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600">
													Chọn
												</button>
											</div>
										</div>

										{isSelected && (
											<div className="mt-4 flex gap-3 overflow-x-auto">
												{(showAllSeats
													? visibleClasses
													: visibleClasses.slice(0, 2)
												).map((seat, idx) => (
													<div
														key={idx}
														className="min-w-[200px] max-w-[240px] border rounded-lg p-4 bg-white shadow">
														<h4 className="font-semibold mb-1">{seat.name}</h4>
														<p>Giá: {seat.price.toLocaleString()} VND</p>
														<p>
															Hành lý: {seat.baggage.hand} |{" "}
															{seat.baggage.checked}
														</p>
														<p>Còn lại: {seat.availableSeats} ghế</p>
														<button
															onClick={() => handleBookFlight(flight, seat)}
															className="mt-2 bg-orange-400 text-white px-3 py-1 rounded hover:bg-orange-600 disabled:bg-gray-300"
															disabled={seat.availableSeats === 0}>
															{seat.availableSeats === 0 ? "Hết vé" : "Đặt vé"}
														</button>
													</div>
												))}
												{!showAllSeats && visibleClasses.length > 2 && (
													<div
														className="min-w-[200px] flex items-center justify-center cursor-pointer text-blue-600 font-bold"
														onClick={() => setShowAllSeats(true)}>
														Xem thêm
													</div>
												)}
											</div>
										)}
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchPage;
