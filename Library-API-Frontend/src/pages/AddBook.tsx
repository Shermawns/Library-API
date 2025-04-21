
import BookForm, { BookFormData } from "../components/BookForm";
import { useBooks } from "../contexts/BookContext";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const { addBook } = useBooks();
  const navigate = useNavigate();

  const handleAddBook = async (bookData: BookFormData) => {
    await addBook(bookData);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <BookForm onSubmit={handleAddBook} />
    </div>
  );
};

export default AddBook;
