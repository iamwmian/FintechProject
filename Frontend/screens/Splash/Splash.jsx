import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../common/theme';

const Splash = ({ navigation }) => {
  
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash-screen-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>Fintech App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default Splash;
