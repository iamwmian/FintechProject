import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
  useAuth,
} from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import {
  AuthenticationStack,
  ProfileStack,
  SplashStack,
} from "./navigation/stack";
import "react-native-gesture-handler";
import { View, Text } from "react-native";
import { MyDrawer } from "./navigation/drawer";
import { StatusBar } from "expo-status-bar";
import useGlobal from "./core/global";
import * as SecureStore from "expo-secure-store";
import ProfileDetailScreen from "./screens/profiles/profiles-detail-screen";
import Splash from "./screens/Splash/Splash";
import { SignOutButton } from "./components/SignOutButton";
import { NewLogin } from "./screens/SignIn/new-login";
import { AppStack } from "./navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const RootNavigator = () => {
  const { isSignedIn, isLoaded } = useAuth(); // or your custom auth state

  if (!isLoaded) return null; // or a splash screen

  return (
    <NavigationContainer>
      {isSignedIn ? (
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <AppStack />
          </SafeAreaView>
        </SafeAreaProvider>
      ) : (
        <AuthenticationStack />
      )}
    </NavigationContainer>
  );
};

export default function App() {
  const initialized = useGlobal((state) => state.initialized);
  const authenticated = useGlobal((state) => state.authenticated);

  const init = useGlobal((state) => state.init);


  useEffect(() => {
    init();
    console.log("INit:? ", initialized, " Auth??", authenticated);
  }, []);

  return (
    <ClerkProvider tokenCache={tokenCache}>
      {/* <NavigationContainer>
        <StatusBar style="dark" />
        <SignedIn>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <AppStack />
            </SafeAreaView>
          </SafeAreaProvider>
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <AuthenticationStack />
        </SignedOut>
      </NavigationContainer> */}
      <RootNavigator/>
    </ClerkProvider>
  );
}
