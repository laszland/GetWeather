import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';

export default function CustomButton({ title, onPress })  {
  return (
    <TouchableOpacity onPress={ onPress } style={styles.buttonContainer}>
      <Text style={styles.buttonTitle}>{ title.toUpperCase() }</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 80,
    height: 30,
    backgroundColor: '#186469',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitle: {
    fontFamily: 'nunito-extrabold',
    fontWeight: '800',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1.5
  }
});