import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, View, Button } from 'react-native';

const ProfileScreen = () => {
    const navigation = useNavigation();
  return (
    <View>
        <Text>Profiles Screen</Text>
        <Button title="some profile" onPress={() => navigation.navigate("Profile", {profileId: 1 })}/>
    </View>
  )
}

export default ProfileScreen