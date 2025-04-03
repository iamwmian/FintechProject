import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthenticationStack, HomeStack } from "./navigation/stack";
import "react-native-gesture-handler";
import { MyDrawer } from "./navigation/drawer";
import { StatusBar } from "expo-status-bar";
import useGlobal from "./core/global";

export default function App() {
  const initialized = useGlobal((state) => state.initialized);
  const authenticated = useGlobal((state) => state.authenticated);

  const init = useGlobal((state) => state.init);

  useEffect(() => {
    init();
    console.log("INit:? ", initialized, " Auth??", authenticated);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {/* <HomeStack/> */}
      {/* <MyDrawer/> */}

      {!initialized ? <MyDrawer /> : <AuthenticationStack />}
    </NavigationContainer>
  );
}
