import { useContext, useState, useEffect } from 'react';
import {
    Appbar,
    Menu,
    useTheme
} from 'react-native-paper';

import { auth } from '../Firebase';

export function MenuAppbar() {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

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

    return (
        <Menu visible={visible} onDismiss={closeMenu} anchor={ menuBarAction }>
            <Menu.Item title='Deslogar' trailingIcon='exit-run' onPress={signoutUser}/>
        </Menu>
    );
}