import { View, Text } from 'react-native'
import React from 'react'
import { SignOutButton } from '../../components/SignOutButton'

export const Setup = ({navigation}) => {
  return (
    <View>
      <Text>Setup</Text>
      <SignOutButton/>
    </View>
  )
}

export default Setup