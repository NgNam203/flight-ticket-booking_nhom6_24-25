import React from "react";
import { NavLink, Outlet } from "react-router-dom";
// import "../../assets/css/admin.css"; // CSS bạn tự thiết kế thêm nếu muốn
import Header from "../../components/Header";
const AdminLayout = () => {
	return (
		<div className="admin-layout">
			<Header />
			<aside className="admin-sidebar">
				<h3>Trang Quản Trị</h3>
				<nav>
					<ul>
						<li>
							<NavLink to="dashboard">Dashboard</NavLink>
						</li>
						<li>
							<NavLink to="flights">Quản lý chuyến bay</NavLink>
						</li>
						<li>
							<NavLink to="bookings">Quản lý đặt vé</NavLink>
						</li>
						<li>
							<NavLink to="users">Quản lý người dùng</NavLink>
						</li>
						<li>
							<NavLink to="airlines">Quản lý hãng hàng không</NavLink>
						</li>
						<li>
							<NavLink to="airports">Quản lý hãng hàng không</NavLink>
						</li>
					</ul>
				</nav>
			</aside>

			<main className="admin-main">
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
