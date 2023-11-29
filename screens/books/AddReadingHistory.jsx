import { useContext, useEffect, useState } from "react";

import { 
    Text, 
    Button, 
    useTheme,
    Icon,
    Card,
    TextInput,
    RadioButton,
    HelperText
} from "react-native-paper";

import { BooksContext } from "../../contexts/BooksContext";
import { ScrollView, View } from "react-native";

import { updateBook } from '../../database/BooksDb';
import { createReadingHistoryOf } from "../../database/BookReadingHistoryDb";

export function AddReadingHistory({ route, navigation }) {
    const theme = useTheme();

    const selectedBook = route.params.selectedBook;
    const { books, setBooks, bookReadingsHistory, setBookReadingsHistory } = useContext(BooksContext);

    const PAGES_READ = 0;
    const READ_UP_TO_PAGE = 1;

    const [pagesReadCalcOption, setPagesReadCalcOption] = useState(PAGES_READ);

    const [pagesReadCalcValue, setPagesReadCalcValue] = useState();
    const [description, setDescription] = useState("");

    const [wasAddPressed, setWasAddPressed] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [formError, setFormError] = useState();

    useEffect(() => {
        validateForm();
    }, [pagesReadCalcValue, wasAddPressed]);

    function validateForm() {
        if (!pagesReadCalcValue) {
            setIsFormValid(false);
            
            if (!wasAddPressed) {
                setFormError(null);
                return;
            }

            setFormError('Preencha o campo de páginas lidas!');
            return;
        }

        if (pagesReadCalcValue <= 0) {
            setIsFormValid(false);
            setFormError(`Informe um valor de páginas positivo e maior que 0`);
            return;
        }

        if (pagesReadCalcOption === PAGES_READ) {
            const maxPagesToRead = selectedBook.totalPages - selectedBook.pagesRead;
            
            if (pagesReadCalcValue > maxPagesToRead) {
                setIsFormValid(false);
                setFormError(`A quantidade de páginas lidas está incorreta, o máximo que você pode ler é ${maxPagesToRead}`);
                return;
            }
        }

        if (pagesReadCalcOption === READ_UP_TO_PAGE) {
            if (pagesReadCalcValue > selectedBook.totalPages) {
                setIsFormValid(false);
                setFormError(`A página lida informada está incorreta, o livro só tem ${selectedBook.totalPages} páginas`);
                return;
            }

            if (pagesReadCalcValue <= selectedBook.pagesRead) {
                setIsFormValid(false);
                setFormError(`Na sua ultima leitura você leu até a página ${selectedBook.pagesRead}, informe uma página de parada maior que essa`);
                return;
            }
        }

        setIsFormValid(true);
        setFormError(null);
    }

    function getPagesRead() {
        if (pagesReadCalcOption === PAGES_READ) {
            return pagesReadCalcValue;
        }

        return pagesReadCalcValue - selectedBook.pagesRead;
    }

    function addNewReadingHistory() {
        setWasAddPressed(true);

        if (!isFormValid)
            return;

        const pagesRead = getPagesRead();
    
        selectedBook.pagesRead = Number(selectedBook.pagesRead) + Number(pagesRead);
        selectedBook.readPercentage = selectedBook.pagesRead / selectedBook.totalPages;
        selectedBook.isFinished = selectedBook.pagesRead == selectedBook.totalPages;

        setBooks([...books]);
        updateBook(selectedBook);

        const newReadingHistory = {
            description: description,
            pagesRead: Number(pagesRead),
        }

        createReadingHistoryOf(selectedBook, newReadingHistory)
            .then(() => {
                setBookReadingsHistory([...bookReadingsHistory, {
                    description: description,
                    pagesRead: Number(pagesRead),
                    timestamp: new Date(),
                }]);
            });

        navigation.goBack();
    }

    return (
        <View style={{ backgroundColor: theme.colors.background, alignItems: 'center', flex: 1}}>
            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}}>
                <Text style={{color: theme.colors.primary, paddingHorizontal: 5}} variant="titleLarge">Adicionar</Text>
                <View style={{ display: "flex", alignItems: "center", flexDirection: "row", marginHorizontal: 20 }}>
                    <Text style={{color: theme.colors.primary, paddingHorizontal: 5, textAlign: 'center' }} variant="displaySmall">Histórico de Leitura</Text>
                    <Icon source="checkbox-marked-circle-plus-outline" color={theme.colors.primary} size={40} />
                </View>
            </View>

            <Card mode="outlined" contentStyle={{ flex: 1 }} style={{ width: '95%', flex: 1, marginBottom: 10 }}>
                    <Card.Title style={{ padding: 15 }} title="Informações sobre a Leitura:" titleVariant="titleLarge" titleNumberOfLines={2}/>
                    <Card.Content style={{ display: "flex", justifyContent: "space-evenly", flex: 1 }}>
                        <ScrollView>
                            <RadioButton.Group  onValueChange={value => setPagesReadCalcOption(value)} value={pagesReadCalcOption}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                        <Text variant="bodyLarge">Páginas lidas</Text>
                                        <RadioButton.Android value={PAGES_READ} />
                                    </View>
                                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                                        <Text variant="bodyLarge">Lido até a página</Text>
                                        <RadioButton.Android value={READ_UP_TO_PAGE} />
                                    </View>
                                </View>
                            </RadioButton.Group>
                            <TextInput style={{ marginVertical: 10 }} keyboardType="numeric" mode="outlined" label={ pagesReadCalcOption ? 'Lido até a página' : 'Páginas lidas' } onChangeText={(val) => setPagesReadCalcValue(val)} />
                            <TextInput multiline mode="outlined" label='Descrição (opcional)' onChangeText={(val) => setDescription(val)} />
                            <HelperText visible={!!formError} type='error'>{formError}</HelperText>
                        </ScrollView>
                    </Card.Content>

                    <Card.Actions>
                        <Button onPress={navigation.goBack}>Cancelar</Button>
                        <Button onPress={addNewReadingHistory} icon='plus'>Adicionar</Button>
                    </Card.Actions>
            </Card>
        </View>
   );
}