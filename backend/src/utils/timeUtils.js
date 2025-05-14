// src/utils/timeUtils.js

// Convert ISO duration (PT5H45M) -> minutes (số phút)
function parseISODuration(durationStr) {
	if (!durationStr) return 0;
	const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
	const hours = parseInt(match?.[1] || "0", 10);
	const minutes = parseInt(match?.[2] || "0", 10);
	return hours * 60 + minutes;
}

// Convert minutes -> "3g5p" format
function formatMinutesToText(minutes) {
	if (typeof minutes !== "number" || minutes < 0) return "0p";
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	let result = "";
	if (hours > 0) result += `${hours}g`;
	if (mins > 0) result += `${mins}p`;
	return result || "0p";
}

module.exports = {
	parseISODuration,
	formatMinutesToText,
};
