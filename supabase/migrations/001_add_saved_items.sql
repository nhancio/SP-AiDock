-- Create saved_items table to replace upvotes functionality
CREATE TABLE saved_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Add like_count to tools table
ALTER TABLE tools ADD COLUMN like_count INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX idx_saved_items_tool_id ON saved_items(tool_id);
CREATE INDEX idx_tools_like_count ON tools(like_count);

-- Enable RLS for saved_items
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Saved items are publicly readable
CREATE POLICY "Saved items are publicly readable" ON saved_items FOR SELECT USING (true);

-- Users can manage their own saved items
CREATE POLICY "Users can manage own saved items" ON saved_items FOR ALL USING (auth.uid() = user_id);

-- Create function to update like count
CREATE OR REPLACE FUNCTION update_tool_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tools SET like_count = like_count + 1 WHERE id = NEW.tool_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tools SET like_count = like_count - 1 WHERE id = OLD.tool_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for like count
CREATE TRIGGER update_like_count
    AFTER INSERT OR DELETE ON saved_items
    FOR EACH ROW EXECUTE FUNCTION update_tool_like_count();

-- Migrate existing upvotes to saved_items (optional - uncomment if you want to migrate)
-- INSERT INTO saved_items (user_id, tool_id, created_at)
-- SELECT user_id, tool_id, created_at FROM upvotes;

-- Update like_count based on existing upvotes
UPDATE tools SET like_count = upvote_count;
