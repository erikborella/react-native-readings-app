import { View } from "react-native";
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

import { routesNames } from '../../routes/RoutesNames';
import { useContext, useEffect, useState } from "react";

import { auth } from '../../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { DynamicThemeContext } from '../../contexts/DynamicThemeContext';
import { AppDarkTheme } from '../../themes/AppDarkTheme';
import { AppLightTheme } from '../../themes/AppLightTheme';

import { createSeekPasswordTextInputButton } from "../../components/SeekPasswordTextInputButton";

export function LoginScreen({navigation}) {
    const theme = useTheme();

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [hidePasswordText, setHidePasswordText] = useState(true);
    const showPasswordButtonComponent = createSeekPasswordTextInputButton(setHidePasswordText);

    const [wasLoginPressed, setWasLoginPressed] = useState(false);

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
    }, [email, password]);

    function validateForm() {
        if (!email || !password) {
            setIsFormValid(false);
            setFormError('Preencha todos os campos');

            return;
        }

        setIsFormValid(true);
        setFormError(null);
    }

    function navigateToSignup() {
        navigation.navigate(routesNames.signup);
    }

    function loginUser() {
        setWasLoginPressed(true);
        
        if (!isFormValid)
            return;

        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("User logged");
        })
        .catch((error) => {
            alert(error.message);
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center'}}>
            <View style={{ display: "flex", alignItems: "center", flexDirection: "row", height: 300 }}>
                <Text style={{color: theme.colors.primary, paddingHorizontal: 5}} variant="displayMedium">Leituras</Text>
                <Icon source="book-open-variant" color={theme.colors.primary} size={40} />
            </View>
            <Card mode="outlined" style={{ width: '80%' }}>
                <Card.Title style={{ padding: 15 }} title="Login" titleVariant="headlineLarge"/>
                <Card.Content style={{ display: "flex", height: 200, justifyContent: "space-evenly" }}>
                    <TextInput autoComplete="username" keyboardType="email-address" textContentType="emailAddress" onChangeText={text => setEmail(text)} mode="outlined" label="Email" />
                    <TextInput autoComplete="password" textContentType="password" onChangeText={text => setPassword(text)} secureTextEntry={hidePasswordText} mode="outlined" label="Password" right={showPasswordButtonComponent}/>
                    <HelperText visible={wasLoginPressed && !!formError} type='error'>{formError}</HelperText>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={navigateToSignup}>Cadastrar</Button>
                    <Button onPress={loginUser} icon='arrow-right'>Entrar</Button>
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