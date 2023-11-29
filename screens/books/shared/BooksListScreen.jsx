import { ScrollView, View } from "react-native";

import {
    Text,
    List,
    useTheme,
    Divider,
    IconButton,
    TouchableRipple
} from 'react-native-paper';

import { BooksFAB } from '../../../components/BooksFAB';
import { BookReadProgressbar } from '../../../components/BookReadProgressbar';

import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";

import { BooksContext } from '../../../contexts/BooksContext';

import { updateBook } from '../../../database/BooksDb';
import { routesNames } from "../../../routes/RoutesNames";

export function BooksListScreen({ navigation, emptyMessage = 'Sem registros', isBookVisible = () => true }) {
    const theme = useTheme();
    const [expandFAB, setExpandFAB] = useState(true);

    const { books, setBooks, setBookReadingsHistory } = useContext(BooksContext);

    const [viewBooks, setViewBooks] = useState([])

    useEffect(() => {
        setViewBooks(books.filter(isBookVisible));
    }, [books]);

    const osScrollView = ({ nativeEvent }) => {
        const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setExpandFAB(currentScrollPosition <= 0);
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

    function navigateToBookDetail(book) {
        setBookReadingsHistory([]);
        navigation.navigate(routesNames.viewReading, { selectedBook: book })
    }
    
    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
            { viewBooks.length === 0 ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                    <Text style={{ textAlign: "center" }} variant="displayMedium">{ emptyMessage }</Text>
                </View>
                :
                <ScrollView onScroll={osScrollView}>
                    {viewBooks.map((book, i) => (
                        <TouchableRipple rippleColor={theme.colors.primaryContainer} onPress={() => navigateToBookDetail(book)} key={i}>
                            <>
                                <View style={{ display: "flex", flexDirection: "row", marginVertical: 15, marginRight: 15 }}>
                                    <View style={{ padding: 15 }}>
                                        <List.Icon color={theme.colors.onSurfaceVariant} icon={ book.isFinished ? 'book-check' : 'book-open-blank-variant'}/>
                                    </View>
                                    <View style={{ display: "flex", flex: 1, marginRight: 10 }}>
                                        <Text variant="titleMedium">{book.title}</Text>
                                        <View>
                                            <View style={{ display: "flex", flexDirection: "row", }}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{flex: 1}}>Autor: {book.author}</Text>
                                                <View style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                    <Text style={{textAlign: "right"}}>Páginas Lidas:</Text>
                                                    <Text style={{textAlign: "right"}}>{book.pagesRead}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ display: "flex", flexDirection: "row", }}>
                                            <View style={{ flex: 1 }}>
                                                <Text>Paginas: {book.totalPages}</Text>
                                            </View>
                                            <BookReadProgressbar readPercentage={book.readPercentage} />
                                        </View>
                                    </View>
                                    <View style={{ padding: 0, justifyContent: "center" }}>
                                        {book.isFavorite ? 
                                            <IconButton onPress={() => unFavoriteBook(book)} style={{ margin: 0, padding: 0 }} iconColor={theme.colors.primary} icon='heart'/>
                                            :
                                            <IconButton onPress={() => favoriteBook(book)} style={{ margin: 0, padding: 0 }} iconColor={theme.colors.onSurfaceVariant} icon='heart-outline'/>
                                        }
                                    </View>
                                </View>
                                <Divider horizontalInset/>
                            </>
                        </TouchableRipple>
                    ))}
                    <View style={{ height: 100 }}>

                    </View>
                </ScrollView>
            }
            <BooksFAB navigation={navigation} extended={expandFAB} />
        </SafeAreaView>
    ); 
}