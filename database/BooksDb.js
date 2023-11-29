import { doc, updateDoc, setDoc, getDocs, query, collection, orderBy, Timestamp } from "firebase/firestore"
import { db, auth } from "../Firebase"

async function readAllBooks() {
    console.info("Firebase -> Running Query: Get all books")

    const booksQuery = query(collection(db, auth.currentUser.email), orderBy("timestamp"))
    const queryResult = await getDocs(booksQuery)

    const queryBooks = []

    queryResult.forEach((doc) => {
        const bookData = doc.data();

        queryBooks.push({
            title: doc.id,
            author: bookData.author,
            totalPages: bookData.totalPages,
            pagesRead: bookData.pagesRead,
            isFavorite: bookData.isFavorite,
            readingIntensity: bookData.readingIntensity,
            readPercentage: bookData.pagesRead / bookData.totalPages,
            isFinished: bookData.totalPages == bookData.pagesRead,
        })
    })

    return queryBooks;
}

async function createBook(book) {
    console.info(`Firebase -> Running Create: Creating book ${book.title}`)

    const newBookDoc = doc(db, auth.currentUser.email, book.title);

    return await setDoc(newBookDoc, {
        author: book.author,
        totalPages: book.totalPages,
        pagesRead: 0,
        isFavorite: false,
        readingIntensity: book.readingIntensity,
        timestamp: Timestamp.now(),
    });
}

async function updateBook(book) {
    console.info(`Firebase -> Running Update: Update book ${book.title}`)

    const bookRef = doc(db, auth.currentUser.email, book.title);

    await updateDoc(bookRef, {
        pagesRead: book.pagesRead,
        isFavorite: book.isFavorite,
    });
}

export { readAllBooks, createBook, updateBook };