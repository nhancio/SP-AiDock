import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for Supabase to process the hash fragment
        // Supabase automatically processes hash fragments with detectSessionInUrl: true
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Get the session - Supabase will automatically extract tokens from URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setTimeout(() => {
            navigate('/login?error=auth_callback_failed')
          }, 2000)
          return
        }

        if (data?.session) {
          // Check if user profile exists, create if not
          const { error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.session.user.id,
                email: data.session.user.email!,
                name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || 'User',
                avatar_url: data.session.user.user_metadata?.avatar_url || null,
              })

            if (insertError) {
              console.error('Error creating user profile:', insertError)
            }
          }

          setStatus('success')
          // Redirect to home page after successful authentication
          setTimeout(() => {
            // Clear the hash from URL before redirecting
            window.history.replaceState(null, '', '/auth/callback')
            navigate('/')
          }, 500)
        } else {
          // No session found, redirect to login
          setStatus('error')
          setTimeout(() => {
            navigate('/login?error=no_session')
          }, 2000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setTimeout(() => {
          navigate('/login?error=auth_callback_failed')
        }, 2000)
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Completing sign in...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-600">Authentication failed. Redirecting...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600">Successfully signed in! Redirecting...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthCallback
