import "react-native-gesture-handler";
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import Navigation from './Navigation';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const loadResources = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));

      await SplashScreen.hideAsync();
    };

    loadResources();
  }, []); 

  return (
    <Navigation />
  );
}
