import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Clock, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";

const AskExecutive = () => {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      // TODO: Submit to backend
      console.log("Question submitted:", question);
      setSubmitted(true);
      setQuestion("");
    }
  };

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
              <MessageCircle className="w-4 h-4" />
              Ask an Executive
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Have a <span className="text-primary">question?</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Submit your questions privately and receive personal responses from 
              our executive team. Your inquiry will be handled with complete confidentiality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl p-8 shadow-soft text-center"
              >
                <div className="w-16 h-16 rounded-full gradient-sage flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
                  Question Submitted!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. An executive will review your question 
                  and respond as soon as possible.
                </p>
                <Button variant="soft" onClick={() => setSubmitted(false)}>
                  Ask Another Question
                </Button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl p-8 shadow-soft"
              >
                <div className="mb-6">
                  <label
                    htmlFor="question"
                    className="block text-lg font-medium text-foreground mb-3"
                  >
                    Your Question
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What would you like to know? Share your question here..."
                    rows={6}
                    className="w-full p-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Clock className="w-4 h-4" />
                  <span>Responses typically within 24-48 hours</span>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={!question.trim()}
                >
                  <Send className="w-4 h-4" />
                  Submit Question
                </Button>
              </motion.form>
            )}

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 bg-sage-50 rounded-2xl p-6"
            >
              <h3 className="font-serif font-semibold text-foreground mb-2">
                Member Benefit
              </h3>
              <p className="text-sm text-muted-foreground">
                As a registered member, you can view your question history and replies 
                in your profile dashboard. Sign up or login to access this feature.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AskExecutive;
