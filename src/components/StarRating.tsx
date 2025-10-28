import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRatingChange,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, i) => (
        <button
          key={i}
          onClick={() => handleClick(i + 1)}
          disabled={!interactive}
          className={`${
            interactive 
              ? 'cursor-pointer hover:scale-110 transition-transform' 
              : 'cursor-default'
          }`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              i < rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
      {showNumber && (
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
          ({rating})
        </span>
      )}
    </div>
  )
}

export default StarRating
