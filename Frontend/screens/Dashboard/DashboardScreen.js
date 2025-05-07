import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../BudgetManipulation/utils/constants';
import { useSpendingAnalysis } from './hooks/useSpendingAnalysis';
import CountrySelector from './components/CountrySelector';
import SpendingChart from './components/SpendingChart';
import InsightsList from './components/InsightsList';
import OverviewMetrics from './components/OverviewMetrics';
import SpendingTrends from './components/SpendingTrends';

const DashboardScreen = () => {
  const {
    countries,
    selectedCountry,
    setSelectedCountry,
    compareCountry,
    setCompareCountry,
    spendingData,
    compareData,
    insights
  } = useSpendingAnalysis();

  const [showPrimaryChart, setShowPrimaryChart] = useState(true);
  const [showCompareChart, setShowCompareChart] = useState(false);

  const togglePrimaryChart = () => {
    setShowPrimaryChart(!showPrimaryChart);
  };

  const toggleCompareChart = () => {
    setShowCompareChart(!showCompareChart);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spending Analysis</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <CountrySelector
            countries={countries}
            selectedCountry={selectedCountry}
            onSelectCountry={(country) => {
              setSelectedCountry(country);
              setShowPrimaryChart(true);
            }}
            title="Select Country"
          />
        </View>

        {showPrimaryChart && (
              <View style={styles.section}>
                <TouchableOpacity onPress={togglePrimaryChart} style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Spending by Category in {selectedCountry}</Text>
                  <Text style={styles.toggleText}>Hide</Text>
                </TouchableOpacity>
                <SpendingChart
                  data={spendingData}
                  title={null}
                />
              </View>
            )}

        {selectedCountry && (
          <>
            <View style={styles.section}>
              <OverviewMetrics
                selectedCountry={selectedCountry}
                compareCountry={compareCountry}
                spendingData={spendingData}
                compareData={compareData}
              />
            </View>

            {/* <View style={styles.section}>
              <SpendingTrends
                selectedCountry={selectedCountry}
                compareCountry={compareCountry}
                spendingData={spendingData}
                compareData={compareData}
              />
            </View> */}

            

            {!showPrimaryChart && (
              <TouchableOpacity onPress={togglePrimaryChart} style={styles.hiddenChart}>
                <Text style={styles.showText}>Show {selectedCountry} Categories</Text>
              </TouchableOpacity>
            )}

            <View style={styles.section}>
              <CountrySelector
                countries={countries}
                selectedCountry={compareCountry}
                onSelectCountry={(country) => {
                  setCompareCountry(country);
                  setShowCompareChart(prev => !prev);
                }}
                title="Compare with Another Country"
                excludeCountry={selectedCountry}
              />
            </View>

            {compareCountry && showCompareChart && (
              <View style={styles.section}>
                <TouchableOpacity onPress={toggleCompareChart} style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Spending by Category in {compareCountry}</Text>
                  <Text style={styles.toggleText}>Hide</Text>
                </TouchableOpacity>
                <SpendingChart
                  data={compareData}
                  title={null}
                />
              </View>
            )}

            {compareCountry && !showCompareChart && (
              <TouchableOpacity onPress={toggleCompareChart} style={styles.hiddenChart}>
                <Text style={styles.showText}>Show {compareCountry} Categories</Text>
              </TouchableOpacity>
            )}

            {compareCountry && (
              <View style={styles.section}>
                <InsightsList insights={insights} />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  toggleText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  hiddenChart: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  showText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  chartContainer: {
    borderWidth: 2,
    borderColor: '#2196F3', // or any color you like
    borderRadius: 20,
    padding: 16,
  },
});

export default DashboardScreen; 