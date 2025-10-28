import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ExternalLink, Heart, Eye, Calendar, Tag, ArrowLeft } from 'lucide-react'
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
  pricing_details: any
  upvote_count: number
  view_count: number
  created_at: string
  submitted_by: string | null
}

const ToolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (id) {
      fetchTool()
    }
  }, [id])

  useEffect(() => {
    if (tool && user) {
      checkUpvoteStatus()
    }
  }, [tool, user])

  const fetchTool = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single()

      if (error) {
        console.error('Error fetching tool:', error)
        return
      }

      setTool(data)
      setUpvoteCount(data.upvote_count)

      // Track view
      if (user) {
        supabase
          .from('analytics')
          .insert({
            tool_id: data.id,
            event_type: 'view',
            user_id: user.id
          })
      }
    } catch (error) {
      console.error('Error fetching tool:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkUpvoteStatus = async () => {
    if (!user || !tool) return

    try {
      const { data } = await supabase
        .from('upvotes')
        .select('id')
        .eq('user_id', user.id)
        .eq('tool_id', tool.id)
        .single()

      setIsUpvoted(!!data)
    } catch (error) {
      // No upvote found, which is fine
    }
  }

  const handleUpvote = async () => {
    if (!user) {
      toast.error('Please sign in to upvote tools')
      return
    }

    if (!tool) return

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
    } catch (error) {
      console.error('Error upvoting:', error)
      toast.error('Failed to upvote tool')
    }
  }

  const handleExternalClick = () => {
    if (!tool) return

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
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tool Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The tool you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/tools" className="btn-primary">
            Browse All Tools
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/tools"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Link>

        {/* Tool Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={tool.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                    {tool.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {tool.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 capitalize">
                  {tool.category.replace('-', ' ')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {getPricingBadge(tool.pricing_type)}
              <button
                onClick={handleUpvote}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isUpvoted
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${isUpvoted ? 'fill-current' : ''}`} />
                <span>{upvoteCount}</span>
              </button>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            {tool.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-md flex items-center"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{tool.view_count} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Added {new Date(tool.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={handleExternalClick}
              className="btn-primary flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Tool</span>
            </button>
          </div>
        </div>

        {/* Additional Information */}
        {tool.pricing_details && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pricing Information
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
                {JSON.stringify(tool.pricing_details, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToolDetailPage
