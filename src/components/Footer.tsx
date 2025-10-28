import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Twitter, Github, Heart } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-bold">AiDock</span>
            </Link>
            <p className="text-gray-400 mb-4 text-sm max-w-xs">
              Discover the best AI tools for your needs.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@nhancio.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/tools" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Browse Tools
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Submit Tool
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-semibold mb-3">Support</h3>
            <ul className="space-y-1">
              <li>
                <a href="mailto:hello@nhancio.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs">
            © 2024 AiDock. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs flex items-center mt-1 md:mt-0">
            Made with <Heart className="w-3 h-3 text-red-500 mx-1" /> for the AI community
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
