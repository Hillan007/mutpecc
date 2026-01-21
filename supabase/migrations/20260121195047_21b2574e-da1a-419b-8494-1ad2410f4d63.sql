-- First migration: Add new enum values
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pending_member';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'candidate';