import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class LocationItem extends PureComponent{

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.text}>{this.props.description}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'nunito-regular',
    color: '#494949',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: 'normal',
    paddingLeft: 12,
    alignSelf: 'flex-start',
  }
})