import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../BudgetManipulation/utils/constants';

const SpendingTrends = ({ selectedCountry, compareCountry, spendingData, compareData }) => {
  // Mock data for the last 6 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Generate mock trend data
  const generateTrendData = (baseData) => {
    return months.map((_, index) => {
      const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
      return Object.values(baseData).reduce((sum, amount) => sum + amount, 0) * randomFactor;
    });
  };

  const primaryTrendData = generateTrendData(spendingData);
  const compareTrendData = compareCountry ? generateTrendData(compareData) : [];

  const chartData = {
    labels: months,
    datasets: [
      {
        data: primaryTrendData,
        color: (opacity = 1) => COLORS.primary,
        strokeWidth: 2,
      },
      ...(compareCountry ? [{
        data: compareTrendData,
        color: (opacity = 1) => COLORS.secondary,
        strokeWidth: 2,
      }] : []),
    ],
    legend: [selectedCountry, ...(compareCountry ? [compareCountry] : [])],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Spending Trends</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default SpendingTrends; 