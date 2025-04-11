// /backend/src/middlewares/verifyCaptcha.js
const axios = require("axios");

const verifyCaptcha = async (req, res, next) => {
	const captchaToken = req.body.captchaToken;

	if (!captchaToken) {
		return res.status(400).json({ message: "Captcha token is required" });
	}

	try {
		const secretKey = process.env.RECAPTCHA_SECRET_KEY;
		const response = await axios.post(
			`https://www.google.com/recaptcha/api/siteverify`,
			null,
			{
				params: {
					secret: secretKey,
					response: captchaToken,
				},
			}
		);

		if (!response.data.success) {
			return res.status(403).json({ message: "Captcha verification failed" });
		}

		next(); // Passed captcha check
	} catch (err) {
		console.error("Captcha verification error:", err.message);
		return res.status(500).json({ message: "Captcha verification failed" });
	}
};

module.exports = verifyCaptcha;
