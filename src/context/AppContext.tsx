import React, { createContext, useState, ReactNode } from 'react';

interface AppContextType {
  weather: any;
  setWeather: (weather: any) => void;
  forecast: any[];
  setForecast: (forecast: any[]) => void;
  news: any[];
  setNews: (news: any[]) => void;
  unit: 'metric' | 'imperial';
  setUnit: (unit: 'metric' | 'imperial') => void;
  newsCategory: string;
  setNewsCategory: (category: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [newsCategory, setNewsCategory] = useState('general');

  return (
    <AppContext.Provider
      value={{
        weather,
        setWeather,
        forecast,
        setForecast,
        news,
        setNews,
        unit,
        setUnit,
        newsCategory,
        setNewsCategory,
      }}>
      {children}
    </AppContext.Provider>
  );
};