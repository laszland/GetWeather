import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function DayDetails({ navigation }) {
  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{navigation.getParam('day')}</Text>
      <Text>{navigation.getParam('temp')} ºC</Text>
      <Text>{navigation.getParam('description')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  detailContainer: {
    padding: 20,
    flex: 1,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});