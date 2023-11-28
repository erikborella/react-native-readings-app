import { useContext, useEffect, useState } from "react";

import { ScrollView, View } from "react-native";

import { 
    Text, 
    useTheme,
    Icon,
    Card,
    IconButton,
    List,
    Divider
} from "react-native-paper";

import { BookReadProgressbar } from "../../components/BookReadProgressbar";
import { BooksContext } from "../../contexts/BooksContext";

import { updateBook } from "../../database/BooksDb";
import { readAllReadingHistoryOf } from '../../database/BookReadingHistoryDb';

export function BookDetailScreen({ route }) {
    const theme = useTheme();
    const selectedBook = route.params.selectedBook;

    const { books, setBooks } = useContext(BooksContext);

    const [readingHistory, setReadingHistory] = useState([]);

    useEffect(() => {
        readBookReadingHistory();
    }, []);

    async function readBookReadingHistory() {
        const dbReadingHistory = await readAllReadingHistoryOf(selectedBook);
        setReadingHistory(dbReadingHistory);
    }

    function favoriteBook(bookToUpdate) {
        bookToUpdate.isFavorite = true;

        setBooks([...books]);

        updateBook(bookToUpdate);
    }

    function unFavoriteBook(bookToUpdate) {
        bookToUpdate.isFavorite = false;

        setBooks([...books]);

        updateBook(bookToUpdate);
    }

    function getFinishExpectedDate(bookToCalculate) {
        const currentDate = new Date();
        
        const pagesLeftToRead = bookToCalculate.totalPages - bookToCalculate.pagesRead;
        const daysToFinishRead = Math.ceil(pagesLeftToRead / bookToCalculate.readingIntensity);

        const finishDate = new Date(currentDate.setDate(currentDate.getDate() + daysToFinishRead));

        return finishDate.toLocaleDateString('pt-br');
    }

    function accumulatePagesRead(readingHistoryToAccumulate) {
        return readingHistoryToAccumulate.reduce((acc, element, index) => {
            const previousSum = index === 0 ? 0 : acc[index - 1].totalPages;
            const currentSum = previousSum + element.pagesRead;

            acc.push({
                ...element,
                totalPages: currentSum
            });

            return acc;
        }, []);
    }

    function ReadingHistoryDescription({description, bookTotalPages, totalPagesRead}) {
        return (
            <View>
                { !!description ? <Text style={{ margin: 8 }}>{description}</Text> : null}
                <View style={{ display: 'flex', flexDirection: "row", flex: 1, marginTop: 8, alignItems: "flex-end" }}>
                    <View style={{ flex: 1 }}>
                        <Text>Total lido: {totalPagesRead}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <BookReadProgressbar readPercentage={totalPagesRead / bookTotalPages} />
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ backgroundColor: theme.colors.background, alignItems: 'center', flex: 1}}>

            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginVertical: 20}}>
                <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                    <Text style={{color: theme.colors.primary, maxWidth: '60%', paddingHorizontal: 5, textAlign: "center"}} variant="headlineMedium">{selectedBook.title}</Text>
                    <Icon source={ selectedBook.isFinished ? 'book-check' : 'book-open-blank-variant' } color={theme.colors.primary} size={30} />
                </View>
            </View>

            <Card mode="outlined" style={{ width: '95%', marginBottom: 20, flex: 1 }}>
                <ScrollView nestedScrollEnabled>
                    <Card.Title style={{ padding: 15 }} title="Informações sobre o Livro:" titleVariant="titleLarge" titleNumberOfLines={2}/>
                    <Card.Content style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{flex: 1}}>Autor: {selectedBook.author}</Text>
                            <View style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                                <Text style={{textAlign: "right"}}>Páginas Lidas: </Text>
                                <Text style={{textAlign: "right"}}>{selectedBook.pagesRead}</Text>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text>Paginas: {selectedBook.totalPages}</Text>
                            </View>
                            <BookReadProgressbar readPercentage={selectedBook.readPercentage} />
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                            <View style={{ flex: 1 }}>
                                <Text>Status: { selectedBook.isFinished ? 'Finalizado' : 'Lendo' }</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                                {selectedBook.isFavorite ? 
                                    <IconButton onPress={() => unFavoriteBook(selectedBook)} style={{ margin: 0, padding: 0 }} iconColor={theme.colors.primary} icon='heart'/>
                                    :
                                    <IconButton onPress={() => favoriteBook(selectedBook)} style={{ margin: 0, padding: 0 }} iconColor={theme.colors.onSurfaceVariant} icon='heart-outline'/>
                                }
                            </View>
                        </View>
                    </Card.Content>

                    <Card.Title style={{ padding: 15 }} title="Cronograma de Leitura:" titleVariant="titleLarge" titleNumberOfLines={2}/>
                    <Card.Content style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <Text>Ler {selectedBook.readingIntensity} páginas por dia</Text>
                        <Text>Previsão de conclusão: {getFinishExpectedDate(selectedBook)}</Text>
                    </Card.Content>

                    <Card.Title style={{ padding: 15 }} title="Adicionar Histórico de Leitura:" titleVariant="titleLarge" titleNumberOfLines={2}/>

                    <Card.Title style={{ padding: 15 }} title="Histórico de Leitura:" titleVariant="titleLarge" titleNumberOfLines={2}/>

                    <View style={{ alignItems: "center" }}>
                        <Card mode="elevated" style={{ width: '90%', maxHeight: 300, marginBottom: 20, justifyContent: 'center' }}>
                            <ScrollView nestedScrollEnabled>
                                {accumulatePagesRead(readingHistory).reverse().map((his, i) => (
                                    <View key={i}>
                                        <List.Item 
                                            title={`Páginas lidas: ${his.pagesRead}`}
                                            description={() => <ReadingHistoryDescription description={his.description} bookTotalPages={selectedBook.totalPages} totalPagesRead={his.totalPages} />}
                                            left={props => <List.Icon {...props} icon='history' />} />
                                        <Divider horizontalInset />
                                    </View>
                                ))}
                            </ScrollView>
                        </Card>
                    </View>
                    
                </ScrollView>
            </Card>
            
        </View>
    );
}