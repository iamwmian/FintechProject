import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import EventList from "../components/event-list";
import axios from 'axios';
const HomeScreen = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async() => {
    try {
      const response = await axios.get('http://localhost:8000/api/events/');
      console.log(response.data)
  
      setData(response.data)
    } catch (error) {
      
    }

  }

  //const navigation = useNavigation();
  return (
    <View style={styles.screen}>
      <EventList data={data}/>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
});

export default HomeScreen;
