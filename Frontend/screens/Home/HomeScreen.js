import { View, Text } from 'react-native'
import React from 'react'
import { SignOutButton } from '../../components/SignOutButton'

const HomeScreen = ({navigation}) => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <SignOutButton/>
    </View>
  )
}

export default HomeScreen