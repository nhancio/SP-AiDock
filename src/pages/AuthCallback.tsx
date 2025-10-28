import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, envConfig } from '../lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login?error=auth_callback_failed')
          return
        }

        if (data.session) {
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

          // Redirect to home page after successful authentication
          navigate('/')
        } else {
          // Redirect to login page if no session
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/login?error=auth_callback_failed')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
