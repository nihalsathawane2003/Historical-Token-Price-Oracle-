'use client';

import React, { useState } from 'react';

const tokens = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA', 'BNB', 'MATIC'];

export default function Home() {
  const [token, setToken] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPrice = async () => {
    if (!token || !date) return;

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time

    if (selectedDate > today) {
      setError('Future date is not allowed.');
      setPrice(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:4000/api/price?token=${token}&date=${date}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setPrice(null);
      } else {
        setPrice(data.price);
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      setError('Failed to fetch price.');
      setPrice(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Historical Price Oracle</h1>

        <select
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Select Token</option>
          {tokens.map((tkn) => (
            <option key={tkn} value={tkn}>
              {tkn}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          onClick={fetchPrice}
          disabled={!token || !date || loading}
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Get Price'}
        </button>

        {error && (
          <div className="text-center text-red-600 font-semibold">{error}</div>
        )}

        {price !== null && !error && (
          <div className="text-center text-lg font-semibold text-gray-800">
            Price on <span className="font-bold">{date}</span>:&nbsp;
            <span className="text-green-600">${price}</span>
          </div>
        )}
      </div>


    </main>
  );
}
