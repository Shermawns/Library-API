import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface BookFormProps {
  onSubmit: (book: BookFormData) => Promise<void>;
}

export interface BookFormData {
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  category: string;
  totalQuantity: number;
}

const categories = [
  "ROMANCE",
  "FICCAO_CIENTIFICA",
  "MISTERIO",
  "HORROR",
  "BIOGRAFIA",
  "HISTORIA",
  "FILOSOFIA",
  "LITERATURA_INFANTIL",
  "GIBI",
  "TECNOLOGIA",
  "PORTUGUES",
  "LITERATURA",
  "INGLES",
  "BIOLOGIA",
  "QUIMICA",
  "FISICA",
  "CIENCIAS",
  "GEOGRAFIA",
  "SOCIOLOGIA",
  "MATEMATICA",
  "INFORMATICA",
  "OUTRO"
];

// Mapeamento de categorias para exibição amigável
const categoryDisplayNames: { [key: string]: string } = {
  ROMANCE: "Romance",
  FICCAO_CIENTIFICA: "Ficção Científica",
  MISTERIO: "Mistério",
  HORROR: "Horror",
  BIOGRAFIA: "Biografia",
  HISTORIA: "História",
  FILOSOFIA: "Filosofia",
  LITERATURA_INFANTIL: "Literatura Infantil",
  GIBI: "Gibi/HQ",
  TECNOLOGIA: "Tecnologia",
  PORTUGUES: "Português",
  LITERATURA: "Literatura",
  INGLES: "Inglês",
  BIOLOGIA: "Biologia",
  QUIMICA: "Química",
  FISICA: "Física",
  CIENCIAS: "Ciências",
  GEOGRAFIA: "Geografia",
  SOCIOLOGIA: "Sociologia",
  MATEMATICA: "Matemática",
  INFORMATICA: "Informática",
  OUTRO: "Outro"
};

const currentYear = new Date().getFullYear();

const BookForm = ({ onSubmit }: BookFormProps) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    publisher: "",
    year: currentYear,
    isbn: "",
    category: "LITERATURA",
    totalQuantity: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      throw new Error("O título é obrigatório");
    }
    if (!formData.author.trim()) {
      throw new Error("O autor é obrigatório");
    }
    if (!formData.publisher.trim()) {
      throw new Error("A editora é obrigatória");
    }
    if (!formData.isbn.trim()) {
      throw new Error("O ISBN é obrigatório");
    }
    if (!formData.category) {
      throw new Error("Por favor, selecione uma categoria para o livro");
    }
    if (!categories.includes(formData.category)) {
      throw new Error("Categoria inválida. Por favor, selecione uma categoria válida");
    }
    if (formData.year < 1800 || formData.year > currentYear) {
      throw new Error(`O ano deve estar entre 1800 e ${currentYear}`);
    }
    if (formData.totalQuantity < 1) {
      throw new Error("A quantidade deve ser maior que zero");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        year: parseInt(formData.year),
        isbn: formData.isbn,
        category: formData.category,
        totalQuantity: parseInt(formData.totalQuantity)
      };

      await onSubmit(bookData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
      if (error instanceof Error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>Adicionar Novo Livro</CardTitle>
        <CardDescription>
          Preencha o formulário para adicionar um novo livro à biblioteca
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              placeholder="Título do livro"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
              name="author"
              placeholder="Nome do autor"
              required
              value={formData.author}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publisher">Editora</Label>
            <Input
              id="publisher"
              name="publisher"
              placeholder="Nome da editora"
              required
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Ano de Publicação</Label>
            <Input
              id="year"
              name="year"
              type="number"
              min={1800}
              max={currentYear}
              required
              value={formData.year}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              name="isbn"
              placeholder="ISBN do livro"
              required
              value={formData.isbn}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {categoryDisplayNames[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalQuantity">Quantidade Total</Label>
            <Input
              id="totalQuantity"
              name="totalQuantity"
              type="number"
              min={1}
              required
              value={formData.totalQuantity}
              onChange={handleChange}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                <span>Adicionando...</span>
              </div>
            ) : (
              "Adicionar Livro"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookForm;
