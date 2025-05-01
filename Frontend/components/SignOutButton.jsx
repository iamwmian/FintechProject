import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "../core/global";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      useAuthStore.getState().logout();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    // <TouchableOpacity onPress={handleSignOut}>
    //   <Text>Sign out</Text>
    // </TouchableOpacity>
    <TouchableOpacity
      onPress={handleSignOut}
      style={styles.row}
    >
      <View style={[styles.rowIcon, { backgroundColor: "red" }]}>
        <Ionicons name="log-out" size={22} color="#fff"></Ionicons>
      </View>

      <Text style={styles.rowLabel}>Logout</Text>

      <View style={styles.rowSpacer} />

      <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
    </TouchableOpacity>
  );
};




const styles = StyleSheet.create({
  /** Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: "#0c0c0c",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
