import { motion } from "framer-motion";
import { Play, Calendar, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";

// Sample vlog data - would come from database in real app
const vlogs = [
  {
    id: 1,
    title: "Managing Anxiety: Practical Tips",
    description: "Learn effective techniques for managing daily anxiety and finding calm in challenging moments.",
    youtubeId: "dQw4w9WgXcQ",
    author: "Dr. Sarah Mitchell",
    date: "Jan 15, 2024",
  },
  {
    id: 2,
    title: "The Power of Self-Compassion",
    description: "Discover why being kind to yourself is the foundation of mental wellness.",
    youtubeId: "dQw4w9WgXcQ",
    author: "Coach James Obi",
    date: "Jan 12, 2024",
  },
  {
    id: 3,
    title: "Building Healthy Relationships",
    description: "Understanding boundaries and communication for stronger connections.",
    youtubeId: "dQw4w9WgXcQ",
    author: "Dr. Linda Chen",
    date: "Jan 8, 2024",
  },
  {
    id: 4,
    title: "Overcoming Depression: First Steps",
    description: "A gentle guide to taking the first steps when you're feeling low.",
    youtubeId: "dQw4w9WgXcQ",
    author: "Dr. Sarah Mitchell",
    date: "Jan 5, 2024",
  },
  {
    id: 5,
    title: "Mindfulness for Beginners",
    description: "Simple mindfulness practices you can start today for better mental clarity.",
    youtubeId: "dQw4w9WgXcQ",
    author: "Coach Maria Santos",
    date: "Dec 28, 2023",
  },
  {
    id: 6,
    title: "Healing from Trauma",
    description: "Understanding the healing process and finding hope after difficult experiences.",
    youtubeId: "dQw4w9WgXcQ",
    author: "Dr. James Obi",
    date: "Dec 20, 2023",
  },
];

const Vlog = () => {
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
              <Play className="w-4 h-4" />
              MUTPECC Vlogs
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Wellness insights & <span className="text-primary">guidance</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Expert videos on mental health, personal growth, and emotional wellness 
              from our team of counselors and coaches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vlogs Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vlogs.map((vlog, index) => (
              <motion.article
                key={vlog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-shadow duration-300 group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  <img
                    src={`https://img.youtube.com/vi/${vlog.youtubeId}/maxresdefault.jpg`}
                    alt={vlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-elevated">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {vlog.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {vlog.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      {vlog.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {vlog.date}
                    </span>
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

export default Vlog;
