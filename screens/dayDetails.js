import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global'

export default function DayDetails({ navigation }) {
  const current = navigation.getParam('current');
  const hourly = navigation.getParam('hourly')
  return (
    <ImageBackground source={require('../assets/backgrounds/details.jpg')} style={globalStyles.image}>
      <TouchableOpacity onPress={() => navigation.pop()}>
        <Image source={require('../assets/icons/return.png')} style={styles.icon}/>
      </TouchableOpacity>
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>{navigation.getParam('day')}</Text>
        <Text>{current.temp} ºC</Text>
        <Text>{navigation.getParam('description')}</Text>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  detailContainer: {
    padding: 20,
    flex: 1,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    marginTop: 60,
    width: 25,
    height: 25,
  }
});