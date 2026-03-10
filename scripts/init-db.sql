-- Information Board Toolkit - PostgreSQL Database Schema
-- Run this script to initialize the database

-- Boards table
CREATE TABLE IF NOT EXISTS boards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  layout JSONB NOT NULL,
  meta JSONB,
  share_token TEXT UNIQUE NOT NULL,
  owner_token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author TEXT
);

-- View logs table
CREATE TABLE IF NOT EXISTS view_logs (
  id SERIAL PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip TEXT,
  user_agent TEXT
);

-- Rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id SERIAL PRIMARY KEY,
  identifier TEXT NOT NULL,
  client_ip TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, client_ip)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_boards_share_token ON boards(share_token);
CREATE INDEX IF NOT EXISTS idx_boards_author ON boards(author);
CREATE INDEX IF NOT EXISTS idx_boards_expires_at ON boards(expires_at);
CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards(created_at);
CREATE INDEX IF NOT EXISTS idx_view_logs_board_id ON view_logs(board_id);
CREATE INDEX IF NOT EXISTS idx_view_logs_viewed_at ON view_logs(viewed_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits(reset_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(identifier, client_ip);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_boards_updated_at 
    BEFORE UPDATE ON boards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
