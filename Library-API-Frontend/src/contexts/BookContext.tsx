import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// tipos
export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  category: string;
  available: boolean;
  totalQuantity: number;
  availableQuantity: number;
}

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  studentName: string;
  studentId: string;
  studentGrade: string;
  loanDate: string;
  returnDate: string;
}

interface BookContextType {
  books: Book[];
  loans: Loan[];
  loading: boolean;
  addBook: (book: Omit<Book, "id" | "available" | "availableQuantity">) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  searchBooks: (query: string, onlyAvailable?: boolean) => Book[];
  createLoan: (loan: Omit<Loan, "id" | "loanDate">) => Promise<void>;
  extendLoan: (loanId: string, newReturnDate: string) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  getLoanById: (id: string) => Loan | undefined;
  getBookLoans: (bookId: string) => Loan[];
  cancelLoan: (loanId: string) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

// atualiza livros iniciais com quantidade
const initialBooks: Book[] = [
  {
    id: "1",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    publisher: "Moderna",
    year: 1899,
    isbn: "9788573261240",
    category: "Literatura Brasileira",
    available: true,
    totalQuantity: 3,
    availableQuantity: 3
  },
  {
    id: "2",
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    publisher: "Agir",
    year: 1943,
    isbn: "9788574801612",
    category: "Literatura Estrangeira",
    available: false,
    totalQuantity: 2,
    availableQuantity: 2
  },
  {
    id: "3",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    publisher: "Companhia das Letras",
    year: 1881,
    isbn: "9788535911145",
    category: "Literatura Brasileira",
    available: true,
    totalQuantity: 4,
    availableQuantity: 4
  },
  {
    id: "4",
    title: "Vidas Secas",
    author: "Graciliano Ramos",
    publisher: "Record",
    year: 1938,
    isbn: "9788501041845",
    category: "Literatura Brasileira",
    available: true,
    totalQuantity: 5,
    availableQuantity: 5
  },
  {
    id: "5",
    title: "Capitães da Areia",
    author: "Jorge Amado",
    publisher: "Companhia das Letras",
    year: 1937,
    isbn: "9788535911442",
    category: "Literatura Brasileira",
    available: false,
    totalQuantity: 1,
    availableQuantity: 1
  }
];

const initialLoans: Loan[] = [
  {
    id: "1",
    bookId: "2",
    bookTitle: "O Pequeno Príncipe",
    studentName: "Ana Silva",
    studentId: "2023001",
    studentGrade: "1º Ano - Ensino Médio",
    loanDate: "2023-11-01",
    returnDate: "2023-11-15"
  },
  {
    id: "2",
    bookId: "5",
    bookTitle: "Capitães da Areia",
    studentName: "Pedro Oliveira",
    studentId: "2023045",
    studentGrade: "3º Ano - Ensino Médio",
    loanDate: "2023-11-05",
    returnDate: "2023-11-19"
  }
];

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // inicializa a partir do localStorage ou usa dados mockados
  useEffect(() => {
    const storedBooks = localStorage.getItem("library_books");
    const storedLoans = localStorage.getItem("library_loans");
    
    setBooks(storedBooks ? JSON.parse(storedBooks) : initialBooks);
    setLoans(storedLoans ? JSON.parse(storedLoans) : initialLoans);
    setLoading(false);
  }, []);

  // atualiza o localStorage quando livros ou empréstimos mudam
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem("library_books", JSON.stringify(books));
    }
  }, [books]);

  useEffect(() => {
    if (loans.length > 0) {
      localStorage.setItem("library_loans", JSON.stringify(loans));
    }
  }, [loans]);

  // operações de livro
  const addBook = async (bookData: Omit<Book, "id" | "available" | "availableQuantity">) => {
    try {
      setLoading(true);
      
      const newBook: Book = {
        ...bookData,
        id: Date.now().toString(),
        available: bookData.totalQuantity > 0,
        availableQuantity: bookData.totalQuantity
      };
      
      setBooks(prevBooks => [...prevBooks, newBook]);
      
      toast({
        title: "Livro adicionado",
        description: `"${newBook.title}" foi adicionado à biblioteca`,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar livro",
        description: error instanceof Error ? error.message : "Não foi possível adicionar o livro",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      setLoading(true);
      
      // verifica se o livro está emprestado
      const isOnLoan = loans.some(loan => loan.bookId === id);
      if (isOnLoan) {
        throw new Error("Não é possível excluir um livro que está emprestado");
      }
      
      // em um app real, seria uma chamada de API
      // await api.delete(`/books/${id}`);
      
      const bookToDelete = books.find(book => book.id === id);
      
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      
      toast({
        title: "Livro removido",
        description: bookToDelete 
          ? `"${bookToDelete.title}" foi removido da biblioteca` 
          : "Livro removido com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover livro",
        description: error instanceof Error ? error.message : "Não foi possível remover o livro",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = (query: string, onlyAvailable: boolean = false) => {
    if (!query.trim() && !onlyAvailable) return books;
    
    let filteredBooks = books;
    
    if (onlyAvailable) {
      filteredBooks = filteredBooks.filter(book => book.availableQuantity > 0);
    }
    
    if (query.trim()) {
      const lowerCaseQuery = query.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(lowerCaseQuery) || 
        book.id.includes(lowerCaseQuery) ||
        book.author.toLowerCase().includes(lowerCaseQuery) ||
        book.isbn.includes(lowerCaseQuery)
      );
    }
    
    return filteredBooks;
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  // operações de empréstimo
  const createLoan = async (loanData: Omit<Loan, "id" | "loanDate">) => {
    try {
      setLoading(true);
      
      const book = books.find(b => b.id === loanData.bookId);
      if (!book) {
        throw new Error("Livro não encontrado");
      }
      
      if (book.availableQuantity <= 0) {
        throw new Error("Este livro não está disponível para empréstimo");
      }
      
      const today = new Date().toISOString().split('T')[0];
      
      const newLoan: Loan = {
        ...loanData,
        id: Date.now().toString(),
        loanDate: today
      };
      
      // atualiza a disponibilidade e quantidade do livro
      setBooks(prevBooks => 
        prevBooks.map(b => {
          if (b.id === loanData.bookId) {
            const newQuantity = b.availableQuantity - 1;
            return {
              ...b,
              available: newQuantity > 0,
              availableQuantity: newQuantity
            };
          }
          return b;
        })
      );
      
      setLoans(prevLoans => [...prevLoans, newLoan]);
      
      toast({
        title: "Empréstimo registrado",
        description: `"${book.title}" emprestado para ${loanData.studentName}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao registrar empréstimo",
        description: error instanceof Error ? error.message : "Não foi possível registrar o empréstimo",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const extendLoan = async (loanId: string, newReturnDate: string) => {
    try {
      setLoading(true);
      
      // em um app real, seria uma chamada de API
      // await api.put(`/loans/${loanId}`, { returnDate: newReturnDate });
      
      // atualiza o empréstimo
      setLoans(prevLoans => 
        prevLoans.map(loan => 
          loan.id === loanId ? { ...loan, returnDate: newReturnDate } : loan
        )
      );
      
      toast({
        title: "Empréstimo prorrogado",
        description: `Data de devolução atualizada para ${new Date(newReturnDate).toLocaleDateString('pt-BR')}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao prorrogar empréstimo",
        description: error instanceof Error ? error.message : "Não foi possível prorrogar o empréstimo",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLoanById = (id: string) => {
    return loans.find(loan => loan.id === id);
  };

  const getBookLoans = (bookId: string) => {
    return loans.filter(loan => loan.bookId === bookId);
  };

  const cancelLoan = async (loanId: string) => {
    try {
      setLoading(true);
      
      const loan = loans.find(l => l.id === loanId);
      if (!loan) {
        throw new Error("Empréstimo não encontrado");
      }
      
      // atualiza a disponibilidade e quantidade do livro
      setBooks(prevBooks => 
        prevBooks.map(book => {
          if (book.id === loan.bookId) {
            const newQuantity = book.availableQuantity + 1;
            return {
              ...book,
              available: true,
              availableQuantity: newQuantity
            };
          }
          return book;
        })
      );
      
      // remove o empréstimo
      setLoans(prevLoans => prevLoans.filter(l => l.id !== loanId));
      
      toast({
        title: "Empréstimo cancelado",
        description: `O empréstimo de "${loan.bookTitle}" foi cancelado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro ao cancelar empréstimo",
        description: error instanceof Error ? error.message : "Não foi possível cancelar o empréstimo",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider value={{
      books,
      loans,
      loading,
      addBook,
      deleteBook,
      searchBooks,
      createLoan,
      extendLoan,
      getBookById,
      getLoanById,
      getBookLoans,
      cancelLoan
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
