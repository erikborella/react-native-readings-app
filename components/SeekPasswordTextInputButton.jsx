import { TextInput } from 'react-native-paper';

export function createSeekPasswordTextInputButton(setState) {
    return (
        <TextInput.Icon icon='eye' 
            onPressIn={() => setState(false)} 
            onPressOut={() => setState(true)}/>
    )
}