import { useState } from 'react';
import { AnimatedFAB } from 'react-native-paper';

export function BooksFAB({extended}) {
    return (
        <AnimatedFAB
            icon='book-plus-outline'
            label='Adicionar Leitura'
            extended={extended}
            animateFrom='right'
            iconMode='dynamic'
            variant='primary'
            style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}/>
    );
}