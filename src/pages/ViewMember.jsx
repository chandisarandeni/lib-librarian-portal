import React from 'react'
import PopularBookCard from '../components/PopularBookCard'

const member = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Student',
  status: 'Active',
  profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
  joined: '2023-01-15',
}

const borrowedBooks = [
  {
    bookId: 1,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81H9b5HkJIL.jpg',
    rating: 4,
    votes: 120,
    description: 'Timeless lessons on wealth, greed, and happiness.',
    dueDate: '2025-07-10',
    status: 'Borrowed'
  },
  {
    bookId: 2,
    title: 'Company of One',
    author: 'Paul Jarvis',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81l3rZK4lnL.jpg',
    rating: 4,
    votes: 85,
    description: 'Why staying small is the next big thing for business.',
    dueDate: '2025-07-15',
    status: 'Borrowed'
  }
]

const returnedBooks = [
  {
    bookId: 3,
    title: 'How Innovation Works',
    author: 'Matt Ridley',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/81w+3k4vQwL.jpg',
    rating: 4,
    votes: 60,
    description: 'And why it flourishes in freedom.',
    returnDate: '2025-06-20',
    status: 'Returned'
  }
]

const ViewMember = () => (
  <div className="min-h-screen bg-gray-50 px-8 py-8 flex justify-center items-start">
    <div className="bg-white rounded-xl shadow-sm p-8 w-full mx-auto">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <img
          src={member.profilePic}
          alt={member.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h1>
          <p className="text-gray-600 mb-1"><b>Email:</b> {member.email}</p>
          <p className="text-gray-600 mb-1"><b>Role:</b> {member.role}</p>
          <p className="text-gray-600 mb-1"><b>Status:</b> <span className={member.status === 'Active' ? 'text-green-600' : 'text-red-600'}>{member.status}</span></p>
          <p className="text-gray-600 mb-1"><b>Joined:</b> {member.joined}</p>
          <p className="text-gray-600 mb-1"><b>Member ID:</b> #{member.id.toString().padStart(4, '0')}</p>
        </div>
      </div>

      {/* Borrowed Books */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Currently Borrowed Books</h2>
        {borrowedBooks.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No borrowed books.</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {borrowedBooks.map(book => (
              <PopularBookCard key={book.bookId} {...book} />
            ))}
          </div>
        )}
      </div>

      {/* Returned Books */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Returned Books</h2>
        {returnedBooks.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No returned books.</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {returnedBooks.map(book => (
              <PopularBookCard key={book.bookId} {...book} />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)

export default ViewMember