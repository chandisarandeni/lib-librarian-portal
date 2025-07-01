import React from 'react'
import { useNavigate } from 'react-router-dom';


const BookCard = ({bookId, title, author, cover, rating, votes, description}) => {
  const navigate = useNavigate();

  

  return (
<div onClick={() => navigate(`/book-details/${bookId}`)} className="group flex flex-col md:flex-row justify-center items-center max-md:text-center bg-gray-50 rounded-lg shadow p-4 max-w-xl">
      {/* Book Cover */}
      <img
        src={cover}
        alt={title}
        className="w-32 h-48 object-cover rounded-md shadow-md transform transition-transform duration-300 group-hover:scale-105"
      />
      {/* Book Info */}
      <div className="ml-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">{title}</h2>
          <p className="text-gray-600 mb-2">By {author}</p>
          <div className="flex items-center mb-2">
            {/* Stars */}
            <span className="text-[#FBBF24] text-lg mr-1">★</span>
            <span className="text-[#FBBF24] text-lg mr-1">★</span>
            <span className="text-[#FBBF24] text-lg mr-1">★</span>
            <span className="text-[#FBBF24] text-lg mr-1">★</span>
            <span className="text-gray-300 text-lg mr-2">★</span>
            <span className="text-gray-400 text-sm ml-2">{votes} votes</span>
          </div>
          <p className="text-gray-400 text-sm">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BookCard