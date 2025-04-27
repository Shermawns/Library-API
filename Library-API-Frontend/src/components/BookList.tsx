import { Book } from "../contexts/BookContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Trash2, Clock } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useBooks } from "../contexts/BookContext";

interface BookListProps {
  books: Book[];
  onDelete: (id: string) => Promise<void>;
  onLoan: (book: Book) => void;
}

const BookList = ({ books, onDelete, onLoan }: BookListProps) => {
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { loans } = useBooks();

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(bookToDelete.id);
    } finally {
      setIsDeleting(false);
      setBookToDelete(null);
    }
  };

  const isBookOverdue = (bookId: string) => {
    const currentDate = new Date();
    return loans.some(loan => 
      loan.bookId === bookId && new Date(loan.returnDate) < currentDate
    );
  };

  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Nenhum livro encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => {
        const isOverdue = isBookOverdue(book.id);
        const isAvailable = book.availableQuantity > 0;
        return (
        <Card key={book.id} className="book-card overflow-hidden h-full flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              {isAvailable ? (
                <Badge className="bg-green-100 text-green-600 border-green-200">
                  <div className="flex items-center">
                    <CheckCircle size={14} className="mr-1" />
                    {book.availableQuantity} disponível{book.availableQuantity !== 1 ? 's' : ''}
                  </div>
                </Badge>
              ) : isOverdue ? (
                <Badge className="bg-red-100 text-red-600 border-red-200">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Atrasado
                  </div>
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-600 border-amber-200">
                  <div className="flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    Indisponível
                  </div>
                </Badge>
              )}
              <div className="text-xs text-gray-500">ID: {book.id}</div>
            </div>
            <CardTitle className="mt-2 text-xl">{book.title}</CardTitle>
            <CardDescription>
              <div className="mt-2 text-sm text-gray-700">
                <div className="font-medium">Autor: {book.author}</div>
                <div>Editora: {book.publisher}</div>
                <div>Ano: {book.year}</div>
                <div>ISBN: {book.isbn}</div>
                <div>Categoria: {book.category}</div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-0 mt-auto">
            <div className="flex w-full justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setBookToDelete(book)}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} className="mr-1" />
                Excluir
              </Button>
              <Button 
                size="sm" 
                disabled={!isAvailable}
                onClick={() => isAvailable ? onLoan(book) : null}
                className={!isAvailable ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isAvailable ? "Emprestar" : "Indisponível"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )})}

      {/* diálogo de confirmação de exclusão */}
      <Dialog open={!!bookToDelete} onOpenChange={() => setBookToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o livro "{bookToDelete?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookToDelete(null)}>Cancelar</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookList;
