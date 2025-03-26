import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {HeaderBackButton} from "@react-navigation/elements";
const EventDetailScreen = () => {
  const route = useRoute();
  const { eventId, eventTitle, eventDescription } = route.params;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
       headerTitle: "Detail Title",
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
        This Is The Event Detail Screen for Event {eventId}
      </Text>
      <Text style={{ fontSize: 20 }}>{eventTitle}</Text>
      <Text style={{ fontSize: 20 }}>{eventDescription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
});

export default EventDetailScreen;
