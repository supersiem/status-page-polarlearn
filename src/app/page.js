"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import learnlogo from './polarlearn.svg';
import polarlogo from './polar.svg';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-center text-gray-100 flex items-center justify-center">
            <Image src={polarlogo} alt="Polar Logo" width={48} height={48} className="inline-block mr-2" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-sky-100 pr-2">
              Polar 
            </span>
            status
          </h1>
          <p className="mt-2 text-center text-gray-400">Zie de live status van de websites en diensen van Polar</p>
        </header>
        <StatusGrid />
      </div>
    </div>
  );
}

function StatusCard({ monitor, isSelected, onClick }) {
  console.log(monitor);
  const isUp = monitor.uptime_status === 'up';
  const isInMaintenance = monitor.monitor_status === 'maint_dnd' || monitor.monitor_status === 'maint';

  return (
    <div
      className={`p-8 rounded-xl shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer ${isInMaintenance
        ? 'bg-gray-800 border-l-4 border-yellow-500'
        : isUp
          ? 'bg-gray-800 border-l-4 border-green-500'
          : 'bg-gray-800 border-l-4 border-red-500'
        }`}
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-200">{monitor.name}</h3>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-3 ${isInMaintenance ? 'bg-yellow-500' : isUp ? 'bg-green-500' : 'bg-red-500'
            } animate-pulse`}></div>
          <span className={`text-lg font-medium ${isInMaintenance ? 'text-yellow-400' : isUp ? 'text-green-400' : 'text-red-400'
            }`}>
            {isInMaintenance ? 'Onderhoud' : isUp ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ monitor }) {
  const isUp = monitor.uptime_status === 'up';
  const isInMaintenance = monitor.monitor_status === 'maint_dnd' || monitor.monitor_status === 'maint';

  // Convert Unix timestamp to "time ago" format
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'error';

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const secondsAgo = now - timestamp;

    if (secondsAgo < 60) {
      return `${secondsAgo} seconden geleden`;
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes} ${minutes === 1 ? 'minuut' : 'minuten'} geleden`;
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `${hours} ${hours === 1 ? 'uur' : 'uren'} geleden`;
    } else {
      const days = Math.floor(secondsAgo / 86400);
      return `${days} ${days === 1 ? 'dag' : 'dagen'} geleden`;
    }
  };
  console.log(monitor);
  return (
    <div className="col-span-full mb-6 p-6 rounded-xl bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg transform transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        {
          monitor.target && monitor.target.includes('://polarlearn.tech') || monitor.target && monitor.target.includes('://staging.polarlearn.tech')
            ? 
        <h3 className="text-2xl font-bold t</div>ext-gray-200 flex items-center">
          Details voor <Image src={learnlogo} alt="Polar Learn Logo" width={32} height={32} className="ml-3" /> <span className='ml-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-100'>{monitor.name}</span>
        </h3>
            :
        <h3 className="text-2xl font-bold text-gray-200">
          Details voor {monitor.name}
        </h3>
        }

        <div className="flex items-center px-3 py-1 rounded-full bg-gray-800/50">
          <div className={`w-3 h-3 rounded-full mr-2 ${isInMaintenance ? 'bg-yellow-500' : isUp ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          <span className={`text-sm font-medium ${isInMaintenance ? 'text-yellow-500' : isUp ? 'text-green-400' : 'text-red-400'}`}>
            {isInMaintenance ? 'Onderhoud' : isUp ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700 hover:border-sky-400 transition-all duration-300">
          <p className="text-gray-400 text-sm mb-2">Uptime</p>
          <p className="text-3xl font-bold text-gray-100">{monitor.uptime ? parseFloat(monitor.uptime).toFixed(2) : 'error'}%</p>
          <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-sky-400 h-2 rounded-full"
              style={{ width: `${monitor.uptime || 0}%` }}></div>
          </div>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700 hover:border-sky-400 transition-all duration-300">
          <p className="text-gray-400 text-sm mb-2">Gemiddelde responstijd</p>
          <p className="text-3xl font-bold text-gray-100">
            {monitor.locations?.amsterdam?.response_time ? monitor.locations.amsterdam.response_time : 'error'}<span className="text-xl text-gray-500">ms</span>
          </p>
          <div className="mt-3 text-xs text-gray-500">
            {parseInt(monitor.locations?.amsterdam?.response_time || 60000) < 200 ? 'Uitstekende prestaties' :
              parseInt(monitor.locations?.amsterdam?.response_time || 60000) < 500 ? 'Normale prestaties' : 'Slechte prestaties'}
          </div>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg shadow-inner border border-gray-700 hover:border-sky-400 transition-all duration-300">
          <p className="text-gray-400 text-sm mb-2">Laatste check</p>
          <p className="text-3xl font-bold text-gray-100">{formatTimeAgo(monitor.last_check)}</p>
          <div className="mt-3 text-xs text-gray-500">Automatisch gecontroleerd</div>
        </div>
      </div>
    </div>
  );
}

function StatusGrid() {
  const [monitors, setMonitors] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedMonitor, setSelectedMonitor] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/status');
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
    const intervalId = setInterval(fetchData, 120000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleCardClick = (monitor) => {
    setSelectedMonitor(selectedMonitor?.id === monitor.id ? null : monitor);
  };

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
          <StatusCard
            key={monitor.id}
            monitor={monitor}
            isSelected={selectedMonitor?.id === monitor.id}
            onClick={() => handleCardClick(monitor)}
          />
        ))}
        {selectedMonitor && <DetailCard monitor={selectedMonitor} />}
      </div>
      {lastUpdated && (
        <p className="text-center text-sm text-gray-400 mt-6 fixed bottom-4 left-0 right-0">
          Laatste update: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
