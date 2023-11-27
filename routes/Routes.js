import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { MyBooksScreen } from '../screens/MyBooksScreen';
import { AddReadingScreen } from '../screens/books/AddReadingScreen';

import { AppDarkTheme } from '../themes/AppDarkTheme';
import { routesNames } from './RoutesNames';

import { auth } from '../Firebase';
import { useEffect, useState } from 'react';

import { MaterialAppbar } from '../components/MaterialAppbar';

import { BooksContext } from "../contexts/BooksContext"

const Stack = createStackNavigator();

export function Routes() {
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);

    function onAuthStateChanged(user) {
        setUser(user);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    return (
        <BooksContext.Provider value={{ books, setBooks }}>
            <NavigationContainer theme={AppDarkTheme}>
                <Stack.Navigator screenOptions={{ header: (props) => <MaterialAppbar {...props}/> }}>
                    { !user ? (
                        <>
                            <Stack.Screen name={routesNames.login} component={LoginScreen} options={{headerShown: false}} />
                            <Stack.Screen name={routesNames.signup} component={SignupScreen} options={{headerShown: false}} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name={routesNames.myBooks} component={MyBooksScreen} options={{headerShown: true}} initialParams={{ teste: true }} />
                            <Stack.Screen name={routesNames.addReading} component={AddReadingScreen} options={{headerShown: true}} initialParams={{ teste: true }} />
                        </>
                    ) }
                </Stack.Navigator>
            </NavigationContainer>
        </BooksContext.Provider>
    );
}