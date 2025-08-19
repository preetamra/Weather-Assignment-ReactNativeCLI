import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, Platform } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Picker } from '@react-native-picker/picker';

const SettingsScreen = () => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { unit, setUnit, newsCategory, setNewsCategory } = context;

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Temperature Unit</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.unitLabel}>Celsius</Text>
          <Switch
            value={unit === 'imperial'}
            onValueChange={(value) => setUnit(value ? 'imperial' : 'metric')}
          />
          <Text style={styles.unitLabel}>Fahrenheit</Text>
        </View>
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.label}>News Category</Text>
        <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={newsCategory}
              onValueChange={(itemValue) => setNewsCategory(itemValue)}
              style={Platform.OS === 'ios' ? styles.pickerIOS : {}}>
              <Picker.Item label="General" value="general" />
              <Picker.Item label="Business" value="business" />
              <Picker.Item label="Technology" value="technology" />
              <Picker.Item label="Health" value="health" />
              <Picker.Item label="Science" value="science" />
              <Picker.Item label="Sports" value="sports" />
            </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  settingRow: { marginBottom: 20, padding: 15, backgroundColor: 'white', borderRadius: 8 },
  label: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  unitLabel: { fontSize: 16 },
  pickerWrapper: { 
    borderWidth: Platform.OS === 'android' ? 1 : 0, 
    borderColor: '#ccc', 
    borderRadius: 8 
  },
  pickerIOS: {
    // On iOS, Picker has a default height which can be adjusted if needed
  },
});

export default SettingsScreen;