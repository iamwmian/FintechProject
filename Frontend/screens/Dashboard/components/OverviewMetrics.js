import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../BudgetManipulation/utils/constants';

const OverviewMetrics = ({ selectedCountry, compareCountry, spendingData, compareData }) => {
  const calculateTotalSpending = (data) => {
    return Object.values(data).reduce((sum, amount) => sum + amount, 0);
  };

  const calculatePercentageDifference = (primary, secondary) => {
    if (!secondary || secondary === 0) return 0;
    return ((primary - secondary) / secondary) * 100;
  };

  const totalSpending = calculateTotalSpending(spendingData);
  const compareTotalSpending = compareCountry ? calculateTotalSpending(compareData) : 0;
  const spendingDifference = compareCountry ? calculatePercentageDifference(totalSpending, compareTotalSpending) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.metricCard}>
        <Text style={styles.metricTitle}>Total Spending</Text>
        <Text style={styles.metricValue}>
          {selectedCountry}: ${totalSpending.toFixed(2)}
        </Text>
        {/* {compareCountry && (
          <Text style={styles.metricValue}>
            {compareCountry}: ${compareTotalSpending.toFixed(2)}
          </Text>
        )} */}
        <Text style={styles.metricValue}>Average spending per transaction: ${(totalSpending / Object.keys(spendingData).length).toFixed(2)}</Text>
        <Text style={styles.metricValue}>Number of transactions: {Object.keys(spendingData).length}</Text>
      </View>

      {/* {compareCountry && (
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Spending Comparison</Text>
          <Text style={[
            styles.comparisonText,
            { color: spendingDifference > 0 ? COLORS.danger : COLORS.success }
          ]}>
            You spend {Math.abs(spendingDifference).toFixed(1)}% {spendingDifference > 0 ? 'more' : 'less'} in {selectedCountry} compared to {compareCountry}
          </Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
});

export default OverviewMetrics; 