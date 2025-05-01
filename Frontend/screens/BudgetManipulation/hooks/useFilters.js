// "use client"

// import { useState, useCallback, useEffect } from "react"

// export default function useFilters(transactions) {
//   const [filterModalVisible, setFilterModalVisible] = useState(false)
//   const [filters, setFilters] = useState({
//     startDate: null,
//     endDate: null,
//     category: "",
//     country: "",
//     currency: "",
//     title: "",
//   })
//   const [filteredTransactions, setFilteredTransactions] = useState([])
//   const [isFiltering, setIsFiltering] = useState(false)
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false)
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false)

//   // Apply search filters
//   const applyFilters = useCallback(() => {
//     let results = [...transactions]

//     // Filter by date range
//     if (filters.startDate) {
//       results = results.filter((t) => t.date >= filters.startDate)
//     }

//     if (filters.endDate) {
//       results = results.filter((t) => t.date <= filters.endDate)
//     }

//     // Filter by category
//     if (filters.category) {
//       results = results.filter((t) => t.category.toLowerCase().includes(filters.category.toLowerCase()))
//     }

//     // Filter by country
//     if (filters.country) {
//       results = results.filter((t) => t.country && t.country.toLowerCase().includes(filters.country.toLowerCase()))
//     }

//     // Filter by currency
//     if (filters.currency) {
//       results = results.filter((t) => t.currency.toLowerCase().includes(filters.currency.toLowerCase()))
//     }

//     // Filter by title
//     if (filters.title) {
//       results = results.filter((t) => t.title.toLowerCase().includes(filters.title.toLowerCase()))
//     }

//     setFilteredTransactions(results)
//   }, [filters, transactions])

//   // Apply filters when they change
//   useEffect(() => {
//     if (isFiltering) {
//       applyFilters()
//     }
//   }, [filters, isFiltering, applyFilters])

//   // Reset filters
//   const resetFilters = useCallback(() => {
//     setFilters({
//       startDate: null,
//       endDate: null,
//       category: "",
//       country: "",
//       currency: "",
//       title: "",
//     })
//   }, [])

//   return {
//     filterModalVisible,
//     setFilterModalVisible,
//     filters,
//     setFilters,
//     filteredTransactions,
//     isFiltering,
//     setIsFiltering,
//     showStartDatePicker,
//     setShowStartDatePicker,
//     showEndDatePicker,
//     setShowEndDatePicker,
//     applyFilters,
//     resetFilters,
//   }
// }


"use client"

import { useState, useCallback, useEffect } from "react"
import { toISOStringFormat } from "../utils/formatters";
import { BASE_URL } from '@env'

const userId = 1;
export default function useFilters(transactions) {
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
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Make an API call to get filtered transactions
  const fetchFilteredTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Construct the API query params
    const queryParams = new URLSearchParams()

    if (filters.startDate) queryParams.append('start_date', toISOStringFormat(filters.startDate))
    if (filters.endDate) queryParams.append('end_date', toISOStringFormat((filters.endDate)))
    if (filters.category) queryParams.append('category', filters.category)
    if (filters.country) queryParams.append('country', filters.country)
    if (filters.currency) queryParams.append('currency', filters.currency)
    if (filters.title) queryParams.append('title', filters.title)

    try {
      const response = await fetch(
        `${BASE_URL}/api/transactions/user/${userId}/search/?${queryParams.toString()}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const data = await response.json()
      setFilteredTransactions(data)  // Assuming the response is an array of transactions
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Trigger API call when filters or isFiltering change
  useEffect(() => {
    if (isFiltering) {
      fetchFilteredTransactions()
    }
  }, [filters, isFiltering, fetchFilteredTransactions])

  // Apply filters (this will trigger the fetchFilteredTransactions function)
  const applyFilters = () => {
    setIsFiltering(true)
  }

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

  return {
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
    applyFilters,
    resetFilters,
    loading,
    error,
  }
}
