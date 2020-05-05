import React from 'react';
import { StyleSheet, View, Text } from 'react-native'

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>C°ELZIUS</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  headerText: {
    paddingTop: 12,
    paddingLeft: 12,
    fontFamily: 'nunito-extralight',
    fontSize: 36,
    fontWeight: '200',
    color: '#FFFFFF'
  }
})