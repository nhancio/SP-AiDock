import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Share2, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

interface SavedTool {
  id: string
  name: string
  logo_url: string | null
  url: string
  category: string
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [savedTools, setSavedTools] = useState<SavedTool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedTools = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('saved_items')
          .select(`
            tool_id,
            tools (
              id,
              name,
              logo_url,
              url,
              category
            )
          `)
          .eq('user_id', user.id)

        if (error) throw error

        const tools = data?.map(item => item.tools).filter(Boolean) as unknown as SavedTool[]
        setSavedTools(tools || [])
      } catch (error) {
        console.error('Error fetching saved tools:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedTools()
  }, [user])

  const shareTool = (tool: SavedTool) => {
    const toolUrl = `${window.location.origin}/tools/${tool.id}`
    const categoryDisplay = tool.category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    
    const message = `🚀 *${tool.name}* - AI Tool Recommendation

📂 *Category:* ${categoryDisplay}
🔗 *Link:* ${toolUrl}

Check out this amazing AI tool I found on AiDock! It might be useful for your projects.

#AITools #${categoryDisplay.replace(' ', '')} #AiDock`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Please Sign In
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            You need to be signed in to view your profile.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Profile
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center space-x-6 mb-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile Avatar"
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.name || user.email?.split('@')[0] || 'User')}&background=random&color=fff&size=80`
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                      {(user.user_metadata?.name || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Full Name</p>
                        <p className="text-sm text-gray-600">
                          {user.user_metadata?.name || user.email?.split('@')[0] || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Address</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Saved Tools Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Saved Tools</h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : savedTools.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {savedTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="group relative flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Link
                        to={`/tools/${tool.id}`}
                        className="flex flex-col items-center w-full"
                      >
                        <div className="w-12 h-12 mb-2 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                          {tool.logo_url ? (
                            <img
                              src={tool.logo_url}
                              alt={tool.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-gray-600 font-bold text-lg ${tool.logo_url ? 'hidden' : ''}`}>
                            {tool.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 text-center group-hover:text-gray-900 transition-colors duration-200 truncate w-full">
                          {tool.name}
                        </span>
                      </Link>
                      
                      {/* Share Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          shareTool(tool)
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">No saved tools yet</p>
                  <p className="text-sm text-gray-400">Start exploring and save tools you like!</p>
                  <Link
                    to="/tools"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Browse Tools
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">

              {/* Account Status */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Verified</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Account Type</span>
                    <span className="text-sm font-medium text-gray-900">Free</span>
                  </div>
                </div>
              </div>

              {/* Premium Membership */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-800 font-medium text-sm mb-3">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Premium
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade to Premium</h3>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-purple-600">$1</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Cancel anytime • No hidden fees</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">AI Expert Access</p>
                      <p className="text-xs text-gray-600">Connect with AI experts in our community</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Trend Discussions</p>
                      <p className="text-xs text-gray-600">Join discussions about latest AI trends</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Exclusive Discounts</p>
                      <p className="text-xs text-gray-600">Special discounts on premium AI tools</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-200 hover:shadow-lg">
                  Start Premium - $1/month
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">7-day free trial</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage