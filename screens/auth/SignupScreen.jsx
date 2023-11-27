import { useEffect, useState, useContext } from 'react';
import { View } from 'react-native';
import { 
    Button, 
    Card, 
    Icon, 
    Text, 
    TextInput, 
    useTheme,
    HelperText,
    IconButton
} from "react-native-paper";

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase';

import { DynamicThemeContext } from '../../contexts/DynamicThemeContext';
import { AppDarkTheme } from '../../themes/AppDarkTheme';
import { AppLightTheme } from '../../themes/AppLightTheme';

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

    const [isFormValid, setIsFormValid] = useState(false);
    const [formError, setFormError] = useState();

    const { appTheme, setAppTheme } = useContext(DynamicThemeContext);

    function changeThemeToLight() {
        setAppTheme(AppLightTheme);
    }

    function changeThemeToDark() {
        setAppTheme(AppDarkTheme);
    }

    useEffect(() => {
        validateForm();
    }, [email, password, passwordConfirm, wasSignupPressed]);

    function validatePasswordFields() {
        if (!password || !passwordConfirm)
            return null;

        if (password !== passwordConfirm) {
            return 'As senhas não estão iguais';
        }
    }

    function validateForm() {
        const passwordValidation = validatePasswordFields();

        if (!!passwordValidation) {
            setIsFormValid(false);
            setFormError(passwordValidation);

            return;
        }

        if (!email || !password || !passwordConfirm) {
            setIsFormValid(false);

            if (!wasSignupPressed) {
                setFormError(null);
                return;
            }

            setFormError('Preencha todos os campos');
            return;
        }
        
        setIsFormValid(true);
        setFormError(null);
    }

    function navigateBackToLogin() {
        navigation.goBack();
    }

    function signupNewUser() {
        setWasSignupPressed(true);

        if (!isFormValid)
            return;

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
                    <TextInput autoComplete='new-password' textContentType='password' onChangeText={text => setPassword(text)} secureTextEntry={hidePasswordText} mode="outlined" label="Senha" right={showPasswordButtonComponent} />
                    <TextInput autoComplete='new-password' onChangeText={text => setPasswordConfirm(text)} secureTextEntry={hidePasswordConfirmText} mode="outlined" label="Confirme a senha" right={showPasswordConfirmButtonComponent} />
                    <HelperText visible={!!formError} type='error'>{formError}</HelperText>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={navigateBackToLogin}>Login</Button>
                    <Button onPress={signupNewUser} icon='arrow-right'>Cadastrar</Button>
                </Card.Actions>
            </Card>

            <View style={{ flex: 1, width: '100%', alignItems: "flex-end", justifyContent: "flex-end" }}>
                { appTheme.dark === true ?
                    <IconButton icon="white-balance-sunny" onPress={changeThemeToLight} size={30} />
                    :
                    <IconButton icon="moon-waning-crescent" onPress={changeThemeToDark} size={30} />
                }
            </View>
        </View>
    );
}