import { BooksListScreen } from './shared/BooksListScreen';

export function FavoriteBooksScreen(props) {
    return (
        <BooksListScreen emptyMessage='Adicione um livro aos favoritos!' isBookVisible={(book) => book.isFavorite} {...props} />
    );
}