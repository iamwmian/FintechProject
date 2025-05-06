import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../BudgetManipulation/utils/constants';

const CountrySelector = ({ countries, selectedCountry, onSelectCountry, title, excludeCountry = null }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.countryButtons}>
        {countries.map(country => (
          country !== excludeCountry && (
            <TouchableOpacity
              key={country}
              style={[
                styles.button,
                selectedCountry === country && styles.selectedButton
              ]}
              onPress={() => onSelectCountry(country)}
            >
              <Text style={[
                styles.buttonText,
                selectedCountry === country && styles.selectedButtonText
              ]}>
                {country}
              </Text>
            </TouchableOpacity>
          )
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
  },
  countryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.text,
  },
  selectedButtonText: {
    color: '#fff',
  },
});

export default CountrySelector; 