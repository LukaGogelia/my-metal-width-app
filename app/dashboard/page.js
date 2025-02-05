"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function DashboardContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "Unknown User";

  const [selectedWidths, setSelectedWidths] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "https://app.tori.ge"; // Ensure correct backend URL

  // Fetch user data on mount
  useEffect(() => {
    if (!user) return;

    fetch(`${BASE_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsersData(data);
        const currentUser = data.find((u) => u.user === user);
        setSelectedWidths(currentUser?.widths || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching user data");
        setLoading(false);
      });
  }, [user]);

  // Function to update width selection
  const handleWidthSelect = (width) => {
    let newWidths;

    if (width === "none") {
      // Clear all widths when "არცერთი არჩევანი" is clicked
      newWidths = [];
    } else {
      // Toggle the selected width
      newWidths = selectedWidths.includes(width)
        ? selectedWidths.filter((w) => w !== width)
        : [...selectedWidths, width];
    }

    setSelectedWidths(newWidths);

    fetch(`${BASE_URL}/updateWidth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, widths: newWidths }), // Ensure `widths` is sent as an array
    })
      .then((res) => res.json())
      .then((data) => setUsersData(data))
      .catch(() => setError("Failed to update width"));
  };

  // Periodic fetch every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${BASE_URL}/usersData`)
        .then((res) => res.json())
        .then((data) => {
          setUsersData(data);
          const currentUser = data.find((u) => u.user === user);
          setSelectedWidths(currentUser?.widths || []);
        })
        .catch(() => setError("Failed to fetch latest data"));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Check which users have at least one width in common
  const usersWithCommonWidths = usersData.reduce((acc, u) => {
    if (u.user === user) return acc;
    if (u.widths?.some((w) => selectedWidths.includes(w))) {
      acc.add(u.user);
    }
    return acc;
  }, new Set());

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-6">
      {/* Logged-in user */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-4 mb-4 text-center">
        <h2 className="text-lg font-semibold">შესული მომხმარებელი: {user}</h2>
        <p className="text-sm text-gray-600">
          თქვენი სიგანეები:{" "}
          {selectedWidths.length > 0 ? selectedWidths.join(", ") : "არცერთი"}
        </p>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-600 font-semibold">{error}</div>}

      {/* Loading Indicator */}
      {loading && <div>Loading...</div>}

      {/* User List with Selected Widths */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2 text-center">
          მომხმარებლები და მათი არჩევანი
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {usersData.map((u) => (
            <div
              key={u.user}
              className={`flex flex-col items-center justify-center p-4 border rounded-lg min-w-[150px] text-center ${
                usersWithCommonWidths.has(u.user)
                  ? "bg-yellow-300"
                  : "bg-gray-200"
              }`}
            >
              <span className="block text-lg font-bold">{u.user}</span>
              {u.widths?.length > 0 ? (
                <ul className="text-gray-700">
                  {u.widths.map((w, index) => (
                    <li key={index}>{w} მმ</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-700">არცერთი</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Width Selection */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-4 mt-auto">
        <h2 className="text-lg font-semibold mb-3 text-center">
          აირჩიეთ სიგანე
        </h2>

        <div className="grid grid-cols-5 gap-2">
          {[0.4, 0.5, 0.7, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map(
            (width) => (
              <button
                key={width}
                onClick={() => handleWidthSelect(width)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  selectedWidths.includes(width)
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {width}
              </button>
            )
          )}
        </div>

        {/* No Selection button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleWidthSelect("none")}
            className="px-6 py-3 rounded-lg text-sm font-semibold transition bg-red-500 text-white hover:bg-red-600"
          >
            არცერთი არჩევანი
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
