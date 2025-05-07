import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TextInput,
  ScrollView,
  FlatList,
  Animated,
  Dimensions
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from "@env"
import axios from 'axios';
import { useAuthStore } from '../../core/global';
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2 - 10;

const standardCategories = [
  { id: '1', name: 'Food', icon: 'restaurant' },
  { id: '2', name: 'Transportation', icon: 'directions-car' },
  { id: '3', name: 'Housing', icon: 'home' },
  { id: '4', name: 'Utilities', icon: 'lightbulb' },
  { id: '5', name: 'Entertainment', icon: 'sports-esports' },
  { id: '6', name: 'Shopping', icon: 'shopping-cart' },
  { id: '7', name: 'Healthcare', icon: 'local-hospital' },
  { id: '8', name: 'Education', icon: 'school' },
];

const InitialSettingBudget = ({navigation, route}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [budgets, setBudgets] = useState({});
  const [errors, setErrors] = useState({});
  const [initCategories, setInitCategories] = useState([]);
  const { mainCurrency, additionalCurrencies } = route.params;
  const user = useAuthStore.getState().user;
  // const userId = user.id;
  const userId = 3;
  // Update initCategories whenever selectedCategories or budgets change
  useEffect(() => {
    const categories = [];
    const categoryNames = new Set();

    const addCategory = (category) => {
      if (!categoryNames.has(category.title)) {
        categories.push(category);
        categoryNames.add(category.title);
      }
    };
    
    standardCategories.forEach(category => {
      if (selectedCategories.includes(category.id)) {
        addCategory({
          title: category.name,
          monthly_budget: parseFloat(budgets[category.id] || 0),
          currency: mainCurrency.code,
          color: generateRandomColor()
        });
      }
    });
    
    customCategories.forEach(category => {
      if (selectedCategories.includes(category.id)) {
        addCategory({
          title: category.name,
          monthly_budget: parseFloat(budgets[category.id] || 0),
          currency: mainCurrency.code,
          color: generateRandomColor()
        });
      }
    });
    
    setInitCategories(categories);
  }, [selectedCategories, customCategories, budgets, mainCurrency]);

  const formatCurrency = (value) => {
    if (!value) return '';
    return `${parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  console.log("Passed Params: ", mainCurrency, additionalCurrencies);
  // Passed Params:  {"code": "USD", "name": "USD"} [{"code": "AED", "name": "AED"}, {"code": "AUD", "name": "AUD"}]

  const formatInput = (value) => {
    return value.replace(/[^0-9.]/g, '');
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(selectedCategories.filter(id => id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };

  const addCustomCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: `custom-${Date.now()}`,
        name: newCategoryName.trim(),
        icon: 'add-circle'
      };
      setCustomCategories([...customCategories, newCategory]);
      setNewCategoryName('');
    }
  };

  const removeCustomCategory = (categoryId) => {
    setCustomCategories(customCategories.filter(cat => cat.id !== categoryId));
    setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
  };

  const updateBudget = (categoryId, amount) => {
    setBudgets({
      ...budgets,
      [categoryId]: amount
    });
  };

  const validateInput = (categoryId, value) => {
    const newErrors = { ...errors };
    if (!value || isNaN(value) || parseFloat(value) <= 0) {
      newErrors[categoryId] = 'Please enter a valid budget amount';
    } else {
      delete newErrors[categoryId];
    }
    setErrors(newErrors);
  };

  const handleSetup = async () => {
    try {
      const url = `${BASE_URL}/api/users/setup/user/${userId}/`;
  
      console.log("Passed Params: ", mainCurrency, additionalCurrencies);
  
      const main = mainCurrency.code;
      const additional = additionalCurrencies.map(curr => curr.code);
  
      const payload = {
        main_currency: main,
        additional_currencies: additional,
        categories: initCategories
      };
  
      console.log("Custom Categories: ", customCategories, selectedCategories);
      console.log("Payload: ", payload);
      console.log("Budgets: ", budgets);
      console.log("Categories for API:", initCategories);
  
      const response = await axios.post(url, payload);
  
      console.log("Response Data: ", response.data);
      const responseUser = response.data.user;
      useAuthStore.getState().setAuth({
        isNewUser: !responseUser.complete_setup,
        user: responseUser, 
      });
      console.log(useAuthStore.getState())
  
    } catch (error) {
      console.error("Error during setup request:", error);
  
      if (error.response) {
        console.error("Response Error: ", error.response.data);
      } else if (error.request) {
        console.error("Request Error: ", error.request);
      } else {
        console.error("Unknown Error: ", error.message);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Setup</Text>
        <Text style={styles.subtitle}>Set up your monthly budget categories</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <Text style={styles.sectionSubtitle}>Select and customize your expense categories</Text>
            <View style={styles.guideContainer}>
              <Text style={styles.guideText}>1. Choose a category</Text>
              <Text style={styles.guideText}>2. Enter a budget amount</Text>
              <Text style={styles.guideText}>3. Add a custom category if needed</Text>
            </View>
          </View>
          
          <View style={styles.addCategoryContainer}>
            <TextInput
              style={styles.categoryInput}
              placeholder="New category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <TouchableOpacity
              style={styles.addCategoryButton}
              onPress={addCustomCategory}
            >
              <Icon name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.gridContainer}>
            {standardCategories.map(category => (
              <Animated.View 
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategories.includes(category.id) && styles.selectedCategoryCard
                ]}
              >
                <TouchableOpacity
                  style={styles.categoryContent}
                  onPress={() => toggleCategory(category)}
                >
                  <View style={styles.iconContainer}>
                    <Icon 
                      name={category.icon} 
                      size={24} 
                      color={selectedCategories.includes(category.id) ? '#2196F3' : '#666'} 
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  {selectedCategories.includes(category.id) && (
                    <View style={styles.checkmarkContainer}>
                      <Icon name="check-circle" size={20} color="#2196F3" />
                    </View>
                  )}
                </TouchableOpacity>
                {selectedCategories.includes(category.id) && (
                  <Animated.View style={styles.categoryDetails}>
                    <TextInput
                      style={[styles.input, errors[category.id] && styles.inputError]}
                      placeholder="Budget amount"
                      keyboardType="numeric"
                      value={budgets[category.id] || ''}
                      onChangeText={(text) => {
                        const formattedValue = formatInput(text);
                        updateBudget(category.id, formattedValue);
                        validateInput(category.id, formattedValue);
                      }}
                      onBlur={() => {
                        if (budgets[category.id]) {
                          updateBudget(category.id, formatCurrency(budgets[category.id]));
                        }
                      }}
                    />
                    {errors[category.id] && (
                      <Text style={styles.errorText}>{errors[category.id]}</Text>
                    )}
                  </Animated.View>
                )}
              </Animated.View>
            ))}

            {customCategories.map(category => (
              <Animated.View 
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategories.includes(category.id) && styles.selectedCategoryCard
                ]}
              >
                <TouchableOpacity
                  style={styles.categoryContent}
                  onPress={() => toggleCategory(category)}
                >
                  <View style={styles.iconContainer}>
                    <Icon 
                      name={category.icon} 
                      size={24} 
                      color={selectedCategories.includes(category.id) ? '#2196F3' : '#666'} 
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  {selectedCategories.includes(category.id) && (
                    <View style={styles.checkmarkContainer}>
                      <Icon name="check-circle" size={20} color="#2196F3" />
                    </View>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.deleteButton,
                      selectedCategories.includes(category.id) && styles.deleteButtonWithCheck
                    ]}
                    onPress={() => removeCustomCategory(category.id)}
                  >
                    <Icon name="delete" size={20} color="#FF5252" />
                  </TouchableOpacity>
                </TouchableOpacity>
                {selectedCategories.includes(category.id) && (
                  <Animated.View style={styles.categoryDetails}>
                    <TextInput
                      style={[styles.input, errors[category.id] && styles.inputError]}
                      placeholder="Budget amount"
                      keyboardType="numeric"
                      value={budgets[category.id] || ''}
                      onChangeText={(text) => {
                        const formattedValue = formatInput(text);
                        updateBudget(category.id, formattedValue);
                        validateInput(category.id, formattedValue);
                      }}
                      onBlur={() => {
                        if (budgets[category.id]) {
                          updateBudget(category.id, formatCurrency(budgets[category.id]));
                        }
                      }}
                    />
                    {errors[category.id] && (
                      <Text style={styles.errorText}>{errors[category.id]}</Text>
                    )}
                  </Animated.View>
                )}
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          // onPress={() => navigation.navigate('HomeTabs')}
          onPress={() => handleSetup()}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  categoryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
  },
  addCategoryButton: {
    backgroundColor: '#2196F3',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 5,
  },
  categoryCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategoryCard: {
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  categoryContent: {
    padding: 15,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonWithCheck: {
    right: 32,
  },
  categoryDetails: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF5252',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guideContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  guideText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default InitialSettingBudget;