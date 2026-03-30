import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// ===== USERS =====

// Register
export const createUser = async (userData) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/register`, userData);
    return res.data.user;
  } catch (err) {
    console.error("createUser error:", err.response?.data || err.message);
    return null;
  }
};

// Login
export async function loginUser(credentials) {
  try {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) throw new Error("Login failed");

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ===== BOOKINGS =====

export async function createBooking(bookingData) {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (!res.ok) throw new Error("Booking failed");

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getBookings(userId, role = "client") {
  try {
    const endpoint =
      role === "client"
        ? `${BASE_URL}/bookings/client/${userId}`
        : `${BASE_URL}/bookings/freelancer/${userId}`;

    const res = await fetch(endpoint);

    if (!res.ok) throw new Error("Fetch bookings failed");

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ===== DOUBTS =====

export async function postDoubt(doubtData) {
  try {
    const res = await fetch(`${BASE_URL}/doubts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doubtData),
    });

    if (!res.ok) throw new Error("Post doubt failed");

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ===== USERS LIST =====

export async function getUsers() {
  try {
    const res = await fetch(`${BASE_URL}/users`);

    if (!res.ok) throw new Error("Fetch users failed");

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ===== FREELANCERS =====

export async function getFreelancers(filters = {}) {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const url = queryString
      ? `${BASE_URL}/freelancers?${queryString}`
      : `${BASE_URL}/freelancers`;

    const res = await fetch(url);

    if (!res.ok) throw new Error("Fetch freelancers failed");

    return await res.json();
  } catch (err) {
    console.error("getFreelancers error:", err);
    return [];
  }
}

export async function getFreelancerById(id) {
  try {
    const res = await fetch(`${BASE_URL}/freelancers/${id}`);

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Fetch freelancer failed");

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ===== AI MATCH =====

export async function matchFreelancers(matchData) {
  try {
    const res = await fetch(`${BASE_URL}/freelancers/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matchData),
    });

    if (!res.ok) throw new Error("Failed to match freelancers");

    return await res.json();
  } catch (err) {
    console.error("Match error:", err);
    return { query: matchData.clientText, matches: [] };
  }
}

// ===== FRAUD CHECK =====

export async function fraudCheckFreelancer(profile) {
  try {
    const res = await fetch(`${BASE_URL}/fraud/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!res.ok) throw new Error("Fraud check failed");

    return await res.json();
  } catch (err) {
    console.error(err);
    return {
      profile,
      fraudCheck: {
        risk: "unknown",
        riskScore: 0,
        reasons: [err.message],
      },
    };
  }
}