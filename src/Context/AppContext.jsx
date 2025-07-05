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
                
                // Remove duplicates based on book title
                const uniqueBooks = response.data.filter((book, index, self) =>
                    index === self.findIndex(b => b.bookName?.toLowerCase() === book.bookName?.toLowerCase())
                );
                
                setBooks(uniqueBooks);
                console.log(uniqueBooks)
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
                
                // Remove duplicates based on book title
                const uniqueBooks = response.data.filter((book, index, self) =>
                    index === self.findIndex(b => b.bookName?.toLowerCase() === book.bookName?.toLowerCase())
                );
                
                setBooks(uniqueBooks);
                console.log(uniqueBooks)
            } catch (error) {
                setBooks([]);
                console.error("Error fetching all books:", error);
            }
        };
        fetchAllBooks();
    }
}, [selectedGenre, selectedType]);
  return (
    <AppContext.Provider value={{books}}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider