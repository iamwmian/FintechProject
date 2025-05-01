import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"

const CategoryCard = ({ category, spent, percentSpent, alert, onEdit, onDelete, animation, progressAnimation }) => {
  return (
    <Animated.View
      style={[
        styles.categoryCard,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >

      <View style={styles.categoryHeader}>
        <View style={styles.categoryNameContainer}>
          <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
          <Text style={styles.categoryName}>{String(category.title)}</Text>
        </View>
        <View style={styles.categoryActions}>
          <TouchableOpacity style={styles.categoryAction} onPress={() => onEdit(category)}>
            <Feather name="edit-2" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryAction} onPress={() => onDelete(category)}>
            <Feather name="trash-2" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.budgetInfo}>
        <View style={styles.budgetItem}>
          <Text style={styles.budgetLabel}>Monthly Budget</Text>
          <Text style={styles.budgetValue}>${Number(category.monthly_budget).toFixed(2)}</Text>
        </View>
        <View style={styles.budgetItem}>
          <Text style={styles.budgetLabel}>Spent</Text>
          <Text style={styles.budgetValue}>${Number(spent).toFixed(2)}</Text>
        </View>
        <View style={styles.budgetItem}>
          <Text style={styles.budgetLabel}>Remaining</Text>
          <Text
            style={[
              styles.budgetValue,
              Number(category.monthly_budget) - Number(spent) < 0 ? styles.negativeValue : styles.positiveValue,
            ]}
          >
            ${(Number(category.monthly_budget) - Number(spent)).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor:
                  percentSpent > 100
                    ? COLORS.danger
                    : percentSpent >= 80
                      ? COLORS.warning
                      : percentSpent >= 40
                        ? COLORS.secondary
                        : COLORS.success,
                transform: [
                  {
                    scaleX: progressAnimation,
                  },
                  {
                    translateX: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-150, 0],
                    }),
                  },
                ],
                transformOrigin: "left",
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{percentSpent.toFixed(0)}% spent</Text>
      </View>

      {alert && (
        <View style={[styles.alertContainer, styles[`alert${alert.type}`]]}>
          <Feather
            name={
              alert.type === "danger"
                ? "alert-circle"
                : alert.type === "warning"
                  ? "alert-triangle"
                  : alert.type === "info"
                    ? "info"
                    : "check-circle"
            }
            size={16}
            color="#fff"
          />
          <Text style={styles.alertText}>{alert.message}</Text>
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  categoryCard: {
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
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryColor: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  categoryActions: {
    flexDirection: "row",
  },
  categoryAction: {
    padding: 8,
    marginLeft: 6,
  },
  budgetInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  budgetItem: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
  },
  positiveValue: {
    color: COLORS.success,
  },
  negativeValue: {
    color: COLORS.danger,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: COLORS.inputBg,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    width: "100%",
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: "right",
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
  },
  alertdanger: {
    backgroundColor: COLORS.danger,
  },
  alertwarning: {
    backgroundColor: COLORS.warning,
  },
  alertinfo: {
    backgroundColor: COLORS.secondary,
  },
  alertsuccess: {
    backgroundColor: COLORS.success,
  },
  alertText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 14,
  },
})

export default CategoryCard
