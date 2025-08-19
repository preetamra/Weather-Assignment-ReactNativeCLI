import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, Linking,
  TouchableOpacity, RefreshControl, ScrollView, PermissionsAndroid, Platform, Alert
} from 'react-native';
import { AppContext } from '../context/AppContext';
import Geolocation from 'react-native-geolocation-service';
import { getWeatherData, getWeatherForecast } from '../api/weatherService';
import { getNews } from '../api/newsService';
import { useFocusEffect } from '@react-navigation/native';

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await Geolocation.requestAuthorization('whenInUse');
    return authStatus === 'granted';
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs your location to show the weather.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};


const HomeScreen = () => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Cannot get weather without location permission.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherData = await getWeatherData(latitude, longitude, context!.unit);
          context!.setWeather(weatherData);

          const forecastData = await getWeatherForecast(latitude, longitude, context!.unit);
          context!.setForecast(forecastData);

          const countryCode = weatherData.sys.country;

          const newsData = await getNews(weatherData.main.temp, context!.unit, context!.newsCategory,countryCode);
          context!.setNews(newsData);
        } catch (error) {
          Alert.alert("Error", "Failed to fetch data. Please check your network connection.");
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      (error) => {
        Alert.alert("Location Error", error.message);
        setLoading(false);
        setRefreshing(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, [context?.unit, context?.newsCategory]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [context?.unit, context?.newsCategory])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);
  
  if (loading && !refreshing) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {context?.weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.location}>{context.weather.name}</Text>
          <Text style={styles.temperature}>
            {Math.round(context.weather.main.temp)}°{context.unit === 'metric' ? 'C' : 'F'}
          </Text>
          <Text style={styles.condition}>{context.weather.weather[0].main}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>News Headlines</Text>
      <FlatList
        data={context?.news}
        scrollEnabled={false}
        keyExtractor={(item, index) => item.url + index}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.newsItem} onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            {item.description && <Text style={styles.newsDescription}>{item.description}</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noNewsText}>No news articles found.</Text>}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16, flexGrow: 1 },
  weatherContainer: { alignItems: 'center', marginBottom: 24, padding: 16, backgroundColor: '#f0f8ff', borderRadius: 8 },
  location: { fontSize: 28, fontWeight: 'bold' },
  temperature: { fontSize: 52, fontWeight: '200' },
  condition: { fontSize: 22, textTransform: 'capitalize' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  newsItem: { marginBottom: 16, padding: 12, backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  newsTitle: { fontSize: 18, fontWeight: 'bold' },
  newsDescription: { fontSize: 14, marginTop: 5, color: '#555' },
  noNewsText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic' },
});

export default HomeScreen;