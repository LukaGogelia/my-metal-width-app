'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState('');

  const handleStart = (user) => {
    setSelectedUser(user);
    router.push(`/dashboard?user=${user}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Select Your Name</h1>
      <div className="grid grid-cols-2 gap-4">
        {["Alex", "Temur", "Salome", "Giorgi"].map((user) => (
          <button
            key={user}
            onClick={() => handleStart(user)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-600 transition"
          >
            {user}
          </button>
        ))}
      </div>
    </div>
  );
}
