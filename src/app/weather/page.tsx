'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout";
import { Cloud, Sun, CloudRain, Wind, Thermometer, MapPin, Search, Plus, Loader2, Navigation, Shield } from "lucide-react";
import { useWeather } from "@/hooks/use-weather";

export default function WeatherPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    weatherData,
    loading,
    error,
    temperatureUnit,
    toggleTemperatureUnit,
    searchLocation,
    refreshWeather,
    locationPermission,
    requestLocationPermission
  } = useWeather('New Delhi, India');

  const handleLocationSearch = async () => {
    if (searchQuery.trim()) {
      await searchLocation(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLocationSearch();
    }
  };

  // Function to convert temperature based on selected unit
  const formatTemperature = (tempF: number): string => {
    if (temperatureUnit === 'F') {
      return `${tempF}°F`;
    } else {
      const tempC = Math.round((tempF - 32) * 5/9);
      return `${tempC}°C`;
    }
  };

  // Function to get weather icon based on OpenWeather icon code
  const getWeatherIcon = (iconCode: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const iconMap: Record<string, React.ReactNode> = {
      '01d': <Sun className={`text-yellow-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '01n': <Sun className={`text-yellow-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '02d': <Cloud className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '02n': <Cloud className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '03d': <Cloud className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '03n': <Cloud className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '04d': <Cloud className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '04n': <Cloud className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '09d': <CloudRain className={`text-blue-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '09n': <CloudRain className={`text-blue-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '10d': <CloudRain className={`text-blue-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '10n': <CloudRain className={`text-blue-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '11d': <CloudRain className={`text-blue-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '11n': <CloudRain className={`text-blue-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '13d': <CloudRain className={`text-blue-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '13n': <CloudRain className={`text-blue-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '50d': <Cloud className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
      '50n': <Cloud className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />,
    };

    return iconMap[iconCode] || <Cloud className={`text-gray-400 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />;
  };

  // Custom navigation configuration
  const navigationConfig = {
    backgroundColor: "bg-gradient-to-r from-blue-900/50 to-indigo-900/50",
    logoText: "BF",
    content: (
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-white">Weather Dashboard</h1>
          <p className="text-blue-200">Get real-time weather information</p>
        </div>
      </div>
    ),
  };

  // Location Permission Request UI
  if (locationPermission === 'loading') {
    return (
      <Layout navigation={navigationConfig}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Checking Location Access</h2>
            <p className="text-blue-200">Please wait while we check your location permissions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Location Permission Request UI
  if (locationPermission === 'prompt') {
    return (
      <Layout navigation={navigationConfig}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
          <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border border-blue-500/20 max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <Navigation className="w-10 h-10 text-blue-400" />
              </div>
              <CardTitle className="text-white text-xl">Enable Location Access</CardTitle>
              <p className="text-blue-200 text-sm mt-2">
                Get weather information for your current location
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-gray-300 text-sm mb-4">
                  We need your location to show you the most relevant weather information.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={requestLocationPermission}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Allow Location
                  </Button>
                  <Button
                    onClick={() => requestLocationPermission()}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Skip
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigationConfig}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Enter city or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 w-64"
                />
              </div>
              <Button
                onClick={handleLocationSearch}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={requestLocationPermission}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {locationPermission === 'granted' ? 'Current Location' : 'Enable Location'}
              </Button>
              <Button
                onClick={toggleTemperatureUnit}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Thermometer className="w-4 h-4 mr-2" />
                °{temperatureUnit}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && !weatherData && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              <span className="ml-3 text-white text-lg">Loading weather data...</span>
            </div>
          )}

          {/* Weather Data */}
          {weatherData && (
            <>
              {/* Current Weather */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Weather Card */}
                <div className="lg:col-span-2">
                  <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        {weatherData.location}
                        {locationPermission === 'granted' && (
                          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            Current Location
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                          {getWeatherIcon(weatherData.current.icon, 'lg')}
                        </div>
                        <h2 className="text-6xl font-bold text-white mb-2">{formatTemperature(weatherData.current.temp)}</h2>
                        <p className="text-xl text-blue-200 mb-4 capitalize">{weatherData.current.description}</p>
                        <p className="text-gray-400">Feels like {formatTemperature(weatherData.current.feels_like)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Weather Details */}
                <div className="lg:col-span-1">
                  <Card className="border-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 border border-indigo-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">Weather Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Thermometer className="w-5 h-5 text-red-400" />
                            <span className="text-white">High</span>
                          </div>
                          <span className="text-white font-semibold">{formatTemperature(weatherData.current.high)}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Thermometer className="w-5 h-5 text-blue-400" />
                            <span className="text-white">Low</span>
                          </div>
                          <span className="text-white font-semibold">{formatTemperature(weatherData.current.low)}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Wind className="w-5 h-5 text-gray-400" />
                            <span className="text-white">Wind</span>
                          </div>
                          <span className="text-white font-semibold">{weatherData.current.wind_speed} mph</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CloudRain className="w-5 h-5 text-blue-400" />
                            <span className="text-white">Humidity</span>
                          </div>
                          <span className="text-white font-semibold">{weatherData.current.humidity}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Forecast */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <Card key={day.date} className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border border-blue-500/20">
                    <CardContent className="p-4 text-center">
                      <p className="text-white font-medium mb-2">{day.day}</p>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                        {getWeatherIcon(day.icon, 'sm')}
                      </div>
                      <p className="text-white font-semibold">{formatTemperature(day.temp)}</p>
                      <p className="text-blue-200 text-sm">{formatTemperature(day.low)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
