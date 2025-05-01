import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"
import { formatDate } from "../utils/formatters"

const TransactionCard = ({ transaction, categoryColor, onEdit, onDelete, animation }) => {
  return (
    <Animated.View
      style={[
        styles.transactionCard,
        // {
        //   opacity: animation,
        //   transform: [
        //     {
        //       translateY: animation.interpolate({
        //         inputRange: [0, 1],
        //         outputRange: [50, 0],
        //       }),
        //     },
        //     {
        //       scale: animation.interpolate({
        //         inputRange: [0, 1],
        //         outputRange: [0.9, 1],
        //       }),
        //     },
        //   ],
        // },
      ]}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionTitleContainer}>
          <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
          <Text style={styles.transactionTitle}>{transaction.title}</Text>
        </View>
        <View style={styles.transactionHeaderRight}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(transaction)}>
            <Feather name="edit-2" size={16} color={COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(transaction)}>
            <Feather name="trash-2" size={16} color={COLORS.danger} />
          </TouchableOpacity>
          <Text style={styles.transactionDate}>{formatDate(new Date(transaction.transaction_date))}</Text>
        </View>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.transactionDetail}>
          <Text style={styles.transactionDetailLabel}>Category</Text>
          <View style={styles.categoryPill}>
            <Text style={[styles.categoryPillText, { color: categoryColor }]}>{transaction.category_title}</Text>
          </View>
        </View>
        <View style={styles.transactionDetail}>
          <Text style={styles.transactionDetailLabel}>Amount</Text>
          <Text style={styles.transactionAmount}>
            {transaction.currency} {Number(transaction.cost).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.transactionFooter}>
        <View style={styles.transactionLocation}>
          <Feather name="map-pin" size={14} color={COLORS.textSecondary} style={styles.locationIcon} />
          <Text style={styles.locationText}>{transaction.location || " Unknown"}</Text>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  transactionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  transactionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  transactionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  transactionDetail: {
    flex: 1,
  },
  transactionDetailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  categoryPill: {
    alignSelf: "flex-start",
  },
  categoryPillText: {
    fontSize: 15,
    fontWeight: "600",
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  transactionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  transactionLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
})

export default TransactionCard
