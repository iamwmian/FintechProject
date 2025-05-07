import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../BudgetManipulation/utils/constants';

const InsightsList = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Insights</Text>
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightItem}>
          <Text style={styles.insightText}>{insight.message}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.text,
  },
  insightItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.text,
  },
});

export default InsightsList; 