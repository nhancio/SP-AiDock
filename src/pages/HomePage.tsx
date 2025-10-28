import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Clock, Zap, BarChart, Settings, Cloud, Bot, Megaphone, Code, PenTool } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ToolCard from '../components/ToolCard'
import CategoryCard from '../components/CategoryCard'

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

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
}

const HomePage: React.FC = () => {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([])
  const [recentTools, setRecentTools] = useState<Tool[]>([])
  const [trendingTools, setTrendingTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🚀 Starting data fetch from Supabase...')
        console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
        console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
        
        // Test basic connection
        const { data: testData, error: testError } = await supabase
          .from('tools')
          .select('count', { count: 'exact', head: true })
        
        console.log('📊 Total tools in database:', testData?.length || 0)
        if (testError) {
          console.error('❌ Database connection test failed:', testError)
        }
        
        // Fetch all tools first to see what's available
        const { data: allTools, error: allToolsError } = await supabase
          .from('tools')
          .select('*')
        
        console.log('📋 All tools in database:', allTools?.length || 0)
        console.log('📋 All tools data:', allTools)
        if (allToolsError) {
          console.error('❌ Error fetching all tools:', allToolsError)
        }
        
        // Fetch featured tools (most saved)
        console.log('🔍 Fetching featured tools...')
        const { data: featured, error: featuredError } = await supabase
          .from('tools')
          .select('*')
          .eq('status', 'approved')
          .order('like_count', { ascending: false })
          .limit(6)

        console.log('⭐ Featured tools query result:', { data: featured, error: featuredError })
        console.log('⭐ Featured tools count:', featured?.length || 0)
        
        if (featuredError) {
          console.error('❌ Featured tools error:', featuredError)
        } else {
          console.log('✅ Featured tools fetched successfully:', featured?.length || 0)
        }

        // Fetch recent tools
        console.log('🕒 Fetching recent tools...')
        const { data: recent, error: recentError } = await supabase
          .from('tools')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(6)

        console.log('🕒 Recent tools query result:', { data: recent, error: recentError })
        console.log('🕒 Recent tools count:', recent?.length || 0)
        
        if (recentError) {
          console.error('❌ Recent tools error:', recentError)
        } else {
          console.log('✅ Recent tools fetched successfully:', recent?.length || 0)
        }

        // Fetch trending tools (most viewed in last 7 days)
        console.log('📈 Fetching trending tools...')
        const { data: trending, error: trendingError } = await supabase
          .from('tools')
          .select('*')
          .eq('status', 'approved')
          .order('view_count', { ascending: false })
          .limit(6)

        console.log('📈 Trending tools query result:', { data: trending, error: trendingError })
        console.log('📈 Trending tools count:', trending?.length || 0)
        
        if (trendingError) {
          console.error('❌ Trending tools error:', trendingError)
        } else {
          console.log('✅ Trending tools fetched successfully:', trending?.length || 0)
        }

        // Fetch categories
        console.log('🏷️ Fetching categories...')
        const { data: cats, error: catsError } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        console.log('🏷️ Categories query result:', { data: cats, error: catsError })
        console.log('🏷️ Categories count:', cats?.length || 0)
        
        if (catsError) {
          console.error('❌ Categories error:', catsError)
        } else {
          console.log('✅ Categories fetched successfully:', cats?.length || 0)
        }

        console.log('Data fetched:', { featured, recent, trending, cats })

        // Mock data as fallback if no tools are found
        const mockTools = [
          {
            id: '1',
            name: 'ChatGPT',
            description: 'Advanced AI conversation model that can help with writing, analysis, coding, and more.',
            short_description: 'AI-powered conversational assistant',
            url: 'https://chat.openai.com',
            logo_url: null,
            category: 'content-creation',
            tags: ['ai', 'chatbot', 'writing', 'assistant'],
            pricing_type: 'freemium',
            like_count: 150,
            view_count: 5000,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Midjourney',
            description: 'AI image generation tool that creates stunning artwork from text descriptions.',
            short_description: 'AI image generation from text',
            url: 'https://midjourney.com',
            logo_url: null,
            category: 'content-creation',
            tags: ['ai', 'image', 'art', 'generation'],
            pricing_type: 'paid',
            like_count: 120,
            view_count: 3500,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Claude',
            description: 'Anthropic\'s AI assistant focused on helpful, harmless, and honest responses.',
            short_description: 'AI assistant by Anthropic',
            url: 'https://claude.ai',
            logo_url: null,
            category: 'productivity',
            tags: ['ai', 'assistant', 'productivity', 'analysis'],
            pricing_type: 'freemium',
            like_count: 95,
            view_count: 2800,
            created_at: new Date().toISOString()
          }
        ]

        setFeaturedTools(featured?.length ? featured : mockTools)
        setRecentTools(recent?.length ? recent : mockTools)
        setTrendingTools(trending?.length ? trending : mockTools)
        setCategories(cats || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const categoryIcons = {
    'content-creation': PenTool,
    'productivity': Zap,
    'analytics': BarChart,
    'automation': Settings,
    'saas': Cloud,
    'agents': Bot,
    'marketing': Megaphone,
    'development': Code,
  }

  const getCategoryIcon = (slug: string) => {
    const IconComponent = categoryIcons[slug as keyof typeof categoryIcons] || Settings
    return IconComponent
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Discover the Best
              <span className="text-primary-600 dark:text-primary-400"> AI Tools</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Explore thousands of AI tools and agents. From content creation to automation, 
              find the perfect AI solution to boost your productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tools"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                Browse All Tools
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/submit"
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                Submit Your Tool
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find AI tools organized by their primary use case
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.slug)
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  icon={IconComponent}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Tools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Most saved AI tools by our community
              </p>
            </div>
            <Link
              to="/tools?sort=likes"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
            >
              View all
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Tools Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                Trending This Week
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Most viewed AI tools this week
              </p>
            </div>
            <Link
              to="/tools?sort=views"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
            >
              View all
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                Recently Added
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Fresh AI tools added to our directory
              </p>
            </div>
            <Link
              to="/tools?sort=newest"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
            >
              View all
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Submit Your AI Tool?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of AI tool creators and get your tool discovered by our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
            >
              Submit Your Tool
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/tools"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
            >
              Browse Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
