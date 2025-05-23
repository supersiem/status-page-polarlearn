"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-center text-gray-100">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-sky-100">Polarlearn</span> Status
          </h1>
          <p className="mt-2 text-center text-gray-400">Real-time monitoring van Polarlearn en de diensten die daar bij horen</p>
        </header>
        <StatusGrid />
      </div>
    </div>
  );
}

function StatusCard({ monitor }) {
  const isUp = monitor.uptime_status === 'up';

  return (
    <>
      <div
        className={`p-8 rounded-xl shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${isUp
          ? 'bg-gray-800 border-l-4 border-green-500'
          : 'bg-gray-800 border-l-4 border-red-500'
          }`}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-200">{monitor.name}</h3>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${isUp ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className={`text-lg font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
              {isUp ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function StatusGrid() {
  const [monitors, setMonitors] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/status');
      if (!response.ok) throw new Error('Data ophalen mislukt');

      const data = await response.json();
      setMonitors(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up interval to fetch data every minute (60000 ms)
    const intervalId = setInterval(fetchData, 60000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg max-w-4xl mx-auto shadow">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
          </svg>
          <span className="font-medium">Fout bij ophalen status: </span>
          <span className="ml-1">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitors.map((monitor) => (
          <StatusCard key={monitor.id} monitor={monitor} />
        ))}
      </div>
      {lastUpdated && (
        <p className="text-center text-sm text-gray-400 mt-6 fixed bottom-4 left-0 right-0">
          Laatste update: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
