import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Clock, CheckCircle, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type QAThread = Database["public"]["Tables"]["qa_threads"]["Row"];

const AskExecutive = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [question, setQuestion] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myQuestions, setMyQuestions] = useState<QAThread[]>([]);
  const [publicQuestions, setPublicQuestions] = useState<QAThread[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, [user]);

  const fetchQuestions = async () => {
    try {
      // Fetch public answered questions
      const { data: publicData } = await supabase
        .from("qa_threads")
        .select("*")
        .eq("is_public", true)
        .not("reply", "is", null)
        .order("replied_at", { ascending: false })
        .limit(5);

      if (publicData) setPublicQuestions(publicData);

      // Fetch user's own questions if logged in
      if (user) {
        const { data: myData } = await supabase
          .from("qa_threads")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (myData) setMyQuestions(myData);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    // Validate guest fields if not logged in
    if (!user && (!guestName.trim() || !guestPhone.trim())) {
      toast({
        title: "Required Fields",
        description: "Please provide your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const insertData: any = {
        question: question.trim(),
      };

      if (user) {
        insertData.user_id = user.id;
      } else {
        insertData.guest_name = guestName.trim();
        insertData.guest_phone = guestPhone.trim();
        insertData.guest_email = guestEmail.trim() || null;
      }

      const { error } = await supabase.from("qa_threads").insert(insertData);

      if (error) throw error;

      toast({
        title: "Question Submitted!",
        description: "An executive will review and respond soon.",
      });
      
      setQuestion("");
      setGuestName("");
      setGuestPhone("");
      setGuestEmail("");
      setSubmitted(true);
      fetchQuestions();
    } catch (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
            {submitted && !user ? (
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
                {/* Guest Contact Info */}
                {!user && (
                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Please provide your contact information
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Your name"
                          className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="Your phone number"
                          className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="Your email address"
                        className="w-full mt-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

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
                    required
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
                  disabled={isSubmitting || !question.trim() || (!user && (!guestName.trim() || !guestPhone.trim()))}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Question
                    </>
                  )}
                </Button>
              </motion.form>
            )}

            {/* User's Previous Questions */}
            {user && myQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8"
              >
                <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                  Your Previous Questions
                </h3>
                <div className="space-y-4">
                  {myQuestions.map((q) => (
                    <div key={q.id} className="bg-card rounded-xl p-4 shadow-soft">
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(q.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-foreground mb-3">{q.question}</p>
                      {q.reply ? (
                        <div className="pt-3 border-t border-border">
                          <p className="text-sm font-medium text-green-600 mb-1">Response:</p>
                          <p className="text-foreground">{q.reply}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-amber-600 italic">Awaiting response...</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Public Q&A */}
            {publicQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8"
              >
                <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {publicQuestions.map((q) => (
                    <div key={q.id} className="bg-sage-50 rounded-xl p-4">
                      <p className="font-medium text-foreground mb-2">{q.question}</p>
                      <p className="text-muted-foreground text-sm">{q.reply}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Info Box */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
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
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AskExecutive;
