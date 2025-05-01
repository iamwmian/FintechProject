"use client"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { COLORS } from "../utils/constants"
import { formatDate } from "../utils/formatters"
import CurrencyDropdown from "../components/CurrencyDropdown"
import CountryDropdown from "../components/CountryDropdown"

const FilterModal = ({
  visible,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
  showStartDatePicker,
  setShowStartDatePicker,
  showEndDatePicker,
  setShowEndDatePicker,
}) => {
  const handleStartDateChange = (event, selectedDate) => {
    // Always hide the date picker on Android
    if (Platform.OS === "android") {
      setShowStartDatePicker(false)
    }

    if (selectedDate) {
      setFilters((prev) => ({ ...prev, startDate: selectedDate }))
    }

    // For iOS, hide the picker after a short delay
    if (Platform.OS === "ios") {
      setTimeout(() => {
        setShowStartDatePicker(false)
      }, 200)
    }
  }

  const handleEndDateChange = (event, selectedDate) => {
    // Always hide the date picker on Android
    if (Platform.OS === "android") {
      setShowEndDatePicker(false)
    }

    if (selectedDate) {
      setFilters((prev) => ({ ...prev, endDate: selectedDate }))
    }

    // For iOS, hide the picker after a short delay
    if (Platform.OS === "ios") {
      setTimeout(() => {
        setShowEndDatePicker(false)
      }, 200)
    }
  }

  const handleCurrencySelect = (currencyCode) => {
    console.log("Filter: Selected currency:", currencyCode)
    setFilters({ ...filters, currency: currencyCode })
  }

  const handleCountrySelect = (countryName) => {
    console.log("Filter: Selected country:", countryName)
    setFilters({ ...filters, country: countryName })
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Transactions</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
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
                    setShowEndDatePicker(false)
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
                    setShowStartDatePicker(false)
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
                onChangeText={(text) => setFilters((prev) => ({ ...prev, category: text }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Country</Text>
              <CountryDropdown
                selectedValue={filters.country}
                onSelect={handleCountrySelect}
                placeholder="Select Country"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Currency</Text>
              <CurrencyDropdown
                selectedValue={filters.currency}
                onSelect={handleCurrencySelect}
                placeholder="Select Currency"
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
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {showStartDatePicker && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showStartDatePicker}
          onRequestClose={() => setShowStartDatePicker(false)}
        >
          <View style={styles.datePickerModalContainer}>
            <Pressable 
              style={styles.datePickerBackdrop} 
              onPress={() => setShowStartDatePicker(false)} 
            />
            <View style={styles.datePickerContent}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Select Start Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerCloseButton} 
                  onPress={() => setShowStartDatePicker(false)}
                >
                  <Feather name="x" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={filters.startDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleStartDateChange}
                textColor={COLORS.text}
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {showEndDatePicker && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showEndDatePicker}
          onRequestClose={() => setShowEndDatePicker(false)}
        >
          <View style={styles.datePickerModalContainer}>
            <Pressable 
              style={styles.datePickerBackdrop} 
              onPress={() => setShowEndDatePicker(false)} 
            />
            <View style={styles.datePickerContent}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Select End Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerCloseButton} 
                  onPress={() => setShowEndDatePicker(false)}
                >
                  <Feather name="x" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={filters.endDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleEndDateChange}
                textColor={COLORS.text}
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  )
}

const styles = StyleSheet.create({
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
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateRangeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateRangeButtonText: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 8,
  },
  dateRangeSeparator: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginHorizontal: 12,
  },
  modalFooter: {
    flexDirection: "row",
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: COLORS.inputBg,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  applyButton: {
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
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  datePickerModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  datePickerContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  datePickerCloseButton: {
    padding: 4,
  },
  datePicker: {
    backgroundColor: COLORS.card,
    height: 200,
    ...(Platform.OS === "ios" && {
      width: "100%",
    }),
  },
})

export default FilterModal