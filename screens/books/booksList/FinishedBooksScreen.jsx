import { BooksListScreen } from '../shared/BooksListScreen';

export function FinishedBooksScreen(props) {
    return (
        <BooksListScreen emptyMessage='Termine de ler um livro!' isBookVisible={(book) => book.isFinished} {...props} />
    );
}