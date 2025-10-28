import React, { useState } from 'react'
import { Search, ArrowRight, Zap, BarChart, Settings, Cloud, Bot, Megaphone, Code, PenTool } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SearchEngine: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const navigate = useNavigate()

  const categories = [
    { id: 'content-creation', name: 'Content Creation', icon: PenTool, color: 'bg-blue-500' },
    { id: 'productivity', name: 'Productivity', icon: Zap, color: 'bg-green-500' },
    { id: 'analytics', name: 'Analytics', icon: BarChart, color: 'bg-yellow-500' },
    { id: 'automation', name: 'Automation', icon: Settings, color: 'bg-purple-500' },
    { id: 'saas', name: 'SaaS', icon: Cloud, color: 'bg-cyan-500' },
    { id: 'agents', name: 'Agents', icon: Bot, color: 'bg-pink-500' },
    { id: 'marketing', name: 'Marketing', icon: Megaphone, color: 'bg-orange-500' },
    { id: 'development', name: 'Development', icon: Code, color: 'bg-red-500' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tools?search=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`)
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Smart Search</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
            Search AI Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect AI tool for your needs with our intelligent search and filtering system
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              {/* Background decoration */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-hover:text-blue-500 transition-colors duration-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI tools... (e.g., 'image generator', 'chatbot', 'data analysis')"
                  className="w-full pl-16 pr-32 py-6 text-lg bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-xl hover:shadow-2xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Category Filters */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h3>
            <p className="text-lg text-gray-600">Click on a category to filter your search</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                  className={`group relative p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-white text-gray-900 scale-105 shadow-2xl border-2 border-blue-500'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold">{category.name}</h4>
                  {selectedCategory === category.id && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">10,000+</div>
              <div className="text-lg font-semibold text-gray-700">AI Tools</div>
              <div className="text-sm text-gray-500 mt-2">Curated collection</div>
            </div>
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">50+</div>
              <div className="text-lg font-semibold text-gray-700">Categories</div>
              <div className="text-sm text-gray-500 mt-2">Organized by type</div>
            </div>
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">1M+</div>
              <div className="text-lg font-semibold text-gray-700">Monthly Users</div>
              <div className="text-sm text-gray-500 mt-2">Growing community</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchEngine
