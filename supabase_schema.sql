-- ========================================================
-- Mental Health AI - Complete Supabase Database Schema Script
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================
-- 1. PROFILES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, theme)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        'light'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ========================================================
-- 2. CHAT HISTORY TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- ========================================================
-- 3. MOOD HISTORY TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.mood_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood VARCHAR(50) NOT NULL CHECK (mood IN ('happy', 'sad', 'stressed', 'calm', 'anxious', 'tired')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- ========================================================
-- 4. PHQ-2 RESULTS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.phq2_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question1 INT NOT NULL CHECK (question1 BETWEEN 0 AND 3),
    question2 INT NOT NULL CHECK (question2 BETWEEN 0 AND 3),
    score INT NOT NULL CHECK (score BETWEEN 0 AND 6),
    recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


-- ========================================================
-- 5. PERFORMANCE INDEXES
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_history_user_id ON public.mood_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_phq2_results_user_id ON public.phq2_results(user_id, created_at DESC);


-- ========================================================
-- 6. ROW LEVEL SECURITY (RLS) & POLICIES
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phq2_results ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- --------------------------------------------------------
-- CHAT HISTORY POLICIES
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own chat history" ON public.chat_history;
CREATE POLICY "Users can view own chat history"
    ON public.chat_history FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own chat history" ON public.chat_history;
CREATE POLICY "Users can insert own chat history"
    ON public.chat_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own chat history" ON public.chat_history;
CREATE POLICY "Users can delete own chat history"
    ON public.chat_history FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- MOOD HISTORY POLICIES
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own mood history" ON public.mood_history;
CREATE POLICY "Users can view own mood history"
    ON public.mood_history FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own mood entry" ON public.mood_history;
CREATE POLICY "Users can insert own mood entry"
    ON public.mood_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own mood entry" ON public.mood_history;
CREATE POLICY "Users can delete own mood entry"
    ON public.mood_history FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- PHQ-2 RESULTS POLICIES
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own phq2 results" ON public.phq2_results;
CREATE POLICY "Users can view own phq2 results"
    ON public.phq2_results FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own phq2 result" ON public.phq2_results;
CREATE POLICY "Users can insert own phq2 result"
    ON public.phq2_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own phq2 result" ON public.phq2_results;
CREATE POLICY "Users can delete own phq2 result"
    ON public.phq2_results FOR DELETE
    USING (auth.uid() = user_id);
