import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Navigator from './routes/homeStack';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

const getFont = () => Font.loadAsync({
  'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
  'nunito-extralight': require('./assets/fonts/Nunito-ExtraLight.ttf'),
  'nunito-extralight-italic': require('./assets/fonts/Nunito-ExtraLightItalic.ttf'),
  'nunito-italic': require('./assets/fonts/Nunito-Italic.ttf'),
  'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
  'nunito-extrabold': require('./assets/fonts/Nunito-ExtraBold.ttf')
});

export default function App () {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (fontsLoaded) {
    return (
      <View style={styles.container}>
        <Navigator />
      </View>
    );
  } else {
    return (
      <AppLoading
        startAsync={getFont}
        onFinish={() => setFontsLoaded(true)}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
