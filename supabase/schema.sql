-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'tool_owner', 'admin');
CREATE TYPE pricing_type AS ENUM ('free', 'freemium', 'paid');
CREATE TYPE tool_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools table
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  url TEXT NOT NULL,
  logo_url TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  pricing_type pricing_type NOT NULL,
  pricing_details JSONB,
  status tool_status DEFAULT 'pending',
  submitted_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  upvote_count INTEGER DEFAULT 0
);

-- Upvotes table
CREATE TABLE upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Featured tools table
CREATE TABLE featured_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  payment_id VARCHAR(255),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'click', 'upvote', etc.
  user_id UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions
CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(7), -- hex color
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Content Creation', 'content-creation', 'AI tools for writing, design, and multimedia content', 'pen-tool', '#3B82F6'),
('Productivity', 'productivity', 'Tools to boost efficiency and streamline workflows', 'zap', '#10B981'),
('Analytics', 'analytics', 'Data analysis and business intelligence tools', 'bar-chart', '#F59E0B'),
('Automation', 'automation', 'Workflow automation and process optimization', 'settings', '#8B5CF6'),
('SaaS', 'saas', 'Software as a Service applications', 'cloud', '#06B6D4'),
('Agents', 'agents', 'AI agents and virtual assistants', 'bot', '#EF4444'),
('Marketing', 'marketing', 'Marketing and growth tools', 'megaphone', '#EC4899'),
('Development', 'development', 'Developer tools and APIs', 'code', '#84CC16');

-- Create indexes for better performance
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_created_at ON tools(created_at);
CREATE INDEX idx_tools_upvote_count ON tools(upvote_count);
CREATE INDEX idx_upvotes_user_id ON upvotes(user_id);
CREATE INDEX idx_upvotes_tool_id ON upvotes(tool_id);
CREATE INDEX idx_analytics_tool_id ON analytics(tool_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update upvote count
CREATE OR REPLACE FUNCTION update_tool_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tools SET upvote_count = upvote_count + 1 WHERE id = NEW.tool_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tools SET upvote_count = upvote_count - 1 WHERE id = OLD.tool_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for upvote count
CREATE TRIGGER update_upvote_count
    AFTER INSERT OR DELETE ON upvotes
    FOR EACH ROW EXECUTE FUNCTION update_tool_upvote_count();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read all users
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Tools are publicly readable
CREATE POLICY "Tools are publicly readable" ON tools FOR SELECT USING (true);

-- Only authenticated users can insert tools
CREATE POLICY "Authenticated users can insert tools" ON tools FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only tool owners and admins can update tools
CREATE POLICY "Tool owners and admins can update tools" ON tools FOR UPDATE USING (
  auth.uid() = submitted_by OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Upvotes are publicly readable
CREATE POLICY "Upvotes are publicly readable" ON upvotes FOR SELECT USING (true);

-- Users can manage their own upvotes
CREATE POLICY "Users can manage own upvotes" ON upvotes FOR ALL USING (auth.uid() = user_id);

-- Analytics are publicly readable for admins
CREATE POLICY "Analytics readable by admins" ON analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Anyone can insert analytics
CREATE POLICY "Anyone can insert analytics" ON analytics FOR INSERT WITH CHECK (true);

-- Newsletter subscriptions are publicly readable
CREATE POLICY "Newsletter subscriptions are publicly readable" ON newsletter_subscriptions FOR SELECT USING (true);

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
