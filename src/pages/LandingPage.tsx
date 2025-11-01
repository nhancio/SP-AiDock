import React from 'react'
import { HeroWithMockup } from '../components/HeroWithMockup'
import SearchEngine from '../components/SearchEngine'
import DisplayCards from '../components/DisplayCards'
import SEO from '../components/SEO'
import { ArrowRight, Sparkles, Zap, BarChart, Users, Globe, Shield } from 'lucide-react'

const LandingPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="MagicBox - Discover the Best AI Tools for Your Needs"
        description="Explore thousands of AI tools across all categories. Find the perfect AI solution for writing, coding, design, marketing, and more. Browse, compare, and discover innovative AI tools."
        keywords="AI tools, artificial intelligence, machine learning, automation, productivity, writing tools, coding tools, design tools, marketing tools"
        url="https://magicboxai.in"
      />
      <div className="min-h-screen bg-white">
      {/* First Page - Hero + Search Combined */}
      <div className="relative">
        {/* Hero Section */}
        <HeroWithMockup
          title="AI Tools Directory"
          description="Discover the best AI tools for your needs. Browse, compare, and find the perfect AI solution."
          primaryCta={{
            text: "Browse Tools",
            href: "/tools"
          }}
          secondaryCta={{
            text: "Submit Tool",
            href: "/submit"
          }}
        />
        
        {/* Search Section - Minimal gap */}
        <div className="-mt-24 relative z-10">
          <SearchEngine />
        </div>
      </div>

      {/* 3rd Screen - Display Cards */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Tools
            </h2>
            <p className="text-xl text-gray-600">
              Worried about finding the right AI tool for your needs? We've got you covered.
            </p>
          </div>
          <DisplayCards />
        </div>
      </section>

      {/* 4th Screen - Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MagicBox?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make it easy to discover, compare, and choose the perfect AI tools for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Curated Collection</h3>
              <p className="text-gray-600 mb-6">Hand-picked AI tools verified by experts to ensure quality and reliability.</p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Search</h3>
              <p className="text-gray-600 mb-6">Find exactly what you need with our intelligent search and filtering system.</p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real Reviews</h3>
              <p className="text-gray-600 mb-6">Read authentic reviews from users who have actually used these tools.</p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600 mb-6">Join thousands of users sharing their experiences and recommendations.</p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Always Updated</h3>
              <p className="text-gray-600 mb-6">Stay current with the latest AI tools and updates in the industry.</p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gray-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted & Secure</h3>
              <p className="text-gray-600 mb-6">All tools are verified for security and reliability before being listed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5th Screen - CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect AI Tool?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have already discovered their ideal AI solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tools"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
            >
              Browse All Tools
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/submit"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300 flex items-center justify-center"
            >
              Submit Your Tool
            </a>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

export default LandingPage