'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DashboardContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user'); // Extract the 'user' parameter
  const [selectedWidth, setSelectedWidth] = useState(null);
  const [usersData, setUsersData] = useState([]);
  
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

  // Update the width (including "No Selection" option)
  const handleWidthSelect = (width) => {
    const newWidth = width === 'none' ? null : width; // Convert "none" to null
    setSelectedWidth(newWidth);
    fetch(`${BASE_URL}/updateWidth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, width: newWidth }),
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

  // Group users by width (only include users with a selected width)
  const groupedByWidth = usersData.reduce((acc, user) => {
    if (!user.width) return acc; // Ignore users with "No Selection"
    acc[user.width] = acc[user.width] || [];
    acc[user.width].push(user.user);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 p-6">
      
      {/* Workers' Selections - Grouped by Width */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2 text-center">Workers' Selections</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(groupedByWidth).map(([width, users]) => (
            <div 
              key={width} 
              className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-200 min-w-[120px] text-center"
            >
              <span className="block text-lg font-bold">{width} cm</span>
              <span className="text-gray-700">{users.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons at the bottom */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-4 mt-auto">
        <h2 className="text-lg font-semibold mb-3 text-center">Select Width</h2>
        
        {/* Width selection buttons in a 5-column grid */}
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

        {/* No Selection button centered on a separate row */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleWidthSelect('none')}
            className="px-6 py-3 rounded-lg text-sm font-semibold transition bg-red-500 text-white hover:bg-red-600"
          >
            No Selection
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
