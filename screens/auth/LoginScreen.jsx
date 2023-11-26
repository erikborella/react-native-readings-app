import { View } from "react-native";
import { 
    Button, 
    Card,
    Icon,
    Text,
    TextInput,
    useTheme,
    HelperText
} from "react-native-paper";

import { routesNames } from '../../routes/RoutesNames';
import { useState } from "react";

import { auth } from '../../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { createSeekPasswordTextInputButton } from "../../components/SeekPasswordTextInputButton";

export function LoginScreen({navigation}) {
    const theme = useTheme();

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [hidePasswordText, setHidePasswordText] = useState(true);
    const showPasswordButtonComponent = createSeekPasswordTextInputButton(setHidePasswordText);

    const [wasLoginPressed, setWasLoginPressed] = useState(false);

    const getFieldsError = () => {
        if (!wasLoginPressed)
            return null;

        if (!email || !password)
            return 'Preencha todos os campos'
    }

    const getError = () => {
        return getFieldsError();
    }

    function navigateToSignup() {
        navigation.navigate(routesNames.signup);
    }

    function loginUser() {
        setWasLoginPressed(true);

        if (!!getError())
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
                    <HelperText visible={!!getError()} type='error'>{getError()}</HelperText>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={navigateToSignup}>Cadastrar</Button>
                    <Button onPress={loginUser} icon='arrow-right'>Entrar</Button>
                </Card.Actions>
            </Card>
        </View>
    );
}