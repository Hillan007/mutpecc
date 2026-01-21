-- 2. Create quick_bookings table for anonymous session requests
CREATE TABLE IF NOT EXISTS public.quick_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  is_contacted BOOLEAN DEFAULT false,
  contacted_by UUID,
  contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quick_bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a quick booking (anonymous)
CREATE POLICY "Anyone can submit quick booking"
ON public.quick_bookings
FOR INSERT
WITH CHECK (name IS NOT NULL AND email IS NOT NULL AND phone IS NOT NULL);

-- Executives can view and manage all quick bookings
CREATE POLICY "Executives can manage quick bookings"
ON public.quick_bookings
FOR ALL
USING (is_executive(auth.uid()));

-- 3. Create community_links table
CREATE TABLE IF NOT EXISTS public.community_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'social',
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_links ENABLE ROW LEVEL SECURITY;

-- Public links viewable by everyone
CREATE POLICY "Public links viewable by all"
ON public.community_links
FOR SELECT
USING (is_active = true AND is_premium = false);

-- Premium links only for approved members
CREATE POLICY "Premium links for approved members"
ON public.community_links
FOR SELECT
USING (is_active = true AND is_premium = true AND has_role(auth.uid(), 'member'));

-- Executives can manage all links
CREATE POLICY "Executives can manage community links"
ON public.community_links
FOR ALL
USING (is_executive(auth.uid()));

-- 4. Update qa_threads to support guest submissions with contact info
ALTER TABLE public.qa_threads 
ADD COLUMN IF NOT EXISTS guest_name TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT,
ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Make user_id nullable for guest submissions
ALTER TABLE public.qa_threads ALTER COLUMN user_id DROP NOT NULL;

-- Drop and recreate insert policy to allow guests
DROP POLICY IF EXISTS "Members can ask questions" ON public.qa_threads;

CREATE POLICY "Anyone can ask questions"
ON public.qa_threads
FOR INSERT
WITH CHECK (
  (auth.uid() = user_id AND is_member(auth.uid())) 
  OR 
  (user_id IS NULL AND guest_name IS NOT NULL AND guest_phone IS NOT NULL)
);

-- Allow counselors to view all questions too
CREATE POLICY "Counselors can view all questions"
ON public.qa_threads
FOR SELECT
USING (is_counselor(auth.uid()));

-- Allow counselors to reply
DROP POLICY IF EXISTS "Executives can reply" ON public.qa_threads;

CREATE POLICY "Counselors and Executives can reply"
ON public.qa_threads
FOR UPDATE
USING (is_counselor(auth.uid()));

-- 5. Add activity_date to activities table for auto-expiry
ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS activity_date TIMESTAMPTZ;

-- 6. Update handle_new_user to set pending_member instead of member
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  -- New users start as pending_member
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'pending_member');
  
  RETURN NEW;
END;
$function$;

-- 7. Create is_approved_member function
CREATE OR REPLACE FUNCTION public.is_approved_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'member') 
    OR public.has_role(_user_id, 'counselor') 
    OR public.has_role(_user_id, 'executive')
    OR public.has_role(_user_id, 'candidate')
$$;

-- 8. Add trigger for updated_at on community_links
CREATE TRIGGER update_community_links_updated_at
BEFORE UPDATE ON public.community_links
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 9. Update activities RLS for approved members only
DROP POLICY IF EXISTS "Published activities viewable by members" ON public.activities;

CREATE POLICY "Published activities viewable by approved members"
ON public.activities
FOR SELECT
USING ((is_published = true) AND is_approved_member(auth.uid()));