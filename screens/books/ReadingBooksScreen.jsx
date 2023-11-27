import { BooksListScreen } from './shared/BooksListScreen';

export function ReadingBooksScreen(props) {
    return (
        <BooksListScreen emptyMessage='Comece a ler um livro!' isBookVisible={(book) => !book.isFinished} {...props} />
    );
}