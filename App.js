import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { AppDarkTheme } from './themes/AppDarkTheme';
import { AppLightTheme } from './themes/AppLightTheme';

import { Routes } from './routes/Routes';

const theme = AppDarkTheme;

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style={theme.dark === true ? 'light':'dark'}/>
      <Routes/>
    </PaperProvider>
  );
}