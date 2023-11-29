import { useContext, useEffect, useState } from "react"

import { AllBooksScreen } from './booksList/AllBooksScreen';

import { readAllBooks } from '../../database/BooksDb';

import { BooksContext } from "../../contexts/BooksContext"

import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { ReadingBooksScreen } from "./booksList/ReadingBooksScreen";
import { FinishedBooksScreen } from "./booksList/FinishedBooksScreen";
import { FavoriteBooksScreen } from "./booksList/FavoriteBooksScreen";

const Tab = createMaterialBottomTabNavigator();

export function MyBooksScreen() {
    const { setBooks } = useContext(BooksContext);

    useEffect(() => {
        readBooks();
    }, []);

	async function readBooks() {
        const dbBooks = await readAllBooks();
        setBooks(dbBooks);
    }
	    
    return (
        <Tab.Navigator>
            <Tab.Screen name="Todos" options={{ tabBarIcon: 'book-multiple' }} component={AllBooksScreen} />
            <Tab.Screen name="Lendo" options={{ tabBarIcon: 'book-open-blank-variant' }} component={ReadingBooksScreen} />
            <Tab.Screen name="Finalizados" options={{ tabBarIcon: 'book-check' }} component={FinishedBooksScreen} />
            <Tab.Screen name="Favoritos" options={{ tabBarIcon: 'heart' }} component={FavoriteBooksScreen} />
        </Tab.Navigator>
    )
}