import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signInWithGoogle } = useAuth()


  const handleCommunityClick = (e: React.MouseEvent) => {
    e.preventDefault()
    toast.success('Coming soon! 🚀', {
      duration: 2000,
    })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">AiDock</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link 
                to="/" 
                className="px-4 py-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 font-medium text-sm"
              >
                Home
              </Link>
              <Link 
                to="/tools" 
                className="px-4 py-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 text-sm"
              >
                Browse Tools
              </Link>
              <Link 
                to="/tools?sort=likes" 
                className="px-4 py-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 text-sm"
              >
                Trending
              </Link>
              <button 
                onClick={handleCommunityClick}
                className="px-4 py-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 text-sm"
              >
                Community
              </button>
              <Link 
                to="/submit" 
                className="px-4 py-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 text-sm"
              >
                Submit Tool
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* User Menu */}
              {user ? (
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="flex items-center space-x-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/60 rounded-full transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="px-4 py-3 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/tools" 
                className="px-4 py-3 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Tools
              </Link>
              <Link 
                to="/tools?sort=likes" 
                className="px-4 py-3 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Trending
              </Link>
              <button 
                onClick={(e) => {
                  handleCommunityClick(e)
                  setIsMenuOpen(false)
                }}
                className="text-left px-4 py-3 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 text-sm"
              >
                Community
              </button>
              <Link 
                to="/submit" 
                className="px-4 py-3 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Tool
              </Link>
              
              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-full text-gray-700 hover:text-gray-900 hover:bg-white/60 transition-all duration-200 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span>Profile</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
        </div>
      </div>
    </header>
  )
}

export default Header
