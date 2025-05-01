// "use client"

// import { useState, useCallback } from "react"
// import { Alert } from "react-native"
// import { COLORS } from "../utils/constants"
// import axios from "axios"

// const initialCategories = [
//   { id: "1", name: "Food", color: "#FF6B6B", monthlyBudget: 500 },
//   { id: "2", name: "Transport", color: "#4ECDC4", monthlyBudget: 300 },
//   { id: "3", name: "Shopping", color: "#FFD166", monthlyBudget: 400 },
//   { id: "4", name: "Entertainment", color: "#6A0572", monthlyBudget: 200 },
//   { id: "5", name: "Bills", color: "#1A535C", monthlyBudget: 800 },
// ]

// export default function useCategories(updateTransactionsCategory) {
//   const [categories, setCategories] = useState(initialCategories)
//   const [categoryModalVisible, setCategoryModalVisible] = useState(false)
//   const [editingCategory, setEditingCategory] = useState(null)
//   const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)
//   const [categoryToDelete, setCategoryToDelete] = useState(null)
//   const [newCategory, setNewCategory] = useState({
//     name: "",
//     color: COLORS.secondary,
//     monthlyBudget: "",
//   })

//   // Calculate spending for each category
//   const calculateCategorySpending = useCallback((categoryName, transactions) => {
//     return transactions
//       .filter((t) => t.category === categoryName)
//       .reduce((sum, transaction) => sum + transaction.cost, 0)
//   }, [])

//   // Get spending alerts
//   const getSpendingAlert = useCallback(
//     (category, transactions) => {
//       const spent = calculateCategorySpending(category.name, transactions)
//       const percentSpent = (spent / category.monthlyBudget) * 100

//       if (percentSpent > 100) {
//         return { type: "danger", message: "You're over budget!" }
//       } else if (percentSpent >= 80) {
//         return { type: "warning", message: "Approaching budget limit" }
//       } else if (percentSpent >= 40) {
//         return { type: "info", message: "Budget on track" }
//       }
//       return { type: "success", message: "Well under budget" }
//     },
//     [calculateCategorySpending],
//   )

//   // Handle adding/editing a category
//   const handleSaveCategory = useCallback(() => {
//     if (!newCategory.name || !newCategory.monthlyBudget) {
//       Alert.alert("Missing Information", "Please fill in all required fields")
//       return
//     }

//     const monthlyBudget = Number.parseFloat(newCategory.monthlyBudget)
//     if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
//       Alert.alert("Invalid Budget", "Please enter a valid monthly budget")
//       return
//     }

//     if (editingCategory) {
//       const oldCategoryName = editingCategory.name
//       setCategories(categories.map(cat => 
//         cat.id === editingCategory.id 
//           ? { ...cat, ...newCategory, monthlyBudget }
//           : cat
//       ))
//       if (oldCategoryName !== newCategory.name) {
//         updateTransactionsCategory(oldCategoryName, newCategory.name)
//       }
//     } else {
//       setCategories([...categories, {
//         id: Date.now().toString(),
//         ...newCategory,
//         monthlyBudget
//       }])
//     }

//     setCategoryModalVisible(false)
//     setEditingCategory(null)
//     setNewCategory({
//       name: "",
//       color: COLORS.secondary,
//       monthlyBudget: "",
//     })
//   }, [newCategory, editingCategory, categories, updateTransactionsCategory])

//   // Handle confirming category deletion
//   const confirmDeleteCategory = useCallback((category) => {
//     setCategoryToDelete(category)
//     setDeleteConfirmVisible(true)
//   }, [])

//   // Handle deleting a category
//   const handleDeleteCategory = useCallback(() => {
//     if (!categoryToDelete) return

//     setCategories(categories.filter(c => c.id !== categoryToDelete.id))
//     updateTransactionsCategory(categoryToDelete.name, "Uncategorized")
//     setDeleteConfirmVisible(false)
//     setCategoryToDelete(null)
//   }, [categoryToDelete, categories, updateTransactionsCategory])

//   // Handle editing a category
//   const handleEditCategory = useCallback((category) => {
//     setEditingCategory(category)
//     setNewCategory({
//       name: category.name,
//       color: category.color,
//       monthlyBudget: category.monthlyBudget.toString(),
//     })
//     setCategoryModalVisible(true)
//   }, [])

//   return {
//     categories,
//     categoryModalVisible,
//     setCategoryModalVisible,
//     editingCategory,
//     setEditingCategory,
//     newCategory,
//     setNewCategory,
//     deleteConfirmVisible,
//     setDeleteConfirmVisible,
//     categoryToDelete,
//     setCategoryToDelete,
//     calculateCategorySpending,
//     getSpendingAlert,
//     handleSaveCategory,
//     confirmDeleteCategory,
//     handleDeleteCategory,
//     handleEditCategory,
//   }
// }


"use client"

import { useState, useCallback, useEffect } from "react"
import { Alert } from "react-native"
import { COLORS } from "../utils/constants"
import axios from "axios"
import { BASE_URL } from "@env"


export default function useCategories(updateTransactionsCategory) {
  const [categories, setCategories] = useState([])
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: COLORS.secondary,
    monthlyBudget: "",
  })
  const userId = 1;

  // Fetch categories from the API when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories/user/${userId}`);

        const updatedCategories = response.data.map(category => ({
          ...category,
          monthly_budget: Number(category.monthly_budget) || 0 // Ensures it's a number, defaults to 0 if invalid
        }));
        setCategories(updatedCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Calculate spending for each category
  const calculateCategorySpending = useCallback((categoryName, transactions) => {
    return transactions
      .filter((t) => t.category_title === categoryName)
      .reduce((sum, transaction) => sum + Number(transaction.cost), 0)
  }, [])

  

  // Get spending alerts
  const getSpendingAlert = useCallback(
    (category, transactions) => {
      const spent = calculateCategorySpending(category.title, transactions)
      const percentSpent = (Number(spent) / Number(category.monthly_budget)) * 100

      if (percentSpent > 100) {
        return { type: "danger", message: "You're over budget!" }
      } else if (percentSpent >= 80) {
        return { type: "warning", message: "Approaching budget limit" }
      } else if (percentSpent >= 40) {
        return { type: "info", message: "Budget on track" }
      }
      return { type: "success", message: "Well under budget" }
    },
    [calculateCategorySpending],
  )

  // Handle adding/editing a category
  const handleSaveCategory = useCallback(async () => {
    if (!newCategory.name || !newCategory.monthlyBudget) {
      Alert.alert("Missing Information", "Please fill in all required fields")
      return
    }

    const monthlyBudget = Number.parseFloat(newCategory.monthlyBudget)
    if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
      Alert.alert("Invalid Budget", "Please enter a valid monthly budget")
      return
    }

    try {
      if (editingCategory) {
        // Editing category
        await axios.put(`${BASE_URL}/api/categories/user/${userId}/category/${editingCategory.id}/`, {
          user : userId,
          title: newCategory.name,
          color: newCategory.color,
          monthly_budget: newCategory.monthlyBudget,
          currency: "USD",
        })

        console.log("new", newCategory.monthlyBudget)

        setCategories(categories.map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, ...newCategory, monthly_budget: newCategory.monthlyBudget }
            : cat
        ))
      } else {
        // Adding new category
        const response = await axios.post(`${BASE_URL}/api/categories/`, {
          user: userId,
          title: newCategory.name,
          color: newCategory.color,
          monthly_budget : newCategory.monthlyBudget,
          currency : "USD"
        })
        setCategories([...categories, response.data])
      }

      setCategoryModalVisible(false)
      setEditingCategory(null)
      setNewCategory({
        name: "",
        color: COLORS.secondary,
        monthlyBudget: "",
      })
    } catch (error) {
      console.error("Error saving category:", error)
      Alert.alert("Error", "There was an issue saving the category.")
    }
  }, [newCategory, editingCategory, categories])

  // Handle confirming category deletion
  const confirmDeleteCategory = useCallback((category) => {
    setCategoryToDelete(category)
    setDeleteConfirmVisible(true)
  }, [])

  // Handle deleting a category
  const handleDeleteCategory = useCallback(async () => {
    if (!categoryToDelete) return

    try {
      await axios.delete(`${BASE_URL}/api/categories/${categoryToDelete.id}/`)
      setCategories(categories.filter(c => c.id !== categoryToDelete.id))
      updateTransactionsCategory(categoryToDelete.name, "Uncategorized")
      setDeleteConfirmVisible(false)
      setCategoryToDelete(null)
    } catch (error) {
      console.error("Error deleting category:", error)
      Alert.alert("Error", "There was an issue deleting the category.")
    }
  }, [categoryToDelete, categories, updateTransactionsCategory])

  // Handle editing a category
  const handleEditCategory = useCallback((category) => {
    setEditingCategory(category)
    setNewCategory({
      user: userId,
      name: category.title,
      color: category.color,
      monthly_budget: category.monthly_budget.toString(),
      currency: "USD"
    })
    setCategoryModalVisible(true)
  }, [])

  return {
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
  }
}
