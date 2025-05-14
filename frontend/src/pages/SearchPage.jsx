import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchFlights } from "../services/flightService";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import "./SearchPage.css";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [flights, setFlights] = useState([]);
	const [returnFlights, setReturnFlights] = useState([]);
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
	const [selectedStops, setSelectedStops] = useState([]);
	const [selectedFlightId, setSelectedFlightId] = useState(null);
	const [visibleSeatIndex, setVisibleSeatIndex] = useState(0);
	const [showAllSeats, setShowAllSeats] = useState(false);
	const [tripType, setTripType] = useState(
		searchParams.get("returnDate") ? "roundtrip" : "oneway"
	);
	const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
	const [isChangingOutbound, setIsChangingOutbound] = useState(false);
	const stopOptions = [
		{ label: "Bay thẳng", value: "direct" },
		{ label: "1 điểm dừng", value: "one-stop" },
		{ label: "Nhiều điểm dừng", value: "multi-stop" },
	];

	const today = dayjs().startOf("day");
	const returnDate = searchParams.get("returnDate");
	const dateList =
		tripType === "roundtrip" && returnDate
			? Array.from({ length: 7 }, (_, i) => {
					const offset = i + weekOffset * 7 - 1;
					const dep = dayjs(currentDate).add(offset, "day");
					const ret = dayjs(returnDate).add(offset, "day");
					return {
						dep: dep.format("YYYY-MM-DD"),
						ret: ret.format("YYYY-MM-DD"),
					};
			  }).filter(({ dep }) => dayjs(dep).isSameOrAfter(today))
			: Array.from({ length: 7 }, (_, i) =>
					today.add(i + weekOffset * 7, "day").format("YYYY-MM-DD")
			  );
	const isReturnPhase =
		tripType === "roundtrip" && selectedOutboundFlight && !isChangingOutbound;
	const activeFlights = isReturnPhase ? returnFlights : flights;

	const filteredFlights = activeFlights.filter((f) => {
		const airlineMatch =
			selectedAirlines.length === 0 ||
			selectedAirlines.includes(f.airlineInfo?.name);
		const stopMatch =
			selectedStops.length === 0 || selectedStops.includes(f.stopType);
		return airlineMatch && stopMatch;
	});

	useEffect(() => {
		const updatedFrom = searchParams.get("from");
		const updatedTo = searchParams.get("to");
		const updatedPassengers = searchParams.get("passengers") || 1;
		const updatedDate = searchParams.get("departureDate");
		const updatedReturnDate = searchParams.get("returnDate");

		setFrom(updatedFrom);
		setTo(updatedTo);
		setPassengers(updatedPassengers);
		setCurrentDate(updatedDate);
		setTripType(updatedReturnDate ? "roundtrip" : "oneway");
		// 👇 Thêm logic này để tự động set lại weekOffset sao cho ngày đang chọn nằm trong khung hiển thị
		if (updatedDate) {
			const diffInDays = dayjs(updatedDate).diff(today, "day");
			const targetOffset = Math.floor(diffInDays / 7);
			setWeekOffset(targetOffset >= 0 ? targetOffset : 0);
		}
	}, [searchParams]);

	useEffect(() => {
		const fetchFlights = async () => {
			try {
				const data = await searchFlights({
					from,
					to,
					departureDate: currentDate,
					returnDate: searchParams.get("returnDate") || null,
					passengers,
				});
				setFlights(data?.depart || []);

				setReturnFlights(data?.return || []);
				const airlines = [
					...new Set(
						[...(data.depart || []), ...(data.return || [])]
							.map((f) => f.airlineInfo?.name)
							.filter(Boolean)
					),
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
	}, [from, to, currentDate, passengers, returnDate]);

	const handleDateClick = (date) => {
		setCurrentDate(date);
		searchParams.set("departureDate", date);
		setSearchParams(searchParams);
	};

	const handleNextWeek = () => {
		setWeekOffset((prev) => prev + 1);
	};

	const handlePrevWeek = () => {
		if (tripType === "roundtrip" && returnDate) {
			// Lấy ngày đi của tuần trước
			const prevDepDate = dayjs(currentDate).add(
				(weekOffset - 1) * 7 - 1,
				"day"
			); // giống offset bên dateList

			if (prevDepDate.isBefore(today, "day")) return;
		}

		if (weekOffset > 0) {
			setWeekOffset((prev) => prev - 1);
		}
	};
	const handleSearchFormSubmit = (values) => {
		searchParams.set("from", values.from);
		searchParams.set("to", values.to);
		searchParams.set("departureDate", values.departureDate);
		searchParams.set("passengers", values.passengers);
		if (values.tripType === "roundtrip" && values.returnDate) {
			searchParams.set("returnDate", values.returnDate);
		} else {
			searchParams.delete("returnDate");
		}
		setSearchParams(searchParams);
	};

	const handleSelectFlight = (flightId) => {
		setSelectedFlightId(flightId === selectedFlightId ? null : flightId);
		setVisibleSeatIndex(0);
		setShowAllSeats(false);
	};

	const handleBookFlight = (flight, seat) => {
		if (tripType === "roundtrip") {
			if (!selectedOutboundFlight || isChangingOutbound) {
				// Đang chọn hoặc đổi chiều đi
				setSelectedOutboundFlight({
					flightId: flight._id,
					seatClass: seat,
					flightInfo: flight,
				});
				setIsChangingOutbound(false);
				return;
			}

			// Đã có chiều đi và không đổi → đây là chiều về → sang booking
			navigate("/booking", {
				state: {
					outboundFlight: selectedOutboundFlight,
					returnFlight: {
						flightId: flight._id,
						seatClass: seat,
						flightInfo: flight,
					},
					passengers: parseInt(passengers),
					tripType: "roundtrip",
				},
			});
		} else {
			// Một chiều
			navigate("/booking", {
				state: {
					flightId: flight._id,
					seatClass: seat,
					passengers: parseInt(passengers),
					departureDate: currentDate,
					flightInfo: flight,
				},
			});
		}
	};

	useEffect(() => {
		const activeDateItem = document.querySelector(".date-item.active");
		const wrapper = document.querySelector(".date-items-wrapper");
		if (activeDateItem && wrapper) {
			// Scroll để date-item active nằm giữa wrapper
			const leftOffset =
				activeDateItem.offsetLeft -
				wrapper.offsetWidth / 2 +
				activeDateItem.offsetWidth / 2;
			wrapper.scrollTo({ left: leftOffset, behavior: "smooth" });
		}
	}, [dateList, currentDate]);
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
						returnDate: searchParams.get("returnDate") || "",
						tripType: searchParams.get("returnDate") ? "roundtrip" : "oneway",
					}}
					onSubmit={handleSearchFormSubmit}
				/>
				<div className="date-scroll">
					<button className="arrow-button" onClick={handlePrevWeek}>
						❮
					</button>
					<div className="date-items-wrapper">
						{tripType === "roundtrip" && returnDate
							? dateList.map(({ dep, ret }) => (
									<button
										key={`${dep}-${ret}`}
										className={`date-item stacked ${
											dep === currentDate && ret === returnDate ? "active" : ""
										}`}
										onClick={() => {
											searchParams.set("departureDate", dep);
											searchParams.set("returnDate", ret);
											setSearchParams(searchParams);
											setCurrentDate(dep);
										}}>
										<span>{dayjs(dep).format("dd, DD/MM/YYYY")} -</span>
										<span>{dayjs(ret).format("dd, DD/MM/YYYY")}</span>
									</button>
							  ))
							: dateList.map((date) => (
									<button
										key={date}
										className={`date-item ${
											date === currentDate ? "active" : ""
										}`}
										onClick={() => handleDateClick(date)}>
										{dayjs(date).format("dd, DD/MM/YYYY")}
									</button>
							  ))}
					</div>
					<button className="arrow-button" onClick={handleNextWeek}>
						❯
					</button>
				</div>
				{tripType === "roundtrip" && selectedOutboundFlight ? (
					<div className="flight-route-header">
						<div
							className="route-content"
							style={{ flexDirection: "column", gap: "6px" }}>
							<div
								style={{ display: "flex", gap: "8px", alignItems: "center" }}>
								<span className="route-index">1.</span>
								<span>
									Chiều đi: {selectedOutboundFlight.flightInfo.originInfo?.name}{" "}
									→ {selectedOutboundFlight.flightInfo.destinationInfo?.name}
								</span>
								<div>
									*Cập nhật lúc:{" "}
									{new Date().toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
							</div>

							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									background: "#fff",
									padding: "10px 16px",
									borderRadius: "6px",
									marginTop: "8px",
									color: "#333",
									fontWeight: "500",
									flexWrap: "wrap",
									gap: "1rem",
								}}>
								<div>
									{dayjs(
										selectedOutboundFlight.flightInfo.itineraries[0].segments[0]
											.departure.at
									).format("DD/MM/YYYY")}
								</div>
								<div>
									{dayjs(
										selectedOutboundFlight.flightInfo.itineraries[0].segments[0]
											.departure.at
									).format("HH:mm")}{" "}
									-{" "}
									{dayjs(
										selectedOutboundFlight.flightInfo.itineraries[0].segments.at(
											-1
										).arrival.at
									).format("HH:mm")}
								</div>
								<div>
									{selectedOutboundFlight.flightInfo.originInfo?.name} -{" "}
									{selectedOutboundFlight.flightInfo.destinationInfo?.name}
								</div>
								<div>{selectedOutboundFlight.flightInfo.duration}</div>
								<button
									className="change-flight-btn"
									onClick={() => {
										setIsChangingOutbound(!isChangingOutbound);
									}}>
									{isChangingOutbound ? "Hủy đổi chuyến" : "Đổi chuyến bay"}
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className="flight-route-header">
						<div className="route-content">
							<span className="route-index">1.</span>
							<span>
								{flights[0]?.originInfo?.name || from} →{" "}
								{flights[0]?.destinationInfo?.name || to}
							</span>
						</div>
					</div>
				)}

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
						<h4>Lọc theo điểm dừng:</h4>
						{stopOptions.map((option) => (
							<label key={option.value} style={{ display: "block" }}>
								<input
									type="checkbox"
									value={option.value}
									checked={selectedStops.includes(option.value)}
									onChange={(e) => {
										const value = e.target.value;
										setSelectedStops((prev) =>
											e.target.checked
												? [...prev, value]
												: prev.filter((s) => s !== value)
										);
									}}
								/>{" "}
								{option.label}
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
								const segments = flight.itineraries?.[0]?.segments;
								const firstSegment = segments?.[0];
								const lastSegment = segments?.[segments.length - 1];
								const departureIATA = firstSegment?.departure?.iataCode;
								const arrivalIATA = lastSegment?.arrival?.iataCode;
								const departureTime = firstSegment?.departure?.at;
								const arrivalTime = lastSegment?.arrival?.at;
								if (!segments) return null;
								const visibleClasses = flight.seatClasses?.filter(
									(s) => s?.name
								);
								const isSelected = selectedFlightId === flight.id;
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
													{segments
														.map((seg) => `${seg.carrierCode}${seg.number}`)
														.join(", ")}
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
													{departureIATA} → {arrivalIATA} | {flight.duration} |{" "}
													{flight.stopType === "direct" && "Bay thẳng"}
													{flight.stopType === "one-stop" && "1 điểm dừng"}
													{flight.stopType === "multi-stop" &&
														"Nhiều điểm dừng"}
												</div>
												<div className="route-tooltip-overlay">
													{flight.stopType === "direct" ? (
														<>
															<div>{flight.originInfo?.name}</div>
															<div>{flight.destinationInfo?.name}</div>
														</>
													) : (
														<>
															<div>{flight.originInfo?.name}</div>
															<div>
																Trung chuyển tại{" "}
																<strong>{flight.transitInfo?.name}</strong> ~{" "}
																{flight.transitDurationFormatted ||
																	`${flight.transitDuration}`}
															</div>
															<div>{flight.destinationInfo?.name}</div>
														</>
													)}
												</div>
											</div>
											<div className="flight-price">
												<strong>
													{flight.seatClasses?.[0]?.price
														? Number(
																flight.seatClasses[0].price
														  ).toLocaleString("vi-VN") + " ₫"
														: "Liên hệ"}
												</strong>
												<button onClick={() => handleSelectFlight(flight.id)}>
													Chọn
												</button>
											</div>
										</div>
										{/* Seat class section giữ nguyên */}
										{isSelected && (
											<div className="seat-classes">
												{visibleClasses.map((seat, idx) => (
													<div className="seat-card" key={idx}>
														<h4>{seat.name}</h4>
														<p>Giá: {seat.price.toLocaleString()} VND</p>
														<p>
															Hành lý: {seat.baggage.hand} |{" "}
															{seat.baggage.checked}
														</p>

														<button
															onClick={() => handleBookFlight(flight, seat)}
															className="book-button"
															disabled={seat.availableSeats === 0}>
															{seat.availableSeats === 0 ? "Hết vé" : "Đặt vé"}
														</button>
													</div>
												))}
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
