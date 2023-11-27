import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { AppDarkTheme } from './themes/AppDarkTheme';
import { AppLightTheme } from './themes/AppLightTheme';

import { DynamicThemeContext } from './contexts/DynamicThemeContext';

import { Routes } from './routes/Routes';
import { useState } from 'react';

export default function App() {
  const [appTheme, setAppTheme] = useState(AppDarkTheme);

  return (
    <DynamicThemeContext.Provider value={{ appTheme, setAppTheme }}>
      <PaperProvider theme={appTheme}>
        <StatusBar style={appTheme.dark === true ? 'light':'dark'}/>
        <Routes/>
      </PaperProvider>
    </DynamicThemeContext.Provider>
  );
}