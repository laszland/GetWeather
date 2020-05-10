import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native';
import { globalStyles } from '../styles/global';
import { LineChart } from 'react-native-chart-kit'
import moment from 'moment'

export default function DayDetails({ navigation }) {
  const current = navigation.getParam('current');
  const hourly = navigation.getParam('hourly')

  const labels = [];
  const dataSet = [];

  for (let i = 0; i < 24; i++) {
    labels.push(moment.unix(hourly[i].dt).format('H:mm'));
    dataSet.push(parseInt(hourly[i].temp));
  }

  return (
    <ImageBackground source={require('../assets/backgrounds/details.jpg')} style={globalStyles.image}>
      <TouchableOpacity onPress={() => navigation.pop()}>
        <Image source={require('../assets/icons/return.png')} style={styles.icon}/>
      </TouchableOpacity>
      <LineChart
      data={{
        labels: labels,
        datasets: [
          {
            data: dataSet
          }
        ]
      }}
      width={Dimensions.get('window').width-24}
      height={300}
      chartConfig={{
        backgroundGradientFromOpacity: 0,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0)'
        },
        propsForDots: {
          r: 2
        },
      }}
      />
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