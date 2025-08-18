'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout";
import { Cloud, Sun, CloudRain, Wind, Thermometer, MapPin, Search, Plus } from "lucide-react";

export default function WeatherPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('New York, NY');

  const handleLocationSearch = () => {
    if (searchQuery.trim()) {
      setSelectedLocation(searchQuery);
      console.log('Searching for location:', searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLocationSearch();
    }
  };

  // Custom navigation configuration
  const navigationConfig = {
    backgroundColor: "bg-gradient-to-r from-blue-900/50 to-indigo-900/50",
    logoText: "BF",
    content: (
      <div className="flex items-center justify-between w-full">
        <div className="flex-1"></div>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-white">Weather Dashboard</h1>
          <p className="text-blue-200">Get real-time weather information</p>
        </div>
        <div className="flex-1 flex justify-end">
          <Button
            onClick={() => console.log('Add location')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 px-8 py-3 text-lg"
          >
            <Plus className="w-6 h-6 mr-2" />
            Add Location
          </Button>
        </div>
      </div>
    ),
  };

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
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Thermometer className="w-4 h-4 mr-2" />
                °C / °F
              </Button>
            </div>
          </div>

          {/* Current Weather */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Weather Card */}
            <div className="lg:col-span-2">
              <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedLocation}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                      <Sun className="w-12 h-12 text-yellow-400" />
                    </div>
                    <h2 className="text-6xl font-bold text-white mb-2">72°F</h2>
                    <p className="text-xl text-blue-200 mb-4">Sunny</p>
                    <p className="text-gray-400">Feels like 75°F</p>
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
                      <span className="text-white font-semibold">78°F</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Thermometer className="w-5 h-5 text-blue-400" />
                        <span className="text-white">Low</span>
                      </div>
                      <span className="text-white font-semibold">65°F</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Wind className="w-5 h-5 text-gray-400" />
                        <span className="text-white">Wind</span>
                      </div>
                      <span className="text-white font-semibold">8 mph</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CloudRain className="w-5 h-5 text-blue-400" />
                        <span className="text-white">Humidity</span>
                      </div>
                      <span className="text-white font-semibold">45%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
              <Card key={day} className="border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border border-blue-500/20">
                <CardContent className="p-4 text-center">
                  <p className="text-white font-medium mb-2">{day}</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                    {index % 2 === 0 ? (
                      <Sun className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <Cloud className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <p className="text-white font-semibold">72°F</p>
                  <p className="text-blue-200 text-sm">65°F</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
