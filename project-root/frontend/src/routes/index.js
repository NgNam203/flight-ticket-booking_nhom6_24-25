import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProfileInfo from "../pages/ProfileInfo";
import PrivateRoute from "./PrivateRoute";
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
			{/* thêm các route khác */}
		</Routes>
	);
};

export default AppRoutes;
