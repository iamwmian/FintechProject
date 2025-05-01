import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"
import { formatDate } from "../utils/formatters"

const DatePickerButton = ({ date, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.datePickerButton, style]} onPress={onPress}>
      <Text style={styles.datePickerButtonText}>{formatDate(date)}</Text>
      <Feather name="calendar" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
})

export default DatePickerButton
