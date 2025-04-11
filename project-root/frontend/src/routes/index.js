import { Routes, Route } from "react-router-dom";

// 🔐 Auth pages
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyPage from "../pages/VerifyPage";

// 👤 User pages
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import SearchPage from "../pages/SearchPage";
import BookingPage from "../pages/BookingPage";
import PaymentPage from "../pages/PaymentPage";
import OrderPage from "../pages/OrderPage";

// 🛡️ Route protection
import PrivateRoute from "./PrivateRoute";

// 🛠️ Admin pages
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import FlightList from "../pages/admin/FlightList";
import BookingList from "../pages/admin/BookingList";
import UserList from "../pages/admin/UserList";
import AirlineList from "../pages/admin/AirlineList";
import AirportList from "../pages/admin/AirportList";
const AppRoutes = () => {
	return (
		<Routes>
			{/* 🔐 Auth routes */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/verify-email" element={<VerifyPage />} />

			{/* 🏠 Public pages */}
			<Route path="/" element={<HomePage />} />
			<Route path="/search" element={<SearchPage />} />

			{/* 👤 Protected routes */}
			<Route
				path="/booking"
				element={
					<PrivateRoute>
						<BookingPage />
					</PrivateRoute>
				}
			/>
			<Route
				path="/payment"
				element={
					<PrivateRoute>
						<PaymentPage />
					</PrivateRoute>
				}
			/>
			<Route
				path="/order/:id"
				element={
					<PrivateRoute>
						<OrderPage />
					</PrivateRoute>
				}
			/>
			<Route
				path="/profile"
				element={
					<PrivateRoute>
						<ProfilePage />
					</PrivateRoute>
				}
			/>

			{/* 🛠️ Admin routes */}
			<Route
				path="/admin"
				element={
					<PrivateRoute adminOnly>
						<AdminLayout />
					</PrivateRoute>
				}>
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="flights" element={<FlightList />} />
				<Route path="bookings" element={<BookingList />} />
				<Route path="users" element={<UserList />} />
				<Route path="airlines" element={<AirlineList />} />
				<Route path="airports" element={<AirportList />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
