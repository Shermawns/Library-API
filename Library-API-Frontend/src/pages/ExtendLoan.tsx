import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ExtendLoan = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loans, extendLoan } = useBooks();
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(
    loans.find((loan) => loan.id === id)
  );
  const { toast } = useToast();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!currentLoan) {
      navigate("/book-loans");
      return;
    }

    const currentReturnDate = new Date(currentLoan.returnDate);
    const newReturnDate = new Date(currentReturnDate);
    newReturnDate.setDate(newReturnDate.getDate() + 7);

    const formattedDate = newReturnDate.toISOString().split('T')[0];
    setReturnDate(formattedDate);
  }, [currentLoan, navigate]);

  if (!currentLoan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedDate = new Date(returnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw new Error('A data de devolução não pode ser anterior à data atual');
      }

      await extendLoan(currentLoan.id, returnDate);
      toast({
        title: "Sucesso",
        description: "Empréstimo prorrogado com sucesso!",
      });
      navigate("/book-loans");
    } catch (error) {
      console.error('Error extending loan:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao prorrogar empréstimo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prorrogar Empréstimo</h1>

      <Card className="w-full animate-fade-in">
        <CardHeader>
          <CardTitle>Detalhes do Empréstimo</CardTitle>
          <CardDescription>
            Atualize a data de devolução do livro
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Livro</h3>
              <p className="mt-1 text-base font-medium">{currentLoan.bookTitle}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Aluno</h3>
              <p className="mt-1 text-base">{currentLoan.studentName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Matrícula</h3>
              <p className="mt-1 text-base">{currentLoan.studentId}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Série/Ano</h3>
              <p className="mt-1 text-base">{currentLoan.studentGrade}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Empréstimo</h3>
              <p className="mt-1 text-base">{formatDate(currentLoan.loanDate)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Data de Devolução Atual</h3>
              <p className="mt-1 text-base">{formatDate(currentLoan.returnDate)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="newReturnDate">Nova Data de Devolução</Label>
              <Input
                id="newReturnDate"
                type="date"
                required
                min={formatDateForInput(tomorrow)}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/book-loans")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                    <span>Atualizando...</span>
                  </div>
                ) : (
                  "Prorrogar Empréstimo"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtendLoan;
