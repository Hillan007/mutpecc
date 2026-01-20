import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MessageCircle, 
  GraduationCap, 
  Clock, 
  Send,
  Plus,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookSessionModal } from "./BookSessionModal";
import { ApplyCounselorModal } from "./ApplyCounselorModal";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type Activity = Database["public"]["Tables"]["activities"]["Row"];
type Session = Database["public"]["Tables"]["sessions"]["Row"];
type QAThread = Database["public"]["Tables"]["qa_threads"]["Row"];

export function MemberDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [qaThreads, setQAThreads] = useState<QAThread[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [eventsRes, activitiesRes, sessionsRes, qaRes] = await Promise.all([
        supabase.from("events").select("*").eq("is_published", true).order("event_date", { ascending: true }),
        supabase.from("activities").select("*").eq("is_published", true).order("created_at", { ascending: false }),
        supabase.from("sessions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("qa_threads").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (eventsRes.data) setEvents(eventsRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);
      if (sessionsRes.data) setSessions(sessionsRes.data);
      if (qaRes.data) setQAThreads(qaRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || !user) return;

    const { error } = await supabase.from("qa_threads").insert({
      user_id: user.id,
      question: newQuestion.trim(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Question Submitted",
        description: "An executive will respond to your question soon.",
      });
      setNewQuestion("");
      fetchData();
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
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">
                Member Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="warm" onClick={() => setIsBookingOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Book Session
            </Button>
            <Button variant="outline" onClick={() => setIsApplyOpen(true)}>
              <GraduationCap className="w-4 h-4 mr-2" />
              Become a Counselor
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming events
                </p>
              ) : (
                events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-secondary/50 rounded-xl"
                  >
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                      <Clock className="w-4 h-4" />
                      {new Date(event.event_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* My Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                My Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You haven't booked any sessions yet
                  </p>
                  <Button variant="warm" size="sm" onClick={() => setIsBookingOpen(true)}>
                    Book Your First Session
                  </Button>
                </div>
              ) : (
                sessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-secondary/50 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{session.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {session.description}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        session.status === "completed" ? "bg-green-100 text-green-700" :
                        session.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                        session.status === "assigned" ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Ask Executive Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Ask an Executive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type your question here..."
                className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="hero" onClick={handleAskQuestion} disabled={!newQuestion.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Previous Q&A */}
            <div className="space-y-3 mt-6">
              {qaThreads.map((thread) => (
                <div key={thread.id} className="p-4 bg-secondary/50 rounded-xl space-y-2">
                  <div>
                    <p className="text-sm font-medium text-primary">Your Question:</p>
                    <p className="text-foreground">{thread.question}</p>
                  </div>
                  {thread.reply ? (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm font-medium text-green-600">Executive Reply:</p>
                      <p className="text-foreground">{thread.reply}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Awaiting response...
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No activities posted yet
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 bg-secondary/50 rounded-xl"
                  >
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {activity.activity_type || "General"}
                    </span>
                    <h4 className="font-semibold text-foreground mt-2">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      <BookSessionModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        onSuccess={fetchData}
      />
      <ApplyCounselorModal 
        isOpen={isApplyOpen} 
        onClose={() => setIsApplyOpen(false)} 
      />
    </div>
  );
}
