import { Appbar } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import { MenuAppbar } from './ManuAppbar';

export function MaterialAppbar({ navigation, route, options, back }) {
    const title = getHeaderTitle(options, route.name);

    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={title} />
            <MenuAppbar />
        </Appbar.Header>
    );
}