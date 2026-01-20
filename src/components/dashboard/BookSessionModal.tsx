import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookSessionModal({ isOpen, onClose, onSuccess }: BookSessionModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("sessions").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        preferred_date: preferredDate ? new Date(preferredDate).toISOString() : null,
        status: "pending",
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to book session. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Session Booked!",
          description: "An executive will assign a counselor to your session soon.",
        });
        setTitle("");
        setDescription("");
        setPreferredDate("");
        onClose();
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-elevated p-6"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-sage flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-foreground">
                  Book a Session
                </h2>
                <p className="text-sm text-muted-foreground">
                  Schedule time with a counselor
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Session Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Anxiety Management Session"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what you'd like to discuss..."
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  className="flex-1"
                  disabled={isSubmitting || !title.trim()}
                >
                  {isSubmitting ? "Booking..." : "Book Session"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
