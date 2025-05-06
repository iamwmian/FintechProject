import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { VictoryPie } from 'victory-native';
import { VictoryLabel } from 'victory-native';
import { CHART_COLORS, CHART_CONFIG } from '../utils/constants';

const SpendingChart = ({ data, title }) => {
  const prepareChartData = (spendingData) => {
    return Object.entries(spendingData).map(([category, amount]) => ({
      name: category,
      population: amount,
      color: CHART_COLORS[category] || CHART_COLORS.Other,
      legendFontColor: 'black',
      legendFontSize: 10,
    }));
  };

  const screenWidth = Dimensions.get('window').width;
  const chartData = prepareChartData(data);

  return (
    <View style={styles.container}>
      <PieChart
        data={prepareChartData(data)}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={CHART_CONFIG}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  title: {
    fontSize: 0,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SpendingChart; 