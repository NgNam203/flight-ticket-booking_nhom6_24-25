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

	const [showAllSeats, setShowAllSeats] = useState(false);

	const today = dayjs().startOf("day");
	const dateList = Array.from({ length: 7 }, (_, i) =>
		today.add(i + weekOffset * 7, "day").format("YYYY-MM-DD")
	);

	const filteredFlights = flights.filter((f) => {
		if (selectedAirlines.length === 0) return true;
		return selectedAirlines.includes(f.airlineInfo?.name);
	});

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
				setFlights(data || []);
				const airlines = [
					...new Set(data.map((f) => f.airlineInfo?.name).filter(Boolean)),
				];
				setAvailableAirlines(airlines);
				setSelectedAirlines([]);
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
						{loading ? (
							<p>Đang tải...</p>
						) : filteredFlights.length === 0 ? (
							<div className="no-flights">
								<img
									src="https://storage.deepgate.io/flight-not-found.png"
									alt="Không tìm thấy chuyến bay"
									className="no-flights-img"
								/>
								<h3>Không tìm thấy chuyến bay</h3>
								<p>
									Rất tiếc chúng tôi không tìm thấy chuyến bay nào phù hợp với
									bạn.
									<br />
									Hãy thử chọn ngày bay khác.
								</p>
							</div>
						) : (
							filteredFlights.map((flight) => {
								const segment = flight.itineraries?.[0]?.segments?.[0];

								const carrierCode = segment.carrierCode;
								const flightNumber = segment.flightNumber;
								const departureIATA = segment.departure?.iataCode;
								const arrivalIATA = segment.arrival?.iataCode;
								const departureTime = segment.departure?.at;
								const arrivalTime = segment.arrival?.at;
								if (!segment) return null;

								const cheapestClass = flight.seatClasses?.find((s) => s?.name);
								const visibleClasses = flight.seatClasses?.filter(
									(s) => s?.name
								);
								const isSelected = selectedFlightId === flight._id;

								return (
									<div className="flight-card" key={flight._id}>
										<div className="flight-main">
											<div className="flight-info">
												<div className="airline">
													<img
														src={flight.airlineInfo?.logo}
														alt={flight.airlineInfo?.name}
														className="airline-logo"
													/>
													<span>{flight.airlineInfo?.name}</span>
												</div>
												<div className="code">
													{carrierCode} {flightNumber}
												</div>
												<div className="time">
													{new Date(departureTime).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													})}{" "}
													→{" "}
													{new Date(arrivalTime).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													})}
												</div>
												<div className="route">
													{departureIATA} → {arrivalIATA}
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
												{!showAllSeats && visibleClasses.length > 3 ? (
													<>
														{visibleClasses.slice(0, 2).map((seat, idx) => (
															<div className="seat-card" key={idx}>
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
														<div
															className="seat-card show-more-seat-card"
															onClick={() => setShowAllSeats(true)}
															style={{
																cursor: "pointer",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
															}}>
															<span
																style={{
																	fontWeight: "bold",
																	color: "#007bff",
																}}>
																Xem thêm
															</span>
														</div>
													</>
												) : (
													<div className="seat-slider-wrapper">
														{visibleClasses.length > 3 && (
															<button className="arrow-btn">❮</button>
														)}
														<div
															className="seat-slider"
															style={{
																transform: `translateX(-${
																	visibleSeatIndex * 260
																}px)`,
															}}>
															{visibleClasses.map((seat, idx) => (
																<div className="seat-card" key={idx}>
																	<h4>{seat.name}</h4>
																	<p>Giá: {seat.price.toLocaleString()} VND</p>
																	<p>
																		Hành lý: {seat.baggage.hand} |{" "}
																		{seat.baggage.checked}
																	</p>
																	<p>Còn lại: {seat.availableSeats} ghế</p>
																	<button
																		onClick={() =>
																			handleBookFlight(flight, seat)
																		}
																		className="book-button"
																		disabled={seat.availableSeats === 0}>
																		{seat.availableSeats === 0
																			? "Hết vé"
																			: "Đặt vé"}
																	</button>
																</div>
															))}
														</div>
														{visibleClasses.length > 3 && (
															<button className="arrow-btn">❯</button>
														)}
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
