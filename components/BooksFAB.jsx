import { useState } from 'react';
import { AnimatedFAB } from 'react-native-paper';

import { routesNames } from '../routes/RoutesNames';

export function BooksFAB({ navigation, extended }) {
    function navigateToAddReading() {
        navigation.navigate(routesNames.addReading);
    }

    return (
        <AnimatedFAB
            icon='book-plus-outline'
            label='Adicionar Leitura'
            extended={extended}
            animateFrom='right'
            iconMode='dynamic'
            variant='primary'
            onPress={navigateToAddReading}
            style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}/>
    );
}