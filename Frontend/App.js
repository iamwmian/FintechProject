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
  SetupStack,
  SplashStack,
} from "./navigation/stack";
import "react-native-gesture-handler";
import {useAuthStore} from "./core/global";
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
  const isNewUser = useAuthStore((state) => state.isNewUser);
  if (!isLoaded) return null; // or a splash screen
  console.log("Is New User: ", isNewUser);
  // instead of using the clerk sign in, I might just check if my token exists
  // also for the init logic, I'll verify my token on the backend and if invalid then call to reset it else continue to main app.
  return (
    <NavigationContainer>
      {!isSignedIn ? (
        <AuthenticationStack />
      ) : (
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            {isNewUser ? <SetupStack /> : <AppStack />}
          </SafeAreaView>
        </SafeAreaProvider>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  const hydrated = useAuthStore((state) => state.hydrated);
  useEffect(() => {
    console.log("Calling hydrate")
    useAuthStore.getState().hydrate();
  }, []);

  if (!hydrated) {
    return (
      <NavigationContainer>
         <SplashStack />
      </NavigationContainer>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <RootNavigator />
    </ClerkProvider>
  );
}
