// Weather service for OpenWeather API integration
import { weatherConfig } from "./config";

const OPENWEATHER_API_KEY = weatherConfig.apiKey;
const OPENWEATHER_BASE_URL = weatherConfig.baseUrl;

export interface WeatherData {
  location: string;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
    icon: string;
    high: number;
    low: number;
  };
  forecast: Array<{
    date: string;
    day: string;
    temp: number;
    low: number;
    description: string;
    icon: string;
  }>;
}

export interface OpenWeatherResponse {
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  name: string;
  dt: number;
}

export interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

class WeatherService {
  private apiKey: string;

  constructor() {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key is not configured');
    }
    this.apiKey = OPENWEATHER_API_KEY;
  }

  // Convert Celsius to Fahrenheit
  private celsiusToFahrenheit(celsius: number): number {
    return Math.round(celsius * 9/5 + 32);
  }

  // Get current weather for a location
  async getCurrentWeather(location: string): Promise<OpenWeatherResponse> {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get 5-day forecast for a location
  async getForecast(location: string): Promise<OpenWeatherForecastResponse> {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric&cnt=40`
    );

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get weather data by coordinates
  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    try {
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeatherByCoordinates(lat, lon),
        this.getForecastByCoordinates(lat, lon)
      ]);

      // Process current weather
      const current = {
        temp: this.celsiusToFahrenheit(currentWeather.main.temp),
        feels_like: this.celsiusToFahrenheit(currentWeather.main.feels_like),
        humidity: currentWeather.main.humidity,
        wind_speed: Math.round(currentWeather.wind.speed * 2.237), // Convert m/s to mph
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon,
        high: this.celsiusToFahrenheit(currentWeather.main.temp_max),
        low: this.celsiusToFahrenheit(currentWeather.main.temp_min),
      };

      // Process forecast data (daily forecasts)
      const dailyForecasts = this.processForecastData(forecast);
      const forecastData = dailyForecasts.slice(0, 5).map((day, index) => ({
        date: day.date,
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(day.date).getDay()],
        temp: this.celsiusToFahrenheit(day.temp),
        low: this.celsiusToFahrenheit(day.low),
        description: day.description,
        icon: day.icon,
      }));

      return {
        location: currentWeather.name,
        current,
        forecast: forecastData,
      };
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw error;
    }
  }

  // Get current weather by coordinates
  async getCurrentWeatherByCoordinates(lat: number, lon: number): Promise<OpenWeatherResponse> {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get forecast by coordinates
  async getForecastByCoordinates(lat: number, lon: number): Promise<OpenWeatherForecastResponse> {
    const response = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&cnt=40`
    );

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get complete weather data (current + forecast)
  async getWeatherData(location: string): Promise<WeatherData> {
    try {
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(location),
        this.getForecast(location)
      ]);

      // Process current weather
      const current = {
        temp: this.celsiusToFahrenheit(currentWeather.main.temp),
        feels_like: this.celsiusToFahrenheit(currentWeather.main.feels_like),
        humidity: currentWeather.main.humidity,
        wind_speed: Math.round(currentWeather.wind.speed * 2.237), // Convert m/s to mph
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon,
        high: this.celsiusToFahrenheit(currentWeather.main.temp_max),
        low: this.celsiusToFahrenheit(currentWeather.main.temp_min),
      };

      // Process forecast data (daily forecasts)
      const dailyForecasts = this.processForecastData(forecast);
      const forecastData = dailyForecasts.slice(0, 5).map((day, index) => ({
        date: day.date,
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(day.date).getDay()],
        temp: this.celsiusToFahrenheit(day.temp),
        low: this.celsiusToFahrenheit(day.low),
        description: day.description,
        icon: day.icon,
      }));

      return {
        location: currentWeather.name,
        current,
        forecast: forecastData,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // Process forecast data to get daily forecasts
  private processForecastData(forecast: OpenWeatherForecastResponse) {
    const dailyData = new Map<string, {
      temp: number;
      low: number;
      high: number;
      description: string;
      icon: string;
      date: string;
    }>();

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];

      if (!dailyData.has(date)) {
        dailyData.set(date, {
          temp: item.main.temp,
          low: item.main.temp_min,
          high: item.main.temp_max,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          date,
        });
      } else {
        const existing = dailyData.get(date)!;
        // Update with midday temperature (around 12:00)
        if (new Date(item.dt * 1000).getHours() === 12) {
          existing.temp = item.main.temp;
        }
        // Update low/high temperatures
        existing.low = Math.min(existing.low, item.main.temp_min);
        existing.high = Math.max(existing.high, item.main.temp_max);
      }
    });

    return Array.from(dailyData.values()).sort((a, b) => a.date.localeCompare(b.date));
  }
}

// Export a singleton instance
export const weatherService = new WeatherService();
