import React from 'react';
import { View,
         StyleSheet,
         TouchableWithoutFeedback,
         ImageBackground,
         TextInput,
         Keyboard,
         ScrollView,
         TouchableOpacity,
         Modal
         } from 'react-native';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import Header from '../components/header';
import CustomButton from '../components/button';
import LocationItem from '../components/locationItem';



export default function LocationModal({ modalOpen, city, closeModal, setCity, setCoordinates }) {
  return (
    <Modal visible={modalOpen}>
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
                                setCity(text);
                                handleTextChange(text);
                              }}
                              defaultValue={city}
                              style={styles.inputField}
                            />
                            <View style={styles.modalButton}>
                              <CustomButton
                                title='save'
                                onPress={closeModal}
                              />
                            </View>
                          </View>
                          <View style={styles.searchResultContainer}>
                            <ScrollView>
                              {locationResults.map(el => (
                                <TouchableOpacity onPress={async () => {
                                  setCity(el.description);
                                  const locationDetails = await fetchDetails(el.place_id);
                                  setCoordinates(locationDetails.geometry.location.lat, locationDetails.geometry.location.lng);
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
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
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
  modalButton: {
    marginTop: 12,
    marginBottom: 12
  },
  searchResultContainer: {
    width: 230,
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.75)'
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center'
  },
})