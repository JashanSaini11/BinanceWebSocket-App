import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import ClipLoader from "react-spinners/ClipLoader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  CandlestickController,
  CandlestickElement
);

// Create an in-memory store for candlestick data
const candlestickStore = new Map();

const BinanceWebSocket = ({ symbol, interval }) => {
  const [candlestickData, setCandlestickData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Retrieve data from the in-memory store
    const storedData = candlestickStore.get(symbol) || [];
    setCandlestickData(storedData);
    setLoading(true);

    const newWs = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
    );

    setWs(newWs);

    newWs.onopen = () => {
      console.log("WebSocket connected");
    };

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const candlestick = data.k;

      const newCandlestick = {
        x: new Date(candlestick.t), // Timestamp
        o: parseFloat(candlestick.o), // Open price
        h: parseFloat(candlestick.h), // High price
        l: parseFloat(candlestick.l), // Low price
        c: parseFloat(candlestick.c), // Close price
      };

      setCandlestickData((prevData) => {
        const updatedData = [...prevData, newCandlestick];
        // Update the in-memory store
        candlestickStore.set(symbol, updatedData);
        return updatedData;
      });

      setLoading(false);
    };

    // Cleanup function
    return () => {
      if (newWs) {
        newWs.close();
      }
    };
  }, [symbol, interval]); // Dependencies: symbol and interval

  const options = {
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Candlestick Chart for ${symbol.toUpperCase()}`,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
        },
        ticks: {
          source: "auto",
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: "Candlestick Data",
        data: candlestickData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        barThickness: 20,
      },
    ],
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-indigo-400 mb-4">
        {symbol.toUpperCase()} Candlestick Chart
      </h2>

      {/* Loader while data is fetching */}
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 opacity-75">
          <ClipLoader color="#00BFFF" size={100} />
        </div>
      ) : (
        <div className="relative w-full h-96 sm:h-112 md:h-128 lg:h-144">
          <Chart type="candlestick" data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default BinanceWebSocket;
