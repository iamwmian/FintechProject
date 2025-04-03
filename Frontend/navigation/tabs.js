import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home-screen';
import QrCodeScreen from '../screens/qr-code-screen';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/SignIn/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { AuthenticationStack } from './stack';

const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
            backgroundColor: "black"
        },
        tabBarActiveTintColor : "teal",
        tabBarInactiveTintColor : "grey",
        tabBarIcon : ({focused, color, size}) => {
            let iconName;
            if (route.name == "HomeTabs") {
                iconName = focused ? 'home' : 'home-outline'
            }
            else if (route.name == "QrCode") {
                iconName = focused ? 'person' : 'person-outline'
            }

            return <Ionicons name={iconName} size = {focused ? size : size} color = {color}/>
        }
    })}>
      <Tab.Screen name="HomeTabs" options={{title:"Home"}} component={AuthenticationStack} />
      <Tab.Screen name="QrCode" component={SettingsScreen} />
    </Tab.Navigator>
  );
}