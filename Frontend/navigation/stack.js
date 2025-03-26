import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home-screen";
import EventDetailScreen from "../screens/event-detail-screen";
import { navOptions } from "./options";
import { useNavigation } from "@react-navigation/native";
import ProfileDetailScreen from "../screens/profiles/profiles-detail-screen";
import ProfileScreen from "../screens/profiles/profiles-screen";
import { HomeTabs } from "./tabs";
import LoginScreen from "../screens/SignIn/LoginScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";

const Stack = createStackNavigator();

export const HomeStack = () => {
  const navgation = useNavigation()
  return (
    <Stack.Navigator screenOptions={() => navOptions(navgation)}>
      <Stack.Screen name="Home" component={HomeTabs} />
      <Stack.Screen name="Event" component={EventDetailScreen} />
    </Stack.Navigator>
  );
};

export const AuthenticationStack = () => {
  const navgation = useNavigation()
  return (
    <Stack.Navigator screenOptions={() => navOptions(navgation)}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};


export const ProfileStack = () => {
  const navgation = useNavigation()
  return (
    <Stack.Navigator screenOptions={() => navOptions(navgation)}>
      <Stack.Screen name="Profiles" component={ProfileScreen} />
      <Stack.Screen name="Profile" component={ProfileDetailScreen} />
    </Stack.Navigator>
  );
};