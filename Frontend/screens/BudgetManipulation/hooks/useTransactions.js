// "use client"

// import { useState, useCallback } from "react"
// import { Alert } from "react-native"
// import { initialTransactions } from "../utils/constants"

// export default function useTransactions() {
//   const [transactions, setTransactions] = useState(initialTransactions)
//   const [modalVisible, setModalVisible] = useState(false)
//   const [editingTransaction, setEditingTransaction] = useState(null)
//   const [newTransaction, setNewTransaction] = useState({
//     title: "",
//     cost: "",
//     currency: "USD",
//     category: "",
//     date: new Date(),
//     country: "United States",
//   })

//   // Handle adding/editing a transaction
//   const handleSaveTransaction = useCallback(() => {
//     if (!newTransaction.title || !newTransaction.cost || !newTransaction.category || !newTransaction.country) {
//       Alert.alert("Missing Information", "Please fill in all required fields")
//       return
//     }

//     const cost = Number.parseFloat(newTransaction.cost)
//     if (isNaN(cost) || cost <= 0) {
//       Alert.alert("Invalid Amount", "Please enter a valid amount")
//       return
//     }

//     if (editingTransaction) {
//       // Update existing transaction
//       setTransactions(
//         transactions.map((t) =>
//           t.id === editingTransaction.id
//             ? {
//                 ...t,
//                 title: newTransaction.title,
//                 cost: cost,
//                 currency: newTransaction.currency,
//                 category: newTransaction.category,
//                 date: newTransaction.date,
//                 country: newTransaction.country,
//               }
//             : t,
//         ),
//       )
//     } else {
//       // Add new transaction
//       const transaction = {
//         id: Date.now().toString(),
//         ...newTransaction,
//         cost: cost,
//       }

//       setTransactions([transaction, ...transactions])
//     }

//     setModalVisible(false)
//     setEditingTransaction(null)
//     setNewTransaction({
//       title: "",
//       cost: "",
//       currency: "USD",
//       category: "",
//       date: new Date(),
//       country: "United States",
//     })
//   }, [newTransaction, editingTransaction, transactions])

//   // Handle editing a transaction
//   const handleEditTransaction = useCallback((transaction) => {
//     console.log("Editing transaction:", transaction)
//     setEditingTransaction(transaction)

//     // Create a deep copy to avoid reference issues
//     setNewTransaction({
//       title: transaction.title,
//       cost: transaction.cost.toString(),
//       currency: transaction.currency,
//       category: transaction.category,
//       date: new Date(transaction.date),
//       country: transaction.country || "United States",
//     })

//     // Open the modal
//     setModalVisible(true)
//   }, [])

//   // Update transactions when a category is renamed or deleted
//   const updateTransactionsCategory = useCallback(
//     (oldCategoryName, newCategoryName) => {
//       setTransactions(
//         transactions.map((t) => (t.category === oldCategoryName ? { ...t, category: newCategoryName } : t)),
//       )
//     },
//     [transactions],
//   )

//   return {
//     transactions,
//     setTransactions,
//     modalVisible,
//     setModalVisible,
//     editingTransaction,
//     setEditingTransaction,
//     newTransaction,
//     setNewTransaction,
//     handleSaveTransaction,
//     handleEditTransaction,
//     updateTransactionsCategory,
//   }
// }

"use client"

import { useState, useCallback, useEffect } from "react"
import { Alert } from "react-native"
import axios from "axios"
import { BASE_URL } from "@env"

const API_BASE_URL = `${BASE_URL}/api/transactions`;

export default function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    cost: "",
    currency: "USD",
    category: "",
    transaction_date: new Date(),
    location: "United States",
  })
  const userId = 1;

  // Fetch transactions on mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/${userId}/`)
      .then((response) => setTransactions(response.data))
      .catch((error) => {
        console.error("Failed to fetch transactions", error)
        Alert.alert("Error", "Failed to load transactions")
      })
  }, [])

  // Save (Create or Update) a transaction
  const handleSaveTransaction = useCallback(async () => {
    const { title, cost, category, location } = newTransaction

    if (!title || !cost || !category || !location) {
      const missingFields = [];
      if (!title) missingFields.push("Title");
      if (!cost) missingFields.push("Cost");
      if (!category) missingFields.push("Category");
      if (!location) missingFields.push("Location");
    
      Alert.alert(
        "Missing Information",
        `Please fill in the following required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const parsedCost = parseFloat(cost)
    if (isNaN(parsedCost) || parsedCost <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount")
      return
    }

    try {
      if (editingTransaction) {
        // Update transaction
        const updatedTransaction = {
          ...editingTransaction,
          ...newTransaction,
          cost: parsedCost,
        }
        
        console.log("Editing Transaction: ", editingTransaction)
        console.log("New Transaction: ", newTransaction)
        console.log("Updated Transaction: ", updatedTransaction)

        const response = await axios.put(`${API_BASE_URL}/user/${userId}/transaction/${editingTransaction.id}/`, updatedTransaction)

        setTransactions(prev =>
          prev.map(t => t.id === editingTransaction.id ? response.data : t)
        )
      } else {
        // Create transaction
        const response = await axios.post(`${API_BASE_URL}/user/${userId}/`, {
          ...newTransaction,
          cost: parsedCost,
        })

        setTransactions((prev) => [response.data, ...prev])
      }

      // Reset modal and form
      setModalVisible(false)
      setEditingTransaction(null)
      setNewTransaction({
        title: "",
        cost: "",
        currency: "USD",
        category: "",
        transaction_date: new Date(),
        location: "United States",
      })
    } catch (error) {
      console.error("Failed to save transaction", error)
      Alert.alert("Error", "Failed to save transaction")
    }
  }, [newTransaction, editingTransaction])

  const handleEditTransaction = useCallback((transaction) => {
    setEditingTransaction(transaction)
    setNewTransaction({
      title: transaction.title,
      cost: transaction.cost.toString(),
      currency: transaction.currency,
      category: transaction.category,
      transaction_date: new Date(transaction.transaction_date),
      location: transaction.location || "United States",
    })
    setModalVisible(true)
  }, [])

  const updateTransactionsCategory = useCallback(
    async (oldCategoryName, newCategoryName) => {
      try {
        const updated = await Promise.all(
          transactions
            .filter((t) => t.category === oldCategoryName)
            .map((t) =>
              axios.put(`${API_BASE_URL}/${t.id}`, {
                ...t,
                category: newCategoryName,
              }),
            ),
        )

        setTransactions((prev) =>
          prev.map((t) =>
            t.category === oldCategoryName ? { ...t, category: newCategoryName } : t,
          ),
        )
      } catch (error) {
        console.error("Failed to update categories", error)
        Alert.alert("Error", "Failed to update category")
      }
    },
    [transactions],
  )

  

  const handleDeleteTransaction = useCallback(async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/user/${userId}/transaction/${id}/`)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Failed to delete transaction", error)
      Alert.alert("Error", "Failed to delete transaction")
    }
  }, [])

  return {
    transactions,
    setTransactions,
    modalVisible,
    setModalVisible,
    editingTransaction,
    setEditingTransaction,
    newTransaction,
    setNewTransaction,
    handleSaveTransaction,
    handleEditTransaction,
    updateTransactionsCategory,
    handleDeleteTransaction,
  }
}
