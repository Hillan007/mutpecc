import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  Calendar, 
  Video,
  Settings,
  MessageCircle,
  Activity,
  Link2,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { UserManagement } from "./UserManagement";
import { BookingManagement } from "./BookingManagement";
import { ContentManager } from "./ContentManager";
import { CommunityLinkManager } from "./CommunityLinkManager";
import type { Database } from "@/integrations/supabase/types";

type CounselorApplication = Database["public"]["Tables"]["counselor_applications"]["Row"];
type Session = Database["public"]["Tables"]["sessions"]["Row"];
type QAThread = Database["public"]["Tables"]["qa_threads"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function ExecutiveDashboard() {
  const { user } = useAuth();
  
  const [pendingApplications, setPendingApplications] = useState(0);
  const [pendingSessions, setPendingSessions] = useState(0);
  const [unansweredQuestions, setUnansweredQuestions] = useState(0);
  const [counselorCount, setCounselorCount] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const [
        applicationsRes,
        sessionsRes,
        qaRes,
        counselorsRes,
        bookingsRes,
      ] = await Promise.all([
        supabase.from("counselor_applications").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("sessions").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("qa_threads").select("id", { count: "exact" }).is("reply", null),
        supabase.from("user_roles").select("id", { count: "exact" }).eq("role", "counselor"),
        supabase.from("quick_bookings").select("id", { count: "exact" }).eq("is_contacted", false),
      ]);

      setPendingApplications(applicationsRes.count || 0);
      setPendingSessions(sessionsRes.count || 0);
      setUnansweredQuestions(qaRes.count || 0);
      setCounselorCount(counselorsRes.count || 0);
      setPendingBookings(bookingsRes.count || 0);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 shadow-soft"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-sage flex items-center justify-center">
              <Settings className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">
                Executive Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage the platform and oversee all operations.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 shadow-soft"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingApplications}</p>
              <p className="text-sm text-muted-foreground">Applications</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 shadow-soft"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingSessions}</p>
              <p className="text-sm text-muted-foreground">Unassigned</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 shadow-soft"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{unansweredQuestions}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-6 shadow-soft"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingBookings}</p>
              <p className="text-sm text-muted-foreground">Bookings</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl p-6 shadow-soft"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{counselorCount}</p>
              <p className="text-sm text-muted-foreground">Counselors</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingManagement />
        </TabsContent>

        <TabsContent value="content">
          <ContentManager />
        </TabsContent>

        <TabsContent value="community">
          <CommunityLinkManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
