import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProfileInfo from "../pages/ProfileInfo";
import PrivateRoute from "./PrivateRoute";
import FlightList from "../pages/admin/FlightList";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import BookingList from "../pages/admin/BookingList";
import UserList from "../pages/admin/UserList";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/register" element={<Register />} />
			<Route path="/verify-email" element={<VerifyEmail />} />
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<Home />} />
			<Route
				path="/profile"
				element={
					<PrivateRoute>
						<ProfileInfo />
					</PrivateRoute>
				}
			/>
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
			</Route>
			{/* thêm các route khác */}
		</Routes>
	);
};

export default AppRoutes;
