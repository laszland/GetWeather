import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native';

export default function Home() {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeText}>Home Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#deeaee',
    paddingTop: 40,
    width: Dimensions.get('screen').width,
    paddingLeft: 20,
  },
  homeText: {
    fontWeight: 'bold'
  }
});