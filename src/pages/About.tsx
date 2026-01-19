import { motion } from "framer-motion";
import { Heart, Target, Users, Award, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We approach every interaction with empathy, understanding, and genuine care for each individual's unique journey.",
  },
  {
    icon: Target,
    title: "Growth",
    description: "We believe in continuous personal development and the transformative power of healing and self-discovery.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We foster a supportive environment where members and counselors grow together as one family.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in counseling, training, and support services for our community.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingButtons />

      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              About MUTPECC
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Creating safe spaces for{" "}
              <span className="text-primary">healing & growth</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              MUTPECC is a mental health guidance and counseling platform dedicated to providing 
              confidential, compassionate support for individuals seeking emotional wellness and 
              personal growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At MUTPECC, we believe that everyone deserves access to mental health support. 
                Our platform connects individuals with trained counselors who understand the 
                unique challenges of navigating emotional wellness.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We've built a tiered community where members can not only receive support but 
                also grow to become counselors themselves, creating a sustainable cycle of 
                healing and helping.
              </p>
              <ul className="space-y-3">
                {[
                  "Professional, trained counselors",
                  "100% confidential conversations",
                  "Path to become a counselor yourself",
                  "Active community support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl gradient-sage p-8 flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <Heart className="w-24 h-24 mx-auto mb-6 opacity-90" />
                  <p className="text-2xl font-serif font-semibold">
                    "Healing happens in community"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These principles guide everything we do at MUTPECC.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-soft text-center"
              >
                <div className="w-14 h-14 rounded-xl gradient-sage flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
