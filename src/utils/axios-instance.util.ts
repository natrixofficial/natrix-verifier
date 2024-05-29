import axios from "axios";

export const httpClient = axios.create({
	headers: {
		"Cache-Control": "no-cache",
		"API-VERSION": String(process.env["VERSION"] || "1.0.0"),
	},
});
