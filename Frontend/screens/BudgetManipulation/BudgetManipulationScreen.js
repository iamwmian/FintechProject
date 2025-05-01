// BudgetManipulationScreen.js
import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
// 🔑 Notice no "screens/BudgetManipulation" here —
import { COLORS }        from "./utils/constants";
import useCategories     from "./hooks/useCategories";
import useTransactions   from "./hooks/useTransactions";
import useFilters        from "./hooks/useFilters";
import TabBar            from "./components/TabBar";
import BudgetTab         from "./components/BudgetTab";
import RecentTab         from "./components/RecentTab";
import SearchTab         from "./components/SearchTab";
import TransactionModal  from "./modals/TransactionModal";
import CategoryModal     from "./modals/CategoryModel";
import FilterModal       from "./modals/FilterModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import { BASE_URL } from "@env"


const userId = 1
const { width: SCREEN_WIDTH } = Dimensions.get("window")

const BudgetManipulationScreen = () => {
  // State
  const [activeTab, setActiveTab] = React.useState("budget") // 'budget', 'recent', or 'search'
  const [datePickerVisible, setDatePickerVisible] = React.useState(false)
  const [datePickerFor, setDatePickerFor] = React.useState("transaction") // 'transaction', 'startFilter', 'endFilter'
  const [transactionToDelete, setTransactionToDelete] = useState(null)
  const [deleteTransactionConfirmVisible, setDeleteTransactionConfirmVisible] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current
  const addButtonScale = useRef(new Animated.Value(1)).current

  // Custom hooks
  const {
    transactions,
    modalVisible,
    setModalVisible,
    editingTransaction,
    setEditingTransaction,
    newTransaction,
    setNewTransaction,
    handleSaveTransaction,
    handleEditTransaction,
    updateTransactionsCategory,
    setTransactions,

    // deleteConfirmVisible,
    // setDeleteConfirmVisible,
    // confirmDeleteCategory,
    // handleDeleteCategory,
  } = useTransactions()

  const {
    categories,
    categoryModalVisible,
    setCategoryModalVisible,
    editingCategory,
    setEditingCategory,
    newCategory,
    setNewCategory,
    deleteConfirmVisible,
    setDeleteConfirmVisible,
    categoryToDelete,
    setCategoryToDelete,
    calculateCategorySpending,
    getSpendingAlert,
    handleSaveCategory,
    confirmDeleteCategory,
    handleDeleteCategory,
    handleEditCategory,
  } = useCategories(updateTransactionsCategory)

  const {
    filterModalVisible,
    setFilterModalVisible,
    filters,
    setFilters,
    filteredTransactions,
    isFiltering,
    setIsFiltering,
    showStartDatePicker,
    setShowStartDatePicker,
    showEndDatePicker,
    setShowEndDatePicker,
    resetFilters,
  } = useFilters(transactions)

  // Animation refs
  // const categoryAnimations = useRef(categories.map(() => new Animated.Value(0))).current
  // const transactionAnimations = useRef(transactions.map(() => new Animated.Value(0))).current
  // const progressAnimations = useRef(categories.map(() => new Animated.Value(0))).current

  const categoryAnimations = useRef([])
  const transactionAnimations = useRef([])
  const progressAnimations = useRef([])

useEffect(() => {
  categoryAnimations.current = categories.map(() => new Animated.Value(0))
  progressAnimations.current = categories.map(() => new Animated.Value(0))
}, [categories])

// useEffect(() => {
//   transactionAnimations.current = transactions.map(() => new Animated.Value(0))
// }, [transactions])

useEffect(() => {
  const anims = transactionAnimations.current

  // Add missing animations
  while (anims.length < transactions.length) {
    anims.push(new Animated.Value(0))
  }

  // Remove extra animations
  while (anims.length > transactions.length) {
    anims.pop()
  }

  // Now, anims.length === transactions.length
}, [transactions])



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
      const spent = calculateCategorySpending(category.title, transactions)
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

  // Handle closing transaction modal
  const handleCloseTransactionModal = useCallback(() => {
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
  }, [])

  // Handle closing category modal
  const handleCloseCategoryModal = useCallback(() => {
    setCategoryModalVisible(false)
    setEditingCategory(null)
    setNewCategory({
      name: "",
      color: COLORS.secondary,
      monthlyBudget: "",
    })
  }, [])

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    setFilterModalVisible(false)
    setIsFiltering(true)
  }, [])

  // Reset filters
  const handleResetFilters = useCallback(() => {
    resetFilters()
    setFilterModalVisible(false)
    setIsFiltering(false)
  }, [resetFilters])

  // Handle confirming transaction deletion
  const confirmDeleteTransaction = useCallback((transaction) => {
    setTransactionToDelete(transaction)
    setDeleteTransactionConfirmVisible(true)
  }, [])

  // Handle deleting a transaction
  const handleDeleteTransaction2 = useCallback(() => {
    if (!transactionToDelete) return

    const transactionIndex = transactions.findIndex((t) => t.id === transactionToDelete.id)

    // Animate the transaction out before removing it
    Animated.timing(transactionAnimations[transactionIndex], {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTransactions(transactions.filter((t) => t.id !== transactionToDelete.id))
      transactionAnimations.splice(transactionIndex, 1)
    })

    setDeleteTransactionConfirmVisible(false)
    setTransactionToDelete(null)
  }, [transactionToDelete, transactions])

  const handleDeleteTransaction = useCallback(async () => {
    if (!transactionToDelete) return
  
    const transactionIndex = transactions.findIndex((t) => t.id === transactionToDelete.id)
    const transactionId = transactionToDelete.id
  
    try {

      await axios.delete(`${BASE_URL}/api/transactions/user/${userId}/transaction/${transactionId}/`)
      const animation = transactionAnimations.current[transactionIndex]
      if (animation) {
        Animated.timing(animation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Remove from state after animation
          setTransactions((prev) =>
            prev.filter((t) => t.id !== transactionId)
          );
          transactionAnimations.current.splice(transactionIndex, 1);
        });
      } else {
        console.warn("No animation found for index:", transactionIndex);
        // Remove immediately without animation
        setTransactions((prev) =>
          prev.filter((t) => t.id !== transactionId)
        );
        transactionAnimations.current.splice(transactionIndex, 1);
      }
      
      // Close modal & reset
      setDeleteTransactionConfirmVisible(false)
      setTransactionToDelete(null)

    } catch (error) {
      console.error("Failed to delete transaction", error, error.message)
      Alert.alert("Error", "Failed to delete transaction. Please try again.")
    }
  }, [transactionToDelete, transactions, transactionAnimations, userId])
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget Management</Text>
      </View>

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} tabIndicatorAnim={tabIndicatorAnim} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {activeTab === "budget" ? (
          <BudgetTab
            categories={categories}
            calculateCategorySpending={(categoryName) => calculateCategorySpending(categoryName, transactions)}
            getSpendingAlert={(category) => getSpendingAlert(category, transactions)}
            handleEditCategory={handleEditCategory}
            confirmDeleteCategory={confirmDeleteCategory}
            transactions={transactions}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            addButtonScale={addButtonScale}
            animateAddButton={animateAddButton}
            setCategoryModalVisible={setCategoryModalVisible}
            setEditingCategory={setEditingCategory}
            setNewCategory={setNewCategory}
            // categoryAnimations={categoryAnimations}
            categoryAnimations={categoryAnimations.current}
            progressAnimations={progressAnimations}
          />
        ) : activeTab === "recent" ? (
          <RecentTab
            transactions={transactions}
            categories={categories}
            handleEditTransaction={handleEditTransaction}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            addButtonScale={addButtonScale}
            animateAddButton={animateAddButton}
            setModalVisible={setModalVisible}
            setEditingTransaction={setEditingTransaction}
            setNewTransaction={setNewTransaction}
            transactionAnimations={transactionAnimations}
            confirmDeleteTransaction={confirmDeleteTransaction}
            transactionToDelete={transactionToDelete}
          />
        ) : (
          <SearchTab
            filters={filters}
            setFilters={setFilters}
            isFiltering={isFiltering}
            setIsFiltering={setIsFiltering}
            filteredTransactions={filteredTransactions}
            resetFilters={resetFilters}
            setFilterModalVisible={setFilterModalVisible}
            categories={categories}
            handleEditTransaction={handleEditTransaction}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
          />
        )}
      </ScrollView>

      {/* Transaction Modal */}
      <TransactionModal
        visible={modalVisible}
        onClose={handleCloseTransactionModal}
        onSave={handleSaveTransaction}
        transaction={newTransaction}
        setTransaction={setNewTransaction}
        categories={categories}
        isEditing={!!editingTransaction}
      />

      {/* Category Modal */}
      <CategoryModal
        visible={categoryModalVisible}
        onClose={handleCloseCategoryModal}
        onSave={handleSaveCategory}
        category={newCategory}
        setCategory={setNewCategory}
        isEditing={!!editingCategory}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        filters={filters}
        setFilters={setFilters}
        showStartDatePicker={showStartDatePicker}
        setShowStartDatePicker={setShowStartDatePicker}
        showEndDatePicker={showEndDatePicker}
        setShowEndDatePicker={setShowEndDatePicker}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={deleteConfirmVisible}
        onClose={() => setDeleteConfirmVisible(false)}
        onDelete={handleDeleteCategory}
        categoryName={categoryToDelete?.title}
      />

      {/* Delete Transaction Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteTransactionConfirmVisible}
        onRequestClose={() => setDeleteTransactionConfirmVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={() => setDeleteTransactionConfirmVisible(false)} />
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmModalIcon}>
              <Feather name="alert-triangle" size={40} color={COLORS.danger} />
            </View>

            <Text style={styles.confirmModalTitle}>Delete Transaction?</Text>

            <Text style={styles.confirmModalText}>
              Are you sure you want to delete "{transactionToDelete?.title}"?
            </Text>

            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={styles.confirmCancelButton} 
                onPress={() => setDeleteTransactionConfirmVisible(false)}
              >
                <Text style={styles.confirmCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmDeleteButton} onPress={handleDeleteTransaction}>
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  confirmModalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  confirmModalIcon: {
    marginBottom: 10,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmModalText: {
    marginBottom: 20,
  },
  confirmModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmCancelButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
  },
  confirmCancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  confirmDeleteButton: {
    backgroundColor: COLORS.danger,
    padding: 10,
    borderRadius: 5,
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
})

export default BudgetManipulationScreen
