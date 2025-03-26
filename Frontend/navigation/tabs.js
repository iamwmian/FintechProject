import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home-screen';
import QrCodeScreen from '../screens/qr-code-screen';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/SignIn/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

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
                iconName = focused ? 'qr-code' : 'qr-code-outline'
            }

            return <Ionicons name={iconName} size = {focused ? size : size} color = {color}/>
        }
    })}>
      <Tab.Screen name="HomeTabs" options={{title:"Home"}} component={SettingsScreen} />
      <Tab.Screen name="QrCode" component={QrCodeScreen} />
    </Tab.Navigator>
  );
}