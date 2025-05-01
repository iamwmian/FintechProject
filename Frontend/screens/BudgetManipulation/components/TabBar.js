import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const TabBar = ({ activeTab, setActiveTab, tabIndicatorAnim }) => {
  return (
    <View style={styles.tabsContainer}>
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("budget")} activeOpacity={0.7}>
          <Ionicons
            name="wallet-outline"
            size={20}
            color={activeTab === "budget" ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === "budget" && styles.activeTabText]}>Budget</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("recent")} activeOpacity={0.7}>
          <Ionicons
            name="receipt-outline"
            size={20}
            color={activeTab === "recent" ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === "recent" && styles.activeTabText]}>Recent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("search")} activeOpacity={0.7}>
          <Ionicons
            name="search-outline"
            size={20}
            color={activeTab === "search" ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === "search" && styles.activeTabText]}>Search</Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [
                {
                  translateX: tabIndicatorAnim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, SCREEN_WIDTH / 3, (SCREEN_WIDTH / 3) * 2],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: COLORS.card,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tabs: {
    flexDirection: "row",
    position: "relative",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 20,
    width: SCREEN_WIDTH / 3 - 20,
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
})

export default TabBar
