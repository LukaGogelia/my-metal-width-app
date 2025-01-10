'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DashboardContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user'); // Extract the 'user' parameter
  const [selectedWidth, setSelectedWidth] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const PORT = process.env.PORT || 3000;
  // Fetch initial data
  useEffect(() => {
    // Join the application
    fetch(`http://localhost:${PORT}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsersData(data);
      });
  }, [user]);

  // Update the width
  const handleWidthSelect = (width) => {
    setSelectedWidth(width);
    fetch(`http://localhost:${PORT}/updateWidth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, width }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsersData(data);
      });
  };

  // Fetch the latest data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`http://localhost:${PORT}/usersData`)
        .then((res) => res.json())
        .then((data) => {
          setUsersData(data);
        });
    }, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user}</h1>
      <div className="mb-4">
        <h2 className="text-lg">Select the metal width you're working with:</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {[0.4, 0.5, 0.7, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map(
            (width) => (
              <button
                key={width}
                onClick={() => handleWidthSelect(width)}
                className={`px-4 py-2 border rounded ${
                  selectedWidth === width ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {width}
              </button>
            )
          )}
        </div>
      </div>

      <h2 className="text-lg mb-4">Others' Work:</h2>
      <div className="grid grid-cols-2 gap-4">
        {usersData.map((item) => (
          <div
            key={item.user}
            className={`p-2 border rounded ${
              item.width === selectedWidth ? 'bg-yellow-300' : ''
            }`}
          >
            <strong>{item.user}</strong>: {item.width || 'No Selection'}
          </div>
        ))}
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
