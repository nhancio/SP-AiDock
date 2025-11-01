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
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { user, signInWithGoogle } = useAuth()
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
      
      // First, ensure user exists in users table - CRITICAL for foreign key constraint
      // Check if user exists by ID
      let { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      // If user doesn't exist, try to create them
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            avatar_url: user.user_metadata?.avatar_url || null,
          })

        if (insertError) {
          const isDuplicateError = insertError.message?.includes('duplicate key') || 
                                  insertError.code === '23505' ||
                                  insertError.message?.includes('users_email_key')
          
          if (isDuplicateError) {
            // Duplicate email - user might exist with different ID or there was a race condition
            // Try to find user by email to check what happened
            const { data: userByEmail } = await supabase
              .from('users')
              .select('id')
              .eq('email', user.email!)
              .maybeSingle()
            
            if (userByEmail && userByEmail.id === user.id) {
              // User exists with correct ID - race condition, we're good
              existingUser = userByEmail
            } else if (userByEmail && userByEmail.id !== user.id) {
              // User exists with different ID - data inconsistency, throw error
              throw new Error('User account mismatch. Please contact support.')
            } else {
              // Email conflict but user not found - try once more to verify
              const { data: retryUser } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .maybeSingle()
              
              if (!retryUser) {
                throw new Error('Failed to create user account. Please try signing in again.')
              }
              existingUser = retryUser
            }
          } else {
            // Different error, throw it
            console.error('Error creating user:', insertError)
            throw insertError
          }
        } else {
          // User created successfully, verify it exists
          const { data: createdUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()
          
          if (!createdUser) {
            throw new Error('User creation succeeded but user not found. Please try again.')
          }
          existingUser = createdUser
        }
      }
      
      // Final verification: user MUST exist before tool submission
      if (!existingUser) {
        throw new Error('User does not exist in database. Please try signing in again.')
      }
      
      // Update user info (name, avatar) - don't throw if this fails
      await supabase
        .from('users')
        .update({
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .eq('id', user.id)

      // Handle logo upload if provided
      let logoUrl = null
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `tool-logos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('tool-logos')
          .upload(filePath, logoFile)

        if (uploadError) {
          console.error('Error uploading logo:', uploadError)
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('tool-logos')
          .getPublicUrl(filePath)
        
        logoUrl = publicUrl
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
          logo_url: logoUrl,
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">AI</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Sign in to submit a tool
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Please sign in with Google to submit a tool to our directory.
            </p>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full inline-flex justify-center items-center py-4 px-6 border border-gray-300 rounded-xl shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
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
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Submit Your AI Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your AI tool with our community and help others discover innovative solutions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-3">
                  Tool Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter the name of your AI tool"
                />
              </div>

              <div>
                <label htmlFor="short_description" className="block text-sm font-semibold text-gray-900 mb-3">
                  Short Description *
                </label>
                <input
                  type="text"
                  id="short_description"
                  name="short_description"
                  required
                  value={formData.short_description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Brief description (max 500 characters)"
                  maxLength={500}
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Tool Logo (Optional)
              </label>
              <div className="space-y-4">
                {logoPreview ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        {logoFile?.name}
                      </p>
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove logo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-3">
                Full Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Detailed description of your AI tool and its features"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="url" className="block text-sm font-semibold text-gray-900 mb-3">
                  Tool URL *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  required
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="https://your-tool-website.com"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-3">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 mb-3">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="ai, writing, automation (comma-separated)"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Separate tags with commas
                </p>
              </div>

              <div>
                <label htmlFor="pricing_type" className="block text-sm font-semibold text-gray-900 mb-3">
                  Pricing Model *
                </label>
                <select
                  id="pricing_type"
                  name="pricing_type"
                  required
                  value={formData.pricing_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                            <option value="free">Free</option>
                            <option value="freemium">Freemium</option>
                            <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Submission Fees</h3>
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="text-2xl font-bold text-gray-500 line-through">$10</span>
                  <span className="text-3xl font-bold text-green-600">FREE</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Limited Time Offer
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Submit your AI tool to our directory and reach millions of users
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                {loading ? 'Submitting...' : 'Submit Tool - FREE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitToolPage

