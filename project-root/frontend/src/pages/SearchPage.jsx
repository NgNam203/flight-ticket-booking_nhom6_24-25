import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchFlights } from "../services/flightService";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import "./SearchPage.css";
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
	};

	const handleSeatSlide = (dir, seatLength) => {
		setVisibleSeatIndex((prev) => {
			if (dir === "left") return Math.max(prev - 1, 0);
			if (dir === "right") return Math.min(prev + 1, seatLength - 1);
		});
	};

	const handleBookFlight = (flight, seat) => {
		navigate("/booking", {
			state: {
				flightId: flight._id,
				seatClass: seat,
				passengers: parseInt(passengers),
				departureDate: currentDate,
				flightInfo: flight,
			},
		});
	};

	return (
		<div className="search-page">
			<Header />
			<div className="search-container">
				<SearchForm
					initialValues={{
						from,
						to,
						passengers: parseInt(passengers),
						departureDate: currentDate,
					}}
				/>

				<div className="date-scroll">
					<button
						className="arrow-button"
						onClick={handlePrevWeek}
						disabled={weekOffset === 0}>
						❮
					</button>
					{dateList.map((date) => (
						<button
							key={date}
							className={`date-item ${date === currentDate ? "active" : ""}`}
							onClick={() => handleDateClick(date)}>
							{dayjs(date).format("dd, DD/MM/YYYY")}
						</button>
					))}
					<button className="arrow-button" onClick={handleNextWeek}>
						❯
					</button>
				</div>

				<div className="results-section">
					<div className="airline-filter">
						<h4>Lọc theo hãng:</h4>
						{availableAirlines.map((airline) => (
							<label key={airline} style={{ display: "block" }}>
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
								/>{" "}
								{airline}
							</label>
						))}
					</div>

					<div className="flight-list">
						{filteredFlights.length > 0 && (
							<div className="flight-route-header">
								<div className="route-content">
									<span className="route-index">1.</span>
									<strong>{filteredFlights[0]?.from?.name}</strong> →
									<strong>{filteredFlights[0]?.to?.name}</strong>
								</div>
							</div>
						)}
						{loading ? (
							<p>Đang tải...</p>
						) : filteredFlights.length === 0 ? (
							<p>Không tìm thấy chuyến bay phù hợp.</p>
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
									<div className="flight-card" key={flight._id}>
										<div className="flight-main">
											<div className="flight-info">
												<div className="airline">
													<img
														src={flight.airline?.logo}
														alt={flight.airline?.name}
														className="airline-logo"
													/>
													<span>{flight.airline?.name}</span>
												</div>
												<div className="code">{flight.flightCode}</div>
												<div className="time">
													{new Date(flight.departureTime).toLocaleTimeString(
														[],
														{
															hour: "2-digit",
															minute: "2-digit",
															hour12: false,
														}
													)}
													{" → "}
													{new Date(flight.arrivalTime).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													})}
												</div>
												<div className="route">
													{flight.from?.code} → {flight.to?.code}
												</div>
											</div>

											<div className="flight-price">
												<strong>
													{cheapestClass?.price?.toLocaleString("vi-VN") || "-"}{" "}
													₫
												</strong>
												<button onClick={() => handleSelectFlight(flight._id)}>
													Chọn
												</button>
											</div>
										</div>

										{isSelected && (
											<div className="seat-classes">
												{visibleClasses.length > 2 && (
													<>
														<button
															className="arrow-btn"
															onClick={() =>
																handleSeatSlide("left", visibleClasses.length)
															}>
															❮
														</button>
														<button
															className="arrow-btn"
															onClick={() =>
																handleSeatSlide("right", visibleClasses.length)
															}>
															❯
														</button>
													</>
												)}
												<div className="seat-scroll">
													{visibleClasses.map((seat, idx) => (
														<div
															className={`seat-card ${
																idx === visibleSeatIndex ? "active" : ""
															}`}
															key={idx}>
															<h4>{seat.name}</h4>
															<p>Giá: {seat.price.toLocaleString()} VND</p>
															<p>
																Hành lý: {seat.baggage.hand} |{" "}
																{seat.baggage.checked}
															</p>
															<p>Còn lại: {seat.availableSeats} ghế</p>
															<button
																onClick={() => handleBookFlight(flight, seat)}
																className="book-button"
																disabled={seat.availableSeats === 0}>
																{seat.availableSeats === 0
																	? "Hết vé"
																	: "Đặt vé"}
															</button>
														</div>
													))}
												</div>
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
