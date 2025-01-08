'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState('');

  const handleStart = () => {
    if (selectedUser) {
      router.push(`/dashboard?user=${selectedUser}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Select Your Name</h1>
      <select
        className="p-2 border border-gray-300 rounded"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">-- Select --</option>
        <option value="Alex">Alex</option>
        <option value="Temur">Temur</option>
        <option value="Salome">Salome</option>
        <option value="Giorgi">Giorgi</option>
      </select>
      <button
        onClick={handleStart}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start
      </button>
    </div>
  );
}
