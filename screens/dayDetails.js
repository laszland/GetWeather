import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, Dimensions, FlatList, ScrollView } from 'react-native';
import { globalStyles } from '../styles/global';
import { LineChart } from 'react-native-chart-kit'
import moment from 'moment'
import { icons } from '../routes/iconRoutes';

export default function DayDetails({ navigation }) {
  const current = navigation.getParam('current');
  const hourly = navigation.getParam('hourly')

  const labels = [];
  const dataSet = [];

  for (let i = 0; i < 24; i+=3) {
    labels.push(moment.unix(hourly[i].dt).format('H:mm'));
    dataSet.push(parseInt(hourly[i].temp));
  }

  return (
    <ImageBackground source={require('../assets/backgrounds/details.jpg')} style={globalStyles.image}>
      <ScrollView>

        <TouchableOpacity onPress={() => navigation.pop()} style={styles.backIconContainer}>
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
        withInnerLines={true}
        withOuterLines={false}
        fromZero={true}
        yAxisSuffix={'°'}
        yLabelsOffset={5}
        xLabelsOffset={0}
        bezier
        verticalLabelRotation={45}
        chartConfig={{
          backgroundGradientFromOpacity: 0,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0)',
          },
          propsForDots: {
            r: 2
          },
        }}
        />

        <View>

          <FlatList 
            data={hourly}
            keyExtractor={item => item.dt.toString()}
            style={styles.detailsContainer}
            renderItem={({ item }) => {
              const hour = moment.unix(item.dt).format('H:mm');
              const temp = parseInt(item.temp);
              const icon = item.weather[0].icon;
              return (
                <View style={globalStyles.cardContent}>
                  <Text style={globalStyles.cardDay}>{ hour }</Text>
                  <Text style={globalStyles.cardTemp}>{ temp }°</Text>
                  <Image source={icons[icon]} style={globalStyles.cardIcon}/>
                </View>
              )
            }}
          />
        </View>
      </ScrollView>
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
  backIconContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 30,
    marginLeft: 12,
    alignSelf: 'flex-start'
  },
  icon: {
    marginTop: 60,
    width: 25,
    height: 25,
  },
  weatherIcon: {
    width: 40,
    height: 40
  },
  detailsContainer: {
    //backgroundColor: 'pink',
    marginTop: 30,
    flexDirection: 'column'
  },
  listItem: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-around',
    marginTop: 10
  }
});