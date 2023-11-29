import { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { 
    Button, 
    Card,
    Icon,
    Text,
    TextInput,
    useTheme,
    HelperText,
    RadioButton,
    TouchableRipple
} from "react-native-paper";

import { createBook } from '../../database/BooksDb';
import { BooksContext } from "../../contexts/BooksContext";

export function AddBookScreen({ navigation }) {
    const theme = useTheme();

    const { books, setBooks } = useContext(BooksContext);

    const [title, setTitle] = useState();
    const [author, setAuthor] = useState();
    const [totalPages, setTotalPages] = useState();

    const [readingIntensity, setReadingIntensity ] = useState(10);
    const [readingIntensityCustomValue, setReadingIntensityCustomValue] = useState("30");

    const [wasCreatePressed, setWasCreatePressed] = useState(false);

    const [isFormValid, setIsFormValid] = useState(false);
    const [formError, setFormError] = useState();

    useEffect(() => {
        validateForm();
    }, [title, author, totalPages, readingIntensity, readingIntensityCustomValue]);

    function validateForm() {
        const isReadingIntensityCustomValueSelected = readingIntensity === readingIntensityCustomValue;

        if (!title || !author || !totalPages || (isReadingIntensityCustomValueSelected && !readingIntensityCustomValue)) {
            setIsFormValid(false);
            setFormError('Preencha todos os campos');

            return;
        }

        setIsFormValid(true);
        setFormError();
    }

    function updateReadingIntensityCustomValue(value) {
        setReadingIntensityCustomValue(value);
        setReadingIntensity(value);
    }

    function createReading() {
        setWasCreatePressed(true);

        if (!isFormValid)
            return;

        const newBook = {
            title: title,
            author: author,
            totalPages: totalPages,
            readingIntensity: Number(readingIntensity),
        };

        createBook(newBook)
            .then(() => {
                setBooks([...books, {
                    title: title,
                    author: author,
                    totalPages: totalPages,
                    readingIntensity: Number(readingIntensity),
                    pagesRead: 0,
                    isFavorite: false,
                    readPercentage: 0,
                    isFinished: false,
                }]);
                
                navigation.goBack();
            })
            .catch((error) => {
                alert(error.message);
            })
    }

    return (
        <View style={{ backgroundColor: theme.colors.background, alignItems: 'center', flex: 1}}>
            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}}>
                <Text style={{color: theme.colors.primary, paddingHorizontal: 5}} variant="titleLarge">Adicionar</Text>
                <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                    <Text style={{color: theme.colors.primary, paddingHorizontal: 5}} variant="displayMedium">Leitura</Text>
                    <Icon source="book-plus" color={theme.colors.primary} size={40} />
                </View>
            </View>

            <Card mode="outlined" style={{ width: '95%', flex: 1, marginBottom: 10, justifyContent: 'center' }}>
                <ScrollView>
                    <Card.Title style={{ padding: 15 }} title="Informações sobre o Livro:" titleVariant="titleLarge" titleNumberOfLines={2}/>
                    <Card.Content style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <TextInput onChangeText={(val) => setTitle(val)} mode="outlined" label="Nome" left={<TextInput.Icon icon='book-alphabet' />} />
                        <TextInput onChangeText={(val) => setAuthor(val)} mode="outlined" label="Autor" left={<TextInput.Icon icon='account-edit' />}/>
                        <TextInput onChangeText={(val) => setTotalPages(val)} keyboardType="numeric" mode="outlined" label="Numero de Páginas" left={<TextInput.Icon icon='book-open-page-variant'/>} />
                        <HelperText visible={false} type='error'></HelperText>
                    </Card.Content>

                    <Card.Title style={{ padding: 15 }} title="Informações de Leitura:" titleVariant="titleLarge" titleNumberOfLines={2}/>
                    <Card.Content style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <Text>Cronograma de Leitura:</Text>
                        <RadioButton.Group onValueChange={value => setReadingIntensity(value)} value={readingIntensity}>
                            <TouchableRipple onPress={() => setReadingIntensity(10)} style={{ display: 'flex', flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                <>
                                    <Text variant="bodyLarge" style={{ flex: 1, marginHorizontal: 20 }}>10 páginas por dia</Text>
                                    <RadioButton.Android style={{ flex: 2 }} value={10} />
                                </>
                            </TouchableRipple>
                            <TouchableRipple onPress={() => setReadingIntensity(25)} style={{ display: 'flex', flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                <>
                                    <Text variant="bodyLarge" style={{ flex: 1, marginHorizontal: 20 }}>25 páginas por dia</Text>
                                    <RadioButton.Android style={{ flex: 2 }} value={25} />
                                </>
                            </TouchableRipple>
                            <TouchableRipple onPress={() => setReadingIntensity(50)} style={{ display: 'flex', flexDirection: 'row', alignItems: "center", paddingVertical: 10 }}>
                                <>
                                    <Text variant="bodyLarge" style={{ flex: 1, marginHorizontal: 20 }}>50 páginas por dia</Text>
                                    <RadioButton.Android style={{ flex: 2 }} value={50} />
                                </>
                            </TouchableRipple>
                            <TouchableRipple onPress={() => setReadingIntensity(-1)} style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                <>
                                    <TextInput style={{ flex: 1, marginHorizontal: 20 }} value={readingIntensityCustomValue} keyboardType="numeric" mode="outlined" label="Personalizado" onChangeText={value => updateReadingIntensityCustomValue(value)} left={<TextInput.Icon icon='format-list-numbered'/>} />
                                    <RadioButton.Android style={{ flex: 2 }} value={readingIntensityCustomValue} />
                                </>
                            </TouchableRipple>
                        </RadioButton.Group>
                    </Card.Content>
                    
                </ScrollView>
                <Card.Actions>
                    <View>
                        <HelperText visible={wasCreatePressed && !!formError} type='error'>Preencha todos os campos!</HelperText>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <Button mode="outlined" onPress={navigation.goBack} style={{ marginRight: 10 }}>Cancelar</Button>
                            <Button mode="contained" icon='plus' onPress={createReading}>Criar Leitura</Button>
                        </View>
                    </View>
                </Card.Actions>
            </Card>
        </View>
    );
}