import { useBooks, BookFormData as ContextBookFormData } from "../contexts/BookContext";
import { useNavigate } from "react-router-dom";
import BookForm, { BookFormData as FormBookFormData } from "../components/BookForm";

const AddBook = () => {
  const { addBook } = useBooks();
  const navigate = useNavigate();

  // Convertemos o tipo do formulário para o tipo esperado pelo contexto
  const handleAddBook = async (bookData: FormBookFormData) => {
    const contextData: ContextBookFormData = {
      ...bookData,
      year: bookData.year.toString(), // Converter o ano para string conforme esperado pelo contexto
      totalQuantity: bookData.totalQuantity.toString() // Converter a quantidade para string conforme esperado pelo contexto
    };
    await addBook(contextData);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <BookForm onSubmit={handleAddBook} />
    </div>
  );
};

export default AddBook;
