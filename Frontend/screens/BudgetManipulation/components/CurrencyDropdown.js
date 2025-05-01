"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, StyleSheet, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"

// Simple standalone dropdown component
const CurrencyDropdown = ({
  selectedValue,
  onSelect,
  placeholder = "Select Currency",
  containerStyle = {},
  labelStyle = {},
  buttonStyle = {},
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currencies, setCurrencies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        console.log("CurrencyDropdown: Fetching currencies...")
        setIsLoading(true)
        setError(null)

        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        console.log("CurrencyDropdown: API response received")
        // Get currency codes and sort them alphabetically
        const currencyList = Object.keys(data.rates)
          .map((code) => ({
            code,
            name: getCurrencyName(code) || code,
          }))
          .sort((a, b) => a.code.localeCompare(b.code))

        setCurrencies(currencyList)
      } catch (error) {
        console.error("CurrencyDropdown: Error fetching currencies:", error)
        setError("Failed to load currencies. Please try again.")

        // Fallback data
        setCurrencies([
          { code: "USD", name: "US Dollar" },
          { code: "EUR", name: "Euro" },
          { code: "GBP", name: "British Pound" },
          { code: "JPY", name: "Japanese Yen" },
          { code: "AUD", name: "Australian Dollar" },
          { code: "INR", name: "Indian Rupee" },
          { code: "MXN", name: "Mexican Peso" },
          { code: "CAD", name: "Canadian Dollar" },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrencies()
  }, [])

  // Helper function to get currency names
  const getCurrencyName = (code) => {
    const currencyNames = {
      USD: "US Dollar",
      EUR: "Euro",
      GBP: "British Pound",
      JPY: "Japanese Yen",
      AUD: "Australian Dollar",
      CAD: "Canadian Dollar",
      CHF: "Swiss Franc",
      CNY: "Chinese Yuan",
      INR: "Indian Rupee",
      MXN: "Mexican Peso",
      BRL: "Brazilian Real",
      RUB: "Russian Ruble",
      KRW: "South Korean Won",
      SGD: "Singapore Dollar",
      NZD: "New Zealand Dollar",
      HKD: "Hong Kong Dollar",
      SEK: "Swedish Krona",
      ZAR: "South African Rand",
      TRY: "Turkish Lira",
      NOK: "Norwegian Krone",
      // Add more as needed
    }
    return currencyNames[code]
  }

  // Filter currencies based on search
  const filteredCurrencies = currencies.filter((currency) =>
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (currency.name && currency.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSelect = (currency) => {
    console.log("CurrencyDropdown: Selected", currency.code)
    onSelect(currency.code)
    setModalVisible(false)
    setSearchQuery("")
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={() => {
          console.log("CurrencyDropdown: Opening modal")
          setSearchQuery("")
          setModalVisible(true)
        }}
      >
        <Text style={[styles.buttonText, labelStyle]}>{selectedValue || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Standalone Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("CurrencyDropdown: Closing modal")
          setModalVisible(false)
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("CurrencyDropdown: Closing modal via X button")
                  setModalVisible(false)
                }}
              >
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search currencies..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textSecondary}
            />

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading currencies...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <FlatList
                data={filteredCurrencies}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.listItem, selectedValue === item.code && styles.selectedItem]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemText}>{item.code}</Text>
                      {item.name && item.name !== item.code && (
                        <Text style={styles.currencyName}>{item.name}</Text>
                      )}
                    </View>
                    {selectedValue === item.code && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                )}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: COLORS.inputBg,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.inputBg,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItemContent: {
    flex: 1,
  },
  selectedItem: {
    backgroundColor: COLORS.inputBg,
  },
  listItemText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  currencyName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: "center",
  },
})

export default CurrencyDropdown