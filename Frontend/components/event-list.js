import React from "react";
import { Text, View, FlatList, RefreshControl } from "react-native";

import EventItem from "./event-item";
const EventList = ({data}) => {
  const renderItem = ({ item }) => {
    return (
      <EventItem
        id={item.id}
        name={item.name}
        description={item.description}
        qrCode = {item.qr_code}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => console.log("Refreshing")}
          />
        }
      />
    </View>
  );
};

export default EventList;
