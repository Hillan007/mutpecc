import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";

// Sample events data
const events = [
  {
    id: 1,
    title: "Weekly Support Circle",
    description: "Join our weekly group session for members to share experiences and support each other.",
    date: "Every Wednesday",
    time: "6:00 PM - 7:30 PM",
    location: "Virtual (Zoom)",
    attendees: 24,
    type: "recurring",
  },
  {
    id: 2,
    title: "Anxiety Management Workshop",
    description: "A practical workshop on techniques to manage anxiety in daily life.",
    date: "Jan 28, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "MUTPECC Center",
    attendees: 15,
    type: "workshop",
  },
  {
    id: 3,
    title: "Counselor Training: Module 3",
    description: "Advanced listening skills and empathy training for aspiring counselors.",
    date: "Feb 5, 2024",
    time: "10:00 AM - 1:00 PM",
    location: "Virtual (Zoom)",
    attendees: 8,
    type: "training",
  },
  {
    id: 4,
    title: "Community Wellness Day",
    description: "A full day of wellness activities, talks, and networking with the MUTPECC community.",
    date: "Feb 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Community Hall",
    attendees: 50,
    type: "special",
  },
];

const typeColors: Record<string, string> = {
  recurring: "bg-sage-100 text-sage-700",
  workshop: "bg-coral-100 text-coral-600",
  training: "bg-blue-100 text-blue-700",
  special: "bg-purple-100 text-purple-700",
};

const Events = () => {
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
              <Calendar className="w-4 h-4" />
              Upcoming Events
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Join our <span className="text-primary">community events</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Workshops, support circles, and training sessions to support your 
              mental wellness journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {events.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Date Box */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl gradient-sage flex flex-col items-center justify-center text-primary-foreground">
                    <span className="text-2xl font-bold">
                      {event.date.includes(",") ? event.date.split(" ")[1].replace(",", "") : "—"}
                    </span>
                    <span className="text-sm opacity-80">
                      {event.date.includes(",") ? event.date.split(" ")[0] : event.date.split(" ")[1]}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-serif font-semibold text-foreground">
                        {event.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[event.type]}`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {event.attendees} attending
                      </span>
                    </div>
                    <Button variant="soft" size="sm">
                      Register Now
                    </Button>
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

export default Events;
