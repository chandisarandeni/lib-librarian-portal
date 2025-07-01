import React from 'react'

const PopularBookCard = ({title, author, cover}) => {
  return (
    <div className="group w-40 bg-white rounded-lg shadow p-2">
      <img
        src={cover}
        alt={title}
        className="w-full h-48 object-cover rounded transform transition-transform duration-300 group-hover:scale-105"
      />
      <div className="mt-2">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mb-1">{author}</p>
        <div className="flex items-center text-xs">
          <span className="text-[#FBBF24]">★</span>
          <span className="text-[#FBBF24]">★</span>
          <span className="text-[#FBBF24]">★</span>
          <span className="text-[#FBBF24]">★</span>
          <span className="text-gray-300">★</span>
        </div>
      </div>
    </div>
  )
}

export default PopularBookCard