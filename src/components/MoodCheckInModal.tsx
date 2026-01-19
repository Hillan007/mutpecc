import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MoodType = "happy" | "sad" | "anxious" | "angry" | "confused" | "hopeful" | null;

const moods: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: "happy", emoji: "😊", label: "Happy", color: "bg-sage-100 hover:bg-sage-200 border-sage-300" },
  { type: "sad", emoji: "😢", label: "Sad", color: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
  { type: "anxious", emoji: "😰", label: "Anxious", color: "bg-amber-50 hover:bg-amber-100 border-amber-200" },
  { type: "angry", emoji: "😠", label: "Angry", color: "bg-red-50 hover:bg-red-100 border-red-200" },
  { type: "confused", emoji: "😕", label: "Confused", color: "bg-purple-50 hover:bg-purple-100 border-purple-200" },
  { type: "hopeful", emoji: "🌟", label: "Hopeful", color: "bg-coral-50 hover:bg-coral-100 border-coral-200" },
];

interface MoodCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoodCheckInModal({ isOpen, onClose }: MoodCheckInModalProps) {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);
  const [feelings, setFeelings] = useState("");
  const [reason, setReason] = useState("");
  const [solution, setSolution] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // TODO: Submit to backend
    console.log({ selectedMood, feelings, reason, solution, name, phone, email });
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return selectedMood !== null;
    if (step === 2) return feelings.trim().length > 0;
    if (step === 3) return reason.trim().length > 0;
    if (step === 4) return true; // Solution is optional
    if (step === 5) return name.trim().length > 0 && email.trim().length > 0;
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
                How is your mood today?
              </h3>
              <p className="text-muted-foreground">
                Select the emotion that best describes how you're feeling
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.type}
                  onClick={() => setSelectedMood(mood.type)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                    mood.color,
                    selectedMood === mood.type
                      ? "ring-2 ring-primary ring-offset-2 scale-105"
                      : "hover:scale-102"
                  )}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-sm font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
                How do you feel?
              </h3>
              <p className="text-muted-foreground">
                Share more about what's on your mind
              </p>
            </div>
            <textarea
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              placeholder="I feel..."
              className="w-full h-32 p-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
                What led to this?
              </h3>
              <p className="text-muted-foreground">
                Understanding the cause helps us help you better
              </p>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="This happened because..."
              className="w-full h-32 p-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
                Your proposed solution
              </h3>
              <p className="text-muted-foreground">
                What do you think could help? (Optional)
              </p>
            </div>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="I think I could..."
              className="w-full h-32 p-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
                How can we reach you?
              </h3>
              <p className="text-muted-foreground">
                So our counselors can connect with you
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full p-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                className="w-full p-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full p-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>
        );

      default:
        return null;
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card rounded-2xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              
              {/* Confidentiality Banner */}
              <div className="flex items-center gap-2 px-4 py-2 bg-sage-50 rounded-lg mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">
                  Your data is encrypted and 100% confidential
                </span>
              </div>

              {/* Progress */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "flex-1 h-1.5 rounded-full transition-colors duration-300",
                      s <= step ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 min-h-[320px]">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Skip to Homepage
              </Button>
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="px-6"
                >
                  Back
                </Button>
              )}
              <Button
                variant="hero"
                onClick={() => {
                  if (step < 5) {
                    setStep(step + 1);
                  } else {
                    handleSubmit();
                  }
                }}
                disabled={!canProceed()}
                className="flex-1"
              >
                {step === 5 ? (
                  <>
                    <Heart className="w-4 h-4" />
                    Submit
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
