import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { MoodCheckInModal } from "@/components/MoodCheckInModal";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Heart,
    title: "Compassionate Care",
    description: "Connect with trained counselors who truly understand and care about your mental wellness journey.",
  },
  {
    icon: Users,
    title: "Supportive Community",
    description: "Join a safe community of members and counselors dedicated to growth and healing together.",
  },
  {
    icon: Shield,
    title: "100% Confidential",
    description: "Your privacy is sacred. All conversations and data are encrypted and completely private.",
  },
  {
    icon: Sparkles,
    title: "Personal Growth",
    description: "Progress from member to counselor and help others on their journey while growing yourself.",
  },
];

const Index = () => {
  const [showMoodModal, setShowMoodModal] = useState(false);

  useEffect(() => {
    // Show modal on first visit
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

      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-24 min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Calming background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 gradient-hero" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                Mental Health & Counseling Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-6"
            >
              Your journey to{" "}
              <span className="text-primary">mental wellness</span> starts here
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl"
            >
              MUTPECC provides a safe, confidential space where you can share your feelings, 
              connect with professional counselors, and grow alongside a supportive community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="hero" size="xl" onClick={() => setShowMoodModal(true)}>
                How are you feeling?
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-sage-200 border-2 border-background flex items-center justify-center text-sm font-medium text-sage-700"
                  >
                    {["J", "A", "M", "K"][i - 1]}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-foreground">500+ Members</p>
                <p className="text-sm text-muted-foreground">Finding healing together</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Why choose MUTPECC?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're more than a platform—we're a community dedicated to your mental wellness and growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-sage flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 gradient-sage opacity-90" />
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
                Ready to start your healing journey?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                Take the first step today. Our counselors are here to listen, support, 
                and guide you towards better mental health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="xl"
                  className="bg-background text-primary hover:bg-background/90"
                  onClick={() => setShowMoodModal(true)}
                >
                  Check In Now
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Become a Counselor
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
