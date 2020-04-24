import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home';
import DayDetails from '../screens/dayDetails';

const screens = {
  Home: {
    screen: Home,
  },
  DayDetails: {
    screen: DayDetails
  }
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);