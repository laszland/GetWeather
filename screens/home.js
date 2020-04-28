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
        modalOpen: false
      }
      this.getCity()
    }

    closeModal = async () => {
      try {
        await AsyncStorage.setItem('city', this.state.city)
        this.setState({ modalOpen: false });
      } catch(err) {
        console.log(err);
      }
    };


    getCity = async () => {
      try {
        const value = await AsyncStorage.getItem('city');
        if (value !== null) {
          this.setState({ city: value })
        } else {
          this.setState({ modalOpen: true })
        }
      } catch(err) {
        console.log(err);
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
              <GoogleAutoComplete apiKey='AIzaSyD_ImLpIpgxe59dO5YInbCYjf9as1lk8rs'
                                  debounce={500}
                                  minLength={3}
                                  queryTypes='(cities)'
                                  >
                {({ handleTextChange, locationResults, inputValue }) => (
                  <React.Fragment>
                    { console.log('location result:', locationResults) }
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
                        <TouchableOpacity onPress={() => this.setState({ 'city': el.description })} key={el.id}>
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