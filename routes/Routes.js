import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { MyBooksScreen } from '../screens/books/MyBooksScreen';
import { AddBookScreen } from '../screens/books/AddBookScreen';
import { AddReadingHistory } from '../screens/books/AddReadingHistory';

import { AppDarkTheme } from '../themes/AppDarkTheme';
import { routesNames } from './RoutesNames';

import { auth } from '../Firebase';
import { useEffect, useState } from 'react';

import { MaterialAppbar } from '../components/MaterialAppbar';

import { BooksContext } from "../contexts/BooksContext"
import { BookDetailScreen } from '../screens/books/BookDetailScreen';

const Stack = createStackNavigator();

export function Routes() {
    const [user, setUser] = useState(null);

    const [books, setBooks] = useState([]);
    const [bookReadingsHistory, setBookReadingsHistory] = useState([]);

    function onAuthStateChanged(user) {
        setUser(user);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    return (
        <BooksContext.Provider value={{ books, setBooks, bookReadingsHistory, setBookReadingsHistory }}>
            <NavigationContainer theme={AppDarkTheme}>
                <Stack.Navigator screenOptions={{ header: (props) => <MaterialAppbar {...props}/> }}>
                    { !user ? (
                        <>
                            <Stack.Screen name={routesNames.login} component={LoginScreen} options={{headerShown: false}} />
                            <Stack.Screen name={routesNames.signup} component={SignupScreen} options={{headerShown: false}} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name={routesNames.myBooks} component={MyBooksScreen} options={{headerShown: true}} />
                            <Stack.Screen name={routesNames.addReading} component={AddBookScreen} options={{headerShown: true}} />
                            <Stack.Screen name={routesNames.viewReading} component={BookDetailScreen} options={{headerShown: true}} />
                            <Stack.Screen name={routesNames.addReadingHistory} component={AddReadingHistory} options={{headerShown: true}} />
                        </>
                    ) }
                </Stack.Navigator>
            </NavigationContainer>
        </BooksContext.Provider>
    );
}