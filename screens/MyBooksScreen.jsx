import { useEffect, useState } from "react"
import { BottomNavigation } from "react-native-paper"

import { AllBooksScreen } from "./books/AllBooksScreen"

import { getDocs, query, collection, orderBy } from "firebase/firestore"
import { db, auth } from "../Firebase"

import { BooksContext } from "../contexts/BooksContext"

import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

const Tab = createMaterialBottomTabNavigator();

export function MyBooksScreen() {
    const [books, setBooks] = useState([])

	useEffect(() => {
		read()
	}, [])

    const read = async () => {
		console.log("books query executing")
		const q = query(collection(db, auth.currentUser.email), orderBy("timestamp"))
		const qs = await getDocs(q)

		const queryBooks = []

		qs.forEach((doc) => {

            const bookData = doc.data();

			queryBooks.push({
				title: doc.id,
				author: bookData.author,
                totalPages: bookData.totalPages,
                pagesRead: bookData.pagesRead,
				isFavorite: bookData.isFavorite,
                readPercentage: bookData.pagesRead / bookData.totalPages,
                isFinished: bookData.totalPages === bookData.pagesRead,
			})
		})

		setBooks(queryBooks)
	}
    
    return (
        <BooksContext.Provider value={{ books }}>
            <Tab.Navigator>
                <Tab.Screen name="Todos" options={{ tabBarIcon: 'book-multiple' }} component={AllBooksScreen} />
                <Tab.Screen name="Lendo" options={{ tabBarIcon: 'book-open-blank-variant' }} component={AllBooksScreen} />
                <Tab.Screen name="Finalizados" options={{ tabBarIcon: 'book-check' }} component={AllBooksScreen} />
                <Tab.Screen name="Favoritos" options={{ tabBarIcon: 'heart' }} component={AllBooksScreen} />
            </Tab.Navigator>
        </BooksContext.Provider>
    )
	// const [index, setIndex] = useState(0)
	// const [books, setBooks] = useState([])

	// useEffect(() => {
	// 	read()
	// }, [])

	// const read = async () => {
	// 	console.log("fetch data called")
	// 	const q = query(collection(db, auth.currentUser.email), orderBy("timestamp"))
	// 	const qs = await getDocs(q)

	// 	const queryBooks = []

	// 	qs.forEach((doc) => {
	// 		queryBooks.push({
	// 			title: doc.id,
	// 			author: doc.data().author,
	// 		})
	// 	})

	// 	setBooks(queryBooks)
	// }

	// const [routes] = useState([
	// 	{ key: "all", title: "Todos", focusedIcon: "book-multiple" },
	// 	{ key: "all2", title: "Lendo", focusedIcon: "book-open-blank-variant" },
	// 	{ key: "all3", title: "Finalizados", focusedIcon: "book-check" },
	// 	{ key: "all4", title: "Favoritos", focusedIcon: "heart" },
	// ])

	// const renderScene = BottomNavigation.SceneMap({
	// 	all: AllBooksScreen,
	// 	all2: AllBooksScreen,
	// 	all3: AllBooksScreen,
	// 	all4: AllBooksScreen,
	// })

	// return (
	// 	<BooksContext.Provider value={{ books }}>
	// 		<BottomNavigation
	// 			teste="123"
	// 			navigationState={{ index, routes }}
	// 			onIndexChange={setIndex}
	// 			renderScene={renderScene}
	// 		/>
	// 	</BooksContext.Provider>
	// )
}
