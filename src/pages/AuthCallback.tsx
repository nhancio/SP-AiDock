import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    let mounted = true
    
    const ensureUserProfile = async (userId: string, email: string, metadata: any) => {
      const { error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email,
            name: metadata?.full_name || 
                  metadata?.name || 
                  email.split('@')[0] || 
                  'User',
            avatar_url: metadata?.avatar_url || null,
          })

        if (insertError) {
          throw insertError
        }
      }
    }

    const handleAuthCallback = async () => {
      // Check for OAuth error in URL
      const error = searchParams.get('error')
      
      if (error) {
        if (mounted) {
          const redirectTo = localStorage.getItem('authRedirectTo') || '/login'
          localStorage.removeItem('authRedirectTo')
          navigate(redirectTo + '?error=' + encodeURIComponent(error), { replace: true })
        }
        return
      }

      // Get the redirect destination from localStorage
      const redirectTo = localStorage.getItem('authRedirectTo') || '/'
      localStorage.removeItem('authRedirectTo')

      try {
        // Wait for session to be established
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }

        if (session) {
          // Ensure user profile exists
          await ensureUserProfile(
            session.user.id,
            session.user.email!,
            session.user.user_metadata
          )
          
          if (mounted) {
            // Clear URL parameters and redirect
            window.history.replaceState(null, '', '/auth/callback')
            navigate(redirectTo, { replace: true })
          }
        } else {
          // No session found, set up listener for auth state change
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              if (!mounted) return
              
              if (event === 'SIGNED_IN' && newSession) {
                try {
                  await ensureUserProfile(
                    newSession.user.id,
                    newSession.user.email!,
                    newSession.user.user_metadata
                  )
                  
                  subscription.unsubscribe()
                  window.history.replaceState(null, '', '/auth/callback')
                  navigate(redirectTo, { replace: true })
                } catch (err) {
                  subscription.unsubscribe()
                  navigate('/login?error=profile_error', { replace: true })
                }
              } else if (event === 'SIGNED_OUT') {
                subscription.unsubscribe()
                navigate('/login?error=sign_out', { replace: true })
              }
            }
          )

          // Timeout fallback
          setTimeout(() => {
            if (mounted) {
              subscription.unsubscribe()
              navigate('/login?error=timeout', { replace: true })
            }
          }, 10000)
        }
      } catch (error: any) {
        if (mounted) {
          navigate('/login?error=auth_callback_failed', { replace: true })
        }
      }
    }

    handleAuthCallback()
    
    return () => {
      mounted = false
    }
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
