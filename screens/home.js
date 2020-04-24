import React from 'react'
import { StyleSheet, View, Text, Dimensions, FlatList, TouchableOpacity } from 'react-native';

const data = [
  { day: 'monday', temp: 21, description: 'cloudy', key: '1' },
  { day: 'thuesday', temp: 22, description: 'sunny', key: '2' },
  { day: 'wednesday', temp: 22, description: 'sunny', key: '3' },
  { day: 'thursday', temp: 19, description: 'cloudy', key: '4' },
  { day: 'friday', temp: 18, description: 'rainy', key: '5' }];

  
  export default function Home({ navigation }) {

    const pressHandler = () => {
      navigation.push('DayDetails');
    }
    return (
    <View style={styles.homeContainer}>
      <FlatList
        data={data}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={pressHandler}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.day}</Text>
              <Text>{item.temp} ºC</Text>
              <Text>{item.description}</Text>
            </View>
          </TouchableOpacity >
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    width: Dimensions.get('screen').width,
    paddingLeft: 20,
  },
  homeText: {
    fontWeight: 'bold'
  },
  list: {
    flex: 1
  },
  cardContent: {
    width: 200,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#999',
    marginTop: 20,
    marginHorizontal: 20,
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});