import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, Dimensions, ScrollView, FlatList } from 'react-native';
import { globalStyles } from '../styles/global';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import { icons } from '../routes/iconRoutes';

export default function DayDetails ({ navigation }) {
  const current = navigation.getParam('current');
  const hourly = navigation.getParam('hourly');

  const labels = [];
  const dataSet = [];
  const hourly24 = [];

  for (let i = 0; i < 24; i += 3) {
    labels.push(moment.unix(hourly[i].dt).format('H:mm'));
    dataSet.push(parseInt(hourly[i].temp));
    hourly24.push(hourly[i]);
  }

  const Item = ({ item }) => {
    const hour = moment.unix(item.dt).format('H:mm');
    const temp = parseInt(item.temp);
    const icon = item.weather[0].icon;
    return (
      <View style={{ ...globalStyles.cardContent, ...styles.itemContainer }}>
        <Text style={globalStyles.cardDay}>{hour}</Text>
        <Text style={globalStyles.cardTemp}>{temp}°</Text>
        <Image source={icons[icon]} style={globalStyles.cardIcon} />
      </View>
    );
  };

  return (
    <ImageBackground source={require('../assets/backgrounds/details.jpg')} style={globalStyles.image}>
      <View>
        <ScrollView>
          <TouchableOpacity onPress={() => navigation.pop()} style={styles.backIconContainer}>
            <Image source={require('../assets/icons/return.png')} style={styles.icon} />
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
            width={Dimensions.get('window').width - 24}
            height={300}
            withInnerLines
            withOuterLines={false}
            fromZero
            yAxisSuffix='°'
            yLabelsOffset={5}
            xLabelsOffset={0}
            bezier
            verticalLabelRotation={45}
            chartConfig={{
              backgroundGradientFromOpacity: 0,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: 2
              }
            }}
          />

          <View>
            <FlatList
              data={hourly24}
              keyExtractor={item => item.dt.toString()}
              style={styles.detailsContainer}
              renderItem={({ item }) => <Item item={item} />}
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    margin: 20,
    flex: 1
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold'
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
    height: 25
  },
  weatherIcon: {
    width: 40,
    height: 40
  },
  detailsContainer: {
    marginTop: 30,
    flexDirection: 'column'
  },
  listItem: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-around',
    marginTop: 10
  },
  itemContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  }
});
