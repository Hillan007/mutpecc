import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Calendar, LogIn, UserPlus, Shield, Sparkles, Users, BookOpen, Video, Info, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { MoodCheckInModal } from "@/components/MoodCheckInModal";
import { QuickBookModal } from "@/components/QuickBookModal";
import { ImageGallery } from "@/components/ImageGallery";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  activity_type: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  event_date: string;
  location: string | null;
}

interface Vlog {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  youtube_url: string;
}

const Index = () => {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [vlogs, setVlogs] = useState<Vlog[]>([]);

  // Always show mood modal on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMoodModal(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch content
  useEffect(() => {
    const fetchContent = async () => {
      const [activitiesRes, eventsRes, vlogsRes] = await Promise.all([
        supabase.from("activities").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(3),
        supabase.from("events").select("*").eq("is_published", true).gte("event_date", new Date().toISOString()).order("event_date", { ascending: true }).limit(3),
        supabase.from("vlogs").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(3),
      ]);

      if (activitiesRes.data) setActivities(activitiesRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (vlogsRes.data) setVlogs(vlogsRes.data);
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingButtons />
      <MoodCheckInModal isOpen={showMoodModal} onClose={() => setShowMoodModal(false)} />
      <QuickBookModal isOpen={showQuickBook} onClose={() => setShowQuickBook(false)} />

      {/* Hero with Background Image */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Calming background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
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

      {/* Activities Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Community Activities
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Grow Through Daily Activities
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, meaningful activities designed to support your mental wellness.
            </p>
          </motion.div>

          {activities.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={activity.image_url || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-primary uppercase">{activity.activity_type || "Activity"}</span>
                    <h3 className="text-lg font-semibold text-foreground mt-1">{activity.title}</h3>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{activity.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No activities yet. Check back soon!</p>
          )}

          <div className="text-center mt-8">
            <Link to="/activities">
              <Button variant="outline" className="gap-2">
                View All Activities <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Calendar className="w-4 h-4" />
              Upcoming Events
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Join Our Events
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Workshops, seminars, and community gatherings for your growth.
            </p>
          </motion.div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-primary">
                      {new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mt-1">{event.title}</h3>
                    {event.location && (
                      <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No upcoming events. Stay tuned!</p>
          )}

          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline" className="gap-2">
                View All Events <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vlogs Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Video className="w-4 h-4" />
              Our Vlogs
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Watch & Learn
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Educational videos from our counselors and mental health experts.
            </p>
          </motion.div>

          {vlogs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {vlogs.map((vlog, index) => (
                <motion.a
                  key={vlog.id}
                  href={vlog.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-shadow"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={vlog.thumbnail_url || "/placeholder.svg"}
                      alt={vlog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                        <Video className="w-6 h-6 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground">{vlog.title}</h3>
                    {vlog.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{vlog.description}</p>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No vlogs yet. Check back soon!</p>
          )}

          <div className="text-center mt-8">
            <Link to="/vlog">
              <Button variant="outline" className="gap-2">
                View All Vlogs <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <ImageIcon className="w-4 h-4" />
              Gallery
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our Moments
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Glimpses from our community activities, events, and more.
            </p>
          </motion.div>

          <ImageGallery />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Info className="w-4 h-4" />
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              MUTPECC (Mental Uplift Through Peer and Expert Counseling Community) is dedicated to providing 
              accessible mental health support. Our team of certified counselors and supportive community members 
              are here to help you navigate life's challenges with confidence and care.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">100% Confidential</h3>
                <p className="text-sm text-muted-foreground">Your privacy is our priority</p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Certified Counselors</h3>
                <p className="text-sm text-muted-foreground">Professional support you can trust</p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-soft">
                <Heart className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Caring Community</h3>
                <p className="text-sm text-muted-foreground">You're never alone in this journey</p>
              </div>
            </div>
            <Link to="/about">
              <Button variant="outline" className="gap-2">
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-card">
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
            <div className="flex items-center gap-3">
              <Heart className="w-10 h-10 text-primary/60" />
              <div>
                <p className="font-bold">Supportive</p>
                <p className="text-xs text-muted-foreground">Caring Community</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-primary/60" />
              <div>
                <p className="font-bold">Resources</p>
                <p className="text-xs text-muted-foreground">Free Learning Materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;