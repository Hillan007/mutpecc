import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ApplyCounselorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyCounselorModal({ isOpen, onClose }: ApplyCounselorModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [motivation, setMotivation] = useState("");
  const [experience, setExperience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState<{
    status: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      checkExistingApplication();
    }
  }, [isOpen, user]);

  const checkExistingApplication = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("counselor_applications")
      .select("status")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setExistingApplication(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !motivation.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("counselor_applications").insert({
        user_id: user.id,
        motivation: motivation.trim(),
        experience: experience.trim() || null,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Applied",
            description: "You have already submitted an application.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to submit application. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Application Submitted!",
          description: "An executive will review your application soon.",
        });
        setMotivation("");
        setExperience("");
        onClose();
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
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-foreground">
                  Become a Counselor
                </h2>
                <p className="text-sm text-muted-foreground">
                  Help others on their journey
                </p>
              </div>
            </div>

            {existingApplication ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Application {existingApplication.status === "approved" ? "Approved!" : existingApplication.status === "rejected" ? "Not Approved" : "Pending"}
                </h3>
                <p className="text-muted-foreground">
                  {existingApplication.status === "pending"
                    ? "Your application is being reviewed by our executives. You'll be notified once a decision is made."
                    : existingApplication.status === "approved"
                    ? "Congratulations! You are now a counselor. Your dashboard will be updated."
                    : "Unfortunately, your application was not approved at this time. Feel free to apply again later."}
                </p>
                <Button variant="outline" className="mt-6" onClick={onClose}>
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Why do you want to become a counselor? *
                  </label>
                  <textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Share your motivation and passion for helping others..."
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-32"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Relevant Experience (Optional)
                  </label>
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Describe any relevant experience, training, or qualifications..."
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                  />
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Note:</strong> Once you apply, an executive will track your "Lessons Attended." 
                    After meeting the requirements, you'll be upgraded to Counselor status automatically.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={isSubmitting || !motivation.trim()}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
