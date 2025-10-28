import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const SubmitToolPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    url: '',
    category: '',
    tags: '',
    pricing_type: 'free'
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to submit a tool')
      return
    }

    setLoading(true)

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      // First, ensure user exists in users table
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
        }, { onConflict: 'id' })

      if (userError) {
        console.error('Error creating/updating user:', userError)
        throw userError
      }
      
      const { error } = await supabase
        .from('tools')
        .insert({
          name: formData.name,
          description: formData.description,
          short_description: formData.short_description || null,
          url: formData.url,
          category: formData.category,
          tags: tagsArray,
          pricing_type: formData.pricing_type,
          pricing_details: null,
          submitted_by: user.id,
          status: 'pending'
        })

      if (error) {
        throw error
      }

      toast.success('Tool submitted successfully! It will be reviewed by our team.')
      navigate('/tools')
    } catch (error: any) {
      console.error('Error submitting tool:', error)
      toast.error(error.message || 'Failed to submit tool')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please sign in to submit a tool to our directory.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Submit Your AI Tool
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tool Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter the name of your AI tool"
              />
            </div>

            <div>
              <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Description *
              </label>
              <input
                type="text"
                id="short_description"
                name="short_description"
                required
                value={formData.short_description}
                onChange={handleChange}
                className="input-field"
                placeholder="Brief description (max 500 characters)"
                maxLength={500}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Detailed description of your AI tool and its features"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tool URL *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                value={formData.url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://your-tool-website.com"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select a category</option>
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
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="ai, writing, automation (comma-separated)"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Separate tags with commas
              </p>
            </div>

            <div>
              <label htmlFor="pricing_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pricing Model *
              </label>
              <select
                id="pricing_type"
                name="pricing_type"
                required
                value={formData.pricing_type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="subscription">Subscription</option>
                <option value="one_time">One-time Purchase</option>
              </select>
            </div>


            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Tool'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitToolPage
