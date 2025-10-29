import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Eye, Bookmark } from 'lucide-react'
import { generateToolUrl } from '../utils/urlUtils'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface Tool {
  id: string
  name: string
  description: string
  short_description: string | null
  url: string
  logo_url: string | null
  category: string
  tags: string[]
  pricing_type: string
  like_count: number
  view_count: number
  created_at: string
}

interface ToolCardProps {
  tool: Tool
  onLike?: () => void
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onLike }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(tool.like_count)
  const { user } = useAuth()

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please sign in to save tools')
      return
    }

    try {
      if (isLiked) {
        // Remove like/save
        const { error } = await supabase
          .from('saved_items')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', tool.id)

        if (error) throw error

        setIsLiked(false)
        setLikeCount(prev => prev - 1)
        toast.success('Removed from saved items')
      } else {
        // Add like/save
        const { error } = await supabase
          .from('saved_items')
          .insert({
            user_id: user.id,
            tool_id: tool.id
          })

        if (error) throw error

        setIsLiked(true)
        setLikeCount(prev => prev + 1)
        toast.success('Tool saved!')
      }

      if (onLike) {
        onLike()
      }
    } catch (error) {
      console.error('Error saving tool:', error)
      toast.error('Failed to save tool')
    }
  }

  const handleExternalClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Track click
    if (user) {
      supabase
        .from('analytics')
        .insert({
          tool_id: tool.id,
          event_type: 'click',
          user_id: user.id
        })
    }

    window.open(tool.url, '_blank', 'noopener,noreferrer')
  }

  const getPricingBadge = (pricingType: string) => {
    const badges = {
      free: { text: 'Free', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      freemium: { text: 'Freemium', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      paid: { text: 'Paid', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
    }
    
    const badge = badges[pricingType as keyof typeof badges] || badges.free
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'content-creation': 'from-pink-500 to-rose-500',
      'productivity': 'from-blue-500 to-cyan-500',
      'analytics': 'from-yellow-500 to-orange-500',
      'automation': 'from-purple-500 to-indigo-500',
      'saas': 'from-green-500 to-emerald-500',
      'agents': 'from-red-500 to-pink-500',
      'marketing': 'from-teal-500 to-blue-500',
      'development': 'from-gray-500 to-slate-500'
    }
    return colors[category as keyof typeof colors] || 'from-gray-500 to-slate-500'
  }

  return (
    <div className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200">
      {/* Gradient overlay */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(tool.category)}`}></div>
      
      {/* Clickable card content */}
      <Link 
        to={generateToolUrl(tool.name)}
        className="block p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={tool.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                  {tool.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {tool.category.replace('-', ' ')}
              </p>
            </div>
          </div>
          {/* Placeholder for button space */}
          <div className="w-10 h-10"></div>
        </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {tool.short_description || tool.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
        {tool.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
            +{tool.tags.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Bookmark className="w-4 h-4" />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{tool.view_count}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getPricingBadge(tool.pricing_type)}
        </div>
      </div>

      </Link>

      {/* Floating buttons - positioned absolutely to avoid interfering with card click */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={handleLike}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isLiked
              ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
              : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={handleExternalClick}
          className="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default ToolCard
