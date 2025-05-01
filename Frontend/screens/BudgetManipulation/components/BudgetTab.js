// import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
// import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
// import { COLORS } from "../utils/constants"
// import CategoryCard from "./CategoryCard"

// // Create default animation values outside the component
// const defaultAnimation = new Animated.Value(1)
// const defaultProgressAnimation = new Animated.Value(0)

// const BudgetTab = ({
//   categories,
//   calculateCategorySpending,
//   getSpendingAlert,
//   handleEditCategory,
//   confirmDeleteCategory,
//   transactions,
//   fadeAnim,
//   slideAnim,
//   addButtonScale,
//   animateAddButton,
//   setCategoryModalVisible,
//   setEditingCategory,
//   setNewCategory,
//   categoryAnimations,
//   progressAnimations,
// }) => {
//   return (
//     <Animated.View
//       style={[
//         styles.tabContent,
//         {
//           opacity: fadeAnim,
//           transform: [{ translateY: slideAnim }],
//         },
//       ]}
//     >
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Your Categories</Text>
//         <Animated.View style={{ transform: [{ scale: addButtonScale }] }}>
//           <TouchableOpacity
//             style={styles.addButtonSmall}
//             onPress={() => {
//               animateAddButton()
//               setEditingCategory(null)
//               setNewCategory({
//                 name: "",
//                 color: COLORS.secondary,
//                 monthlyBudget: "",
//               })
//               setCategoryModalVisible(true)
//             }}
//             activeOpacity={0.8}
//           >
//             <Feather name="plus" size={18} color="#fff" />
//             <Text style={styles.addButtonText}>Add</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>

//       {categories.length === 0 ? (
//         <View style={styles.emptyState}>
//           <MaterialCommunityIcons name="folder-outline" size={70} color={COLORS.textSecondary} />
//           <Text style={styles.emptyStateText}>No categories yet</Text>
//           <Text style={styles.emptyStateSubtext}>Add your first category to start budgeting</Text>
//         </View>
//       ) : (
//         categories.map((category, index) => {
//           const spent = calculateCategorySpending(category.name, transactions)
//           const percentSpent = (spent / category.monthlyBudget) * 100
//           const alert = getSpendingAlert(category, transactions)
          
//           // Use the animation values from props if available, otherwise use defaults
//           const animation = categoryAnimations?.[index] ?? defaultAnimation
//           const progressAnimation = progressAnimations?.[index] ?? defaultProgressAnimation

//           return (
//             <CategoryCard
//               key={category.id}
//               category={category}
//               spent={spent}
//               percentSpent={percentSpent}
//               alert={alert}
//               onEdit={handleEditCategory}
//               onDelete={confirmDeleteCategory}
//               animation={animation}
//               progressAnimation={progressAnimation}
//             />
//           )
//         })
//       )}
//     </Animated.View>
//   )
// }

// const styles = StyleSheet.create({
//   tabContent: {
//     padding: 16,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//     paddingHorizontal: 4,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: COLORS.text,
//   },
//   addButtonSmall: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   addButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     marginLeft: 6,
//     fontSize: 14,
//   },
//   emptyState: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 40,
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     marginTop: 16,
//   },
//   emptyStateText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.text,
//     marginTop: 16,
//   },
//   emptyStateSubtext: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginTop: 8,
//     textAlign: "center",
//   },
// })

// export default BudgetTab

import React, { useCallback, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { COLORS } from "../utils/constants"
import CategoryCard from "./CategoryCard"

const BudgetTab = ({
  categories,
  calculateCategorySpending,
  getSpendingAlert,
  handleEditCategory,
  confirmDeleteCategory,
  transactions,
  fadeAnim,
  slideAnim,
  addButtonScale,
  animateAddButton,
  setCategoryModalVisible,
  setEditingCategory,
  setNewCategory,
}) => {
  const [categoryAnimations, setCategoryAnimations] = useState([])
  const [progressAnimations, setProgressAnimations] = useState([])

  useFocusEffect(
    useCallback(() => {
      const newCategoryAnims = categories.map(() => new Animated.Value(0))
      const newProgressAnims = categories.map(() => new Animated.Value(0))

      setCategoryAnimations(newCategoryAnims)
      setProgressAnimations(newProgressAnims)

      newCategoryAnims.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start()
      })

      newProgressAnims.forEach((anim) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start()
      })
    }, [categories])
  )

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
        <Text style={styles.sectionTitle}>Your Categories</Text>
        <Animated.View style={{ transform: [{ scale: addButtonScale }] }}>
          <TouchableOpacity
            style={styles.addButtonSmall}
            onPress={() => {
              animateAddButton()
              setEditingCategory(null)
              setNewCategory({
                name: "",
                color: COLORS.secondary,
                monthlyBudget: "",
              })
              setCategoryModalVisible(true)
            }}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {categories.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="folder-outline" size={70} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateText}>No categories yet</Text>
          <Text style={styles.emptyStateSubtext}>Add your first category to start budgeting</Text>
        </View>
      ) : (
        categories.map((category, index) => {
          const spent = calculateCategorySpending(category.title, transactions)
          const percentSpent = (spent / category.monthly_budget) * 100
          const alert = getSpendingAlert(category, transactions)

          const animation = categoryAnimations[index] ?? new Animated.Value(1)
          const progressAnimation = progressAnimations[index] ?? new Animated.Value(0)

          return (
            <CategoryCard
              key={category.id}
              category={category}
              spent={spent}
              percentSpent={percentSpent}
              alert={alert}
              onEdit={handleEditCategory}
              onDelete={confirmDeleteCategory}
              animation={animation}
              progressAnimation={progressAnimation}
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

export default BudgetTab
