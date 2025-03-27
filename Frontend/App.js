import { NavigationContainer } from "@react-navigation/native";
import { AuthenticationStack, HomeStack } from "./navigation/stack";
import 'react-native-gesture-handler';
import { MyDrawer } from "./navigation/drawer";
import { StatusBar } from "expo-status-bar";


export default function App() {
  return (
    <NavigationContainer>
      <HomeStack/>
      {/* <MyDrawer/> */}
      {/* <AuthenticationStack/>
      <StatusBar style="light"/> */}
    </NavigationContainer>
  );
}