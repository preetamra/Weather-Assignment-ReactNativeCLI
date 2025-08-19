import axios from 'axios';

const NEWS_API_KEY = "b1745c6c0aa44d569dfefbf4ef6ca0ae"

const NEWS_API_URL = 'https://newsapi.org/v2/everything';

const getKeywordForWeather = (
  temperature: number,
  unit: 'metric' | 'imperial',
): string => {
  // Convert to Celsius for a standard comparison
  const celsiusTemp = unit === 'imperial' ? ((temperature - 32) * 5) / 9 : temperature;

  if (celsiusTemp < 10) return 'depressing OR sad OR gloomy OR crisis'; // Cold
  if (celsiusTemp > 25) return 'fear OR danger OR warning OR alert'; // Hot
  return 'winning OR happiness OR success OR joy'; // Cool
};

export const getNews = async (
  temperature: number,
  unit: 'metric' | 'imperial',
  category: string,
  countryCode: string, // ADDED: New parameter for location
) => {

  console.log(`Fetching news for temperature: ${temperature}°${unit === 'metric' ? 'C' : 'F'}, category: ${category}, country: ${countryCode}`);
    
  const keywords = getKeywordForWeather(temperature, unit);
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        q: keywords,
        category: category === 'general' ? undefined : category, // NewsAPI doesn't mix `category` with `q` well, so we might omit it or adjust logic. For now, we prioritize the keyword `q`.
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 30,
        // country: countryCode.toLowerCase(),
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};