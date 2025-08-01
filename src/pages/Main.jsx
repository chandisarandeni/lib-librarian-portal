import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditBookModal from '../components/EditBookModal'
import EditUserModal from '../components/EditUserModal'
import { AppContext } from '../context/AppContext'

const Main = () => {
  const navigate = useNavigate()
  const {fetchPopularBooks, books = [], fetchAllMembers, fetchIssuedBooks} = useContext(AppContext)
  const [topChoices, setTopChoices] = useState([])
  const [members, setMembers] = useState([])
  const [issuedBooks, setIssuedBooks] = useState([])

  useEffect(() => {
    if (fetchPopularBooks) {
      fetchPopularBooks()
        .then(data => {
          setTopChoices(data)
        })
        .catch(error => {
          console.error('Error fetching popular books:', error)
          setTopChoices([])
        })
    }
  }, [fetchPopularBooks])

  useEffect(() => {
    fetchAllMembers()
    .then(data => {
      setMembers(data)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchIssuedBooks()
      .then(data => {
        setIssuedBooks(data)
        console.log('Issued Books:', data)
      })
      .catch(error => {
        console.error('Error fetching issued books:', error)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate overdue books from issued books
  const calculateOverdueBooks = () => {
    const today = new Date();
    
    return issuedBooks.filter(book => {
      // Step 1: Check if book is returned - if yes, don't show it
      if (book.returnStatus === 'Returned' || book.returnStatus === 'returned' || book.returnStatus === 'RETURNED' || book.returnStatus === 'return') {
        console.log(`Book ${book.bookId} is already returned with status: ${book.returnStatus}`);
        return false;
      }
      
      // Step 2: Check if book is not returned AND return day has passed
      if (!book.returnDate) return false;
      
      const returnDate = new Date(book.returnDate);
      const isOverdue = returnDate < today;
      
      if (isOverdue) {
        console.log(`Book ${book.bookId} is overdue. Due: ${book.returnDate}, Status: ${book.returnStatus}`);
      }
      
      return isOverdue; // Return day has passed
      
    }).map(book => {
      // Calculate fine for overdue books
      const returnDate = new Date(book.returnDate);
      const today = new Date();
      const daysPastDue = Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24));
      const fine = daysPastDue * 5; // $5 per day
      
      return {
        ...book,
        daysPastDue,
        fine: `$${fine.toFixed(2)}`
      };
    });
  };

  // Calculate currently borrowed books (not returned)
  const currentlyBorrowedBooks = issuedBooks.filter(book => 
    book.returnStatus !== 'Returned' && 
    book.returnStatus !== 'returned' && 
    book.returnStatus !== 'RETURNED' && 
    book.returnStatus !== 'return'
  );

  const overdueBooks = calculateOverdueBooks();

  const statsData = [
    { title: 'Total Books', value: books.length.toString(), icon: '📚', color: 'bg-blue-100 text-blue-700' },
    { title: 'Borrowed Books', value: currentlyBorrowedBooks.length.toString(), icon: '📖', color: 'bg-yellow-100 text-yellow-700' },
    { title: 'Overdue Books', value: overdueBooks.length.toString(), icon: '⏰', color: 'bg-red-100 text-red-700' },
    { title: 'Active Members', value: members.length.toString(), icon: '🧑‍🤝‍🧑', color: 'bg-green-100 text-green-700' }
  ]

  // Ensure we have safe arrays to work with
  const safeBooks = Array.isArray(books) ? books : []
  const safeMembers = Array.isArray(members) ? members : []

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Modal handlers
  const openEditModal = (book) => {
    setSelectedBook(book)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBook(null)
  }
  const handleEditBookSubmit = () => {
    closeEditModal()
  }
  const openUserEditModal = (user) => {
    setSelectedUser(user)
    setIsUserEditModalOpen(true)
  }
  const closeUserEditModal = () => {
    setIsUserEditModalOpen(false)
    setSelectedUser(null)
  }
  const handleEditUserSubmit = () => {
    closeUserEditModal()
  }

  return (
    <div className={`p-6 bg-gray-50 min-h-screen relative ${isEditModalOpen ? 'overflow-hidden' : ''}`}>
      {/* Modals */}
      {isEditModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EditBookModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            book={selectedBook}
            onSubmit={handleEditBookSubmit}
          />
        </div>
      )}
      {isUserEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EditUserModal
            isOpen={isUserEditModalOpen}
            onClose={closeUserEditModal}
            user={selectedUser}
            onSubmit={handleEditUserSubmit}
          />
        </div>
      )}

      {/* Librarian Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Librarian Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage books, users, and library activity.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard/add-books')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Book
          </button>
          <button
            onClick={() => navigate('/dashboard/add-user')}
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            + Add User
          </button>
        </div>
      </header>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statsData.map((stat, idx) => (
          <div key={idx} className={`flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm`}>
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Management Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Members List</h3>
              <div className="flex gap-2">
                <button onClick={() => {navigate('/dashboard/add-user')}} className="bg-[#B67242] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#8E552C] transition-colors">
                  Add New Member
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.slice(0, 4).map(user => (
                    <tr key={user.memberId}>
                      <td className="px-4 py-3 text-sm text-gray-900">#{user.memberId.toString().padStart(4, '0')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0"></div>
                          {user.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <button onClick={() => openUserEditModal(user)} className="border border-gray-300 px-3 py-1 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        {/* Books Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Books</h3>
            <button
              onClick={() => navigate('/dashboard/all-books')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {safeBooks.slice(0, 4).map(book => (
                  <tr key={book.bookId || book.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">#{(book.bookId || book.id || 0).toString().padStart(4, '0')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.bookName || book.title || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.author || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        (book.availabilityStatus || 'Available') === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : (book.availabilityStatus || 'Available') === 'Borrowed'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.availabilityStatus || 'Available'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        className="border border-gray-300 px-3 py-1 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => openEditModal(book)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Overdue Books */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Overdue Books</h3>
          <button
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            onClick={() => navigate('/dashboard/overdue-books')}
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overdueBooks.slice(0, 5).map(item => (
                <tr key={item.id || item.bookId}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.borrowerName || 'Unknown Member'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.bookName || 'Unknown Book'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(item.returnDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">{item.fine}</td>
                </tr>
              ))}
              {overdueBooks.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No overdue books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Main