import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const OPENWEATHERMAP_API_KEY = "ae98d5b62371e7a147137adf6f0596f2"

export const getWeatherData = async (
  lat: number,
  lon: number,
  units: 'metric' | 'imperial',
) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: OPENWEATHERMAP_API_KEY, units },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getWeatherForecast = async (
  lat: number,
  lon: number,
  units: 'metric' | 'imperial',
) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, appid: OPENWEATHERMAP_API_KEY, units },
    });
    // Return a 5-day forecast by taking one entry per 24 hours (8 * 3-hour intervals)
    return response.data.list.filter((_: any, index: number) => index % 8 === 0);
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};