import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { bookService } from "../services/bookService";
import { toast } from "@/components/ui/use-toast";

export interface Loan {
  id: string;
  bookId: string;
  bookTitle?: string;
  studentName: string;
  studentId: string;
  studentGrade: string;
  loanDate: string;
  returnDate: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  available: boolean;
}

export interface BookFormData {
  title: string;
  author: string;
  publisher: string;
  year: string;
  isbn: string;
  category: string;
  totalQuantity: string;
}

export interface LoanFormData {
  bookId: string;
  bookTitle?: string;
  studentName: string;
  studentId: string;
  studentGrade: string;
  returnDate: string;
}

interface BookContextProps {
  books: Book[];
  loans: Loan[];
  loading: boolean;
  loadBooks: () => Promise<void>;
  addBook: (bookData: BookFormData) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
  searchBooks: (query: string, showOnlyAvailable: boolean) => Book[];
  createLoan: (loanData: LoanFormData) => Promise<Loan>;
  extendLoan: (loanId: string, newReturnDate: string) => Promise<Loan>;
  cancelLoan: (loanId: string) => Promise<void>;
}

const BookContext = createContext<BookContextProps>({
  books: [],
  loans: [],
  loading: false,
  loadBooks: async () => { },
  addBook: async () => { throw new Error("addBook function not implemented."); },
  deleteBook: async () => { },
  searchBooks: () => [],
  createLoan: async () => { throw new Error("createLoan function not implemented."); },
  extendLoan: async () => { throw new Error("extendLoan function not implemented."); },
  cancelLoan: async () => { },
});

export const BookProvider = ({ children }: { children: React.ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);

      const loansData = await bookService.getAllLoans();
      const mappedLoans = loansData.map(loan => ({
        ...loan,
        id: loan.id || '',
        loanDate: loan.loanDate || new Date().toISOString().split('T')[0],
      }));
      setLoans(mappedLoans as Loan[]);
    } catch (error) {
      console.error("Error loading books and loans:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os livros e empréstimos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const addBook = async (bookData: BookFormData) => {
    try {
      const newBook = await bookService.createBook({
        ...bookData,
        year: parseInt(bookData.year),
        totalQuantity: parseInt(bookData.totalQuantity),
        availableQuantity: parseInt(bookData.totalQuantity),
        available: true,
      });
      setBooks(prevBooks => [...prevBooks, newBook]);
      toast({
        title: "Sucesso",
        description: "Livro adicionado com sucesso!",
      });
      return newBook;
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o livro",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await bookService.deleteBook(id);
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      toast({
        title: "Sucesso",
        description: "Livro removido com sucesso!",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o livro",
        variant: "destructive",
      });
      throw error;
    }
  };

  const searchBooks = (query: string, showOnlyAvailable: boolean) => {
    const searchLower = query.toLowerCase();
    return books.filter(book => {
      const matchesSearch = (
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.isbn.toLowerCase().includes(searchLower)
      );
      return showOnlyAvailable ? matchesSearch && book.availableQuantity > 0 : matchesSearch;
    });
  };

  const createLoan = async (loanData: LoanFormData) => {
    try {
      const book = books.find(b => b.id === loanData.bookId);
      if (!book) {
        throw new Error("Livro não encontrado");
      }
      if (book.availableQuantity <= 0) {
        throw new Error("Livro não disponível para empréstimo");
      }

      const newLoan = await bookService.createLoan({
        ...loanData,
        loanDate: new Date().toISOString().split('T')[0],
      });

      setLoans(prevLoans => [...prevLoans, newLoan]);
      setBooks(prevBooks =>
        prevBooks.map(b =>
          b.id === loanData.bookId
            ? { ...b, availableQuantity: b.availableQuantity - 1 }
            : b
        )
      );

      toast({
        title: "Sucesso",
        description: "Empréstimo registrado com sucesso!",
      });
      return newLoan;
    } catch (error) {
      console.error("Error creating loan:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao registrar empréstimo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const extendLoan = async (loanId: string, newReturnDate: string) => {
    try {
      const updatedLoan = await bookService.extendLoan(loanId, newReturnDate);
      setLoans(prevLoans =>
        prevLoans.map(loan =>
          loan.id === loanId ? { ...loan, returnDate: newReturnDate } : loan
        )
      );
      toast({
        title: "Sucesso",
        description: "Data de devolução atualizada com sucesso!",
      });
      return updatedLoan;
    } catch (error) {
      console.error("Error extending loan:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a data de devolução",
        variant: "destructive",
      });
      throw error;
    }
  };

  const cancelLoan = async (loanId: string) => {
    try {
      const loan = loans.find(l => l.id === loanId);
      if (!loan) {
        throw new Error("Empréstimo não encontrado");
      }

      await bookService.cancelLoan(loanId);
      setLoans(prevLoans => prevLoans.filter(l => l.id !== loanId));
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === loan.bookId
            ? { ...book, availableQuantity: book.availableQuantity + 1 }
            : book
        )
      );

      toast({
        title: "Sucesso",
        description: "Empréstimo cancelado com sucesso!",
      });
    } catch (error) {
      console.error("Error canceling loan:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cancelar empréstimo",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loans,
        loading,
        loadBooks,
        addBook,
        deleteBook,
        searchBooks,
        createLoan,
        extendLoan,
        cancelLoan,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
