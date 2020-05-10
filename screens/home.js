import React from 'react'
import { StyleSheet,
         View,
         Text,
         Dimensions,
         FlatList,
         TouchableOpacity,
         AsyncStorage,
         ImageBackground,
         Image } from 'react-native';
import { getWeatherData } from '../services/weatherData';
import Header from '../components/header'
const moment = require('moment')
import { icons } from '../routes/iconRoutes';
import LocationModal from '../components/locationModal';
import Spinner from 'react-native-loading-spinner-overlay';


export default class Home extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      city: '',
      lat: 0,
      lng: 0,
      modalOpen: false,
      current: {},
      hourly: [],
      daily: [],
      spinner: true
    }
  }
  
  closeModal = async () => {
    const city = ['city', this.state.city];
    const lat = ['lat', this.state.lat.toString()];
    const lng = ['lng', this.state.lng.toString()];
    try {
      await AsyncStorage.multiSet([city, lat, lng]);
      const weatherData = await getWeatherData(this.state.lat, this.state.lng);
      this.setState({ modalOpen: false,
                      current: weatherData.current,
                      hourly: weatherData.hourly,
                      daily: weatherData.daily});
    } catch(err) {
      console.error(err);
    }
  };
  
  
  updateState = async () => {
    try {
      const value = await AsyncStorage.multiGet(['city', 'lat', 'lng']);
      if (value !== null) {
        this.setState({ city: value[0][1], lat: parseFloat(value[1][1]), lng: parseFloat(value[2][1]) });
        const weatherData = await getWeatherData(this.state.lat, this.state.lng);
        this.setState({ current: weatherData.current,
                        hourly: weatherData.hourly,
                        daily: weatherData.daily,
                        spinner: false});
      } else {
        this.setState({ modalOpen: true })
      }
    } catch(err) {
      console.error(err);
    }
  }
  
  openModal = () => {
    this.setState({ modalOpen: true })
  }

  setCity = (text) => {
    this.setState({ city: text })
  }

  setCoordinates = (lat, lng) => {
    this.setState({ lat, lng});
  }

  componentDidMount() {
    this.updateState();
  }
  
  render() {

    return (
          <ImageBackground source={require('../assets/backgrounds/weather-data.jpg')} style={styles.image}>
            <View style={styles.homeContainer}>
              <Header />
        
              <LocationModal
                modalOpen={this.state.modalOpen}
                city={this.state.city}
                closeModal={this.closeModal}
                setCity={this.setCity}
                setCoordinates={this.setCoordinates}
              />

              <Spinner 
                visible={this.state.spinner}
                animation='fade'
              />
        
              <TouchableOpacity style={styles.city} onPress={this.openModal}>
                <Text style={styles.cardTitle}>{this.state.city}</Text>
                <Image source={require('../assets/icons/draw.png')} style={styles.icon}/>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.currentWeatherContainer}>
                <Text style={styles.currentWeatherTemp}>{ parseInt(this.state.current.temp) || '--'}º</Text>
                <View style={styles.iconAndTextContainer}>
                  <Image source={require('../assets/icons/weather/01d.png')} style={styles.iconBig}/>
                  <Text style={styles.currentDescription}>sunny</Text>
                </View>
              </TouchableOpacity>

              <FlatList
                data={this.state.daily}
                style={styles.list}
                keyExtractor={item => item.dt.toString()}
                renderItem={({ item }) => {
                  const day = moment.unix(item.dt).format('dd');
                  const icon = item.weather[0].icon;
                  return (
                    <View >
                      <View style={styles.cardContent}>
                        <Text style={styles.cardDay}>{day}</Text>
                        <Text style={styles.cardTemp}>{parseInt(item.temp.min)}º / {parseInt(item.temp.max)}º</Text>
                        <Image source={icons[icon]} style={styles.cardIcon}/>
                      </View>
                    </View >
                )
              }}
              />
            </View>
          </ImageBackground>
      )
    }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  cardContent: {
    width: Dimensions.get('window').width-24,
    height: 68,
    marginTop: 20,
    marginHorizontal: 20,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 100, 105, 0.5)',
    flexDirection: 'row',
    borderRadius: 4
  },
  cardTitle: {
    fontFamily: 'nunito-extralight',
    fontWeight: '200',
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
    paddingLeft: 12,
    paddingRight: 10
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center'
  },
  homeContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  icon: {
    width: 14,
    height: 14,
  },
  city: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  currentWeatherContainer: {
    flexDirection: 'row',
    height: 130,
    width: Dimensions.get('window').width-24,
    backgroundColor: 'rgba(24, 100, 105, 0.9)',
    marginTop: 30,
    padding: 0,
    alignSelf: 'center',
    borderRadius: 4,
  },
  currentWeatherTemp: {
    fontFamily: 'nunito-extralight',
    fontSize: 96,
    color: '#FFFFFF',
    textAlign: 'left',
    textAlignVertical: 'center',
    lineHeight: 130,
    paddingLeft: 12,
    //backgroundColor: 'pink'
  },
  iconAndTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'pink'
  },
  iconBig: {
    width: 60,
    height: 60
  },
  currentDescription: {
    fontFamily: 'nunito-bold',
    fontSize: 14,
    marginTop: 5,
    color: '#FFFFFF'
  },
  cardDay: {
    fontFamily: 'nunito-bold',
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'left',
    paddingLeft: 20,
  },
  cardTemp: {
    fontFamily: 'nunito-extralight',
    fontSize: 25,
    color: '#FFFFFF',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
});