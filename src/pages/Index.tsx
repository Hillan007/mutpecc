import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Calendar, LogIn, UserPlus, Shield, Sparkles, Users } from "lucide-react";
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
    <div className="min-h-screen bg-[#0a192f] text-white overflow-x-hidden">
      <Header />
      <FloatingButtons />
      <MoodCheckInModal isOpen={showMoodModal} onClose={() => setShowMoodModal(false)} />
      <QuickBookModal isOpen={showQuickBook} onClose={() => setShowQuickBook(false)} />

      {/* Hero Section - Optimized for height */}
      <section className="relative pt-20 pb-10 md:pt-32 md:pb-20 min-h-[100vh] lg:min-h-[90vh] flex items-center">
        {/* Background Overlay with Navy Theme */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/60 via-[#0a192f] to-[#0a192f]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Side: Value Prop - Compressed for Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[#0070f3] text-xs font-bold mb-4 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Healing Journey Starts Here
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                Mental Peace <br />
                <span className="text-[#0070f3]">Simplified.</span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 mb-6 max-w-md mx-auto lg:mx-0">
                Secure, professional counseling and community support. 100% private.
              </p>
              
              {/* Trust Badge - Hidden on very small screens to save space */}
              <div className="hidden sm:flex items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#0a192f]" />
                  ))}
                </div>
                <span>Joined by 500+ members this month</span>
              </div>
            </motion.div>

            {/* Right Side: Action Grid - 2x2 on Mobile to avoid scrolling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-3 md:gap-4"
            >
              {/* Primary Action: Book - Spans 2 columns on mobile for prominence */}
              <button 
                onClick={() => setShowQuickBook(true)}
                className="col-span-2 flex items-center justify-between p-5 bg-[#0070f3] text-white rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-600 transition-all group"
              >
                <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6 md:w-8 md:h-8" />
                    <div className="text-left">
                        <h3 className="font-bold text-lg leading-tight">Book Session</h3>
                        <p className="text-xs opacity-80">Talk to a professional</p>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Action: Log In */}
              <Link to="/auth" className="flex flex-col items-center justify-center p-4 bg-[#112240] border border-slate-700 rounded-xl hover:border-[#0070f3] transition-all text-center">
                <LogIn className="w-6 h-6 mb-2 text-[#0070f3]" />
                <span className="font-bold text-sm">Login</span>
              </Link>

              {/* Action: Mood Check */}
              <button 
                onClick={() => setShowMoodModal(true)}
                className="flex flex-col items-center justify-center p-4 bg-[#112240] border border-slate-700 rounded-xl hover:border-rose-500 transition-all text-center"
              >
                <Heart className="w-6 h-6 mb-2 text-rose-500" />
                <span className="font-bold text-sm">Mood</span>
              </button>

              {/* Action: Join - Spans 2 columns on mobile */}
              <Link to="/community" className="col-span-2 flex items-center justify-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">
                <UserPlus className="w-5 h-5 text-slate-300" />
                <span className="font-bold text-sm">Join the Community</span>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trust Section - Extremely Compact */}
      <section className="py-8 bg-[#020c1b] border-y border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-around gap-6 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#0070f3]" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0070f3]" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Verified</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;