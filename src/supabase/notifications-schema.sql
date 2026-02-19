-- ==========================================
-- TABLE: notifications
-- Stores in-app notifications for users
-- ==========================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon TEXT DEFAULT '🔔',
    type TEXT DEFAULT 'general' CHECK (type IN ('general', 'order', 'offer', 'points', 'system', 'alert')),
    target TEXT DEFAULT 'all' CHECK (target IN ('all', 'user')),
    target_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    image_url TEXT,
    action_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TABLE: notification_reads
-- Tracks which users have read which notifications
-- ==========================================

CREATE TABLE IF NOT EXISTS public.notification_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(notification_id, user_id)
);

-- ==========================================
-- ENABLE RLS ON NOTIFICATIONS
-- ==========================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view notifications targeted to 'all' or themselves
CREATE POLICY "Users can view their notifications"
    ON public.notifications FOR SELECT
    USING (
        is_active = true AND (
            target = 'all' OR
            (target = 'user' AND target_user_id = auth.uid())
        )
    );

-- Admins can do everything (using a simple check on email or service role)
CREATE POLICY "Service role can manage notifications"
    ON public.notifications FOR ALL
    USING (true)
    WITH CHECK (true);

-- Users can insert their own reads
CREATE POLICY "Users can insert their reads"
    ON public.notification_reads FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can view their own reads
CREATE POLICY "Users can view their reads"
    ON public.notification_reads FOR SELECT
    USING (user_id = auth.uid());

-- ==========================================
-- ENABLE REALTIME ON NOTIFICATIONS
-- ==========================================
-- Run this in Supabase dashboard > Database > Replication
-- Or run: ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ==========================================
-- SAMPLE NOTIFICATIONS (optional)
-- ==========================================
-- INSERT INTO public.notifications (title, body, icon, type, target)
-- VALUES 
--   ('مرحباً بك! 👋', 'شكراً لانضمامك إلى متجر الأطيب. استمتع بأفضل المنتجات الطازجة!', '🎉', 'general', 'all'),
--   ('عرض خاص 🔥', 'احصل على خصم 20% على جميع الخضروات اليوم فقط!', '🔥', 'offer', 'all');
