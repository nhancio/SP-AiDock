import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleTools = [
  {
    name: 'ChatGPT',
    description: 'Advanced AI conversation model that can help with writing, analysis, coding, and more.',
    short_description: 'AI-powered conversational assistant',
    url: 'https://chat.openai.com',
    category: 'content-creation',
    tags: ['ai', 'chatbot', 'writing', 'assistant'],
    pricing_type: 'freemium',
    status: 'approved',
    upvote_count: 150,
    view_count: 5000
  },
  {
    name: 'Midjourney',
    description: 'AI image generation tool that creates stunning artwork from text descriptions.',
    short_description: 'AI image generation from text',
    url: 'https://midjourney.com',
    category: 'content-creation',
    tags: ['ai', 'image', 'art', 'generation'],
    pricing_type: 'paid',
    status: 'approved',
    upvote_count: 120,
    view_count: 3500
  },
  {
    name: 'Claude',
    description: 'Anthropic\'s AI assistant focused on helpful, harmless, and honest responses.',
    short_description: 'AI assistant by Anthropic',
    url: 'https://claude.ai',
    category: 'productivity',
    tags: ['ai', 'assistant', 'productivity', 'analysis'],
    pricing_type: 'freemium',
    status: 'approved',
    upvote_count: 95,
    view_count: 2800
  },
  {
    name: 'Notion AI',
    description: 'AI-powered writing and organization tool integrated into Notion workspace.',
    short_description: 'AI writing assistant in Notion',
    url: 'https://notion.so',
    category: 'productivity',
    tags: ['ai', 'writing', 'productivity', 'organization'],
    pricing_type: 'paid',
    status: 'approved',
    upvote_count: 80,
    view_count: 2200
  },
  {
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster with intelligent suggestions.',
    short_description: 'AI coding assistant',
    url: 'https://github.com/features/copilot',
    category: 'development',
    tags: ['ai', 'coding', 'development', 'programming'],
    pricing_type: 'paid',
    status: 'approved',
    upvote_count: 110,
    view_count: 4000
  }
]

async function addSampleTools() {
  try {
    console.log('Adding sample tools to Supabase...')
    
    const { data, error } = await supabase
      .from('tools')
      .insert(sampleTools)
    
    if (error) {
      console.error('Error adding tools:', error)
    } else {
      console.log('Successfully added sample tools!', data)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

addSampleTools()
