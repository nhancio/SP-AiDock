import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ExternalLink, Eye } from 'lucide-react'
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
  upvote_count: number
  view_count: number
  created_at: string
}

interface ToolCardProps {
  tool: Tool
  onUpvote?: () => void
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onUpvote }) => {
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(tool.upvote_count)
  const { user } = useAuth()

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please sign in to upvote tools')
      return
    }

    try {
      if (isUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', tool.id)

        if (error) throw error

        setIsUpvoted(false)
        setUpvoteCount(prev => prev - 1)
        toast.success('Upvote removed')
      } else {
        // Add upvote
        const { error } = await supabase
          .from('upvotes')
          .insert({
            user_id: user.id,
            tool_id: tool.id
          })

        if (error) throw error

        setIsUpvoted(true)
        setUpvoteCount(prev => prev + 1)
        toast.success('Tool upvoted!')
      }

      if (onUpvote) {
        onUpvote()
      }
    } catch (error) {
      console.error('Error upvoting:', error)
      toast.error('Failed to upvote tool')
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
      paid: { text: 'Paid', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      subscription: { text: 'Subscription', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      one_time: { text: 'One-time', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' }
    }
    
    const badge = badges[pricingType as keyof typeof badges] || badges.free
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200 group">
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
        <button
          onClick={handleUpvote}
          className={`p-2 rounded-lg transition-colors ${
            isUpvoted
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <Heart className={`w-5 h-5 ${isUpvoted ? 'fill-current' : ''}`} />
        </button>
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
            <Heart className="w-4 h-4" />
            <span>{upvoteCount}</span>
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

      <div className="mt-4 flex items-center justify-between">
        <Link
          to={`/tools/${tool.id}`}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center"
        >
          View Details
        </Link>
        <button
          onClick={handleExternalClick}
          className="text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ToolCard
