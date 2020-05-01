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
         ScrollView } from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from '../components/locationItem';
import { getWeatherData } from '../services/weatherData';


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
    } catch(err) {
      console.error(err);
    }
    this.setState({ modalOpen: false });
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
                     <TextInput
                      placeholder='Type your city'
                      onChangeText={text => {
                        this.setState({'city': text}),
                        handleTextChange(text)
                      }}
                      defaultValue={this.state.city}
                      style={styles.inputField}
                      value={this.state.city}
                    />
                    <Button
                      title='close'
                      onPress={this.closeModal}
                    />

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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'blue',
    paddingHorizontal: 16,
    marginTop: 60,
  }
});