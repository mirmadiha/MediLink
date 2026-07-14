const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7197";
const FALLBACK_API_BASE_URLS = ["https://localhost:7197", "http://localhost:5155", "https://localhost:7049"];
const PROFILE_CACHE_KEY = "medilink_profile_cache_v1";

function setProfileCache(profile) {
	if (!profile) {
		return;
	}

	try {
		sessionStorage.setItem(
			PROFILE_CACHE_KEY,
			JSON.stringify({
				cachedAt: Date.now(),
				profile,
			})
		);
	} catch {
		// Ignore session storage failures.
	}
}

export function clearProfileCache() {
	try {
		sessionStorage.removeItem(PROFILE_CACHE_KEY);
	} catch {
		// Ignore session storage failures.
	}
}

export function getCachedProfile(maxAgeMs = 5 * 60 * 1000) {
	try {
		const raw = sessionStorage.getItem(PROFILE_CACHE_KEY);
		if (!raw) {
			return null;
		}

		const parsed = JSON.parse(raw);
		if (!parsed?.profile || !parsed?.cachedAt) {
			return null;
		}

		if (Date.now() - parsed.cachedAt > maxAgeMs) {
			return null;
		}

		return parsed.profile;
	} catch {
		return null;
	}
}

function getBaseUrls() {
	if (import.meta.env.VITE_API_BASE_URL) {
		return [import.meta.env.VITE_API_BASE_URL];
	}

	return FALLBACK_API_BASE_URLS;
}

async function request(path, options = {}) {
	const baseUrls = getBaseUrls();
	let lastError;

	for (const baseUrl of baseUrls) {
		try {
			const response = await fetch(`${baseUrl}${path}`, {
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					...(options.headers || {}),
				},
				...options,
			});

			const isJson = response.headers.get("content-type")?.includes("application/json");
			const payload = isJson ? await response.json() : null;

			if (!response.ok) {
				const error = new Error(payload?.message || "Request failed");
				error.status = response.status;
				error.payload = payload;
				throw error;
			}

			return payload;
		} catch (error) {
			lastError = error;

			// Retry only on network-level failures.
			if (!(error instanceof TypeError)) {
				throw error;
			}
		}
	}

	throw lastError;
}

export const api = {
	health: () => request("/api/health"),

	login: (data) =>
		{
			clearProfileCache();
			return request("/api/account/login", {
				method: "POST",
				body: JSON.stringify(data),
			});
		},

	signup: (data) =>
		request("/api/account/signup", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	logout: () =>
		request("/api/account/logout", {
			method: "POST",
		}).then((payload) => {
			clearProfileCache();
			return payload;
		}),

	profile: ({ forceFresh = false } = {}) => {
		if (!forceFresh) {
			const cached = getCachedProfile();
			if (cached) {
				return Promise.resolve(cached);
			}
		}

		return request("/api/account/profile").then((profile) => {
			setProfileCache(profile);
			return profile;
		});
	},
	myPrescriptions: () => request("/api/account/my-prescriptions"),

	listHospitals: () => request("/api/hospitals"),
	hospitalOptions: () => request("/api/hospitals/options"),
	adminCount: () => request("/api/hospitals/admins/count"),
	createHospital: (data) =>
		request("/api/hospitals", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	updateHospital: (id, data) =>
		request(`/api/hospitals/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),
	deleteHospital: (id) =>
		request(`/api/hospitals/${id}`, {
			method: "DELETE",
		}),
	createHospitalAdmin: (data) =>
		request("/api/hospitals/admins", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	listDoctors: () => request("/api/users/doctors"),

	getDoctor: (id) => request(`/api/users/doctors/${id}`),

	createDoctor: (data) =>
		request("/api/users/doctors", {
			method: "POST",
			body: JSON.stringify(data),
		}),

	updateDoctor: (id, data) =>
		request(`/api/users/doctors/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	deleteDoctor: (id) =>
		request(`/api/users/doctors/${id}`, {
			method: "DELETE",
		}),

	doctorDashboard: (abhaId) => request(`/api/doctor/dashboard?abhaId=${encodeURIComponent(abhaId ?? "")}`),
	doctorPrescriptions: (abhaId) => request(`/api/doctor/prescriptions?abhaId=${encodeURIComponent(abhaId ?? "")}`),
	doctorPrescriptionForm: (abhaId) =>
		request(`/api/doctor/prescription-form?abhaId=${encodeURIComponent(abhaId ?? "")}`),
	addPrescription: (data) =>
		request("/api/doctor/prescriptions", {
			method: "POST",
			body: JSON.stringify(data),
		}),
};

export function getApiErrorMessage(error, fallback = "Something went wrong") {
	if (!error) {
		return fallback;
	}

	if (error.payload?.errors?.length) {
		return error.payload.errors.join(" ");
	}

	if (error.payload?.message) {
		return error.payload.message;
	}

	if (error.message) {
		if (error.message.toLowerCase().includes("failed to fetch")) {
			return "Unable to reach API. Start MediLink.Api and ensure frontend points to the correct API URL.";
		}

		return error.message;
	}

	return fallback;
}
