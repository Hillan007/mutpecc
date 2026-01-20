-- Fix the overly permissive INSERT policy on mood_forms to only allow inserts with proper data
DROP POLICY IF EXISTS "Anyone can submit mood form" ON public.mood_forms;
CREATE POLICY "Anyone can submit mood form" ON public.mood_forms 
  FOR INSERT 
  WITH CHECK (name IS NOT NULL AND phone IS NOT NULL AND email IS NOT NULL);