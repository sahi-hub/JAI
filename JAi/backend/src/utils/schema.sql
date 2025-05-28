-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Entry',
  content TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT 'neutral',
  tags TEXT[] DEFAULT '{}',
  ai_summary TEXT,
  has_summary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood ON journal_entries(mood);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for journal_entries table
CREATE POLICY journal_entries_select_own ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY journal_entries_insert_own ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY journal_entries_update_own ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY journal_entries_delete_own ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to search journal entries by content
CREATE OR REPLACE FUNCTION search_journal_entries(search_query TEXT, user_uuid UUID)
RETURNS SETOF journal_entries AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM journal_entries
  WHERE user_id = user_uuid
    AND (
      title ILIKE '%' || search_query || '%'
      OR content ILIKE '%' || search_query || '%'
    )
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;