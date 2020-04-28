import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class LocationItem extends PureComponent{

  render() {
    return (
      <View style={styles.root}>
        <Text>{this.props.description}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    height: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center'
  }
})