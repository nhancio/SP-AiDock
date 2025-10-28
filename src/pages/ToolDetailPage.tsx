import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ExternalLink, 
  Bookmark, 
  Calendar, 
  Star, 
  CheckCircle, 
  Twitter, 
  Linkedin, 
  Facebook,
  ChevronRight
} from 'lucide-react'
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
  like_count: number
  view_count: number
  created_at: string
  submitted_by: string | null
}

const ToolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')
  const { user } = useAuth()

  useEffect(() => {
    if (id) {
      fetchTool()
    }
  }, [id])

  useEffect(() => {
    if (tool && user) {
      checkLikeStatus()
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
      setLikeCount(data.like_count)

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

  const checkLikeStatus = async () => {
    if (!user || !tool) return

    try {
      const { data } = await supabase
        .from('saved_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('tool_id', tool.id)
        .single()

      setIsLiked(!!data)
    } catch (error) {
      // No like found, which is fine
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to save tools')
      return
    }

    if (!tool) return

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
    } catch (error) {
      console.error('Error saving tool:', error)
      toast.error('Failed to save tool')
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

  const getPricingText = (pricingType: string) => {
    const pricing = {
      free: 'Free',
      freemium: 'Freemium',
      paid: 'Contact for Pricing'
    }
    return pricing[pricingType as keyof typeof pricing] || 'Contact for Pricing'
  }

  const getCategoryDisplayName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/tools" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              AI Tools
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tool Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
              {/* Tool Header */}
              <div className="flex items-start space-x-6 mb-6">
                {/* Tool Logo */}
                <div className="flex-shrink-0">
                  {tool.logo_url ? (
                    <img
                      src={tool.logo_url}
                      alt={tool.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {tool.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tool Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {tool.name}
                    </h1>
                    <div className="flex items-center space-x-1">
                      {renderStars(4)}
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">(0)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getPricingText(tool.pricing_type)}
                    </span>
                  </div>

                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    {tool.short_description || tool.description}
                  </p>

                  {/* Categories */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      AI Categories: {getCategoryDisplayName(tool.category)}
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center space-x-4 mb-6">
                    <button className="text-gray-400 hover:text-blue-500 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isLiked
                          ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{likeCount}</span>
                    </button>
                    
                    <button
                      onClick={handleExternalClick}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Visit Site</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>


            {/* Tabbed Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-8">
                  {[
                    { id: 'overview', label: `What is ${tool.name}` },
                    { id: 'reviews', label: `${tool.name} Reviews` },
                    { id: 'alternatives', label: `${tool.name} Alternatives` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      Updated {new Date(tool.created_at).toLocaleDateString()}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      What is {tool.name}?
                    </h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Reviews
                    </h3>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        No reviews yet. Be the first to review this tool!
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'alternatives' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Alternatives
                    </h3>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ExternalLink className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Alternative tools will be suggested here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Tool Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tool Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tool.view_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Saves</span>
                    <span className="font-medium text-gray-900 dark:text-white">{likeCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {getCategoryDisplayName(tool.category)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pricing</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getPricingText(tool.pricing_type)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolDetailPage