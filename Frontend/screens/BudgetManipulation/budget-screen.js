"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Pressable,
  Animated,
  Easing,
} from "react-native"
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import CurrencyDropdown from "./components/CurrencyDropdown";
import CountryDropdown from "./components/CountryDropdown"


const { width: SCREEN_WIDTH } = Dimensions.get("window")

// Initial mock data
const initialCategories = [
  { id: "1", name: "Food", color: "#FF6B6B", monthly_budget: 500 },
  { id: "2", name: "Transport", color: "#4ECDC4", monthly_budget: 300 },
  { id: "3", name: "Shopping", color: "#FFD166", monthly_budget: 400 },
  { id: "4", name: "Entertainment", color: "#6A0572", monthly_budget: 200 },
  { id: "5", name: "Bills", color: "#1A535C", monthly_budget: 800 },
]

// Add location to transactions
const initialTransactions = [
  {
    id: "1",
    title: "Grocery Shopping",
    cost: 85.5,
    currency: "USD",
    category: "Food",
    date: new Date(2025, 3, 8),
    country: "United States",
  },
  {
    id: "2",
    title: "Uber Ride",
    cost: 24.75,
    currency: "USD",
    category: "Transport",
    date: new Date(2025, 3, 7),
    country: "United States",
  },
  {
    id: "3",
    title: "Movie Tickets",
    cost: 32.0,
    currency: "USD",
    category: "Entertainment",
    date: new Date(2025, 3, 5),
    country: "Mexico",
  },
  {
    id: "4",
    title: "Internet Bill",
    cost: 65.99,
    currency: "USD",
    category: "Bills",
    date: new Date(2025, 3, 1),
    country: "India",
  },
  {
    id: "5",
    title: "Street Food",
    cost: 1200,
    currency: "INR",
    category: "Food",
    date: new Date(2025, 2, 25),
    country: "India",
  },
  {
    id: "6",
    title: "Taxi Fare",
    cost: 350,
    currency: "MXN",
    category: "Transport",
    date: new Date(2025, 2, 20),
    country: "Mexico",
  },
]

// Color palette
const COLORS = {
  primary: "#0A2463",
  primaryLight: "#1E3A8A",
  secondary: "#3E92CC",
  accent: "#FF6B6B",
  success: "#2DCE89",
  warning: "#FB8C00",
  danger: "#F5365C",
  background: "#F7F9FC",
  card: "#FFFFFF",
  text: "#1A1F36",
  textSecondary: "#8898AA",
  border: "#E9ECEF",
  inputBg: "#F4F5F7",
}

const pBudgetManipulationScreen = () => {
  const [activeTab, setActiveTab] = useState("budget") // 'budget', 'recent', or 'search'
  const [categories, setCategories] = useState(initialCategories)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [modalVisible, setModalVisible] = useState(false)
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    cost: "",
    currency: "USD",
    category: "",
    date: new Date(),
    country: "United States",
  })
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: COLORS.secondary,
    monthly_budget: "",
  })
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  // Search filters
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category: "",
    country: "",
    currency: "",
    title: "",
  })
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [isFiltering, setIsFiltering] = useState(false)

  // Date picker state - Added datePickerVisible for better control
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [datePickerFor, setDatePickerFor] = useState("transaction") // 'transaction', 'startFilter', 'endFilter'
  const [datePickerVisible, setDatePickerVisible] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current
  const addButtonScale = useRef(new Animated.Value(1)).current
  const categoryAnimations = useRef(categories.map(() => new Animated.Value(0))).current
  const transactionAnimations = useRef(transactions.map(() => new Animated.Value(0))).current
  const progressAnimations = useRef(categories.map(() => new Animated.Value(0))).current

  // Animate on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()

    // Staggered animations for categories and transactions
    const categoryAnimationsArray = categories.map((_, i) => {
      return Animated.timing(categoryAnimations[i], {
        toValue: 1,
        duration: 300,
        delay: i * 50,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      })
    })

    const transactionAnimationsArray = transactions.map((_, i) => {
      return Animated.timing(transactionAnimations[i], {
        toValue: 1,
        duration: 300,
        delay: i * 50,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      })
    })

    // Progress bar animations
    const progressAnimationsArray = categories.map((category, i) => {
      const spent = calculateCategorySpending(category.name)
      const percentSpent = (spent / category.monthly_budget) * 100
      return Animated.timing(progressAnimations[i], {
        toValue: Math.min(percentSpent, 100) / 100, // Normalize to 0-1
        duration: 800,
        delay: i * 100 + 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      })
    })

    Animated.stagger(50, [
      ...categoryAnimationsArray,
      ...transactionAnimationsArray,
      ...progressAnimationsArray,
    ]).start()
  }, [])

  // Animate tab change
  useEffect(() => {
    const tabPosition = activeTab === "budget" ? 0 : activeTab === "recent" ? 1 : 2
    Animated.timing(tabIndicatorAnim, {
      toValue: tabPosition,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [activeTab])

  // Apply filters when they change
  useEffect(() => {
    if (isFiltering) {
      applyFilters()
    }
  }, [filters, isFiltering])

  // Calculate spending for each category
  const calculateCategorySpending = useCallback(
    (categoryName) => {
      return transactions
        .filter((t) => t.category === categoryName)
        .reduce((sum, transaction) => sum + transaction.cost, 0)
    },
    [transactions],
  )

  // Get spending alerts - Updated with new messages
  const getSpendingAlert = useCallback(
    (category) => {
      const spent = calculateCategorySpending(category.name)
      const percentSpent = (spent / category.monthly_budget) * 100

      if (percentSpent > 100) {
        return { type: "danger", message: "You're over the monthly budget!" }
      } else if (percentSpent >= 80) {
        return { type: "warning", message: "You're approaching your budget!" }
      } else if (percentSpent >= 40) {
        return { type: "info", message: "You're under your budget" }
      } else if (percentSpent > 0) {
        return { type: "success", message: "You're well under budget" }
      }
      return null
    },
    [calculateCategorySpending],
  )

  // Handle adding/editing a transaction
  const handleSaveTransaction = useCallback(() => {
    if (!newTransaction.title || !newTransaction.cost || !newTransaction.category || !newTransaction.country) {
      Alert.alert("Missing Information", "Please fill in all required fields")
      return
    }

    const cost = Number.parseFloat(newTransaction.cost)
    if (isNaN(cost) || cost <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount")
      return
    }

    if (editingTransaction) {
      // Update existing transaction
      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id
            ? {
                ...t,
                title: newTransaction.title,
                cost: cost,
                currency: newTransaction.currency,
                category: newTransaction.category,
                date: newTransaction.date,
                country: newTransaction.country,
              }
            : t,
        ),
      )
    } else {
      // Add new transaction
      const transaction = {
        id: Date.now().toString(),
        ...newTransaction,
        cost: cost,
      }

      setTransactions([transaction, ...transactions])

      // Add a new animation value for the new transaction
      transactionAnimations.unshift(new Animated.Value(0))
      Animated.timing(transactionAnimations[0], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }

    setModalVisible(false)
    setEditingTransaction(null)
    setNewTransaction({
      title: "",
      cost: "",
      currency: "USD",
      category: "",
      date: new Date(),
      country: "United States",
    })

    // Reset date picker state
    setShowDatePicker(false)
    setDatePickerVisible(false)
  }, [newTransaction, editingTransaction, transactions])

  // Handle editing a transaction - Updated to fix state issues
  const handleEditTransaction = useCallback((transaction) => {
    console.log("Editing transaction:", transaction)
    setEditingTransaction(transaction)

    // Create a deep copy to avoid reference issues
    setNewTransaction({
      title: transaction.title,
      cost: transaction.cost.toString(),
      currency: transaction.currency,
      category: transaction.category,
      date: new Date(transaction.date),
      country: transaction.country || "United States",
    })

    // Reset date picker state
    setDatePickerVisible(false)
    setShowDatePicker(false)

    // Open the modal
    setModalVisible(true)
  }, [])

  // Handle adding/editing a category
  const handleSaveCategory = useCallback(() => {
    if (!newCategory.name || !newCategory.monthly_budget) {
      Alert.alert("Missing Information", "Please fill in all required fields")
      return
    }

    const monthly_budget = Number.parseFloat(newCategory.monthly_budget)

    if (isNaN(monthly_budget) || monthly_budget <= 0) {
      Alert.alert("Invalid Budget", "Please enter a valid monthly budget")
      return
    }

    if (editingCategory) {
      // Update existing category - store the old name to update transactions
      const oldCategoryName = editingCategory.name
      const newCategoryName = newCategory.name

      // Update the category
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: newCategory.name,
                color: newCategory.color,
                monthly_budget: monthly_budget,
              }
            : cat,
        ),
      )

      // Update all transactions that used the old category name
      if (oldCategoryName !== newCategoryName) {
        setTransactions(
          transactions.map((t) => (t.category === oldCategoryName ? { ...t, category: newCategoryName } : t)),
        )
      }
    } else {
      // Add new category
      const newCat = {
        id: Date.now().toString(),
        name: newCategory.name,
        color: newCategory.color,
        monthly_budget: monthly_budget,
      }
      setCategories([...categories, newCat])

      // Add a new animation value for the new category
      categoryAnimations.push(new Animated.Value(0))
      progressAnimations.push(new Animated.Value(0))

      Animated.parallel([
        Animated.timing(categoryAnimations[categoryAnimations.length - 1], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnimations[progressAnimations.length - 1], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }

    setCategoryModalVisible(false)
    setEditingCategory(null)
    setNewCategory({
      name: "",
      color: COLORS.secondary,
      monthly_budget: "",
    })
  }, [newCategory, editingCategory, categories, transactions])

  // Handle confirming category deletion
  const confirmDeleteCategory = useCallback((category) => {
    setCategoryToDelete(category)
    setDeleteConfirmVisible(true)
  }, [])

  // Handle deleting a category
  const handleDeleteCategory = useCallback(() => {
    if (!categoryToDelete) return

    const categoryName = categoryToDelete.name
    const categoryIndex = categories.findIndex((c) => c.id === categoryToDelete.id)

    // Animate the category out before removing it
    Animated.timing(categoryAnimations[categoryIndex], {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id))
      categoryAnimations.splice(categoryIndex, 1)
      progressAnimations.splice(categoryIndex, 1)

      // Update transactions that used this category
      setTransactions(transactions.map((t) => (t.category === categoryName ? { ...t, category: "Uncategorized" } : t)))
    })

    setDeleteConfirmVisible(false)
    setCategoryToDelete(null)
  }, [categoryToDelete, categories, transactions])

  // Handle editing a category
  const handleEditCategory = useCallback((category) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      color: category.color,
      monthly_budget: category.monthly_budget.toString(),
    })
    setCategoryModalVisible(true)
  }, [])

  // Format date for display
  const formatDate = useCallback((date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }, [])

  // Handle date change from DateTimePicker - Fixed date picker bug
  const handleDateChange = useCallback(
    (event, selectedDate) => {
      console.log("Date change event:", event.type, "Selected date:", selectedDate)

      // Always hide the date picker on Android
      if (Platform.OS === "android") {
        setShowDatePicker(false)
        setShowStartDatePicker(false)
        setShowEndDatePicker(false)
        setDatePickerVisible(false)
      }

      if (selectedDate) {
        if (datePickerFor === "transaction") {
          console.log("Setting transaction date to:", selectedDate)
          setNewTransaction((prev) => ({ ...prev, date: selectedDate }))
        } else if (datePickerFor === "startFilter") {
          setFilters((prev) => ({ ...prev, startDate: selectedDate }))
        } else if (datePickerFor === "endFilter") {
          setFilters((prev) => ({ ...prev, endDate: selectedDate }))
        }
      }

      // For iOS, hide the picker after a short delay
      if (Platform.OS === "ios") {
        setTimeout(() => {
          setShowDatePicker(false)
          setShowStartDatePicker(false)
          setShowEndDatePicker(false)
          setDatePickerVisible(false)
        }, 200)
      }
    },
    [datePickerFor],
  )

  // Apply search filters
  const applyFilters = useCallback(() => {
    let results = [...transactions]

    // Filter by date range
    if (filters.startDate) {
      results = results.filter((t) => t.date >= filters.startDate)
    }

    if (filters.endDate) {
      results = results.filter((t) => t.date <= filters.endDate)
    }

    // Filter by category
    if (filters.category) {
      results = results.filter((t) => t.category.toLowerCase().includes(filters.category.toLowerCase()))
    }

    // Filter by country
    if (filters.country) {
      results = results.filter((t) => t.country && t.country.toLowerCase().includes(filters.country.toLowerCase()))
    }

    // Filter by currency
    if (filters.currency) {
      results = results.filter((t) => t.currency.toLowerCase().includes(filters.currency.toLowerCase()))
    }

    // Filter by title
    if (filters.title) {
      results = results.filter((t) => t.title.toLowerCase().includes(filters.title.toLowerCase()))
    }

    setFilteredTransactions(results)
  }, [filters, transactions])

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      startDate: null,
      endDate: null,
      category: "",
      country: "",
      currency: "",
      title: "",
    })
  }, [])

  // Animate add button press
  const animateAddButton = useCallback(() => {
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }, [addButtonScale])

  // Handle currency selection
  const handleCurrencySelect = useCallback((currencyCode) => {
    console.log("Main screen: Selected currency:", currencyCode)
    setNewTransaction((prev) => ({ ...prev, currency: currencyCode }))
  }, [])

  // Handle country selection
  const handleCountrySelect = useCallback((countryName) => {
    console.log("Main screen: Selected country:", countryName)
    setNewTransaction((prev) => ({ ...prev, country: countryName }))
  }, [])

  // Open date picker - Fixed to properly set state
  const openDatePicker = useCallback(() => {
    console.log("Opening date picker, current date:", newTransaction.date)
    setDatePickerFor("transaction")
    setShowDatePicker(true)
    setDatePickerVisible(true)
  }, [newTransaction.date])

  // Render budget tab content - Removed weekly budget and update budget button
  const renderBudgetTab = () => (
    <Animated.View
      style={[
        styles.tabContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Categories</Text>
        <Animated.View style={{ transform: [{ scale: addButtonScale }] }}>
          <TouchableOpacity
            style={styles.addButtonSmall}
            onPress={() => {
              animateAddButton()
              setEditingCategory(null)
              setNewCategory({
                name: "",
                color: COLORS.secondary,
                monthly_budget: "",
              })
              setCategoryModalVisible(true)
            }}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {categories.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="folder-outline" size={70} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateText}>No categories yet</Text>
          <Text style={styles.emptyStateSubtext}>Add your first category to start budgeting</Text>
        </View>
      ) : (
        categories.map((category, index) => {
          const spent = calculateCategorySpending(category.name)
          const percentSpent = (spent / category.monthly_budget) * 100
          const alert = getSpendingAlert(category)

          return (
            <Animated.View
              key={category.id}
              style={[
                styles.categoryCard,
                {
                  opacity: categoryAnimations[index],
                  transform: [
                    {
                      translateY: categoryAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                    {
                      scale: categoryAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryNameContainer}>
                  <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.categoryActions}>
                  <TouchableOpacity style={styles.categoryAction} onPress={() => handleEditCategory(category)}>
                    <Feather name="edit-2" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.categoryAction} onPress={() => confirmDeleteCategory(category)}>
                    <Feather name="trash-2" size={20} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.budgetInfo}>
                <View style={styles.budgetItem}>
                  <Text style={styles.budgetLabel}>Monthly Budget</Text>
                  <Text style={styles.budgetValue}>${category.monthly_budget.toFixed(2)}</Text>
                </View>
                <View style={styles.budgetItem}>
                  <Text style={styles.budgetLabel}>Spent</Text>
                  <Text style={styles.budgetValue}>${spent.toFixed(2)}</Text>
                </View>
                <View style={styles.budgetItem}>
                  <Text style={styles.budgetLabel}>Remaining</Text>
                  <Text
                    style={[
                      styles.budgetValue,
                      category.monthly_budget - spent < 0 ? styles.negativeValue : styles.positiveValue,
                    ]}
                  >
                    ${(category.monthly_budget - spent).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBarContainer}>
                  {/* Fixed progress bar using scaleX transform instead of width */}
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        backgroundColor:
                          percentSpent > 100
                            ? COLORS.danger
                            : percentSpent >= 80
                              ? COLORS.warning
                              : percentSpent >= 40
                                ? COLORS.secondary
                                : COLORS.success,
                        transform: [
                          {
                            scaleX: progressAnimations[index],
                          },
                          {
                            translateX: progressAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [-150, 0], // Adjust based on your container width
                            }),
                          },
                        ],
                        // Set the transformOrigin to left
                        transformOrigin: "left",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{percentSpent.toFixed(0)}% spent</Text>
              </View>

              {alert && (
                <View style={[styles.alertContainer, styles[`alert${alert.type}`]]}>
                  <Feather
                    name={
                      alert.type === "danger"
                        ? "alert-circle"
                        : alert.type === "warning"
                          ? "alert-triangle"
                          : alert.type === "info"
                            ? "info"
                            : "check-circle"
                    }
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.alertText}>{alert.message}</Text>
                </View>
              )}
            </Animated.View>
          )
        })
      )}
    </Animated.View>
  )

  // Render transactions tab content
  const renderRecentTab = () => (
    <Animated.View
      style={[
        styles.tabContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Animated.View style={{ transform: [{ scale: addButtonScale }] }}>
          <TouchableOpacity
            style={styles.addButtonSmall}
            onPress={() => {
              animateAddButton()
              setEditingTransaction(null)
              setNewTransaction({
                title: "",
                cost: "",
                currency: "USD",
                category: "",
                date: new Date(),
                country: "United States",
              })
              setModalVisible(true)
            }}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="receipt-outline" size={70} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateText}>No transactions yet</Text>
          <Text style={styles.emptyStateSubtext}>Add your first transaction to start tracking</Text>
        </View>
      ) : (
        transactions.map((transaction, index) => {
          const category = categories.find((c) => c.name === transaction.category)
          const categoryColor = category ? category.color : COLORS.textSecondary

          return (
            <Animated.View
              key={transaction.id}
              style={[
                styles.transactionCard,
                {
                  opacity: transactionAnimations[index < transactionAnimations.length ? index : 0],
                  transform: [
                    {
                      translateY: transactionAnimations[index < transactionAnimations.length ? index : 0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                    {
                      scale: transactionAnimations[index < transactionAnimations.length ? index : 0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.transactionHeader}>
                <View style={styles.transactionTitleContainer}>
                  <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                </View>
                <View style={styles.transactionHeaderRight}>
                  <TouchableOpacity
                    style={styles.editTransactionButton}
                    onPress={() => handleEditTransaction(transaction)}
                  >
                    <Feather name="edit-2" size={16} color={COLORS.secondary} />
                  </TouchableOpacity>
                  <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                </View>
              </View>

              <View style={styles.transactionDetails}>
                <View style={styles.transactionDetail}>
                  <Text style={styles.transactionDetailLabel}>Category</Text>
                  <View style={styles.categoryPill}>
                    <Text style={[styles.categoryPillText, { color: categoryColor }]}>{transaction.category}</Text>
                  </View>
                </View>
                <View style={styles.transactionDetail}>
                  <Text style={styles.transactionDetailLabel}>Amount</Text>
                  <Text style={styles.transactionAmount}>
                    {transaction.currency} {transaction.cost.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionFooter}>
                <View style={styles.transactionLocation}>
                  <Feather name="map-pin" size={14} color={COLORS.textSecondary} style={styles.locationIcon} />
                  <Text style={styles.locationText}>{transaction.country || "Unknown"}</Text>
                </View>
              </View>
            </Animated.View>
          )
        })
      )}
    </Animated.View>
  )

  // Render search tab content
  const renderSearchTab = () => (
    <Animated.View
      style={[
        styles.tabContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={COLORS.textSecondary}
            value={filters.title}
            onChangeText={(text) => {
              setFilters({ ...filters, title: text })
              setIsFiltering(true)
            }}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Feather name="filter" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {isFiltering && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFilters}>
            {filters.startDate && (
              <View style={styles.activeFilterPill}>
                <Text style={styles.activeFilterText}>From: {formatDate(filters.startDate)}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, startDate: null })}
                  style={styles.removeFilterButton}
                >
                  <Feather name="x" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.endDate && (
              <View style={styles.activeFilterPill}>
                <Text style={styles.activeFilterText}>To: {formatDate(filters.endDate)}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, endDate: null })}
                  style={styles.removeFilterButton}
                >
                  <Feather name="x" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.category && (
              <View style={styles.activeFilterPill}>
                <Text style={styles.activeFilterText}>Category: {filters.category}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, category: "" })}
                  style={styles.removeFilterButton}
                >
                  <Feather name="x" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.country && (
              <View style={styles.activeFilterPill}>
                <Text style={styles.activeFilterText}>Country: {filters.country}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, country: "" })}
                  style={styles.removeFilterButton}
                >
                  <Feather name="x" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.currency && (
              <View style={styles.activeFilterPill}>
                <Text style={styles.activeFilterText}>Currency: {filters.currency}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, currency: "" })}
                  style={styles.removeFilterButton}
                >
                  <Feather name="x" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {(filters.startDate ||
              filters.endDate ||
              filters.category ||
              filters.country ||
              filters.currency ||
              filters.title) && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  resetFilters()
                  setIsFiltering(false)
                }}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {isFiltering && filteredTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="file-search-outline" size={70} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateText}>No matching transactions</Text>
          <Text style={styles.emptyStateSubtext}>Try adjusting your search filters</Text>
        </View>
      ) : isFiltering ? (
        filteredTransactions.map((transaction, index) => {
          const category = categories.find((c) => c.name === transaction.category)
          const categoryColor = category ? category.color : COLORS.textSecondary

          return (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionTitleContainer}>
                  <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                </View>
                <View style={styles.transactionHeaderRight}>
                  <TouchableOpacity
                    style={styles.editTransactionButton}
                    onPress={() => handleEditTransaction(transaction)}
                  >
                    <Feather name="edit-2" size={16} color={COLORS.secondary} />
                  </TouchableOpacity>
                  <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                </View>
              </View>

              <View style={styles.transactionDetails}>
                <View style={styles.transactionDetail}>
                  <Text style={styles.transactionDetailLabel}>Category</Text>
                  <View style={styles.categoryPill}>
                    <Text style={[styles.categoryPillText, { color: categoryColor }]}>{transaction.category}</Text>
                  </View>
                </View>
                <View style={styles.transactionDetail}>
                  <Text style={styles.transactionDetailLabel}>Amount</Text>
                  <Text style={styles.transactionAmount}>
                    {transaction.currency} {transaction.cost.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionFooter}>
                <View style={styles.transactionLocation}>
                  <Feather name="map-pin" size={14} color={COLORS.textSecondary} style={styles.locationIcon} />
                  <Text style={styles.locationText}>{transaction.country || "Unknown"}</Text>
                </View>
              </View>
            </View>
          )
        })
      ) : (
        <View style={styles.emptySearchState}>
          <MaterialCommunityIcons name="magnify" size={70} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateText}>Search Transactions</Text>
          <Text style={styles.emptyStateSubtext}>Use the search bar or filter button to find transactions</Text>
        </View>
      )}
    </Animated.View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget Management</Text>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("budget")} activeOpacity={0.7}>
            <Ionicons
              name="wallet-outline"
              size={20}
              color={activeTab === "budget" ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === "budget" && styles.activeTabText]}>Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("recent")} activeOpacity={0.7}>
            <Ionicons
              name="receipt-outline"
              size={20}
              color={activeTab === "recent" ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === "recent" && styles.activeTabText]}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("search")} activeOpacity={0.7}>
            <Ionicons
              name="search-outline"
              size={20}
              color={activeTab === "search" ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === "search" && styles.activeTabText]}>Search</Text>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [
                  {
                    translateX: tabIndicatorAnim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, SCREEN_WIDTH / 3, (SCREEN_WIDTH / 3) * 2],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {activeTab === "budget" ? renderBudgetTab() : activeTab === "recent" ? renderRecentTab() : renderSearchTab()}
      </ScrollView>

      {/* Add/Edit Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setModalVisible(false)
                  // Reset state when closing modal
                  if (editingTransaction) {
                    setEditingTransaction(null)
                    setNewTransaction({
                      title: "",
                      cost: "",
                      currency: "USD",
                      category: "",
                      date: new Date(),
                      country: "United States",
                    })
                  }
                }}
              >
                <Feather name="x" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Grocery Shopping"
                  placeholderTextColor={COLORS.textSecondary}
                  value={newTransaction.title}
                  onChangeText={(text) => setNewTransaction((prev) => ({ ...prev, title: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="numeric"
                  value={newTransaction.cost}
                  onChangeText={(text) => setNewTransaction((prev) => ({ ...prev, cost: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Currency</Text>
                <CurrencyDropdown
                  selectedValue={newTransaction.currency}
                  onSelect={handleCurrencySelect}
                  placeholder="Select Currency"
                  buttonStyle={styles.dropdownButton}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.pickerContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryOption,
                          newTransaction.category === category.name && styles.selectedCategoryOption,
                          { borderColor: category.color },
                        ]}
                        onPress={() => setNewTransaction((prev) => ({ ...prev, category: category.name }))}
                      >
                        <View style={[styles.categoryOptionDot, { backgroundColor: category.color }]} />
                        <Text
                          style={[
                            styles.categoryOptionText,
                            newTransaction.category === category.name && styles.selectedCategoryOptionText,
                          ]}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Country</Text>
                <CountryDropdown
                  selectedValue={newTransaction.country}
                  onSelect={handleCountrySelect}
                  placeholder="Select Country"
                  buttonStyle={styles.dropdownButton}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity style={styles.datePickerButton} onPress={openDatePicker}>
                  <Text style={styles.datePickerButtonText}>{formatDate(newTransaction.date)}</Text>
                  <Feather name="calendar" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false)
                  // Reset state when canceling
                  if (editingTransaction) {
                    setEditingTransaction(null)
                    setNewTransaction({
                      title: "",
                      cost: "",
                      currency: "USD",
                      category: "",
                      date: new Date(),
                      country: "United States",
                    })
                  }
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveTransaction}>
                <Text style={styles.saveButtonText}>
                  {editingTransaction ? "Update Transaction" : "Add Transaction"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add/Edit Category Modal - Removed weekly budget */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setCategoryModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingCategory ? "Edit Category" : "Add Category"}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setCategoryModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Food, Transport, etc."
                  placeholderTextColor={COLORS.textSecondary}
                  value={newCategory.name}
                  onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Monthly Budget</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="numeric"
                  value={newCategory.monthly_budget}
                  onChangeText={(text) => setNewCategory({ ...newCategory, monthly_budget: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Color</Text>
                <View style={styles.colorOptions}>
                  {[
                    "#FF6B6B",
                    "#4ECDC4",
                    "#FFD166",
                    "#6A0572",
                    "#1A535C",
                    "#3366FF",
                    "#F26419",
                    "#2DCE89",
                    "#FB8C00",
                    "#F5365C",
                  ].map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newCategory.color === color && styles.selectedColorOption,
                      ]}
                      onPress={() => setNewCategory({ ...newCategory, color })}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCategoryModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveCategory}>
                <Text style={styles.saveButtonText}>{editingCategory ? "Update Category" : "Add Category"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setFilterModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Transactions</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setFilterModalVisible(false)}>
                <Feather name="x" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date Range</Text>
                <View style={styles.dateRangeContainer}>
                  <TouchableOpacity
                    style={styles.dateRangeButton}
                    onPress={() => {
                      setDatePickerFor("startFilter")
                      setShowStartDatePicker(true)
                    }}
                  >
                    <Text style={styles.dateRangeButtonText}>
                      {filters.startDate ? formatDate(filters.startDate) : "Start Date"}
                    </Text>
                    <Feather name="calendar" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.dateRangeSeparator}>to</Text>
                  <TouchableOpacity
                    style={styles.dateRangeButton}
                    onPress={() => {
                      setDatePickerFor("endFilter")
                      setShowEndDatePicker(true)
                    }}
                  >
                    <Text style={styles.dateRangeButtonText}>
                      {filters.endDate ? formatDate(filters.endDate) : "End Date"}
                    </Text>
                    <Feather name="calendar" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter category name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={filters.category}
                  onChangeText={(text) => setFilters({ ...filters, category: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Country</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter country name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={filters.country}
                  onChangeText={(text) => setFilters({ ...filters, country: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Currency</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter currency code"
                  placeholderTextColor={COLORS.textSecondary}
                  value={filters.currency}
                  onChangeText={(text) => setFilters({ ...filters, currency: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Transaction Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter transaction title"
                  placeholderTextColor={COLORS.textSecondary}
                  value={filters.title}
                  onChangeText={(text) => setFilters({ ...filters, title: text })}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  resetFilters()
                  setFilterModalVisible(false)
                  setIsFiltering(false)
                }}
              >
                <Text style={styles.cancelButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  setFilterModalVisible(false)
                  setIsFiltering(true)
                }}
              >
                <Text style={styles.saveButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteConfirmVisible}
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={() => setDeleteConfirmVisible(false)} />
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmModalIcon}>
              <Feather name="alert-triangle" size={40} color={COLORS.danger} />
            </View>

            <Text style={styles.confirmModalTitle}>Delete Category?</Text>

            <Text style={styles.confirmModalText}>
              Are you sure you want to delete "{categoryToDelete?.name}"? This will affect all associated transactions.
            </Text>

            <View style={styles.confirmModalButtons}>
              <TouchableOpacity style={styles.confirmCancelButton} onPress={() => setDeleteConfirmVisible(false)}>
                <Text style={styles.confirmCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmDeleteButton} onPress={handleDeleteCategory}>
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DateTimePicker for iOS/Android - Fixed date picker bug */}
      {(showDatePicker || datePickerVisible) && (
        <DateTimePicker
          testID="dateTimePicker"
          value={newTransaction.date || new Date()}
          mode="date"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {showStartDatePicker && (
        <DateTimePicker
          value={filters.startDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={filters.endDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tabsContainer: {
    backgroundColor: COLORS.card,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tabs: {
    flexDirection: "row",
    position: "relative",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    width: SCREEN_WIDTH / 3 - 20,
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  tabContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  categoryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryColor: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
  },
  categoryColorLarge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  selectedCategoryName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  categoryActions: {
    flexDirection: "row",
  },
  categoryAction: {
    padding: 8,
    marginLeft: 6,
  },
  budgetInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  budgetItem: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
  },
  positiveValue: {
    color: COLORS.success,
  },
  negativeValue: {
    color: COLORS.danger,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: COLORS.inputBg,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    width: "100%", // Set to 100% and use scaleX to animate
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: "right",
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
  },
  alertdanger: {
    backgroundColor: COLORS.danger,
  },
  alertwarning: {
    backgroundColor: COLORS.warning,
  },
  alertinfo: {
    backgroundColor: COLORS.secondary,
  },
  alertsuccess: {
    backgroundColor: COLORS.success,
  },
  alertText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 14,
  },
  transactionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  transactionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  editTransactionButton: {
    padding: 6,
    marginRight: 8,
  },
  categoryDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  transactionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  transactionDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  transactionDetails: {
    flexDirection: "row",
  },
  transactionDetail: {
    flex: 1,
  },
  transactionDetailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  categoryPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    alignSelf: "flex-start",
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
  },
  transactionFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  transactionLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginTop: 16,
  },
  emptySearchState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: COLORS.text,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFiltersContainer: {
    marginBottom: 16,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  activeFilters: {
    flexDirection: "row",
  },
  activeFilterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterText: {
    fontSize: 14,
    color: COLORS.text,
    marginRight: 6,
  },
  removeFilterButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.inputBg,
    justifyContent: "center",
    alignItems: "center",
  },
  clearFiltersButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  currencyModalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: "90%",
    maxHeight: "70%",
    alignSelf: "center",
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  selectedCategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  inputHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  pickerContainer: {
    marginVertical: 8,
  },
  dropdownButton: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 14,
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 14,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateRangeButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 12,
  },
  dateRangeButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  dateRangeSeparator: {
    marginHorizontal: 10,
    color: COLORS.textSecondary,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 14,
    marginBottom: 14,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: COLORS.text,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: COLORS.inputBg,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Confirmation modal styles
  confirmModalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignSelf: "center",
    alignItems: "center",
  },
  confirmModalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(245, 54, 92, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  confirmModalText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmModalButtons: {
    flexDirection: "row",
    width: "100%",
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: COLORS.inputBg,
  },
  confirmCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: COLORS.danger,
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    marginRight: 10,
    borderWidth: 1, // Lighter border for unselected categories
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  selectedCategoryOption: {
    backgroundColor: COLORS.card,
    borderWidth: 2, // Bold border for selected category
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryOptionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryOptionText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.text,
  },
  selectedCategoryOptionText: {
    fontWeight: "600",
  },
})

export default pBudgetManipulationScreen
