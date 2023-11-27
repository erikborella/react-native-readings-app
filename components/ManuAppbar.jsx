import { useContext, useState, useEffect } from 'react';
import {
    Appbar,
    Menu,
    useTheme
} from 'react-native-paper';

import { auth } from '../Firebase';

import { AppDarkTheme } from '../themes/AppDarkTheme';
import { AppLightTheme } from '../themes/AppLightTheme';

import { DynamicThemeContext } from '../contexts/DynamicThemeContext';

export function MenuAppbar() {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const { appTheme, setAppTheme } = useContext(DynamicThemeContext);

    const menuBarAction = <Appbar.Action icon='dots-vertical' onPress={openMenu} />;

    function signoutUser() {
        auth.signOut()
        .then(() => {
            console.log('User singouted');
        })
        .catch((error) => {
            console.log(error.message);
        })
    }

    function changeThemeToLight() {
        setAppTheme(AppLightTheme);
    }

    function changeThemeToDark() {
        setAppTheme(AppDarkTheme);
    }

    return (
        <Menu visible={visible} onDismiss={closeMenu} anchor={ menuBarAction }>
            { appTheme.dark === true ? 
                <Menu.Item title='Modo Claro' trailingIcon='white-balance-sunny' onPress={changeThemeToLight}/>
                :
                <Menu.Item title='Modo Escuro' trailingIcon='moon-waning-crescent' onPress={changeThemeToDark}/>
            }
            <Menu.Item title='Deslogar' trailingIcon='exit-run' onPress={signoutUser}/>
        </Menu>
    );
}