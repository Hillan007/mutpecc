import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  Calendar, 
  Video,
  CheckCircle,
  XCircle,
  Plus,
  Settings,
  User,
  MessageCircle,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddVlogModal } from "./AddVlogModal";
import { AddEventModal } from "./AddEventModal";
import { AddActivityModal } from "./AddActivityModal";
import type { Database } from "@/integrations/supabase/types";

type CounselorApplication = Database["public"]["Tables"]["counselor_applications"]["Row"];
type Session = Database["public"]["Tables"]["sessions"]["Row"];
type MoodForm = Database["public"]["Tables"]["mood_forms"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type QAThread = Database["public"]["Tables"]["qa_threads"]["Row"];
type Vlog = Database["public"]["Tables"]["vlogs"]["Row"];
type Event = Database["public"]["Tables"]["events"]["Row"];
type ActivityItem = Database["public"]["Tables"]["activities"]["Row"];

export function ExecutiveDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<(CounselorApplication & { profile?: Profile })[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [moodForms, setMoodForms] = useState<MoodForm[]>([]);
  const [qaThreads, setQAThreads] = useState<QAThread[]>([]);
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [counselors, setCounselors] = useState<{ user_id: string; profile?: Profile }[]>([]);
  
  const [isVlogModalOpen, setIsVlogModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [
        applicationsRes,
        sessionsRes,
        moodFormsRes,
        qaRes,
        vlogsRes,
        eventsRes,
        activitiesRes,
        counselorsRes,
      ] = await Promise.all([
        supabase.from("counselor_applications").select("*").order("created_at", { ascending: false }),
        supabase.from("sessions").select("*").order("created_at", { ascending: false }),
        supabase.from("mood_forms").select("*").order("created_at", { ascending: false }),
        supabase.from("qa_threads").select("*").order("created_at", { ascending: false }),
        supabase.from("vlogs").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("*").order("event_date", { ascending: true }),
        supabase.from("activities").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id").eq("role", "counselor"),
      ]);

      // Fetch profiles for applications
      if (applicationsRes.data) {
        const userIds = applicationsRes.data.map(a => a.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .in("user_id", userIds);
        
        const appsWithProfiles = applicationsRes.data.map(app => ({
          ...app,
          profile: profiles?.find(p => p.user_id === app.user_id),
        }));
        setApplications(appsWithProfiles);
      }

      // Fetch profiles for counselors
      if (counselorsRes.data) {
        const counselorIds = counselorsRes.data.map(c => c.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .in("user_id", counselorIds);
        
        const counselorsWithProfiles = counselorsRes.data.map(c => ({
          ...c,
          profile: profiles?.find(p => p.user_id === c.user_id),
        }));
        setCounselors(counselorsWithProfiles);
      }

      if (sessionsRes.data) setSessions(sessionsRes.data);
      if (moodFormsRes.data) setMoodForms(moodFormsRes.data);
      if (qaRes.data) setQAThreads(qaRes.data);
      if (vlogsRes.data) setVlogs(vlogsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (appId: string, userId: string, action: "approved" | "rejected") => {
    const { error } = await supabase
      .from("counselor_applications")
      .update({
        status: action,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", appId);

    if (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} application.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Application ${action} successfully.`,
      });
      fetchData();
    }
  };

  const handleAssignCounselor = async (sessionId: string, counselorId: string) => {
    const { error } = await supabase
      .from("sessions")
      .update({
        counselor_id: counselorId,
        status: "assigned",
      })
      .eq("id", sessionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to assign counselor.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Counselor Assigned",
        description: "The session has been assigned successfully.",
      });
      fetchData();
    }
  };

  const handleReplyQuestion = async (threadId: string, reply: string) => {
    const { error } = await supabase
      .from("qa_threads")
      .update({
        reply,
        replied_by: user?.id,
        replied_at: new Date().toISOString(),
      })
      .eq("id", threadId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send reply.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent to the member.",
      });
      fetchData();
    }
  };

  const handleUpdateLessons = async (userId: string, currentLessons: number) => {
    const { error } = await supabase
      .from("profiles")
      .update({ lessons_attended: currentLessons + 1 })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update lessons.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Lesson Recorded",
        description: "Lessons attended updated.",
      });
      fetchData();
    }
  };

  const pendingApplications = applications.filter(a => a.status === "pending");
  const pendingSessions = sessions.filter(s => s.status === "pending");
  const unansweredQuestions = qaThreads.filter(q => !q.reply);

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
      <div className="grid md:grid-cols-4 gap-4">
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
              <p className="text-2xl font-bold text-foreground">{pendingApplications.length}</p>
              <p className="text-sm text-muted-foreground">Pending Applications</p>
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
              <p className="text-2xl font-bold text-foreground">{pendingSessions.length}</p>
              <p className="text-sm text-muted-foreground">Unassigned Sessions</p>
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
              <p className="text-2xl font-bold text-foreground">{unansweredQuestions.length}</p>
              <p className="text-sm text-muted-foreground">Unanswered Questions</p>
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
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{counselors.length}</p>
              <p className="text-sm text-muted-foreground">Active Counselors</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="questions">Q&A</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="mood-forms">Mood Forms</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Counselor Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingApplications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No pending applications
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 bg-secondary/50 rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-foreground">
                              {app.profile?.full_name || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Lessons: {app.profile?.lessons_attended || 0}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-1">
                            <strong>Motivation:</strong> {app.motivation}
                          </p>
                          {app.experience && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Experience:</strong> {app.experience}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateLessons(app.user_id, app.profile?.lessons_attended || 0)}
                          >
                            +1 Lesson
                          </Button>
                          <Button
                            variant="warm"
                            size="sm"
                            onClick={() => handleApplicationAction(app.id, app.user_id, "approved")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApplicationAction(app.id, app.user_id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No session bookings yet
                </p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 bg-secondary/50 rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{session.title}</h4>
                          <p className="text-sm text-muted-foreground">{session.description}</p>
                          <p className="text-xs text-primary mt-1">
                            Status: {session.status}
                          </p>
                        </div>
                        {session.status === "pending" && counselors.length > 0 && (
                          <select
                            className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignCounselor(session.id, e.target.value);
                              }
                            }}
                            defaultValue=""
                          >
                            <option value="">Assign Counselor</option>
                            {counselors.map((c) => (
                              <option key={c.user_id} value={c.user_id}>
                                {c.profile?.full_name || c.user_id.slice(0, 8)}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Q&A Tab */}
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Member Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {qaThreads.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No questions yet
                </p>
              ) : (
                <div className="space-y-4">
                  {qaThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className={`p-4 bg-secondary/50 rounded-xl ${!thread.reply ? "border-l-4 border-amber-400" : ""}`}
                    >
                      <p className="text-sm font-medium text-primary mb-1">Question:</p>
                      <p className="text-foreground mb-3">{thread.question}</p>
                      
                      {thread.reply ? (
                        <div className="pt-3 border-t border-border">
                          <p className="text-sm font-medium text-green-600 mb-1">Your Reply:</p>
                          <p className="text-foreground">{thread.reply}</p>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-border">
                          <ReplyInput
                            onSubmit={(reply) => handleReplyQuestion(thread.id, reply)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {/* Vlogs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Vlogs
              </CardTitle>
              <Button variant="warm" size="sm" onClick={() => setIsVlogModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Vlog
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vlogs.map((vlog) => (
                  <div key={vlog.id} className="p-4 bg-secondary/50 rounded-xl">
                    <h4 className="font-semibold text-foreground">{vlog.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{vlog.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Events
              </CardTitle>
              <Button variant="warm" size="sm" onClick={() => setIsEventModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 bg-secondary/50 rounded-xl">
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-primary mt-2">
                      {new Date(event.event_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activities
              </CardTitle>
              <Button variant="warm" size="sm" onClick={() => setIsActivityModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Activity
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-4 bg-secondary/50 rounded-xl">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {activity.activity_type || "General"}
                    </span>
                    <h4 className="font-semibold text-foreground mt-2">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mood Forms Tab */}
        <TabsContent value="mood-forms">
          <Card>
            <CardHeader>
              <CardTitle>All Mood Check-Ins</CardTitle>
            </CardHeader>
            <CardContent>
              {moodForms.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No mood check-ins yet
                </p>
              ) : (
                <div className="space-y-4">
                  {moodForms.map((form) => (
                    <div
                      key={form.id}
                      className={`p-4 bg-secondary/50 rounded-xl ${form.is_claimed ? "border-l-4 border-green-400" : "border-l-4 border-amber-400"}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-foreground">{form.name}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${form.is_claimed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                              {form.is_claimed ? "Claimed" : "Unclaimed"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Mood: {form.mood} | Phone: {form.phone} | Email: {form.email}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(form.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddVlogModal isOpen={isVlogModalOpen} onClose={() => setIsVlogModalOpen(false)} onSuccess={fetchData} />
      <AddEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onSuccess={fetchData} />
      <AddActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} onSuccess={fetchData} />
    </div>
  );
}

// Reply Input Component
function ReplyInput({ onSubmit }: { onSubmit: (reply: string) => void }) {
  const [reply, setReply] = useState("");

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Type your reply..."
        className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
      />
      <Button
        variant="warm"
        size="sm"
        onClick={() => {
          if (reply.trim()) {
            onSubmit(reply.trim());
            setReply("");
          }
        }}
        disabled={!reply.trim()}
      >
        Reply
      </Button>
    </div>
  );
}
