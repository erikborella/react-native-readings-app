import { ScrollView, View } from "react-native";

import {
    Text,
    List,
    Button,
    ProgressBar,
    Icon,
    useTheme,
    Divider
} from 'react-native-paper';

import { BooksFAB } from '../../components/BooksFAB';
import { SafeAreaView } from "react-native-safe-area-context";
import { Fragment, useContext, useEffect, useState } from "react";

import { BooksContext } from '../../contexts/BooksContext';

export function AllBooksScreen({ route }) {
    const theme = useTheme();
    const [expandFAB, setExpandFAB] = useState(true);

    const { books } = useContext(BooksContext);

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
    
    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
            <ScrollView onScroll={osScrollView}>
                {books.map((book, i) => (
                    <Fragment key={i}>
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
                                    <List.Icon color={theme.colors.primary} icon='heart'/>
                                    :
                                    <List.Icon color={theme.colors.onSurfaceVariant} icon='heart-outline'/>
                                }
                            </View>
                        </View>
                        <Divider horizontalInset/>
                    </Fragment>
                ))}
                <View style={{ height: 100 }}>

                </View>
            </ScrollView>
            <BooksFAB extended={expandFAB} />
        </SafeAreaView>
    ); 
}