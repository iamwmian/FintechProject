import { useState, useEffect } from 'react';
import { initialTransactions } from '../../BudgetManipulation/utils/constants';
import { INSIGHT_THRESHOLD } from '../utils/constants';

export const useSpendingAnalysis = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [compareCountry, setCompareCountry] = useState(null);
  const [spendingData, setSpendingData] = useState({});
  const [compareData, setCompareData] = useState({});
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    // Extract unique countries from transactions
    const uniqueCountries = [...new Set(initialTransactions.map(t => t.country))];
    setCountries(uniqueCountries);
    if (uniqueCountries.length > 0) {
      setSelectedCountry(uniqueCountries[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryData = calculateSpendingData(selectedCountry);
      setSpendingData(countryData);
    }
    if (compareCountry) {
      const compareCountryData = calculateSpendingData(compareCountry);
      setCompareData(compareCountryData);
      generateInsights(spendingData, compareCountryData);
    }
  }, [selectedCountry, compareCountry]);

  const calculateSpendingData = (country) => {
    const countryTransactions = initialTransactions.filter(t => t.country === country);
    const categoryTotals = {};

    countryTransactions.forEach(transaction => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += transaction.cost;
    });

    return categoryTotals;
  };

  const generateInsights = (primaryData, secondaryData) => {
    const newInsights = [];
    
    // Compare spending by category
    Object.keys(primaryData).forEach(category => {
      if (secondaryData[category]) {
        const primaryAmount = primaryData[category];
        const secondaryAmount = secondaryData[category];
        const difference = ((primaryAmount - secondaryAmount) / secondaryAmount) * 100;
        
        if (Math.abs(difference) > INSIGHT_THRESHOLD) {
          newInsights.push({
            category,
            difference,
            message: `You spend ${Math.abs(difference).toFixed(1)}% ${difference > 0 ? 'more' : 'less'} on ${category} in ${selectedCountry} compared to ${compareCountry}`
          });
        }
      }
    });

    setInsights(newInsights);
  };

  return {
    countries,
    selectedCountry,
    setSelectedCountry,
    compareCountry,
    setCompareCountry,
    spendingData,
    compareData,
    insights
  };
}; 