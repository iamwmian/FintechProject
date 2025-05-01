import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Animated } from "react-native"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"
import { formatDate } from "../utils/formatters"
import TransactionCard from "./TransactionCard"

const SearchTab = ({
  filters,
  setFilters,
  isFiltering,
  setIsFiltering,
  filteredTransactions,
  resetFilters,
  setFilterModalVisible,
  categories,
  handleEditTransaction,
  fadeAnim,
  slideAnim,
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
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={COLORS.textSecondary}
            value={filters.title}
            onChangeText={(text) => {
              setFilters({ ...filters, title: text })
              setIsFiltering(true)
            }}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Feather name="filter" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {isFiltering && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFilters}>
            {filters.startDate && (
              <View style={styles.activeFilterPill}>
                <Text style={styles.activeFilterText}>From: {formatDate(filters.startDate)}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, startDate: null })}
                  style={styles.removeFilterButton}
                >
                  <Feather name="x" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.endDate && (
              <View style={styles.activeFilterPill}>
                <Text style={styles.activeFilterText}>To: {formatDate(filters.endDate)}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, endDate: null })}
                  style={styles.removeFilterButton}
                >
                  <Feather name="x" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {filters.category && (
              <View style={styles.activeFilterPill}>
                <Text style={styles.activeFilterText}>Category: {filters.category}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ ...filters, category: "" })}
                  style={styles.removeFilterButton}
                >
                  <Feather name="x" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            // In the activeFilters section of SearchTab.js, update the country and currency filter pills:

          {filters.country && (
            <View style={styles.activeFilterPill}>
              <Text style={styles.activeFilterText}>Country: {filters.country}</Text>
              <TouchableOpacity
                onPress={() => setFilters({ ...filters, country: "" })}
                style={styles.removeFilterButton}
              >
                <Feather name="x" size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {filters.currency && (
            <View style={styles.activeFilterPill}>
              <Text style={styles.activeFilterText}>Currency: {filters.currency}</Text>
              <TouchableOpacity
                onPress={() => setFilters({ ...filters, currency: "" })}
                style={styles.removeFilterButton}
              >
                <Feather name="x" size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
            {(filters.startDate ||
              filters.endDate ||
              filters.category ||
              filters.country ||
              filters.currency ||
              filters.title) && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  resetFilters()
                  setIsFiltering(false)
                }}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {isFiltering && filteredTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="file-search-outline" size={70} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateText}>No matching transactions</Text>
          <Text style={styles.emptyStateSubtext}>Try adjusting your search filters</Text>
        </View>
      ) : isFiltering ? (
        filteredTransactions.map((transaction) => {
          const category = categories.find((c) => c.name === transaction.category)
          const categoryColor = category ? category.color : COLORS.textSecondary

          return (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              categoryColor={categoryColor}
              onEdit={handleEditTransaction}
              onDelete={confirmDeleteTransaction}
              animation={new Animated.Value(1)} // Static animation for filtered results
            />
          )
        })
      ) : (
        <View style={styles.emptySearchState}>
          <MaterialCommunityIcons name="magnify" size={70} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateText}>Search Transactions</Text>
          <Text style={styles.emptyStateSubtext}>Use the search bar or filter button to find transactions</Text>
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  tabContent: {
    padding: 16,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: COLORS.text,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFiltersContainer: {
    marginBottom: 16,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  activeFilters: {
    flexDirection: "row",
  },
  activeFilterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterText: {
    fontSize: 14,
    color: COLORS.text,
    marginRight: 6,
  },
  removeFilterButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.inputBg,
    justifyContent: "center",
    alignItems: "center",
  },
  clearFiltersButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginTop: 16,
  },
  emptySearchState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
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

export default SearchTab
