import Swal from "sweetalert2";

const AlertPopup = {
	success: (message, title = "Thành công") => {
		Swal.fire({
			icon: "success",
			title,
			text: message,
			showConfirmButton: false,
			timer: 1500,
		});
	},

	error: (message, title = "Lỗi") => {
		Swal.fire({
			icon: "error",
			title,
			text: message,
		});
	},

	warning: (message, title = "Thông báo") => {
		Swal.fire({
			icon: "warning",
			title,
			text: message,
		});
	},
};

export default AlertPopup;
