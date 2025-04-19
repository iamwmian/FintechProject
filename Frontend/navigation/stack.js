import { createStackNavigator } from "@react-navigation/stack";
import { navOptions } from "./options";
import { useNavigation } from "@react-navigation/native";
import SignUpScreen from "../screens/Register/SignUp";
import Splash from "../screens/Splash/Splash";
import { TabLayout } from "./tabs";
import { NewLogin } from "../screens/SignIn/new-login";
import { Setup } from "../screens/Setup/Setup";
const Stack = createStackNavigator();

export const AuthenticationStack = () => {
  const navgation = useNavigation()
  return (
    <Stack.Navigator screenOptions={() => navOptions(navgation)}>
      {/* <Stack.Screen name="SignIn" component={SignInScreen} /> */}
      <Stack.Screen name="SignIn" component={NewLogin} />
      <Stack.Screen name="SignUp" component={SignUpScreen} /> 
    </Stack.Navigator>
  );
};

export const SplashStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={() => navOptions(navigation)}>
      <Stack.Screen name = "Splash" component={Splash}/>
    </Stack.Navigator>
  )
}

export const SetupStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={() => navOptions(navigation)}>
      <Stack.Screen name = "Setup" component={Setup}/>
    </Stack.Navigator>
  )
}

export const AppStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator screenOptions={() => navOptions(navigation)}>
      <Stack.Screen name="HomeTabs" component={TabLayout} />
    </Stack.Navigator>
  )
}