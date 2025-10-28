import React from 'react'
import { envConfig } from '../lib/supabase'

const EnvironmentDebug: React.FC = () => {
  // Only show in development
  if (envConfig.isProduction) {
    return null
  }

  return null;
}

export default EnvironmentDebug
