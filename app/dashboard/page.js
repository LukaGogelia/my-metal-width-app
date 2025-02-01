'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DashboardContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user'); // Extract the 'user' parameter
  const [selectedWidth, setSelectedWidth] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const PORT = process.env.PORT || 3000;
  
  // Base URL for the deployed API
  const BASE_URL = 'https://my-metal-width-app.onrender.com';

  // Fetch initial data
  useEffect(() => {
    fetch(`${BASE_URL}/join`, {
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
    fetch(`${BASE_URL}/updateWidth`, {
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
      fetch(`${BASE_URL}/usersData`)
        .then((res) => res.json())
        .then((data) => {
          setUsersData(data);
        });
    }, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-6">
      
      {/* Selections at the top */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2 text-center">Workers' Selections</h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          {usersData.map((item) => (
            <div 
              key={item.user} 
              className={`p-3 border rounded-lg font-medium text-sm bg-gray-200`}
            >
              {item.user}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons at the bottom */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4 mt-auto">
        <h2 className="text-lg font-semibold mb-3 text-center">Select Width</h2>
        <div className="grid grid-cols-5 gap-2">
          {[0.4, 0.5, 0.7, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((width) => (
            <button
              key={width}
              onClick={() => handleWidthSelect(width)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                selectedWidth === width 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {width}
            </button>
          ))}
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
