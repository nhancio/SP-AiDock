// Environment configuration for different deployment environments
export const getEnvironmentConfig = () => {
  const isDevelopment = import.meta.env.DEV
  const isProduction = import.meta.env.PROD
  
  // Get the current origin (localhost for dev, production domain for prod)
  const currentOrigin = window.location.origin
  
  // Define redirect URLs based on environment
  const redirectUrls = {
    development: 'http://localhost:5173/auth/callback',
    production: 'https://magicboxai.in/auth/callback'
  }
  
  // Get the appropriate redirect URL
  // Force production URL if we're on the production domain (even if detected as dev)
  const isProductionDomain = currentOrigin.includes('magicboxai.in') || currentOrigin.includes('www.magicboxai.in')
  const redirectUrl = (isDevelopment && !isProductionDomain)
    ? redirectUrls.development 
    : redirectUrls.production
  
  return {
    isDevelopment,
    isProduction,
    redirectUrl,
    currentOrigin,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
  }
}

// Export the config for easy access
export const envConfig = getEnvironmentConfig()
