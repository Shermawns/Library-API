import api from "./api";
import { Book } from "../contexts/BookContext";

export interface BookDTO {
  id?: number;
  titulo: string;
  autor: string;
  editora: string;
  anoDePublicacao: number;
  isbn: string;
  categoria?: string;
  categoriaStr: string;
  status?: string;
}

export interface AlunoDTO {
  id?: number;
  nome: string;
  matricula: string;
  email: string;
}

export interface AluguelDTO {
  id?: number;
  alunoId: number;
  livroId: number;
  dataDevolucao: string;
  devolvido?: boolean;
  entryDate?: string;
  exitDate?: string;
  livro?: {
    id: number;
    titulo: string;
  };
  aluno?: {
    id: number;
    nome: string;
    matricula: string;
  };
}

export const bookService = {
  // Livros
  getAllBooks: async (): Promise<Book[]> => {
    const response = await api.get<BookDTO[]>("/livro");
    const books = response.data.map((book: BookDTO) => ({
      id: book.id?.toString() || '',
      title: book.titulo || '',
      author: book.autor || '',
      publisher: book.editora || '',
      year: book.anoDePublicacao || 0,
      isbn: book.isbn || '',
      category: book.categoria || '',
      totalQuantity: 1,
      availableQuantity: book.status === 'DISPONIVEL' ? 1 : 0,
      available: book.status === 'DISPONIVEL'
    }));
    return books;
  },

  getBookById: async (id: string): Promise<Book> => {
    const response = await api.get<BookDTO>(`/livro/${id}`);
    const book = response.data;
    return {
      id: book.id?.toString() || '',
      title: book.titulo || '',
      author: book.autor || '',
      publisher: book.editora || '',
      year: book.anoDePublicacao || 0,
      isbn: book.isbn || '',
      category: book.categoria || '',
      totalQuantity: 1,
      availableQuantity: book.status === 'DISPONIVEL' ? 1 : 0,
      available: book.status === 'DISPONIVEL'
    };
  },

  addBook: async (bookData: {
    title: string;
    author: string;
    publisher: string;
    year: number;
    isbn: string;
    category: string;
    totalQuantity: number;
  }): Promise<Book> => {
    try {
      // Validações básicas
      if (!bookData.title?.trim()) {
        throw new Error("O título é obrigatório");
      }
      if (!bookData.author?.trim()) {
        throw new Error("O autor é obrigatório");
      }
      if (!bookData.publisher?.trim()) {
        throw new Error("A editora é obrigatória");
      }
      if (!bookData.isbn?.trim()) {
        throw new Error("O ISBN é obrigatório");
      }
      if (!bookData.category) {
        throw new Error("A categoria é obrigatória");
      }

      // Validar se a categoria é válida
      const validCategories = [
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

      if (!validCategories.includes(bookData.category)) {
        throw new Error(`Categoria inválida. Categorias válidas são: ${validCategories.join(", ")}`);
      }

      // Validar ano
      const currentYear = new Date().getFullYear();
      if (bookData.year < 1800 || bookData.year > currentYear) {
        throw new Error(`O ano deve estar entre 1800 e ${currentYear}`);
      }

      // Validar quantidade
      if (bookData.totalQuantity < 1) {
        throw new Error("A quantidade deve ser maior que zero");
      }

      const backendData: BookDTO = {
        titulo: bookData.title.trim(),
        autor: bookData.author.trim(),
        editora: bookData.publisher.trim(),
        anoDePublicacao: bookData.year,
        isbn: bookData.isbn.trim(),
        categoriaStr: bookData.category.toUpperCase()
      };

      const response = await api.post<BookDTO>("/livro/create", backendData);
      const book = response.data;

      return {
        id: book.id?.toString() || '',
        title: book.titulo || '',
        author: book.autor || '',
        publisher: book.editora || '',
        year: book.anoDePublicacao || 0,
        isbn: book.isbn || '',
        category: book.categoria || '',
        totalQuantity: bookData.totalQuantity,
        availableQuantity: book.status === 'DISPONIVEL' ? bookData.totalQuantity : 0,
        available: book.status === 'DISPONIVEL'
      };
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      if (error instanceof Error) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else if (error.message.includes('403')) {
          throw new Error('Você não tem permissão para adicionar livros. Por favor, faça login novamente.');
        } else if (error.message.includes('500')) {
          throw new Error('Erro no servidor. Por favor, verifique os logs do backend para mais detalhes.');
        }
      }
      throw error;
    }
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/livro/delete/${id}`);
  },

  searchBooks: async (query: string): Promise<Book[]> => {
    const allBooks = await bookService.getAllBooks();
    const searchTerm = query.toLowerCase();

    return allBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.isbn.toLowerCase().includes(searchTerm)
    );
  },

  // Alunos
  createStudent: async (studentData: { name: string; matricula: string; email: string }): Promise<AlunoDTO> => {
    try {
      const response = await api.post<AlunoDTO>("/aluno/create", {
        name: studentData.name,
        matricula: studentData.matricula,
        email: studentData.email
      });
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  getAllStudents: async (): Promise<AlunoDTO[]> => {
    const response = await api.get<AlunoDTO[]>("/aluno");
    return response.data;
  },

  // Empréstimos
  getAllLoans: async (): Promise<any[]> => {
    const response = await api.get<AluguelDTO[]>("/aluguel/filtrar/alugados");
    return response.data.map((aluguel: AluguelDTO) => ({
      id: aluguel.id?.toString() || '',
      bookId: aluguel.livro?.id?.toString() || '',
      bookTitle: aluguel.livro?.titulo || '',
      studentName: aluguel.aluno?.nome || '',
      studentId: aluguel.aluno?.id?.toString() || '',
      studentGrade: aluguel.aluno?.matricula || '',
      loanDate: aluguel.entryDate || new Date().toISOString().split('T')[0],
      returnDate: aluguel.exitDate || ''
    }));
  },

  createLoan: async (loanData: {
    bookId: string;
    studentName: string;
    studentId: string;
    studentGrade: string;
    returnDate: string;
  }): Promise<any> => {
    try {
      // First, try to find or create the student
      let student: AlunoDTO;
      try {
        const students = await bookService.getAllStudents();
        const existingStudent = students.find(s => s.matricula === loanData.studentId);

        if (!existingStudent) {
          student = await bookService.createStudent({
            name: loanData.studentName,
            matricula: loanData.studentId,
            email: `${loanData.studentId}@cm.cb.ce.gov.br`
          });
        } else {
          student = existingStudent;
        }
      } catch (error) {
        throw new Error('Falha ao processar dados do aluno. Verifique se a matrícula está correta.');
      }

      if (!student || !student.id) {
        throw new Error('Dados do aluno inválidos ou incompletos.');
      }

      // Now create the loan with the student ID
      const aluguelData = {
        alunoId: student.id,
        livroId: Number(loanData.bookId),
        dataDevolucao: loanData.returnDate
      };

      const response = await api.post<AluguelDTO>("/aluguel/alugar", aluguelData);
      const aluguel = response.data;

      return {
        id: aluguel.id?.toString() || '',
        bookId: aluguel.livro?.id?.toString() || '',
        bookTitle: aluguel.livro?.titulo || '',
        studentName: aluguel.aluno?.nome || '',
        studentId: aluguel.aluno?.matricula || '',
        studentGrade: loanData.studentGrade,
        loanDate: aluguel.entryDate || new Date().toISOString().split('T')[0],
        returnDate: aluguel.exitDate || ''
      };
    } catch (error) {
      console.error('Erro ao criar empréstimo:', error);
      if (error instanceof Error) {
        throw new Error(`Falha ao criar empréstimo: ${error.message}`);
      }
      throw error;
    }
  },

  extendLoan: async (loanId: string, newReturnDate: string): Promise<any> => {
    try {
      // Ensure we're working with a valid date string in YYYY-MM-DD format
      const date = new Date(newReturnDate);
      const formattedDate = date.toISOString().split('T')[0];

      // Validate the date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('A data de devolução não pode ser anterior à data atual');
      }

      // Use the correct request format
      const response = await api.put<AluguelDTO>(`/aluguel/estender/${loanId}`, {
        alunoId: null,
        livroId: null,
        dataDevolucao: formattedDate
      });

      if (!response.data) {
        throw new Error('Resposta inválida do servidor');
      }

      const aluguel = response.data;

      // Map the response data to match our frontend's format
      return {
        id: aluguel.id?.toString() || loanId,
        bookId: aluguel.livro?.id?.toString() || '',
        bookTitle: aluguel.livro?.titulo || '',
        studentName: aluguel.aluno?.nome || '',
        studentId: aluguel.aluno?.matricula || '',
        studentGrade: aluguel.aluno?.matricula || '',
        loanDate: aluguel.entryDate || new Date().toISOString().split('T')[0],
        returnDate: aluguel.exitDate || formattedDate
      };
    } catch (error) {
      console.error('Error extending loan:', error);
      if (error instanceof Error) {
        // Check for specific error messages from the backend
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw new Error(`Falha ao estender empréstimo: ${error.message}`);
      }
      throw error;
    }
  },

  cancelLoan: async (loanId: string): Promise<void> => {
    await api.post(`/aluguel/devolver/${loanId}`);
  }
};
