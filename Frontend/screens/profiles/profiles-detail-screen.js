import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {HeaderBackButton} from "@react-navigation/elements";
const ProfileDetailScreen = () => {
  const route = useRoute();
  const { profileId } = route.params;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
       headerLeft: () => (
          <HeaderBackButton
            tintColor="white"
            onPress={() => {navigation.goBack()}}
          />
       )
    })
  }, [])
  return (
    <View style={styles.screen}>
      <Text style={{ fontSize: 20 }}>
        Profile ID : {profileId}
      </Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
});

export default ProfileDetailScreen;
