import React from 'react'
import { StyleSheet,
         View,
         Text,
         Dimensions,
         FlatList,
         TouchableOpacity,
         Modal,
         Button,
         TextInput,
         AsyncStorage,
         ScrollView,
         ImageBackground,
         TouchableWithoutFeedback,
         Keyboard,
         Image } from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from '../components/locationItem';
import { getWeatherData } from '../services/weatherData';
import CustomButton from '../components/button';
import Header from '../components/header'
const moment = require('moment')


export default class Home extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      data: [
        { day: 'monday', temp: 21, description: 'cloudy', key: '1' },
        { day: 'thuesday', temp: 22, description: 'sunny', key: '2' },
        { day: 'wednesday', temp: 22, description: 'sunny', key: '3' },
        { day: 'thursday', temp: 19, description: 'cloudy', key: '4' },
        { day: 'friday', temp: 18, description: 'rainy', key: '5' }
      ],
      city: '',
      lat: 0,
      lng: 0,
      modalOpen: false,
      current: {},
      hourly: [],
      daily: [],
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
                        daily: weatherData.daily });
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

  componentDidMount() {
    this.updateState();
  }
  
  render() {

    return (
          <ImageBackground source={require('../assets/backgrounds/weather-data.jpg')} style={styles.image}>
            <View style={styles.homeContainer}>
              <Header />
        
              <Modal visible={this.state.modalOpen}>
                <GoogleAutoComplete apiKey='AIzaSyD_ImLpIpgxe59dO5YInbCYjf9as1lk8rs' // ! TODO: hide api_key
                                    debounce={500}
                                    minLength={3}
                                    queryTypes='(cities)'
                                    >
                  {({ handleTextChange, locationResults, fetchDetails, clearSearch }) => (
                    <React.Fragment>
                      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ImageBackground source={require("../assets/backgrounds/location-select.jpg")} style={styles.image}>
                          <Header />
                          <View style={styles.inputContainer}>
                            <TextInput
                              placeholder='type your location'
                              onChangeText={text => {
                                this.setState({'city': text}),
                                handleTextChange(text)
                              }}
                              defaultValue={this.state.city}
                              style={styles.inputField}
                              value={this.state.city}
                            />
                            <View style={styles.modalButton}>
                              <CustomButton
                                title='save'
                                onPress={this.closeModal}
                              />
                            </View>
                          </View>
                          <View style={styles.searchResultContainer}>
                            <ScrollView>
                              {locationResults.map(el => (
                                <TouchableOpacity onPress={async () => {
                                  this.setState({ 'city': el.description });
                                  const locationDetails = await fetchDetails(el.place_id);
                                  this.setState({ lat: locationDetails.geometry.location.lat, lng: locationDetails.geometry.location.lng })
                                  clearSearch();
                                }} key={el.id}>
                                  <LocationItem 
                                    {...el}
                                  />
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        </ImageBackground>
                      </TouchableWithoutFeedback>
                    </ React.Fragment>
                  )}
                </GoogleAutoComplete>
              </Modal>
        
              <TouchableOpacity style={styles.city} onPress={this.openModal}>
                <Text style={styles.cardTitle}>{this.state.city}</Text>
                <Image source={require('../assets/icons/draw.png')} style={styles.icon}/>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.currentWeatherContainer}>
                <Text style={styles.currentWeatherTemp}>{ parseInt(this.state.current.temp) }º</Text>
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
                  const day = moment.unix(item.dt).format('dd')
                  return (
                    <View >
                      <View style={styles.cardContent}>
                        <Text style={styles.cardDay}>{day}</Text>
                        <Text style={styles.cardTemp}>{parseInt(item.temp.min)}/{parseInt(item.temp.max)} ºC</Text>
                        <Text style={styles.cardTitle}>{item.weather[0].icon}</Text>
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
    flexDirection: 'row'
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
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalButton: {
    marginTop: 12,
    marginBottom: 12
  },
  inputField: {
    marginTop: 142,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    width: 230,
    height: 40,
    fontFamily: 'nunito-regular',
    color: '#494949',
    fontSize: 13,
    lineHeight: 16,
    paddingHorizontal: 12
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center'
  },
  searchResultContainer: {
    width: 230,
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.75)'
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
    backgroundColor: 'rgba(24, 100, 105, 0.5)',
    marginTop: 30,
    padding: 0,
    alignSelf: 'center',
  },
  currentWeatherTemp: {
    fontFamily: 'nunito-extralight',
    fontSize: 96,
    color: '#FFFFFF',
    textAlign: 'left',
    textAlignVertical: 'center',
    lineHeight: 130,
    paddingLeft: 12
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
    fontFamily: 'nunito-extralight',
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'left',
    paddingLeft: 12,
  },
  cardTemp: {
    fontFamily: 'nunito-extralight',
    fontSize: 45,
    color: '#FFFFFF',
  },
});