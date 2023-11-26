import { useState } from 'react';
import { View } from 'react-native';
import { 
    Button, 
    Card, 
    Icon, 
    Text, 
    TextInput, 
    useTheme,
    HelperText,
} from "react-native-paper";

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase';

import { createSeekPasswordTextInputButton } from '../../components/SeekPasswordTextInputButton';

export function SignupScreen({navigation}) {
    const theme = useTheme();

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [hidePasswordText, setHidePasswordText] = useState(true);
    const showPasswordButtonComponent = createSeekPasswordTextInputButton(setHidePasswordText);

    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [hidePasswordConfirmText, setHidePasswordConfirmText] = useState(true);
    const showPasswordConfirmButtonComponent = createSeekPasswordTextInputButton(setHidePasswordConfirmText);

    const [wasSignupPressed, setWasSignupPressed] = useState(false);

    const getPasswordError = () => {
        if (!password || !passwordConfirm)
            return null;

        if (password !== passwordConfirm) {
            return 'As senhas não estão iguais';
        }
    }

    const getFieldsError = () => {
        if (!wasSignupPressed)
            return null;

        if (!email || !password || !passwordConfirm) {
            return 'Preencha todos os campos';
        }
    }

    const getError = () => {
        return getPasswordError() ||
               getFieldsError();
    }

    function navigateBackToLogin() {
        navigation.goBack();
    }

    function signupNewUser() {
        setWasSignupPressed(true);

        if (!!getError()) {
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("User signIn");
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center'}}>
            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300}}>
                <Text style={{ color: theme.colors.text }}>Bem vindo ao</Text>
                <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                    <Text style={{color: theme.colors.primary, paddingHorizontal: 5}} variant="displayMedium">Leituras</Text>
                    <Icon source="book-open-variant" color={theme.colors.primary} size={40} />
                </View>
            </View>

            <Card mode="outlined" style={{ width: '80%' }}>
                <Card.Title style={{ padding: 15 }} title="Cadastrar" titleVariant="headlineLarge"/>
                <Card.Content style={{ display: "flex", height: 250, justifyContent: "space-evenly" }}>
                    <TextInput autoComplete='username' keyboardType='email-address'  textContentType='emailAddress' onChangeText={text => setEmail(text)} mode="outlined" label="Email" />
                    <TextInput autoComplete='new-password' textContentType='password' onChangeText={text => setPassword(text)} secureTextEntry={hidePasswordText} mode="outlined" label="Senha" right={showPasswordButtonComponent} error={!!getPasswordError()} />
                    <TextInput autoComplete='new-password' onChangeText={text => setPasswordConfirm(text)} secureTextEntry={hidePasswordConfirmText} mode="outlined" label="Confirme a senha" right={showPasswordConfirmButtonComponent} error={!!getPasswordError()} />
                    <HelperText visible={!!getError()} type='error'>{getError()}</HelperText>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={navigateBackToLogin}>Login</Button>
                    <Button onPress={signupNewUser} icon='arrow-right'>Cadastrar</Button>
                </Card.Actions>
            </Card>
        </View>
    );
}