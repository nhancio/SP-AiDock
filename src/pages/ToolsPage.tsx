import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import ToolCard from '../components/ToolCard'
import { supabase } from '../lib/supabase'

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

const ToolsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedPricing, setSelectedPricing] = useState(searchParams.get('pricing') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchTools()
  }, [searchQuery, selectedCategory, selectedPricing, sortBy])

  const fetchTools = async () => {
    setLoading(true)
    try {
      console.log('🔍 ToolsPage: Starting tools fetch...')
      console.log('🔍 Search query:', searchQuery)
      console.log('🔍 Selected category:', selectedCategory)
      console.log('🔍 Selected pricing:', selectedPricing)
      console.log('🔍 Sort by:', sortBy)
      
      // First, let's check what tools exist in the database
      const { data: allTools, error: allToolsError } = await supabase
        .from('tools')
        .select('*')
      
      console.log('📋 ToolsPage: All tools in database:', allTools?.length || 0)
      console.log('📋 ToolsPage: All tools data:', allTools)
      if (allToolsError) {
        console.error('❌ ToolsPage: Error fetching all tools:', allToolsError)
      }
      
      let query = supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved')

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
      }

      // Apply category filter
      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      // Apply pricing filter
      if (selectedPricing) {
        query = query.eq('pricing_type', selectedPricing)
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'upvotes':
          query = query.order('upvote_count', { ascending: false })
          break
        case 'views':
          query = query.order('view_count', { ascending: false })
          break
        case 'name':
          query = query.order('name', { ascending: true })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      console.log('🔍 ToolsPage: Executing final query...')
      const { data, error } = await query

      console.log('📊 ToolsPage: Query result:', { data, error })
      console.log('📊 ToolsPage: Tools count after filters:', data?.length || 0)
      console.log('📊 ToolsPage: Tools data:', data)

      if (error) {
        console.error('❌ ToolsPage: Error fetching tools:', error)
        return
      }

      console.log('✅ ToolsPage: Tools fetched successfully:', data?.length || 0)
      setTools(data || [])
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    setSearchParams(params)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value) {
      params.set(filterType, value)
    } else {
      params.delete(filterType)
    }
    
    setSearchParams(params)
    
    switch (filterType) {
      case 'category':
        setSelectedCategory(value)
        break
      case 'pricing':
        setSelectedPricing(value)
        break
      case 'sort':
        setSortBy(value)
        break
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedPricing('')
    setSortBy('newest')
    setSearchParams({})
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
          <h3 className="font-bold text-yellow-800">🐛 Debug Info:</h3>
          <p className="text-sm text-yellow-700">
            Tools loaded: {tools.length} | Loading: {loading ? 'Yes' : 'No'} | 
            Search: "{searchQuery}" | Category: "{selectedCategory}" | 
            Pricing: "{selectedPricing}" | Sort: "{sortBy}"
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Check browser console for detailed API call logs
          </p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI Tools Directory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover and explore {tools.length} AI tools across all categories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI tools..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="upvotes">Most Upvoted</option>
              <option value="views">Most Viewed</option>
              <option value="name">Name A-Z</option>
            </select>

            {(searchQuery || selectedCategory || selectedPricing) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  <option value="content-creation">Content Creation</option>
                  <option value="productivity">Productivity</option>
                  <option value="analytics">Analytics</option>
                  <option value="automation">Automation</option>
                  <option value="saas">SaaS</option>
                  <option value="agents">Agents</option>
                  <option value="marketing">Marketing</option>
                  <option value="development">Development</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pricing
                </label>
                <select
                  value={selectedPricing}
                  onChange={(e) => handleFilterChange('pricing', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Pricing</option>
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                  <option value="subscription">Subscription</option>
                  <option value="one_time">One-time</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {tools.length} tool{tools.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToolsPage
