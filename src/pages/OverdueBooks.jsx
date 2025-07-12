import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'

const ROWS_PER_PAGE = 15

const OverdueBooks = () => {
  const [page, setPage] = useState(1)
  const [issuedBooks, setIssuedBooks] = useState([])
  const {fetchIssuedBooks} = useContext(AppContext)

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

  const allOverdueBooks = calculateOverdueBooks();
  const totalPages = Math.ceil(allOverdueBooks.length / ROWS_PER_PAGE)
  const paginatedBooks = allOverdueBooks.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  )

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Overdue Book List ({allOverdueBooks.length} book{allOverdueBooks.length !== 1 ? 's' : ''})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedBooks.map(item => (
                <tr key={item.id || item.bookId}>
                  <td className="px-4 py-3 text-sm text-gray-900">#{item.memberId.toString().padStart(4, '0')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.borrowerName || 'Unknown Member'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">#{item.bookId.toString().padStart(4, '0')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.bookName || 'Unknown Book'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.author || 'Unknown Author'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(item.returnDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-red-100 text-red-800">
                      {item.daysPastDue} day{item.daysPastDue !== 1 ? 's' : ''} overdue
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 font-semibold">{item.fine}</td>
                </tr>
              ))}
              {paginatedBooks.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">No overdue books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="inline-flex -space-x-px">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded-l-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border-t border-b border-gray-300 text-gray-700 bg-white hover:bg-gray-100 ${
                  page === i + 1 ? 'font-bold bg-blue-100 border-blue-400' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-r-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default OverdueBooks