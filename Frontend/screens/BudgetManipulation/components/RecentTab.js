import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"
import TransactionCard from "./TransactionCard"

const RecentTab = ({
  transactions,
  categories,
  handleEditTransaction,
  fadeAnim,
  slideAnim,
  addButtonScale,
  animateAddButton,
  setModalVisible,
  setEditingTransaction,
  setNewTransaction,
  transactionAnimations,
  confirmDeleteTransaction,
}) => {
  return (
    <Animated.View
      style={[
        styles.tabContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Animated.View style={{ transform: [{ scale: addButtonScale }] }}>
          <TouchableOpacity
            style={styles.addButtonSmall}
            onPress={() => {
              animateAddButton()
              setEditingTransaction(null)
              setNewTransaction({
                title: "",
                cost: "",
                currency: "USD",
                category: "",
                date: new Date(),
                country: "United States",
              })
              setModalVisible(true)
            }}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="receipt-outline" size={70} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateText}>No transactions yet</Text>
          <Text style={styles.emptyStateSubtext}>Add your first transaction to start tracking</Text>
        </View>
      ) : (
        transactions.map((transaction, index) => {
          const category = categories.find((c) => c.title === transaction.category_title)
          const categoryColor = category ? category.color : COLORS.textSecondary

          return (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              categoryColor={categoryColor}
              onEdit={handleEditTransaction}
              onDelete={confirmDeleteTransaction}
              animation={transactionAnimations[index < transactionAnimations.length ? index : 0]}
            />
          )
        })
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  tabContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
})

export default RecentTab
