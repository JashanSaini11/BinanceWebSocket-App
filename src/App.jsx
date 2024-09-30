import React, { useState } from "react";
import BinanceWebSocket from "./components/BinanceWebSocket";

const App = () => {
  const [symbol, setSymbol] = useState("ethusdt");
  const [interval, setInterval] = useState("1m");

  const handleSymbolChange = (e) => setSymbol(e.target.value);
  const handleIntervalChange = (e) => setInterval(e.target.value);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex items-center justify-center">
      <div className="container mx-auto max-w-4xl bg-gray-800 p-4 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-indigo-400">
          Binance Live Crypto Charts
        </h1>

        {/* Dropdown Controls */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Cryptocurrency Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Cryptocurrency
            </label>
            <select
              onChange={handleSymbolChange}
              value={symbol}
              className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
            >
              <option value="ethusdt">ETH/USDT</option>
              <option value="bnbusdt">BNB/USDT</option>
              <option value="dotusdt">DOT/USDT</option>
            </select>
          </div>

          {/* Time Interval Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Time Interval
            </label>
            <select
              onChange={handleIntervalChange}
              value={interval}
              className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
            >
              <option value="1m">1 Minute</option>
              <option value="3m">3 Minutes</option>
              <option value="5m">5 Minutes</option>
            </select>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg">
          <BinanceWebSocket symbol={symbol} interval={interval} />
        </div>
      </div>
    </div>
  );
};

export default App;
