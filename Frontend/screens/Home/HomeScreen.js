import { View, Text } from "react-native";
import React from "react";
import { SignOutButton } from "../../components/SignOutButton";
import { useAuthStore } from "../../core/global";
const HomeScreen = ({ navigation }) => {
  const user = useAuthStore.getState().user;
    const userId = user.id;
    const {first_name} = user;
  return (
    <View>
      <Text>Home Screen</Text>
      <Text>Hello {first_name}</Text>
      <SignOutButton />
    </View>
  );
};

export default HomeScreen;
