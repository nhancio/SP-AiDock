import React from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
}

interface CategoryCardProps {
  category: Category
  icon: LucideIcon
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, icon: IconComponent }) => {
  return (
    <Link
      to={`/tools?category=${category.slug}`}
      className="block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 group hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 select-none"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: category.color ? `${category.color}20` : '#3B82F620' }}
        >
          <IconComponent 
            className="w-6 h-6" 
            style={{ color: category.color || '#3B82F6' }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {category.name}
          </h3>
        </div>
      </div>
      
      {category.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {category.description}
        </p>
      )}
      
      <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300">
        Explore tools
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

export default CategoryCard
