import { StyleSheet, Dimensions } from 'react-native';

export const globalStyles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover'
  },
  cardDay: {
    fontFamily: 'nunito-bold',
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'left',
    paddingLeft: 20
  },
  cardTemp: {
    fontFamily: 'nunito-extralight',
    fontSize: 25,
    color: '#FFFFFF'
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 20
  },
  cardContent: {
    width: Dimensions.get('window').width - 24,
    height: 68,
    marginTop: 20,
    marginHorizontal: 20,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 100, 105, 0.5)',
    flexDirection: 'row',
    borderRadius: 4
  }
});
