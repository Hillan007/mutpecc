import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Calendar, LogIn, UserPlus, Shield, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { MoodCheckInModal } from "@/components/MoodCheckInModal";
import { QuickBookModal } from "@/components/QuickBookModal";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showQuickBook, setShowQuickBook] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("mutpecc-mood-checked");
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowMoodModal(true);
        sessionStorage.setItem("mutpecc-mood-checked", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingButtons />
      <MoodCheckInModal isOpen={showMoodModal} onClose={() => setShowMoodModal(false)} />
      <QuickBookModal isOpen={showQuickBook} onClose={() => setShowQuickBook(false)} />

      {/* Hero & Main Actions */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 min-h-[90vh] flex items-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Calming background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side: Value Prop */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Ready to start your healing journey?
              </span>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight mb-6">
                Professional support for your <span className="text-primary border-b-4 border-primary/20">mental peace.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Book a session with a certified counselor or join our supportive community today. Your privacy is 100% guaranteed.
              </p>
              
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
                  ))}
                </div>
                <span>Joined by 500+ members this month</span>
              </div>
            </motion.div>

            {/* Right Side: Direct Action Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {/* Primary Action: Book */}
              <button 
                onClick={() => setShowQuickBook(true)}
                className="flex flex-col items-start p-6 bg-primary text-primary-foreground rounded-2xl shadow-xl hover:translate-y-[-4px] transition-all group text-left"
              >
                <Calendar className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-1">Book a Session</h3>
                <p className="text-sm opacity-90 mb-4">Talk to a professional counselor privately.</p>
                <div className="mt-auto flex items-center gap-2 font-semibold">
                  Quick Book <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Action: Log In */}
              <Link to="/auth" className="flex flex-col items-start p-6 bg-card border-2 border-border rounded-2xl shadow-sm hover:border-primary/50 transition-all text-left">
                <LogIn className="w-8 h-8 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-1">Member Login</h3>
                <p className="text-sm text-muted-foreground mb-4">Access your dashboard and past sessions.</p>
                <div className="mt-auto flex items-center gap-2 text-primary font-semibold">
                  Sign In <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Action: Mood Check */}
              <button 
                onClick={() => setShowMoodModal(true)}
                className="flex flex-col items-start p-6 bg-card border-2 border-border rounded-2xl shadow-sm hover:border-primary/50 transition-all text-left"
              >
                <Heart className="w-8 h-8 mb-4 text-rose-500" />
                <h3 className="text-xl font-bold mb-1">Mood Check-in</h3>
                <p className="text-sm text-muted-foreground mb-4">Not sure how you feel? Take a quick assessment.</p>
                <div className="mt-auto flex items-center gap-2 text-primary font-semibold">
                  Start Check <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* Action: Join */}
              <Link to="/community" className="flex flex-col items-start p-6 bg-secondary rounded-2xl shadow-sm hover:bg-secondary/80 transition-all text-left">
                <UserPlus className="w-8 h-8 mb-4 text-foreground" />
                <h3 className="text-xl font-bold mb-1">Join Community</h3>
                <p className="text-sm text-muted-foreground mb-4">Connect with our supportive community.</p>
                <div className="mt-auto flex items-center gap-2 font-semibold">
                  Get Started <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trust Section: Simple & Clean */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-primary/60" />
              <div>
                <p className="font-bold">Confidential</p>
                <p className="text-xs text-muted-foreground">End-to-end encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10 text-primary/60" />
              <div>
                <p className="font-bold">Verified</p>
                <p className="text-xs text-muted-foreground">Certified Counselors</p>
              </div>
            </div>
            {/* Add two more trust markers here */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;