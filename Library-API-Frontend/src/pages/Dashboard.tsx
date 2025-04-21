import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import LoanForm, { LoanFormData } from "../components/LoanForm";
import { Book } from "../contexts/BookContext";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BookOpen, BookCheck, Library, Clock } from "lucide-react";

const Dashboard = () => {
  const { books, searchBooks, deleteBook, createLoan, loans } = useBooks();
  const navigate = useNavigate();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filterValue, setFilterValue] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isBookOverdue = (bookId: string) => {
    const currentDate = new Date();
    const loan = loans.find(loan => loan.bookId === bookId);
    if (!loan) return false;
    
    return new Date(loan.returnDate) < currentDate;
  };

  const applyFilters = (query: string, filter: string) => {
    let result = searchBooks(query);
    
    switch (filter) {
      case "available":
        result = result.filter(book => book.available);
        break;
      case "borrowed":
        result = result.filter(book => !book.available);
        break;
      case "overdue":
        result = result.filter(book => !book.available && isBookOverdue(book.id));
        break;
      default:
        break;
    }
    
    setFilteredBooks(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filterValue);
  };

  const handleFilterChange = (value: string) => {
    if (value) {
      setFilterValue(value);
      applyFilters(searchQuery, value);
    }
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
  };

  const handleLoanClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleLoanSubmit = async (loanData: LoanFormData) => {
    await createLoan(loanData);
    setSelectedBook(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-2">Pesquisar Livros</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Digite o título, autor ou ID do livro para encontrá-lo rapidamente
          </p>
          <div className="space-y-4">
            <SearchBar 
              onSearch={handleSearch} 
              className="max-w-3xl"
            />
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
              <ToggleGroup type="single" value={filterValue} onValueChange={handleFilterChange}>
                <ToggleGroupItem value="all" aria-label="Todos os livros">
                  <Library className="h-4 w-4 mr-2" />
                  Todos
                </ToggleGroupItem>
                <ToggleGroupItem value="available" aria-label="Livros disponíveis">
                  <BookCheck className="h-4 w-4 mr-2" />
                  Disponíveis
                </ToggleGroupItem>
                <ToggleGroupItem value="borrowed" aria-label="Livros emprestados">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Emprestados
                </ToggleGroupItem>
                <ToggleGroupItem value="overdue" aria-label="Livros atrasados">
                  <Clock className="h-4 w-4 mr-2" />
                  Atrasados
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </div>

      <BookList 
        books={filteredBooks} 
        onDelete={handleDeleteBook} 
        onLoan={handleLoanClick}
      />

      {/* emprestimo dialog */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Empréstimo de Livro</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para registrar o empréstimo.
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <LoanForm
              book={selectedBook}
              onSubmit={handleLoanSubmit}
              onCancel={() => setSelectedBook(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;