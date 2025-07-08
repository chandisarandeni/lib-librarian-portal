import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AppContext = createContext()

const AppContextProvider = ({ children }) => {

    const [books, setBooks] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("All Genres");
    const [selectedType, setSelectedType] = useState("All Types");

    useEffect(() => {
    // Only fetch by genre if selectedType is not set and genre is set and not "All Genres"
    if ((!selectedType || selectedType === "All Types") && selectedGenre && selectedGenre !== "All Genres") {
        const fetchBooksByGenre = async () => {
            try {
                const url = "http://localhost:8080/api/v1/books";
                const params = { genre: selectedGenre };
                const response = await axios.get(url, { params });
                
                setBooks(response.data);
                console.log(response.data)
            } catch (error) {
                setBooks([]);
                console.error("Error fetching books by genre:", error);
            }
        };
        fetchBooksByGenre();
    }
    // If neither type nor genre is selected, fetch all books
    if ((!selectedType || selectedType === "All Types") && (!selectedGenre || selectedGenre === "All Genres")) {
        const fetchAllBooks = async () => {
            try {
                const url = "http://localhost:8080/api/v1/books";
                const response = await axios.get(url);
                
                setBooks(response.data);
                console.log(response.data)
            } catch (error) {
                setBooks([]);
                console.error("Error fetching all books:", error);
            }
        };
        fetchAllBooks();
    }
}, [selectedGenre, selectedType]);

    const addBooks = async (newBook) => {
        try {
            const url = "http://localhost:8080/api/v1/books/add";
            const response = await axios.post(url, newBook);
            
            setBooks(prevBooks => [...prevBooks, response.data]);
            console.log("Book added successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error adding book:", error);
            throw error;
        }
    }

    const updateBook = async (bookId, updatedBook) => {
        try {
            const url = `http://localhost:8080/api/v1/books/update/${bookId}`;
            const response = await axios.put(url, updatedBook);

            setBooks(prevBooks => prevBooks.map(book => 
                (book.bookId === bookId || book.id === bookId) ? response.data : book
            ));
            console.log("Book updated successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating book:", error);
            throw error;
        }
    }

    const fetchIssuedBooks = async () => {
        try {
            const url = "http://localhost:8080/api/v1/borrowings";
            const response = await axios.get(url);
            console.log("Issued books fetched:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching issued books:", error);
            throw error;
        }
    }

  return (
    <AppContext.Provider value={{books, addBooks, updateBook, fetchIssuedBooks}}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider