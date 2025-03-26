import React from 'react'
import { Text } from 'react-native'
import { View, StyleSheet } from 'react-native'

const QrCodeScreen = () => {
const styles = StyleSheet.create({
    screen : {
        padding: 20
    }
})
  return (
    <View style={styles.screen}>
        <Text>
            qr code scan
        </Text>
    </View>

  )
}

export default QrCodeScreen