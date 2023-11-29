import { doc, addDoc, getDocs, query, collection, orderBy, Timestamp } from "firebase/firestore"
import { db, auth } from "../Firebase"

async function readAllReadingHistoryOf(book) {
    console.info(`Firebase -> Running Query: Get all reading history for book ${book.title}`);

    const readingQuery = query(
        collection(db, auth.currentUser.email, book.title, 'readingHistory'),
        orderBy('timestamp')
    );
    const queryResult = await getDocs(readingQuery);

    const queryReadingHistory = [];

    queryResult.forEach((doc) => {
        const readingHistoryData = doc.data();

        queryReadingHistory.push({
            timestamp: readingHistoryData.timestamp.toDate(),
            pagesRead: readingHistoryData.pagesRead,
            description: readingHistoryData.description,
        });
    });

    return queryReadingHistory;
}

async function createReadingHistoryOf(book, readingHistory) {
    console.info(`Firebase -> Running Create: Creating Reading History for book ${book.title}, ${readingHistory.pagesRead} pages`);

    const newReadingHistoryCollection = collection(db, auth.currentUser.email, book.title, 'readingHistory');

    return await addDoc(newReadingHistoryCollection, {
        pagesRead: readingHistory.pagesRead,
        description: readingHistory.description,
        timestamp: Timestamp.now()
    });
}

export { readAllReadingHistoryOf, createReadingHistoryOf };