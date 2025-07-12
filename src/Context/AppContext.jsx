import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AppContext = createContext()

const AppContextProvider = ({ children }) => {

    const [books, setBooks] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("All Genres");
    const [selectedType, setSelectedType] = useState("All Types");
    const [members, setMembers] = useState([]);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    })
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("isAuthenticated") === "true";
    });

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/members/auth/login", {
                email,
                password
            });
            
            if (response.data === true) {
                // Create user object with email
                const userData = { email };
                
                // Update state
                setUser(userData);
                setIsAuthenticated(true);
                
                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('isAuthenticated', 'true');
                
                return { success: true, message: "Login successful" };
            } else {
                return { success: false, message: "Invalid credentials" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { 
                success: false, 
                message: error.response?.data?.message || "Login failed" 
            };
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    };

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
            
            // Fetch member and book details for each borrowing
            const borrowingsWithFullDetails = await Promise.all(
                response.data.map(async (borrowing) => {
                    try {
                        // Fetch both member and book details in parallel
                        const [memberResponse, bookResponse] = await Promise.all([
                            axios.get(`http://localhost:8080/api/v1/members/${borrowing.memberId}`),
                            axios.get(`http://localhost:8080/api/v1/books/${borrowing.bookId}`)
                        ]);

                        return {
                            ...borrowing,
                            memberDetails: memberResponse.data,
                            borrowerName: memberResponse.data.name,
                            borrowerEmail: memberResponse.data.email,
                            borrowerPhone: memberResponse.data.phoneNumber,
                            borrowerAddress: memberResponse.data.address,
                            bookDetails: bookResponse.data,
                            bookName: bookResponse.data.bookName,
                            author: bookResponse.data.author,
                            isbn: bookResponse.data.isbn,
                            genre: bookResponse.data.genre,
                            imageUrl: bookResponse.data.imageUrl
                        };
                    } catch (error) {
                        console.error(`Error fetching details for borrowing ID ${borrowing.id}:`, error);
                        
                        // Handle member details fetch failure
                        let memberData = {
                            memberDetails: null,
                            borrowerName: 'Unknown Member',
                            borrowerEmail: 'N/A',
                            borrowerPhone: 'N/A',
                            borrowerAddress: 'N/A'
                        };

                        // Handle book details fetch failure
                        let bookData = {
                            bookDetails: null,
                            bookName: 'Unknown Book',
                            author: 'Unknown Author',
                            isbn: 'N/A',
                            genre: 'N/A',
                            imageUrl: null
                        };

                        // Try to fetch member details individually if parallel fetch failed
                        try {
                            const memberResponse = await axios.get(`http://localhost:8080/api/v1/members/${borrowing.memberId}`);
                            memberData = {
                                memberDetails: memberResponse.data,
                                borrowerName: memberResponse.data.name,
                                borrowerEmail: memberResponse.data.email,
                                borrowerPhone: memberResponse.data.phoneNumber,
                                borrowerAddress: memberResponse.data.address
                            };
                        } catch (memberError) {
                            console.error(`Error fetching member details for ID ${borrowing.memberId}:`, memberError);
                        }

                        // Try to fetch book details individually if parallel fetch failed
                        try {
                            const bookResponse = await axios.get(`http://localhost:8080/api/v1/books/${borrowing.bookId}`);
                            bookData = {
                                bookDetails: bookResponse.data,
                                bookName: bookResponse.data.bookName,
                                author: bookResponse.data.author,
                                isbn: bookResponse.data.isbn,
                                genre: bookResponse.data.genre,
                                imageUrl: bookResponse.data.imageUrl
                            };
                        } catch (bookError) {
                            console.error(`Error fetching book details for ID ${borrowing.bookId}:`, bookError);
                        }

                        return {
                            ...borrowing,
                            ...memberData,
                            ...bookData
                        };
                    }
                })
            );
            
            console.log("Issued books with full details:", borrowingsWithFullDetails);
            return borrowingsWithFullDetails;
        } catch (error) {
            console.error("Error fetching issued books:", error);
            throw error;
        }
    }

    const fetchAllMembers = async () => {
        try {
            const url = "http://localhost:8080/api/v1/members";
            const response = await axios.get(url);
            console.log("All members fetched:", response.data);
            setMembers(response.data || []); // Ensure it's always an array
            return response.data || [];
        } catch (error) {
            console.error("Error fetching all members:", error);
            setMembers([]); // Set to empty array on error
            return [];
        }
    }

    const addMembers = async (newMember) => {
        try {
            const url = "http://localhost:8080/api/v1/members";
            const response = await axios.post(url, newMember);
            setMembers(prevMembers => [...prevMembers, response.data]);
            console.log("Member added successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error adding member:", error);
            throw error;
        }
    }

    const deleteMember = async (memberId) => {
        try {
            const url = `http://localhost:8080/api/v1/members/${memberId}`;
            await axios.delete(url);
            setMembers(prevMembers => prevMembers.filter(member => member.memberId !== memberId));
            console.log("Member deleted successfully:", memberId);
        } catch (error) {
            console.error("Error deleting member:", error);
            throw error;
        }
    }

    useEffect(() => {
        fetchAllMembers();
    }, [])


            const editMember  = async (memberId, updatedData) => {
            try {
                const url = `http://localhost:8080/api/v1/members/${memberId}`;
                const response = await axios.put(url, updatedData);
                console.log("Member updated successfully:", response.data);
                return response.data;
            } catch (error) {
                console.error("Error updating member:", error);
                throw error;
            }
        }


    const updateBorrowings = async (borrowing, id) => {
        try {
            const url = `http://localhost:8080/api/v1/borrowings/${id}`;
            const response = await axios.put(url, borrowing);
            console.log("Borrowings updated successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating borrowings:", error);
            throw error;
        }
    }

    

  return (
    <AppContext.Provider value={{books, addBooks, updateBook, fetchIssuedBooks, members, setMembers, addMembers, deleteMember, editMember, fetchAllMembers, login, logout, user, updateBorrowings  }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider