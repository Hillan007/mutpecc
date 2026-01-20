-- Create enums for roles and statuses
CREATE TYPE public.app_role AS ENUM ('member', 'counselor', 'executive');
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.mood_type AS ENUM ('happy', 'sad', 'anxious', 'stressed', 'confused', 'hopeful', 'angry', 'neutral');
CREATE TYPE public.session_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');

-- User roles table (critical for RLS)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  lessons_attended INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Mood forms (leads from check-in)
CREATE TABLE public.mood_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  mood mood_type NOT NULL,
  feelings TEXT,
  cause TEXT,
  proposed_solution TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  is_claimed BOOLEAN DEFAULT false,
  claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.mood_forms ENABLE ROW LEVEL SECURITY;

-- Session bookings
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  counselor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  preferred_date TIMESTAMP WITH TIME ZONE,
  status session_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Counselor applications
CREATE TABLE public.counselor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  motivation TEXT NOT NULL,
  experience TEXT,
  status application_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.counselor_applications ENABLE ROW LEVEL SECURITY;

-- Q&A threads for Ask Executive
CREATE TABLE public.qa_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  reply TEXT,
  replied_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  replied_at TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.qa_threads ENABLE ROW LEVEL SECURITY;

-- Vlogs (managed by executives)
CREATE TABLE public.vlogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.vlogs ENABLE ROW LEVEL SECURITY;

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Activities
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- ============ HELPER FUNCTIONS ============
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_member(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_counselor(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'counselor') OR public.has_role(_user_id, 'executive')
$$;

CREATE OR REPLACE FUNCTION public.is_executive(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'executive')
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT FROM public.user_roles WHERE user_id = _user_id ORDER BY 
    CASE role 
      WHEN 'executive' THEN 1 
      WHEN 'counselor' THEN 2 
      WHEN 'member' THEN 3 
    END 
  LIMIT 1
$$;

-- ============ TRIGGERS ============
-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_vlogs_updated_at BEFORE UPDATE ON public.vlogs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile and member role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-upgrade to counselor when application approved
CREATE OR REPLACE FUNCTION public.handle_application_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'counselor')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_application_approved
  AFTER UPDATE ON public.counselor_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_application_approved();

-- ============ RLS POLICIES ============

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Executives can view all roles" ON public.user_roles FOR SELECT USING (public.is_executive(auth.uid()));
CREATE POLICY "Executives can manage roles" ON public.user_roles FOR ALL USING (public.is_executive(auth.uid()));

-- Profiles policies
CREATE POLICY "Public profiles are viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mood forms policies
CREATE POLICY "Anyone can submit mood form" ON public.mood_forms FOR INSERT WITH CHECK (true);
CREATE POLICY "Counselors can view unclaimed forms" ON public.mood_forms FOR SELECT USING (public.is_counselor(auth.uid()) AND is_claimed = false);
CREATE POLICY "Counselors can view their claimed forms" ON public.mood_forms FOR SELECT USING (public.is_counselor(auth.uid()) AND claimed_by = auth.uid());
CREATE POLICY "Executives can view all forms" ON public.mood_forms FOR SELECT USING (public.is_executive(auth.uid()));
CREATE POLICY "Counselors can claim forms" ON public.mood_forms FOR UPDATE USING (public.is_counselor(auth.uid()) AND (is_claimed = false OR claimed_by = auth.uid()));

-- Sessions policies
CREATE POLICY "Users can view own sessions" ON public.sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Counselors can view assigned sessions" ON public.sessions FOR SELECT USING (public.is_counselor(auth.uid()) AND counselor_id = auth.uid());
CREATE POLICY "Executives can view all sessions" ON public.sessions FOR SELECT USING (public.is_executive(auth.uid()));
CREATE POLICY "Members can create sessions" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = user_id AND public.is_member(auth.uid()));
CREATE POLICY "Executives can manage sessions" ON public.sessions FOR ALL USING (public.is_executive(auth.uid()));
CREATE POLICY "Counselors can update assigned sessions" ON public.sessions FOR UPDATE USING (public.is_counselor(auth.uid()) AND counselor_id = auth.uid());

-- Counselor applications policies
CREATE POLICY "Users can view own application" ON public.counselor_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create application" ON public.counselor_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Executives can view all applications" ON public.counselor_applications FOR SELECT USING (public.is_executive(auth.uid()));
CREATE POLICY "Executives can manage applications" ON public.counselor_applications FOR UPDATE USING (public.is_executive(auth.uid()));

-- QA threads policies
CREATE POLICY "Users can view own questions" ON public.qa_threads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public questions viewable by all" ON public.qa_threads FOR SELECT USING (is_public = true);
CREATE POLICY "Members can ask questions" ON public.qa_threads FOR INSERT WITH CHECK (auth.uid() = user_id AND public.is_member(auth.uid()));
CREATE POLICY "Executives can view all questions" ON public.qa_threads FOR SELECT USING (public.is_executive(auth.uid()));
CREATE POLICY "Executives can reply" ON public.qa_threads FOR UPDATE USING (public.is_executive(auth.uid()));

-- Vlogs policies
CREATE POLICY "Published vlogs are public" ON public.vlogs FOR SELECT USING (is_published = true);
CREATE POLICY "Executives can manage vlogs" ON public.vlogs FOR ALL USING (public.is_executive(auth.uid()));

-- Events policies
CREATE POLICY "Published events are public" ON public.events FOR SELECT USING (is_published = true);
CREATE POLICY "Executives can manage events" ON public.events FOR ALL USING (public.is_executive(auth.uid()));

-- Activities policies
CREATE POLICY "Published activities viewable by members" ON public.activities FOR SELECT USING (is_published = true AND public.is_member(auth.uid()));
CREATE POLICY "Executives can manage activities" ON public.activities FOR ALL USING (public.is_executive(auth.uid()));