-- Insert sample AI tools into the database
-- First, let's ensure we have some sample users (you can replace these with real user IDs)
INSERT INTO users (id, email, name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@aidock.com', 'Admin User', 'admin'),
('00000000-0000-0000-0000-000000000002', 'user@aidock.com', 'Sample User', 'user')
ON CONFLICT (id) DO NOTHING;

-- Insert sample AI tools
INSERT INTO tools (id, name, description, short_description, url, logo_url, category, tags, pricing_type, status, submitted_by, view_count, upvote_count, like_count) VALUES
-- Content Creation Tools
('10000000-0000-0000-0000-000000000001', 'ChatGPT', 'Advanced AI language model for conversation, writing, and problem-solving', 'AI-powered conversational assistant for various tasks', 'https://chat.openai.com', 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', 'content-creation', ARRAY['ai', 'writing', 'conversation', 'gpt'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 15420, 892, 892),

('10000000-0000-0000-0000-000000000002', 'Midjourney', 'AI-powered image generation from text descriptions', 'Create stunning artwork and images with AI', 'https://midjourney.com', 'https://cdn.midjourney.com/logo.png', 'content-creation', ARRAY['ai', 'image', 'art', 'generation'], 'paid', 'approved', '00000000-0000-0000-0000-000000000001', 12850, 756, 756),

('10000000-0000-0000-0000-000000000003', 'DALL-E 3', 'OpenAI''s latest image generation model', 'Generate creative images from text prompts', 'https://openai.com/dall-e-3', 'https://openai.com/content/images/2022/05/openai-avatar.png', 'content-creation', ARRAY['ai', 'image', 'openai', 'dall-e'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 9870, 634, 634),

('10000000-0000-0000-0000-000000000004', 'Jasper AI', 'AI writing assistant for marketing content', 'Create compelling marketing copy with AI', 'https://jasper.ai', 'https://jasper.ai/favicon.ico', 'content-creation', ARRAY['ai', 'writing', 'marketing', 'copywriting'], 'subscription', 'approved', '00000000-0000-0000-0000-000000000001', 7650, 423, 423),

-- Productivity Tools
('10000000-0000-0000-0000-000000000005', 'Notion AI', 'AI-powered workspace for notes, docs, and projects', 'Organize your work with AI assistance', 'https://notion.so', 'https://www.notion.so/images/logo-ios.png', 'productivity', ARRAY['ai', 'productivity', 'notes', 'organization'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 11200, 567, 567),

('10000000-0000-0000-0000-000000000006', 'Grammarly', 'AI-powered writing assistant and grammar checker', 'Improve your writing with AI suggestions', 'https://grammarly.com', 'https://static.grammarly.com/assets/files/grammarly_logo.png', 'productivity', ARRAY['ai', 'writing', 'grammar', 'editing'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 18900, 1023, 1023),

('10000000-0000-0000-0000-000000000007', 'Otter.ai', 'AI-powered meeting transcription and notes', 'Transcribe and summarize meetings automatically', 'https://otter.ai', 'https://otter.ai/favicon.ico', 'productivity', ARRAY['ai', 'transcription', 'meetings', 'notes'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 5430, 298, 298),

-- Analytics Tools
('10000000-0000-0000-0000-000000000008', 'Tableau AI', 'Data visualization and analytics platform', 'Transform data into insights with AI', 'https://tableau.com', 'https://www.tableau.com/sites/default/files/2021-03/Tableau-Logo-RGB.png', 'analytics', ARRAY['ai', 'analytics', 'data', 'visualization'], 'subscription', 'approved', '00000000-0000-0000-0000-000000000001', 6780, 345, 345),

('10000000-0000-0000-0000-000000000009', 'DataRobot', 'Automated machine learning platform', 'Build and deploy ML models without coding', 'https://datarobot.com', 'https://www.datarobot.com/wp-content/uploads/2021/05/DataRobot-Logo.png', 'analytics', ARRAY['ai', 'ml', 'automation', 'data-science'], 'subscription', 'approved', '00000000-0000-0000-0000-000000000001', 4320, 187, 187),

-- Automation Tools
('10000000-0000-0000-0000-000000000010', 'Zapier', 'Automate workflows between apps', 'Connect your favorite apps and automate tasks', 'https://zapier.com', 'https://cdn.zapier.com/storage/photos/8c3c4b8b8b8b8b8b8b8b8b8b8b8b8b8b.png', 'automation', ARRAY['ai', 'automation', 'workflow', 'integration'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 15670, 789, 789),

('10000000-0000-0000-0000-000000000011', 'Make (Integromat)', 'Visual automation platform', 'Create powerful automations with visual workflows', 'https://make.com', 'https://www.make.com/sites/default/files/2021-05/make-logo.png', 'automation', ARRAY['ai', 'automation', 'workflow', 'visual'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 8920, 456, 456),

-- SaaS Tools
('10000000-0000-0000-0000-000000000012', 'Salesforce Einstein', 'AI-powered CRM platform', 'Intelligent customer relationship management', 'https://salesforce.com', 'https://www.salesforce.com/content/dam/web/en_us/www/images/logo-salesforce.png', 'saas', ARRAY['ai', 'crm', 'sales', 'customer-management'], 'subscription', 'approved', '00000000-0000-0000-0000-000000000001', 12340, 678, 678),

('10000000-0000-0000-0000-000000000013', 'HubSpot', 'Inbound marketing and sales platform', 'Grow your business with AI-powered tools', 'https://hubspot.com', 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot_Logo.svg', 'saas', ARRAY['ai', 'marketing', 'sales', 'crm'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 9870, 534, 534),

-- AI Agents
('10000000-0000-0000-0000-000000000014', 'Replika', 'AI companion and chatbot', 'Your personal AI friend and companion', 'https://replika.ai', 'https://replika.ai/favicon.ico', 'agents', ARRAY['ai', 'chatbot', 'companion', 'conversation'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 7650, 423, 423),

('10000000-0000-0000-0000-000000000015', 'Character.AI', 'Create and chat with AI characters', 'Bring your imagination to life with AI', 'https://character.ai', 'https://character.ai/favicon.ico', 'agents', ARRAY['ai', 'characters', 'conversation', 'roleplay'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 5430, 298, 298),

-- Marketing Tools
('10000000-0000-0000-0000-000000000016', 'Copy.ai', 'AI copywriting tool for marketing', 'Generate marketing copy that converts', 'https://copy.ai', 'https://copy.ai/favicon.ico', 'marketing', ARRAY['ai', 'copywriting', 'marketing', 'content'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 8760, 456, 456),

('10000000-0000-0000-0000-000000000017', 'Lately AI', 'Social media content generation', 'Create engaging social media posts with AI', 'https://lately.ai', 'https://lately.ai/favicon.ico', 'marketing', ARRAY['ai', 'social-media', 'content', 'marketing'], 'subscription', 'approved', '00000000-0000-0000-0000-000000000001', 4320, 234, 234),

-- Development Tools
('10000000-0000-0000-0000-000000000018', 'GitHub Copilot', 'AI pair programmer', 'Code faster with AI assistance', 'https://github.com/features/copilot', 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', 'development', ARRAY['ai', 'coding', 'programming', 'github'], 'subscription', 'approved', '00000000-0000-0000-0000-000000000001', 18900, 1023, 1023),

('10000000-0000-0000-0000-000000000019', 'Tabnine', 'AI code completion tool', 'Intelligent code completion for developers', 'https://tabnine.com', 'https://tabnine.com/favicon.ico', 'development', ARRAY['ai', 'coding', 'completion', 'development'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 7650, 423, 423),

('10000000-0000-0000-0000-000000000020', 'Replit AI', 'AI-powered coding environment', 'Code, run, and deploy with AI assistance', 'https://replit.com', 'https://replit.com/favicon.ico', 'development', ARRAY['ai', 'coding', 'ide', 'development'], 'freemium', 'approved', '00000000-0000-0000-0000-000000000001', 5430, 298, 298);

-- Update the upvote_count to match like_count for consistency
UPDATE tools SET upvote_count = like_count WHERE upvote_count != like_count;