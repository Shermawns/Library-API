
import { useState } from "react";
import { useBooks } from "../contexts/BookContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, AlertCircle, Search, BookX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const BookLoans = () => {
  const { loans, cancelLoan } = useBooks();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Filtra emprestimos baseado na search query
  const filteredLoans = loans.filter(loan => 
    loan.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // checa se data de retorno passou
  const isOverdue = (returnDate: string) => {
    const today = new Date();
    const returnDay = new Date(returnDate);
    return returnDay < today;
  };

  // pega o icone do status do pedido
  const getLoanStatus = (returnDate: string) => {
    const overdue = isOverdue(returnDate);
    
    if (overdue) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">
          <AlertCircle size={14} className="mr-1" />
          Atrasado
        </Badge>
      );
    }
    
    // calcula quantos dias falta
    const today = new Date();
    const returnDay = new Date(returnDate);
    const daysRemaining = Math.ceil((returnDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 3) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">
          <AlertCircle size={14} className="mr-1" />
          {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'} restante{daysRemaining !== 1 ? 's' : ''}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
        <CheckCircle size={14} className="mr-1" />
        Em dia
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleCancelClick = (loanId: string) => {
    setSelectedLoanId(loanId);
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedLoanId) {
      try {
        await cancelLoan(selectedLoanId);
        setIsDialogOpen(false);
        setSelectedLoanId(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível cancelar o empréstimo",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Empréstimos de Livros</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os empréstimos de livros da biblioteca
        </p>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por livro, aluno ou matrícula..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredLoans.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-white">
          <p className="text-gray-500">Nenhum empréstimo encontrado</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livro</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Série/Ano</TableHead>
                <TableHead>Data de Empréstimo</TableHead>
                <TableHead>Data de Devolução</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{loan.bookTitle}</TableCell>
                  <TableCell>{loan.studentName}</TableCell>
                  <TableCell>{loan.studentId}</TableCell>
                  <TableCell>{loan.studentGrade}</TableCell>
                  <TableCell>{formatDate(loan.loanDate)}</TableCell>
                  <TableCell>{formatDate(loan.returnDate)}</TableCell>
                  <TableCell>{getLoanStatus(loan.returnDate)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/extend-loan/${loan.id}`)}
                        className="flex items-center"
                      >
                        <Calendar size={14} className="mr-1" />
                        Prorrogar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelClick(loan.id)}
                        className="flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <BookX size={14} className="mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* diálogo de confirmação para cancelar empréstimo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Empréstimo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este empréstimo? 
              Isto irá registrar a devolução do livro e disponibilizá-lo para novos empréstimos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmCancel}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookLoans;