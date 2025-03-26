import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { HomeStack, ProfileStack } from "./stack";
import { Linking, SafeAreaView, StyleSheet } from "react-native";
import { View } from "react-native";
import { Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

export const MyDrawer = () => {
  const styles = StyleSheet.create({
    logo: {
      width: 100,
      resizeMode: "contain",
    },
  });
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => {
        return (
          <SafeAreaView
            style={{ flex: 1, paddingTop: 20, backgroundColor: "grey" }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                style={styles.logo}
                source={require("../assets/favicon.png")}
              />
            </View>
            <DrawerItemList {...props} />
            <DrawerItem
              label={"More Info"}
              onPress={() => {
                Linking.openURL("https://www.youtube.com");
              }}
              icon={() => <Ionicons name="logo-youtube" size={22} />}
            />
          </SafeAreaView>
        );
      }}
    >
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: "Home",
          drawerIcon: () => <Ionicons name="home" size={22} />,
        }}
      />
      <Drawer.Screen
        name="ProfilesStack"
        component={ProfileStack}
        options={{
          title: "Profiles",
          drawerIcon: () => (
            <MaterialCommunityIcons name="face-man-profile" size={22} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
