import { motion } from "framer-motion";
import { Sparkles, BookOpen, Users, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";

// Sample activities data
const activities = [
  {
    id: 1,
    title: "Daily Gratitude Practice",
    description: "Start each day by listing three things you're grateful for. Share with the community if comfortable.",
    icon: Heart,
    category: "Mindfulness",
  },
  {
    id: 2,
    title: "Journaling Challenge",
    description: "Spend 10 minutes each day writing about your thoughts and feelings. No judgment, just expression.",
    icon: BookOpen,
    category: "Self-Reflection",
  },
  {
    id: 3,
    title: "Peer Support Buddy",
    description: "Connect with another member for weekly check-ins. Build meaningful supportive relationships.",
    icon: Users,
    category: "Community",
  },
  {
    id: 4,
    title: "Mindful Breathing",
    description: "Practice 5 minutes of deep breathing exercises. Perfect for managing stress and anxiety.",
    icon: Sparkles,
    category: "Wellness",
  },
];

const Activities = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingButtons />

      {/* Hero */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Community Activities
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Grow through <span className="text-primary">daily activities</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Simple, meaningful activities designed to support your mental wellness 
              and connect you with our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {activities.map((activity, index) => (
              <motion.article
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl gradient-sage flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                      {activity.category}
                    </span>
                    <h3 className="text-xl font-serif font-semibold text-foreground mt-1 mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Activities;
