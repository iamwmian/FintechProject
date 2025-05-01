"use client"

import { useState, useCallback, useEffect } from "react"

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

  // Apply filters when they change
  useEffect(() => {
    if (isFiltering) {
      applyFilters()
    }
  }, [filters, isFiltering, applyFilters])

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
  }
}
