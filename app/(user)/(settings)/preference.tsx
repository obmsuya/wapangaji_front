import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Picker } from '@react-native-picker/picker';
import { Switch } from 'react-native';

const Preferences = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <View style={styles.container} className="px-6 py-12">
        <Text variant="huge" className="font-bold mb-4">Preference</Text>
        <View style={styles.section}>
        <Text variant="large" className="font-bold mb-4">Language</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Swahili" value="sw" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="large" className="font-bold mb-4">Theme</Text>
        <View style={styles.themeContainer}>
          <Text>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#767577', true: '#d3d3d3' }}
            thumbColor={isDarkMode ? '#969696' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 16
  },
});

export default Preferences;