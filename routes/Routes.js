import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { MyBooksScreen } from '../screens/MyBooksScreen';

import { AppDarkTheme } from '../themes/AppDarkTheme';
import { routesNames } from './RoutesNames';

import { auth } from '../Firebase';
import { useEffect, useState } from 'react';

import { MaterialAppbar } from '../components/MaterialAppbar';

const Stack = createStackNavigator();

export function Routes() {
    const [user, setUser] = useState(null);

    function onAuthStateChanged(user) {
        setUser(user);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    return (
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
                    </>
                ) }
            </Stack.Navigator>
        </NavigationContainer>
    );
}