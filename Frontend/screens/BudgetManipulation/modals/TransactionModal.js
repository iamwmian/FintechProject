"use client"

import { useState } from "react"
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
import DatePickerButton from "../components/DatePickerButton"

const TransactionModal = ({ visible, onClose, onSave, transaction, setTransaction, categories, isEditing }) => {
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleDateChange = (event, selectedDate) => {
    // Always hide the date picker on Android
    if (Platform.OS === "android") {
      setShowDatePicker(false)
    }

    if (selectedDate) {
      setTransaction((prev) => ({ ...prev, transaction_date: selectedDate }))
    }

    // For iOS, hide the picker after a short delay
    if (Platform.OS === "ios") {
      setTimeout(() => {
        setShowDatePicker(false)
      }, 200)
    }
  }

  const handleCurrencySelect = (currencyCode) => {
    console.log("Selected currency:", currencyCode)
    setTransaction((prev) => ({ ...prev, currency: currencyCode }))
  }

  const handleCountrySelect = (countryName) => {
    console.log("Selected country:", countryName)
    setTransaction((prev) => ({ ...prev, location: countryName }))
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
            <Text style={styles.modalTitle}>{isEditing ? "Edit Transaction" : "Add Transaction"}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
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
                value={transaction.title}
                onChangeText={(text) => setTransaction((prev) => ({ ...prev, title: text }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={transaction.cost}
                onChangeText={(text) => setTransaction((prev) => ({ ...prev, cost: text }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Currency</Text>
              <CurrencyDropdown
                // Could default it 
                selectedValue={transaction.currency}
                onSelect={handleCurrencySelect}
                placeholder="Select Currency"
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
                        transaction.category === category.name && styles.selectedCategoryOption,
                        { borderColor: category.color },
                      ]}
                      onPress={() => setTransaction((prev) => ({ ...prev, category: category.id }))}
                    >
                      <View style={[styles.categoryOptionDot, { backgroundColor: category.color }]} />
                      <Text
                        style={[
                          styles.categoryOptionText,
                          transaction.category === category.name && styles.selectedCategoryOptionText,
                        ]}
                      >
                        {category.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Country</Text>
              <CountryDropdown
                // Could default it 
                selectedValue={transaction.location}
                onSelect={handleCountrySelect}
                placeholder="Select Country"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerButtonText}>
                  {transaction.transaction_date ? formatDate(new Date(transaction.transaction_date)) : "Select Date"}
                </Text>
                <Feather name="calendar" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>{isEditing ? "Update Transaction" : "Add Transaction"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.datePickerModalContainer}>
            <Pressable 
              style={styles.datePickerBackdrop} 
              onPress={() => setShowDatePicker(false)} 
            />
            <View style={styles.datePickerContent}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Select Date</Text>
                <TouchableOpacity 
                  style={styles.datePickerCloseButton} 
                  onPress={() => setShowDatePicker(false)}
                >
                  <Feather name="x" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                testID="dateTimePicker"
                value={transaction.date || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
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
  pickerContainer: {
    marginVertical: 8,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  selectedCategoryOption: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
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
    fontWeight: "900",
    color : "blue",
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
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

export default TransactionModal
