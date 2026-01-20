import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Phone, 
  Mail, 
  MessageSquare,
  CheckCircle,
  Clock,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type MoodForm = Database["public"]["Tables"]["mood_forms"]["Row"];
type Session = Database["public"]["Tables"]["sessions"]["Row"];

export function CounselorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [unclaimedForms, setUnclaimedForms] = useState<MoodForm[]>([]);
  const [claimedForms, setClaimedForms] = useState<MoodForm[]>([]);
  const [assignedSessions, setAssignedSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [unclaimedRes, claimedRes, sessionsRes] = await Promise.all([
        supabase.from("mood_forms").select("*").eq("is_claimed", false).order("created_at", { ascending: false }),
        supabase.from("mood_forms").select("*").eq("claimed_by", user.id).order("created_at", { ascending: false }),
        supabase.from("sessions").select("*").eq("counselor_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (unclaimedRes.data) setUnclaimedForms(unclaimedRes.data);
      if (claimedRes.data) setClaimedForms(claimedRes.data);
      if (sessionsRes.data) setAssignedSessions(sessionsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimForm = async (formId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("mood_forms")
      .update({
        is_claimed: true,
        claimed_by: user.id,
        claimed_at: new Date().toISOString(),
      })
      .eq("id", formId)
      .eq("is_claimed", false); // Ensure it's not already claimed

    if (error) {
      toast({
        title: "Error",
        description: "Failed to claim this request. It may have been claimed by another counselor.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Request Claimed",
        description: "You can now contact this person.",
      });
      fetchData();
    }
  };

  const handleUpdateSessionStatus = async (sessionId: string, status: string) => {
    const { error } = await supabase
      .from("sessions")
      .update({ status: status as any })
      .eq("id", sessionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update session status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status Updated",
        description: `Session marked as ${status}.`,
      });
      fetchData();
    }
  };

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      happy: "😊",
      sad: "😢",
      anxious: "😰",
      stressed: "😫",
      confused: "😕",
      hopeful: "🌟",
      angry: "😠",
      neutral: "😐",
    };
    return emojis[mood] || "😐";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 shadow-soft"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-sage flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Counselor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Help those in need and make a difference.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 shadow-soft"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{unclaimedForms.length}</p>
              <p className="text-sm text-muted-foreground">New Requests</p>
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
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{claimedForms.length}</p>
              <p className="text-sm text-muted-foreground">My Clients</p>
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
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{assignedSessions.length}</p>
              <p className="text-sm text-muted-foreground">Assigned Sessions</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Unclaimed Mood Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              New Mood Requests (Unclaimed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unclaimedForms.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No new requests at the moment
              </p>
            ) : (
              <div className="space-y-4">
                {unclaimedForms.map((form) => (
                  <div
                    key={form.id}
                    className="p-4 bg-secondary/50 rounded-xl border-l-4 border-amber-400"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getMoodEmoji(form.mood)}</span>
                          <span className="font-semibold text-foreground capitalize">{form.mood}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(form.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-1">
                          <strong>Name:</strong> {form.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <strong>Feelings:</strong> {form.feelings || "Not specified"}
                        </p>
                      </div>
                      <Button
                        variant="warm"
                        size="sm"
                        onClick={() => handleClaimForm(form.id)}
                      >
                        Pick & Respond
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* My Claimed Clients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              My Assigned Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            {claimedForms.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                You haven't claimed any clients yet
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {claimedForms.map((form) => (
                  <div
                    key={form.id}
                    className="p-4 bg-secondary/50 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{getMoodEmoji(form.mood)}</span>
                      <div>
                        <p className="font-semibold text-foreground">{form.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{form.mood}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${form.phone}`} className="text-primary hover:underline">
                          {form.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${form.email}`} className="text-primary hover:underline">
                          {form.email}
                        </a>
                      </div>
                    </div>

                    {form.feelings && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Feelings:</p>
                        <p className="text-sm text-foreground">{form.feelings}</p>
                      </div>
                    )}

                    {form.cause && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Cause:</p>
                        <p className="text-sm text-foreground">{form.cause}</p>
                      </div>
                    )}

                    {form.proposed_solution && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Their proposed solution:</p>
                        <p className="text-sm text-foreground">{form.proposed_solution}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Assigned Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>My Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedSessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No sessions assigned to you yet
              </p>
            ) : (
              <div className="space-y-4">
                {assignedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-secondary/50 rounded-xl flex items-start justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-semibold text-foreground">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                      {session.preferred_date && (
                        <p className="text-xs text-primary mt-1">
                          Preferred: {new Date(session.preferred_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full text-center ${
                        session.status === "completed" ? "bg-green-100 text-green-700" :
                        session.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {session.status}
                      </span>
                      {session.status !== "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateSessionStatus(
                            session.id,
                            session.status === "assigned" ? "in_progress" : "completed"
                          )}
                        >
                          {session.status === "assigned" ? "Start" : "Complete"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
