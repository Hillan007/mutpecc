import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddEventModal({ isOpen, onClose, onSuccess }: AddEventModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !eventDate) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("events").insert({
        title: title.trim(),
        description: description.trim() || null,
        event_date: new Date(eventDate).toISOString(),
        location: location.trim() || null,
        created_by: user.id,
        is_published: true,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add event. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Event Added!",
          description: "The event has been published successfully.",
        });
        setTitle("");
        setDescription("");
        setEventDate("");
        setLocation("");
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
                  Add New Event
                </h2>
                <p className="text-sm text-muted-foreground">
                  Create a calendar event
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Online / Community Center"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the event..."
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
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
                  disabled={isSubmitting || !title.trim() || !eventDate}
                >
                  {isSubmitting ? "Adding..." : "Add Event"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
