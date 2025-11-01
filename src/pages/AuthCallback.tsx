import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have a code in the URL (PKCE flow)
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        
        if (error) {
          console.error('OAuth error:', error)
          setErrorMessage(`Authentication error: ${error}`)
          setStatus('error')
          setTimeout(() => {
            navigate('/login?error=' + encodeURIComponent(error))
          }, 3000)
          return
        }

        // Wait for Supabase to process the code/tokens
        // With PKCE, Supabase automatically exchanges the code for tokens
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              try {
                // Check if user profile exists, create if not
                const { error: profileError } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()

                if (profileError && profileError.code === 'PGRST116') {
                  // Profile doesn't exist, create it
                  const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                      id: session.user.id,
                      email: session.user.email!,
                      name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                      avatar_url: session.user.user_metadata?.avatar_url || null,
                    })

                  if (insertError) {
                    console.error('Error creating user profile:', insertError)
                  }
                }

                setStatus('success')
                // Clear the URL parameters
                window.history.replaceState(null, '', '/auth/callback')
                setTimeout(() => {
                  navigate('/')
                }, 500)
              } catch (err) {
                console.error('Profile creation error:', err)
                setStatus('error')
                setErrorMessage('Failed to create user profile')
              }
            } else if (event === 'SIGNED_OUT') {
              setStatus('error')
              setErrorMessage('Authentication failed')
              setTimeout(() => {
                navigate('/login?error=sign_out')
              }, 2000)
            }
          }
        )
        
        // Get the current session
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setStatus('error')
          setErrorMessage(sessionError.message || 'Failed to get session')
          subscription.unsubscribe()
          setTimeout(() => {
            navigate('/login?error=auth_callback_failed')
          }, 3000)
          return
        }

        // If we already have a session, handle it
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
          subscription.unsubscribe()
          // Clear the URL parameters
          window.history.replaceState(null, '', '/auth/callback')
          setTimeout(() => {
            navigate('/')
          }, 500)
        } else if (code) {
          // We have a code but no session yet - wait for auth state change
          // The subscription above will handle it
          console.log('Waiting for session from code exchange...')
          // Set a timeout in case something goes wrong
          setTimeout(() => {
            subscription.unsubscribe()
            setStatus('error')
            setErrorMessage('Authentication timeout. Please try again.')
            setTimeout(() => {
              navigate('/login?error=timeout')
            }, 3000)
          }, 10000)
        } else {
          // No code and no session
          subscription.unsubscribe()
          setStatus('error')
          setErrorMessage('No authentication code found')
          setTimeout(() => {
            navigate('/login?error=no_code')
          }, 2000)
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
    
    // Cleanup function to unsubscribe if component unmounts
    return () => {
      // Cleanup will be handled in the callback function
    }
  }, [navigate, searchParams])

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
            <p className="text-gray-600 mb-2">Authentication failed</p>
            {errorMessage && (
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">{errorMessage}</p>
            )}
            <p className="text-gray-400 text-sm">Redirecting...</p>
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
