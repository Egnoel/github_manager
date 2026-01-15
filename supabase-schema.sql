-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    current INTEGER DEFAULT 0 NOT NULL,
    target INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN (
            'commits',
            'pull_requests',
            'code_reviews',
            'issues',
            'contributions',
            'repositories'
        )
    ),
    deadline_days INTEGER NOT NULL,
    deadline_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_deadline_date ON goals(deadline_date);
-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
-- Create policy: Users can only see their own goals
CREATE POLICY "Users can view their own goals" ON goals FOR
SELECT USING (auth.uid() = user_id);
-- Create policy: Users can insert their own goals
CREATE POLICY "Users can insert their own goals" ON goals FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Create policy: Users can update their own goals
CREATE POLICY "Users can update their own goals" ON goals FOR
UPDATE USING (auth.uid() = user_id);
-- Create policy: Users can delete their own goals
CREATE POLICY "Users can delete their own goals" ON goals FOR DELETE USING (auth.uid() = user_id);
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create trigger to automatically update updated_at
CREATE TRIGGER update_goals_updated_at BEFORE
UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();