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
    this.getCityAndCoordinates()
    getWeatherData(this.state.lat, this.state.lng)
      .then(data => {
        this.setState({ current: data.current,
                        hourly: data.hourly,
                        daily: data.daily })
      }
    );
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
    //console.log(this.state);
  };
  
  
  getCityAndCoordinates = async () => {
    try {
      const value = await AsyncStorage.multiGet(['city', 'lat', 'lng']);
      if (value !== null) {
        this.setState({ city: value[0][1], lat: parseFloat(value[1][1]), lng: parseFloat(value[2][1]) });
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

  
  render() {
    console.log('this is the actual state', this.state)
    const { current: { weather }} = this.state;
    console.log('weather data:', weather);
    
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

              <FlatList
                data={this.state.data}
                style={styles.list}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('DayDetails', item)}>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.day}</Text>
                      <Text>{item.temp} ºC</Text>
                      <Text>{item.description}</Text>
                    </View>
                  </TouchableOpacity >
                )}
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
    width: '100%',
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
});