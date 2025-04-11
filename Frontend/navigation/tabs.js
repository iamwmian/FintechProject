import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import QrCodeScreen from '../screens/qr-code-screen';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/SignIn/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { AuthenticationStack } from './stack';
import ProfileDetailScreen from '../screens/profiles/profiles-detail-screen';
import { COLORS } from '../common/theme';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export const TabLayout = () => {
  return (
    <Tab.Navigator screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: tabBarStyles,
        tabBarActiveTintColor : COLORS.background,
        tabBarInactiveTintColor : COLORS.surface,
        tabBarIcon : ({focused, color, size}) => {
            let iconName;
            if (route.name == "Home") {
                iconName = focused ? 'home' : 'home-outline'
            }
            else if(route.name == "Profile") {
                iconName = `person${focused ? "" : "-outline"}`
            }

            return <Ionicons name={iconName} size = {focused ? size : size} color = {color}/>
        }
    })}>
      <Tab.Screen name="Home" options={{title:"Home"}} component={HomeScreen} />
      <Tab.Screen name="Profile" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const tabBarStyles = StyleSheet.create({
  backgroundColor: COLORS.black,
  borderTopWidth: 0,
  position: "absolute",
  elevation: 0,
  height: 40,
  paddingBottom: 8, // might make it 0
})