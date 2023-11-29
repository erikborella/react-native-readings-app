import { BooksListScreen } from '../shared/BooksListScreen';

export function AllBooksScreen(props) {
    return (
        <BooksListScreen emptyMessage='Adicione uma leitura nova!' {...props} />
    );
}