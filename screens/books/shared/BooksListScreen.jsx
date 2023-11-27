import { ScrollView, View } from "react-native";

import {
    Text,
    List,
    Button,
    ProgressBar,
    Icon,
    useTheme,
    Divider,
    IconButton,
    TouchableRipple
} from 'react-native-paper';

import { BooksFAB } from '../../../components/BooksFAB';
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";

import { BooksContext } from '../../../contexts/BooksContext';

import { updateBook } from '../../../database/BooksDb';

export function BooksListScreen({ navigation, emptyMessage = 'Sem registros', isBookVisible = () => true }) {
    const theme = useTheme();
    const [expandFAB, setExpandFAB] = useState(true);

    const { books, setBooks } = useContext(BooksContext);

    const [viewBooks, setViewBooks] = useState([])

    useEffect(() => {
        setViewBooks(books.filter(isBookVisible));
    }, [books]);

    const osScrollView = ({ nativeEvent }) => {
        const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setExpandFAB(currentScrollPosition <= 0);
    }

    function getBookProgressColor (progress) {
        const initialColor = [255, 0, 0];
        const middleColor = [255, 255, 0];
        const endColor = [0, 255, 0];
    
        const intermediary = [
          initialColor[0] + progress * (middleColor[0] - initialColor[0]),
          initialColor[1] + progress * (middleColor[1] - initialColor[1]),
          initialColor[2] + progress * (middleColor[2] - initialColor[2]),
        ];
    
        const intermediary2 = [
          middleColor[0] + progress * (endColor[0] - middleColor[0]),
          middleColor[1] + progress * (endColor[1] - middleColor[1]),
          middleColor[2] + progress * (endColor[2] - middleColor[2]),
        ];
    
        const final = [
          intermediary[0] + progress * (intermediary2[0] - intermediary[0]),
          intermediary[1] + progress * (intermediary2[1] - intermediary[1]),
          intermediary[2] + progress * (intermediary2[2] - intermediary[2]),
        ];
    
        return `rgb(${Math.round(final[0])}, ${Math.round(final[1])}, ${Math.round(final[2])})`;
    };

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
    
    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
            { viewBooks.length === 0 ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                    <Text style={{ textAlign: "center" }} variant="displayMedium">{ emptyMessage }</Text>
                </View>
                :
                <ScrollView onScroll={osScrollView}>
                    {viewBooks.map((book, i) => (
                        <TouchableRipple rippleColor={theme.colors.primaryContainer} onPress={() => {}} key={i}>
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
                                            <View style={{ flex: 1 }}>
                                                <View>
                                                    <ProgressBar color={getBookProgressColor(book.readPercentage)} style={{ height: 10, borderRadius: 10 }} progress={book.readPercentage} />
                                                    <Text style={{ textAlign: "right" }}>{`${Math.floor(book.readPercentage * 100)}%`}</Text>
                                                </View>
                                            </View>
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