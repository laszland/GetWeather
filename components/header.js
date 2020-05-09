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
    width: '100%',
    justifyContent: 'flex-start'
  },
  headerText: {
    paddingTop: 20,
    paddingLeft: 12,
    fontFamily: 'nunito-extralight',
    fontSize: 36,
    fontWeight: '200',
    color: '#FFFFFF'
  }
})