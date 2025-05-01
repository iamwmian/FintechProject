"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, StyleSheet, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"

// Enhanced dropdown component that fetches countries from an API
const CountryDropdown = ({
  selectedValue,
  onSelect,
  placeholder = "Select Country",
  containerStyle = {},
  labelStyle = {},
  buttonStyle = {},
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [countries, setCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        console.log("CountryDropdown: Fetching countries...")
        setIsLoading(true)
        setError(null)

        // Fetch all countries from REST Countries API
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,currencies")
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        console.log("CountryDropdown: API response received with", data.length, "countries")

        // Format the country data
        const formattedCountries = data
          .filter(country => country.currencies) // Only include countries with currencies
          .map(country => ({
            code: country.cca2,
            name: country.name.common,
            currencies: Object.keys(country.currencies || {})
          }))
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically

        setCountries(formattedCountries)
      } catch (error) {
        console.error("CountryDropdown: Error fetching countries:", error)
        setError("Failed to load countries. Please try again.")

        // Fallback data from constants.js
        setCountries([
          { code: "US", name: "United States", currencies: ["USD"] },
          { code: "IN", name: "India", currencies: ["INR"] },
          { code: "MX", name: "Mexico", currencies: ["MXN"] },
          { code: "CA", name: "Canada", currencies: ["CAD"] },
          { code: "GB", name: "United Kingdom", currencies: ["GBP"] },
          { code: "AU", name: "Australia", currencies: ["AUD"] },
          { code: "JP", name: "Japan", currencies: ["JPY"] },
          { code: "DE", name: "Germany", currencies: ["EUR"] },
          { code: "FR", name: "France", currencies: ["EUR"] },
          { code: "IT", name: "Italy", currencies: ["EUR"] },
          { code: "ES", name: "Spain", currencies: ["EUR"] },
          { code: "BR", name: "Brazil", currencies: ["BRL"] },
          { code: "RU", name: "Russia", currencies: ["RUB"] },
          { code: "CN", name: "China", currencies: ["CNY"] },
          { code: "ZA", name: "South Africa", currencies: ["ZAR"] },
          { code: "NG", name: "Nigeria", currencies: ["NGN"] },
          { code: "EG", name: "Egypt", currencies: ["EGP"] },
          { code: "SA", name: "Saudi Arabia", currencies: ["SAR"] },
          { code: "AE", name: "United Arab Emirates", currencies: ["AED"] },
          { code: "SG", name: "Singapore", currencies: ["SGD"] },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Filter countries based on search
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (country) => {
    console.log("CountryDropdown: Selected", country.name)
    onSelect(country.name)
    setModalVisible(false)
    setSearchQuery("")
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        onPress={() => {
          console.log("CountryDropdown: Opening modal")
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
          console.log("CountryDropdown: Closing modal")
          setModalVisible(false)
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("CountryDropdown: Closing modal via X button")
                  setModalVisible(false)
                }}
              >
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search countries..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textSecondary}
            />

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading countries...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.listItem, selectedValue === item.name && styles.selectedItem]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemText}>
                        {item.name} ({item.code})
                      </Text>
                      {item.currencies && item.currencies.length > 0 && (
                        <Text style={styles.currencyText}>
                          {item.currencies.join(', ')}
                        </Text>
                      )}
                    </View>
                    {selectedValue === item.name && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
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
  },
  currencyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
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

export default CountryDropdown