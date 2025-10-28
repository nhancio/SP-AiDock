import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Only throw error in production
if (import.meta.env.PROD && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          role: 'user' | 'tool_owner' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          role?: 'user' | 'tool_owner' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: 'user' | 'tool_owner' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          name: string
          description: string
          short_description: string | null
          url: string
          logo_url: string | null
          category: string
          tags: string[]
          pricing_type: 'free' | 'freemium' | 'paid' | 'subscription' | 'one_time'
          pricing_details: any
          status: 'pending' | 'approved' | 'rejected'
          submitted_by: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
          view_count: number
          click_count: number
          upvote_count: number
        }
        Insert: {
          id?: string
          name: string
          description: string
          short_description?: string | null
          url: string
          logo_url?: string | null
          category: string
          tags?: string[]
          pricing_type: 'free' | 'freemium' | 'paid' | 'subscription' | 'one_time'
          pricing_details?: any
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
          view_count?: number
          click_count?: number
          upvote_count?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          short_description?: string | null
          url?: string
          logo_url?: string | null
          category?: string
          tags?: string[]
          pricing_type?: 'free' | 'freemium' | 'paid' | 'subscription' | 'one_time'
          pricing_details?: any
          status?: 'pending' | 'approved' | 'rejected'
          submitted_by?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
          view_count?: number
          click_count?: number
          upvote_count?: number
        }
      }
      upvotes: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          created_at?: string
        }
      }
    }
  }
}
