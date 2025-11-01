import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Log component mount
  React.useEffect(() => {
    console.log('AuthCallback component mounted')
    return () => {
      console.log('AuthCallback component unmounting')
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let subscription: { data: { subscription: { unsubscribe: () => void } } } | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    
    const ensureUserProfile = async (userId: string, email: string, metadata: any) => {
      try {
        const { error: profileError } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
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
            console.error('Error creating user profile:', insertError)
            throw insertError
          }
        }
      } catch (err) {
        console.error('Profile creation error:', err)
        throw err
      }
    }

    const handleAuthCallback = async () => {
      try {
        // Check for OAuth error in URL
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        if (error) {
          console.error('OAuth error:', error, errorDescription)
          if (mounted) {
            setErrorMessage(errorDescription || `Authentication error: ${error}`)
            setStatus('error')
            setTimeout(() => {
              navigate('/login?error=' + encodeURIComponent(error), { replace: true })
            }, 3000)
          }
          return
        }

        const code = searchParams.get('code')
        console.log('Auth callback - Code present:', !!code)

        // Set up auth state listener BEFORE checking session
        subscription = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session ? 'Session exists' : 'No session')
            
            if (!mounted) return
            
            if (event === 'SIGNED_IN' && session) {
              try {
                // Clear timeout
                if (timeoutId) {
                  clearTimeout(timeoutId)
                  timeoutId = null
                }
                
                // Ensure user profile exists
                await ensureUserProfile(
                  session.user.id,
                  session.user.email!,
                  session.user.user_metadata
                )

                // Clean up subscription
                if (subscription) {
                  subscription.data.subscription.unsubscribe()
                  subscription = null
                }
                
                if (mounted) {
                  setStatus('success')
                  // Clear URL parameters
                  window.history.replaceState(null, '', '/auth/callback')
                  
                  // Redirect to home
                  setTimeout(() => {
                    navigate('/', { replace: true })
                  }, 500)
                }
              } catch (err) {
                console.error('Error in SIGNED_IN handler:', err)
                if (mounted) {
                  if (subscription) {
                    subscription.data.subscription.unsubscribe()
                    subscription = null
                  }
                  setStatus('error')
                  setErrorMessage('Failed to complete authentication')
                  setTimeout(() => {
                    navigate('/login?error=profile_error', { replace: true })
                  }, 3000)
                }
              }
            } else if (event === 'TOKEN_REFRESHED' && session) {
              // Token was refreshed, user is still signed in
              console.log('Token refreshed')
            } else if (event === 'SIGNED_OUT') {
              if (mounted) {
                if (subscription) {
                  subscription.data.subscription.unsubscribe()
                  subscription = null
                }
                setStatus('error')
                setErrorMessage('Authentication failed')
                setTimeout(() => {
                  navigate('/login?error=sign_out', { replace: true })
                }, 2000)
              }
            }
          }
        )
        
        // Check if we already have a session (might happen if code was already exchanged)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
        }
        
        if (sessionData?.session) {
          // We already have a session - handle it immediately
          console.log('Session already exists')
          try {
            await ensureUserProfile(
              sessionData.session.user.id,
              sessionData.session.user.email!,
              sessionData.session.user.user_metadata
            )
            
            if (subscription) {
              subscription.data.subscription.unsubscribe()
              subscription = null
            }
            
            if (mounted) {
              setStatus('success')
              window.history.replaceState(null, '', '/auth/callback')
              setTimeout(() => {
                navigate('/', { replace: true })
              }, 500)
            }
          } catch (err) {
            console.error('Error handling existing session:', err)
            if (mounted) {
              if (subscription) {
                subscription.data.subscription.unsubscribe()
                subscription = null
              }
              setStatus('error')
              setErrorMessage('Failed to process session')
              setTimeout(() => {
                navigate('/login?error=session_error', { replace: true })
              }, 3000)
            }
          }
        } else if (code) {
          // We have a code but no session - wait for auth state change
          // With detectSessionInUrl: true, Supabase will automatically exchange the code
          console.log('Code present, waiting for session...')
          
          // Set timeout as fallback
          timeoutId = setTimeout(() => {
            if (mounted) {
              console.error('Authentication timeout')
              if (subscription) {
                subscription.data.subscription.unsubscribe()
                subscription = null
              }
              setStatus('error')
              setErrorMessage('Authentication timeout. Please try signing in again.')
              setTimeout(() => {
                navigate('/login?error=timeout', { replace: true })
              }, 3000)
            }
          }, 15000) // 15 second timeout
        } else {
          // No code and no session - invalid state
          console.error('No code or session found')
          if (mounted) {
            if (subscription) {
              subscription.data.subscription.unsubscribe()
              subscription = null
            }
            setStatus('error')
            setErrorMessage('No authentication code found')
            setTimeout(() => {
              navigate('/login?error=no_code', { replace: true })
            }, 2000)
          }
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        if (mounted) {
          setStatus('error')
          setErrorMessage(error?.message || 'An unexpected error occurred')
          setTimeout(() => {
            navigate('/login?error=auth_callback_failed', { replace: true })
          }, 3000)
        }
      }
    }

    handleAuthCallback()
    
    // Cleanup function
    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (subscription) {
        subscription.data.subscription.unsubscribe()
      }
    }
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center px-4">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Completing sign in...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">Authentication failed</p>
            {errorMessage && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">{errorMessage}</p>
            )}
            <p className="text-gray-400 dark:text-gray-500 text-sm">Redirecting...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Successfully signed in! Redirecting...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthCallback
