import { useState, useEffect, useCallback } from 'react';
import { weatherService, WeatherData } from '@/lib/weather-service';

export type TemperatureUnit = 'F' | 'C';

export interface UseWeatherReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  temperatureUnit: TemperatureUnit;
  toggleTemperatureUnit: () => void;
  searchLocation: (location: string) => Promise<void>;
  refreshWeather: () => Promise<void>;
  locationPermission: 'granted' | 'denied' | 'prompt' | 'loading';
  requestLocationPermission: () => Promise<void>;
}

export function useWeather(defaultLocation: string = 'New Delhi, India'): UseWeatherReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState(defaultLocation);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'loading'>('loading');
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('F');

  const toggleTemperatureUnit = useCallback(() => {
    setTemperatureUnit(prev => prev === 'F' ? 'C' : 'F');
  }, []);

  const fetchWeather = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await weatherService.getWeatherData(location);
      setWeatherData(data);
      setCurrentLocation(location);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLocation = useCallback(async (location: string) => {
    if (location.trim()) {
      await fetchWeather(location.trim());
    }
  }, [fetchWeather]);

  const refreshWeather = useCallback(async () => {
    if (currentLocation) {
      await fetchWeather(currentLocation);
    }
  }, [fetchWeather, currentLocation]);

  const requestLocationPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      await fetchWeather(defaultLocation);
      return;
    }

    try {
      setLocationPermission('loading');

      // Check current permission status
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });

      if (permission.state === 'granted') {
        setLocationPermission('granted');
        await getCurrentLocation();
      } else if (permission.state === 'denied') {
        setLocationPermission('denied');
        await fetchWeather(defaultLocation);
      } else {
        setLocationPermission('prompt');
        await getCurrentLocation();
      }
    } catch (err) {
      console.error('Permission check error:', err);
      setLocationPermission('denied');
      await fetchWeather(defaultLocation);
    }
  }, [fetchWeather, defaultLocation]);

  const getCurrentLocation = useCallback(async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Use reverse geocoding to get city name from coordinates
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}`
        );

        if (response.ok) {
          const geoData = await response.json();
          if (geoData && geoData.length > 0) {
            const cityName = geoData[0].name;
            const countryCode = geoData[0].country;
            const locationString = `${cityName}, ${countryCode}`;
            await fetchWeather(locationString);
            return;
          }
        }
      } catch (geoError) {
        console.warn('Reverse geocoding failed, using coordinates:', geoError);
      }

      // Fallback to coordinates if reverse geocoding fails
      try {
        const data = await weatherService.getWeatherByCoordinates(latitude, longitude);
        setWeatherData(data);
        setCurrentLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
      } catch (weatherError) {
        console.error('Weather fetch by coordinates failed:', weatherError);
        // Final fallback to default location
        await fetchWeather(defaultLocation);
      }

    } catch (err) {
      console.error('Geolocation error:', err);
      setLocationPermission('denied');
      await fetchWeather(defaultLocation);
    }
  }, [fetchWeather, defaultLocation]);


  // Initialize weather data and check location permission on mount
  useEffect(() => {
    const initializeWeather = async () => {
      await requestLocationPermission();
    };

    initializeWeather();
  }, [requestLocationPermission]);

  return {
    weatherData,
    loading,
    error,
    temperatureUnit,
    toggleTemperatureUnit,
    searchLocation,
    refreshWeather,
    locationPermission,
    requestLocationPermission,
  };
}
