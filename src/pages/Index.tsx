import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Calendar, LogIn, UserPlus, Shield, Sparkles, Users, Play, MapPin, Clock, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { MoodCheckInModal } from "@/components/MoodCheckInModal";
import { QuickBookModal } from "@/components/QuickBookModal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import aboutBg from "@/assets/about-bg.jpg";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  activity_date: string | null;
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

interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
}

const Index = () => {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Always show mood modal when page opens
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
        supabase
          .from("activities")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("events")
          .select("*")
          .eq("is_published", true)
          .gte("event_date", new Date().toISOString())
          .order("event_date", { ascending: true })
          .limit(3),
        supabase
          .from("vlogs")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(3),
      ]);

      if (activitiesRes.data) setActivities(activitiesRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (vlogsRes.data) setVlogs(vlogsRes.data);

      // Collect images for gallery from all content with images
      const images: GalleryImage[] = [];
      
      const eventsWithImages = await supabase
        .from("events")
        .select("id, title, description, image_url")
        .eq("is_published", true)
        .not("image_url", "is", null);
      
      const activitiesWithImages = await supabase
        .from("activities")
        .select("id, title, description, image_url")
        .eq("is_published", true)
        .not("image_url", "is", null);
        
      const vlogsWithImages = await supabase
        .from("vlogs")
        .select("id, title, description, thumbnail_url")
        .eq("is_published", true)
        .not("thumbnail_url", "is", null);

      if (eventsWithImages.data) {
        eventsWithImages.data.forEach(e => {
          if (e.image_url) images.push({ id: e.id, title: e.title, image_url: e.image_url });
        });
      }
      if (activitiesWithImages.data) {
        activitiesWithImages.data.forEach(a => {
          if (a.image_url) images.push({ id: a.id, title: a.title, image_url: a.image_url });
        });
      }
      if (vlogsWithImages.data) {
        vlogsWithImages.data.forEach(v => {
          if (v.thumbnail_url) images.push({ id: v.id, title: v.title, image_url: v.thumbnail_url });
        });
      }

      setGalleryImages(images);
    };

    fetchContent();
  }, []);

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingButtons />
      <MoodCheckInModal isOpen={showMoodModal} onClose={() => setShowMoodModal(false)} />
      <QuickBookModal isOpen={showQuickBook} onClose={() => setShowQuickBook(false)} />

      {/* Hero Section with Background */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Calming background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid gap-4 sm:grid-cols-2"
            >
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

              <Link to="/auth" className="flex flex-col items-start p-6 bg-card border-2 border-border rounded-2xl shadow-sm hover:border-primary/50 transition-all text-left">
                <LogIn className="w-8 h-8 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-1">Member Login</h3>
                <p className="text-sm text-muted-foreground mb-4">Access your dashboard and past sessions.</p>
                <div className="mt-auto flex items-center gap-2 text-primary font-semibold">
                  Sign In <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

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

      {/* Trust Section */}
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
            <div className="flex items-center gap-3">
              <Heart className="w-10 h-10 text-primary/60" />
              <div>
                <p className="font-bold">Caring</p>
                <p className="text-xs text-muted-foreground">Compassionate Support</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-10 h-10 text-primary/60" />
              <div>
                <p className="font-bold">Flexible</p>
                <p className="text-xs text-muted-foreground">Book Anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Our Activities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our therapeutic activities designed to promote mental wellness and personal growth.
            </p>
          </motion.div>

          {activities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all"
                >
                  <div className="h-48 bg-muted overflow-hidden">
                    {activity.image_url ? (
                      <img src={activity.image_url} alt={activity.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <Sparkles className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{activity.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">{activity.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/activities">
              <Button variant="outline" size="lg">
                View All Activities <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our upcoming events and workshops to connect with others on the same journey.
            </p>
          </motion.div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all"
                >
                  <div className="h-48 bg-muted overflow-hidden">
                    {event.image_url ? (
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <Calendar className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming events at the moment.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline" size="lg">
                View All Events <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vlogs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Latest Vlogs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch our latest video content on mental health, wellness tips, and inspiring stories.
            </p>
          </motion.div>

          {vlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vlogs.map((vlog, index) => {
                const thumbnail = vlog.thumbnail_url || getYouTubeThumbnail(vlog.youtube_url);
                return (
                  <motion.a
                    key={vlog.id}
                    href={vlog.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all group"
                  >
                    <div className="h-48 bg-muted overflow-hidden relative">
                      {thumbnail ? (
                        <img src={thumbnail} alt={vlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Play className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-8 h-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">{vlog.title}</h3>
                      <p className="text-muted-foreground line-clamp-2">{vlog.description}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-2xl">
              <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No vlogs available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/vlog">
              <Button variant="outline" size="lg">
                View All Vlogs <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Image Gallery</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore moments from our events, activities, and community gatherings.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.slice(0, 8).map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img 
                    src={image.image_url} 
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 z-0">
          <img src={aboutBg} alt="About background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif font-bold text-foreground mb-6">About MUTPECC</h2>
              <p className="text-lg text-muted-foreground mb-6">
                MUTPECC (Mental Health and Psychotherapy Education and Counseling Center) is dedicated to providing 
                accessible, professional mental health support to everyone who needs it.
              </p>
              <p className="text-muted-foreground mb-8">
                Our team of certified counselors and therapists are committed to creating a safe, 
                non-judgmental space where you can explore your feelings, overcome challenges, and 
                achieve personal growth. We believe in the power of community and connection in the 
                healing journey.
              </p>
              <Link to="/about">
                <Button variant="hero" size="lg">
                  Learn More About Us <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-card p-6 rounded-2xl shadow-soft">
                <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
                <p className="text-muted-foreground">Members Helped</p>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-soft">
                <h3 className="text-4xl font-bold text-primary mb-2">20+</h3>
                <p className="text-muted-foreground">Expert Counselors</p>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-soft">
                <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
                <p className="text-muted-foreground">Sessions Completed</p>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-soft">
                <h3 className="text-4xl font-bold text-primary mb-2">98%</h3>
                <p className="text-muted-foreground">Satisfaction Rate</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;