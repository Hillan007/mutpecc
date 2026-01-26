import { useState, useEffect } from "react";
import { MessageCircle, Send, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type QAThread = Database["public"]["Tables"]["qa_threads"]["Row"];

export function QAManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<QAThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unanswered" | "answered">("unanswered");

  useEffect(() => {
    fetchThreads();
  }, [filter]);

  const fetchThreads = async () => {
    try {
      let query = supabase.from("qa_threads").select("*").order("created_at", { ascending: false });
      
      if (filter === "unanswered") {
        query = query.is("reply", null);
      } else if (filter === "answered") {
        query = query.not("reply", "is", null);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setThreads(data);
    } catch (error) {
      console.error("Error fetching Q&A threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (threadId: string, reply: string) => {
    if (!user || !reply.trim()) return;

    const { error } = await supabase
      .from("qa_threads")
      .update({
        reply: reply.trim(),
        replied_by: user.id,
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
        description: "Your response has been saved and is now visible to the user.",
      });
      fetchThreads();
    }
  };

  const togglePublic = async (threadId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("qa_threads")
      .update({ is_public: !currentStatus })
      .eq("id", threadId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Visibility Updated",
        description: currentStatus ? "Question is now private." : "Question is now public and visible on the Ask Executive page.",
      });
      fetchThreads();
    }
  };

  const unansweredCount = threads.filter(t => !t.reply).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Questions & Answers
            {unansweredCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
                {unansweredCount} unanswered
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "unanswered" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unanswered")}
            >
              Unanswered
            </Button>
            <Button
              variant={filter === "answered" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("answered")}
            >
              Answered
            </Button>
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : threads.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {filter === "unanswered" ? "No unanswered questions!" : "No questions found."}
          </p>
        ) : (
          <div className="space-y-4">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`p-4 bg-secondary/50 rounded-xl ${!thread.reply ? "border-l-4 border-amber-400" : "border-l-4 border-green-400"}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-primary">
                      {thread.guest_name || "Member"}
                      {thread.guest_phone && (
                        <span className="text-muted-foreground ml-2">({thread.guest_phone})</span>
                      )}
                      {thread.guest_email && (
                        <span className="text-muted-foreground ml-2">• {thread.guest_email}</span>
                      )}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(thread.created_at).toLocaleDateString()} at {new Date(thread.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  {thread.reply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublic(thread.id, thread.is_public || false)}
                      className="flex items-center gap-1"
                    >
                      {thread.is_public ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">Public</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span className="text-xs">Private</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Question */}
                <p className="text-foreground mb-3 bg-background/50 p-3 rounded-lg">{thread.question}</p>

                {/* Reply Section */}
                {thread.reply ? (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Replied</span>
                      {thread.replied_at && (
                        <span className="text-xs text-muted-foreground">
                          on {new Date(thread.replied_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-foreground bg-green-50 p-3 rounded-lg">{thread.reply}</p>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-border">
                    <ReplyInput onSubmit={(reply) => handleReply(thread.id, reply)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Reply Input Component
function ReplyInput({ onSubmit }: { onSubmit: (reply: string) => void }) {
  const [reply, setReply] = useState("");

  return (
    <div className="space-y-2">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Type your reply to this question..."
        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm min-h-[80px] resize-none"
      />
      <div className="flex justify-end">
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
          className="flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Reply
        </Button>
      </div>
    </div>
  );
}
