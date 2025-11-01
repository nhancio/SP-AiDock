import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    // Check for OAuth error in URL
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    // Store cleanup refs
    let subscription: { data: { subscription: { unsubscribe: () => void } } } | null = null
    let timeoutId: NodeJS.Timeout | null = null
    
    const handleAuthCallback = async () => {
      try {
        if (error) {
          console.error('OAuth error:', error, errorDescription)
          setErrorMessage(errorDescription || `Authentication error: ${error}`)
          setStatus('error')
          setTimeout(() => {
            navigate('/login?error=' + encodeURIComponent(error))
          }, 3000)
          return
        }

        // With PKCE flow and detectSessionInUrl: true, Supabase automatically
        // processes the code from the URL and exchanges it for tokens
        // We just need to wait for the session to be established
        
        // Set up auth state listener
        subscription = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session ? 'Session exists' : 'No session')
            
            if (event === 'SIGNED_IN' && session) {
              try {
                // Clear any timeouts
                if (timeoutId) {
                  clearTimeout(timeoutId)
                  timeoutId = null
                }
                
                // Ensure user profile exists
                const { error: profileError } = await supabase
                  .from('users')
                  .select('id')
                  .eq('id', session.user.id)
                  .single()

                if (profileError && profileError.code === 'PGRST116') {
                  // Profile doesn't exist, create it
                  const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                      id: session.user.id,
                      email: session.user.email!,
                      name: session.user.user_metadata?.full_name || 
                            session.user.user_metadata?.name || 
                            session.user.email?.split('@')[0] || 
                            'User',
                      avatar_url: session.user.user_metadata?.avatar_url || null,
                    })

                  if (insertError) {
                    console.error('Error creating user profile:', insertError)
                  }
                }

                // Clean up subscription
                if (subscription) {
                  subscription.data.subscription.unsubscribe()
                  subscription = null
                }
                
                setStatus('success')
                // Clear URL parameters
                window.history.replaceState(null, '', '/auth/callback')
                
                // Redirect to home after a brief delay
                setTimeout(() => {
                  navigate('/', { replace: true })
                }, 500)
              } catch (err) {
                console.error('Profile creation error:', err)
                if (subscription) {
                  subscription.data.subscription.unsubscribe()
                  subscription = null
                }
                setStatus('error')
                setErrorMessage('Failed to create user profile')
                setTimeout(() => {
                  navigate('/login?error=profile_error')
                }, 3000)
              }
            } else if (event === 'SIGNED_OUT') {
              if (subscription) {
                subscription.data.subscription.unsubscribe()
                subscription = null
              }
              setStatus('error')
              setErrorMessage('Authentication failed')
              setTimeout(() => {
                navigate('/login?error=sign_out')
              }, 2000)
            }
          }
        )
        
        // Also try to get session directly (in case the event already fired)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          // Don't fail immediately - wait for auth state change
        }
        
        if (sessionData?.session) {
          // We already have a session, handle it
          try {
            // Ensure user profile exists
            const { error: profileError } = await supabase
              .from('users')
              .select('id')
              .eq('id', sessionData.session.user.id)
              .single()

            if (profileError && profileError.code === 'PGRST116') {
              const { error: insertError } = await supabase
                .from('users')
                .insert({
                  id: sessionData.session.user.id,
                  email: sessionData.session.user.email!,
                  name: sessionData.session.user.user_metadata?.full_name || 
                        sessionData.session.user.user_metadata?.name || 
                        sessionData.session.user.email?.split('@')[0] || 
                        'User',
                  avatar_url: sessionData.session.user.user_metadata?.avatar_url || null,
                })

              if (insertError) {
                console.error('Error creating user profile:', insertError)
              }
            }
            
            // Clean up subscription
            if (subscription) {
              subscription.data.subscription.unsubscribe()
              subscription = null
            }
            
            setStatus('success')
            window.history.replaceState(null, '', '/auth/callback')
            setTimeout(() => {
              navigate('/', { replace: true })
            }, 500)
          } catch (err) {
            console.error('Error handling session:', err)
            if (subscription) {
              subscription.data.subscription.unsubscribe()
              subscription = null
            }
            setStatus('error')
            setErrorMessage('Failed to process session')
            setTimeout(() => {
              navigate('/login?error=session_error')
            }, 3000)
          }
        } else {
          // No session yet - set timeout to wait for auth state change
          timeoutId = setTimeout(() => {
            if (subscription) {
              subscription.data.subscription.unsubscribe()
              subscription = null
            }
            setStatus('error')
            setErrorMessage('Authentication timeout. Please try signing in again.')
            setTimeout(() => {
              navigate('/login?error=timeout')
            }, 3000)
          }, 10000) // 10 second timeout
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setErrorMessage(error?.message || 'An unexpected error occurred')
        setTimeout(() => {
          navigate('/login?error=auth_callback_failed')
        }, 3000)
      }
    }

    handleAuthCallback()
    
    // Cleanup function for useEffect
    return () => {
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
