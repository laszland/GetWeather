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
         Keyboard } from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from '../components/locationItem';
import { getWeatherData } from '../services/weatherData';
import CustomButton from '../components/button';


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
      weatherData: {}
    }
    this.getCityAndCoordinates()
    getWeatherData(this.state.lat, this.state.lng)
      .then(data => {
        this.setState({ weatherData: data })
        console.log(this.state);
      });
  }
  
  
  closeModal = async () => {
    const city = ['city', this.state.city];
    const lat = ['lat', this.state.lat.toString()];
    const lng = ['lng', this.state.lng.toString()];
    try {
      await AsyncStorage.multiSet([city, lat, lng]);
      const weatherData = await getWeatherData(this.state.lat, this.state.lng);
      this.setState({ modalOpen: false, weatherData });
    } catch(err) {
      console.error(err);
    }
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
    
    return (
          <View style={styles.homeContainer}>
      
            <Button
              title='open'
              onPress={this.openModal}
            />
      
            <Modal visible={this.state.modalOpen}>
              <GoogleAutoComplete apiKey='AIzaSyD_ImLpIpgxe59dO5YInbCYjf9as1lk8rs' // ! TODO: hide api_key
                                  debounce={500}
                                  minLength={3}
                                  queryTypes='(cities)'
                                  >
                {({ handleTextChange, locationResults, fetchDetails }) => (
                  <React.Fragment>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                      <ImageBackground source={require("../assets/backgrounds/location-select.jpg")} style={styles.image}>
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
                        <View style={styles.searchResultContainer}>
                          <ScrollView>
                            {locationResults.map(el => (
                              <TouchableOpacity onPress={async () => {
                                this.setState({ 'city': el.description });
                                const locationDetails = await fetchDetails(el.place_id);
                                console.log(locationDetails);
                                this.setState({ lat: locationDetails.geometry.location.lat, lng: locationDetails.geometry.location.lng })
                              }} key={el.id}>
                                <LocationItem 
                                  {...el}
                                />
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                        <View style={styles.modalSaveButton}>
                          <CustomButton
                            title='save'
                            onPress={this.closeModal}
                          />
                        </View>
                      </ImageBackground>
                    </TouchableWithoutFeedback>
                  </ React.Fragment>
                )}
              </GoogleAutoComplete>
            </Modal>
      
            <Text style={styles.cardTitle}>{this.state.city}</Text>
            <Text style={styles.cardTitle}> coordinates: {this.state.lat}; {this.state.lng} </Text>
      
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
      )
    }
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
  },
  inputField: {
    position: 'absolute',
    top: 142,
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchResultContainer: {
    width: 230,
    position: 'absolute',
    top: 218,
    backgroundColor: 'rgba(255, 255, 255, 0.75)'
  },
  modalSaveButton: {
    position: 'absolute',
    top: 500
  }
});