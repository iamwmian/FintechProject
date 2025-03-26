import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, Text, Image } from "react-native";

const EventItem = ({ id, name, description, qrCode }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={style.card}
      onPress={() => {
        navigation.navigate("Event", {
          eventId: id,
          eventTitle: name,
          eventDescription: description,
        });
      }}
    >
      <Text>{name}</Text>
      <Text>{description}</Text>
      <Image style = {{width:100, height:100}} source={{uri: qrCode}} />
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    marginVertical: 5,
    padding: 30,
  },
});

export default EventItem;
