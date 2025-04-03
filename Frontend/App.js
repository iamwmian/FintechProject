import React, { useEffect, useState } from "react";
import { NavigationContainer, Sta } from "@react-navigation/native";
import { AuthenticationStack, HomeStack, ProfileStack } from "./navigation/stack";
import "react-native-gesture-handler";
import { View, Text } from "react-native";
import { MyDrawer } from "./navigation/drawer";
import { StatusBar } from "expo-status-bar";
import useGlobal from "./core/global";
import * as SecureStore from 'expo-secure-store';
import ProfileDetailScreen from "./screens/profiles/profiles-detail-screen";
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

      {/* {!initialized ? <MyDrawer /> : <AuthenticationStack />} */}
      {!initialized ? (
        <>
          <View><Text>SPLASH!</Text></View>
        </>
      ) : !authenticated ? (
        <><AuthenticationStack /></>
      ) : (
        <>
        <ProfileStack/>
        </>
      )
    }
    </NavigationContainer>
  );

 
}
