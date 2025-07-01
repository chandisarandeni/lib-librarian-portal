import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditBookModal from '../components/EditBookModal'
import EditUserModal from '../components/EditUserModal'

const Main = () => {
  const navigate = useNavigate()

  // Example data (replace with real data/fetch as needed)
  const statsData = [
    { title: 'Total Books', value: '1,240', icon: '📚', color: 'bg-blue-100 text-blue-700' },
    { title: 'Borrowed Books', value: '740', icon: '📖', color: 'bg-yellow-100 text-yellow-700' },
    { title: 'Overdue Books', value: '22', icon: '⏰', color: 'bg-red-100 text-red-700' },
    { title: 'Active Members', value: '320', icon: '🧑‍🤝‍🧑', color: 'bg-green-100 text-green-700' }
  ]

  const users = [
    { id: 1, name: 'John Doe', books: 5, role: 'Student', status: 'Active' },
    { id: 2, name: 'Jane Smith', books: 3, role: 'Faculty', status: 'Active' },
    { id: 3, name: 'Mike Johnson', books: 7, role: 'Student', status: 'Inactive' },
    { id: 4, name: 'Sarah Wilson', books: 2, role: 'Staff', status: 'Active' }
  ]

  const books = [
    { id: 1, title: 'React Guide', author: 'John Smith', isbn: 'ISBN-001', status: 'Available' },
    { id: 2, title: 'JavaScript Pro', author: 'Jane Doe', isbn: 'ISBN-002', status: 'Borrowed' },
    { id: 3, title: 'CSS Mastery', author: 'Bob Johnson', isbn: 'ISBN-003', status: 'Available' },
    { id: 4, title: 'HTML Basics', author: 'Alice Brown', isbn: 'ISBN-004', status: 'Overdue' }
  ]

  const overdueBooks = [
    { id: 1, user: 'John Doe', book: 'React Guide', dueDate: '2023-06-15', fine: '$5.00' },
    { id: 2, user: 'Mike Johnson', book: 'CSS Mastery', dueDate: '2023-06-10', fine: '$8.50' },
    { id: 3, user: 'Sarah Wilson', book: 'HTML Basics', dueDate: '2023-06-12', fine: '$3.00' }
  ]

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
  const handleEditBookSubmit = (updatedBook) => {
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
  const handleEditUserSubmit = (updatedUser) => {
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
            <h3 className="text-lg font-semibold text-gray-800">Users</h3>
            <button
              onClick={() => navigate('/dashboard/all-users')}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Books</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">#{user.id.toString().padStart(4, '0')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.books}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.role}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => openUserEditModal(user)}
                        className="border border-gray-300 px-3 py-1 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors"
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
                {books.map(book => (
                  <tr key={book.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">#{book.id.toString().padStart(4, '0')}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.author}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        book.status === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : book.status === 'Borrowed'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.status}
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
              {overdueBooks.map(item => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.user}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.book}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.dueDate}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">{item.fine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Main