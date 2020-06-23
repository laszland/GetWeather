import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home';
import DayDetails from '../screens/dayDetails';

const screens = {
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Home',
      headerShown: false
    }
  },
  DayDetails: {
    screen: DayDetails,
    navigationOptions: {
      title: 'DayDetails',
      headerShown: false
    }
  }
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
