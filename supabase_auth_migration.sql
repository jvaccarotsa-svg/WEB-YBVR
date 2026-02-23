-- ============================================
-- CMS Authentication Tables
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create cms_users table
CREATE TABLE IF NOT EXISTS cms_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create cms_sessions table
CREATE TABLE IF NOT EXISTS cms_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES cms_users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sessions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - allow anon key to read for auth verification
CREATE POLICY "Allow anon to verify credentials" ON cms_users
    FOR SELECT USING (true);

CREATE POLICY "Allow anon to manage sessions" ON cms_sessions
    FOR ALL USING (true);

-- 6. Create index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_cms_sessions_token ON cms_sessions(token);
CREATE INDEX IF NOT EXISTS idx_cms_sessions_expires ON cms_sessions(expires_at);

-- 7. Seed initial admin user (password: ybvr2025)
INSERT INTO cms_users (username, password_hash, display_name)
VALUES (
    'admin',
    crypt('ybvr2025', gen_salt('bf')),
    'Administrador'
)
ON CONFLICT (username) DO NOTHING;

-- 8. Function to verify passwords via RPC
CREATE OR REPLACE FUNCTION verify_cms_password(input_username TEXT, input_password TEXT)
RETURNS TABLE(id UUID, username TEXT, display_name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.username, u.display_name
    FROM cms_users u
    WHERE u.username = input_username
      AND u.password_hash = crypt(input_password, u.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Function to clean expired sessions (optional, run periodically)
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM cms_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
