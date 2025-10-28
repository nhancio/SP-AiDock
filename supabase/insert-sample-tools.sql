-- Insert sample tools into the tools table
-- Run this in your Supabase SQL Editor

-- First, let's check if there are any existing tools
SELECT COUNT(*) as total_tools FROM tools;

-- Insert sample tools
INSERT INTO tools (
  name, 
  description, 
  short_description, 
  url, 
  category, 
  tags, 
  pricing_type, 
  status, 
  upvote_count, 
  view_count,
  created_at
) VALUES 
(
  'ChatGPT',
  'Advanced AI conversation model that can help with writing, analysis, coding, and more. It understands context and can engage in meaningful conversations on a wide range of topics.',
  'AI-powered conversational assistant',
  'https://chat.openai.com',
  'content-creation',
  ARRAY['ai', 'chatbot', 'writing', 'assistant', 'conversation'],
  'freemium',
  'approved',
  150,
  5000,
  NOW()
),
(
  'Midjourney',
  'AI image generation tool that creates stunning artwork from text descriptions. Perfect for artists, designers, and content creators who need high-quality visuals.',
  'AI image generation from text',
  'https://midjourney.com',
  'content-creation',
  ARRAY['ai', 'image', 'art', 'generation', 'design'],
  'paid',
  'approved',
  120,
  3500,
  NOW()
),
(
  'Claude',
  'Anthropic''s AI assistant focused on helpful, harmless, and honest responses. Designed to be more reliable and safer than other AI models.',
  'AI assistant by Anthropic',
  'https://claude.ai',
  'productivity',
  ARRAY['ai', 'assistant', 'productivity', 'analysis', 'safe'],
  'freemium',
  'approved',
  95,
  2800,
  NOW()
),
(
  'Notion AI',
  'AI-powered writing and organization tool integrated into Notion workspace. Helps with writing, summarization, and content creation.',
  'AI writing assistant in Notion',
  'https://notion.so',
  'productivity',
  ARRAY['ai', 'writing', 'productivity', 'organization', 'notion'],
  'paid',
  'approved',
  80,
  2200,
  NOW()
),
(
  'GitHub Copilot',
  'AI pair programmer that helps you write code faster with intelligent suggestions. Supports multiple programming languages and integrates with popular editors.',
  'AI coding assistant',
  'https://github.com/features/copilot',
  'development',
  ARRAY['ai', 'coding', 'development', 'programming', 'github'],
  'paid',
  'approved',
  110,
  4000,
  NOW()
),
(
  'DALL-E 2',
  'OpenAI''s AI image generation model that creates realistic images and art from natural language descriptions.',
  'AI image generation by OpenAI',
  'https://openai.com/dall-e-2',
  'content-creation',
  ARRAY['ai', 'image', 'openai', 'generation', 'art'],
  'paid',
  'approved',
  90,
  3000,
  NOW()
),
(
  'Jasper AI',
  'AI writing assistant for marketing content, blog posts, and copywriting. Helps create engaging content for businesses.',
  'AI writing for marketing',
  'https://jasper.ai',
  'marketing',
  ARRAY['ai', 'writing', 'marketing', 'copywriting', 'content'],
  'paid',
  'approved',
  75,
  1800,
  NOW()
),
(
  'Runway ML',
  'Creative AI tools for video editing, image generation, and multimedia content creation. Used by professionals in film and design.',
  'AI creative tools for video',
  'https://runwayml.com',
  'content-creation',
  ARRAY['ai', 'video', 'editing', 'creative', 'multimedia'],
  'freemium',
  'approved',
  65,
  1500,
  NOW()
);

-- Check the results
SELECT COUNT(*) as total_tools_after_insert FROM tools;
SELECT name, category, status, upvote_count FROM tools ORDER BY created_at DESC;
