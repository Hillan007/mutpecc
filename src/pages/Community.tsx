import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  MessageCircle, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube,
  Lock,
  ExternalLink,
  Phone
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import communityBg from "@/assets/community-bg.jpg";

interface CommunityLink {
  id: string;
  title: string;
  url: string;
  link_type: string;
  is_premium: boolean;
  icon: string | null;
}

const getIconComponent = (icon: string | null, linkType: string) => {
  switch (icon || linkType) {
    case "whatsapp":
      return <MessageCircle className="w-6 h-6" />;
    case "instagram":
      return <Instagram className="w-6 h-6" />;
    case "twitter":
      return <Twitter className="w-6 h-6" />;
    case "facebook":
      return <Facebook className="w-6 h-6" />;
    case "youtube":
      return <Youtube className="w-6 h-6" />;
    default:
      return <Users className="w-6 h-6" />;
  }
};

const Community = () => {
  const { user, role } = useAuth();
  const [publicLinks, setPublicLinks] = useState<CommunityLink[]>([]);
  const [premiumLinks, setPremiumLinks] = useState<CommunityLink[]>([]);
  const [loading, setLoading] = useState(true);

  const isApprovedMember = role === "member" || role === "counselor" || role === "executive";

  useEffect(() => {
    fetchLinks();
  }, [user, role]);

  const fetchLinks = async () => {
    try {
      // Fetch public links (anyone can see)
      const { data: publicData } = await supabase
        .from("community_links")
        .select("*")
        .eq("is_active", true)
        .eq("is_premium", false)
        .order("sort_order", { ascending: true });

      if (publicData) setPublicLinks(publicData);

      // Fetch premium links only if approved member
      if (isApprovedMember) {
        const { data: premiumData } = await supabase
          .from("community_links")
          .select("*")
          .eq("is_active", true)
          .eq("is_premium", true)
          .order("sort_order", { ascending: true });

        if (premiumData) setPremiumLinks(premiumData);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  // Default WhatsApp contact number - replace with actual number
  const whatsappNumber = "+254700000000";
  const whatsappChatUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20would%20like%20to%20connect%20with%20MUTPECC`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingButtons />

      {/* Hero with Background Image */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={communityBg} alt="Community background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Join Our Community
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Connect with our <span className="text-primary">community</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join our supportive community through WhatsApp groups, social media, 
              and exclusive member channels. Together, we grow stronger.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Direct WhatsApp Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                        Chat with Us on WhatsApp
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Have a question? Start a conversation with our team directly on WhatsApp. 
                        We're here to help and support you.
                      </p>
                      <a
                        href={whatsappChatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        Start Chat
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Public Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Social & Community Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-muted-foreground text-center py-8">Loading...</p>
                  ) : publicLinks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No community links available yet. Check back soon!
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {publicLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-xl gradient-sage flex items-center justify-center text-primary-foreground">
                            {getIconComponent(link.icon, link.link_type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {link.title}
                            </h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {link.link_type}
                            </p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className={!isApprovedMember ? "opacity-75" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Premium Member Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <div className="text-center py-8">
                      <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Member Access Required
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Sign up and get approved as a member to access exclusive community links.
                      </p>
                      <Link to="/auth">
                        <Button variant="warm">Sign Up Now</Button>
                      </Link>
                    </div>
                  ) : !isApprovedMember ? (
                    <div className="text-center py-8">
                      <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Pending Approval
                      </h3>
                      <p className="text-muted-foreground">
                        Your membership is pending approval. Once approved by an executive, 
                        you'll have access to these exclusive links.
                      </p>
                    </div>
                  ) : premiumLinks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No premium links available yet.
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {premiumLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors group border-2 border-primary/20"
                        >
                          <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center text-accent-foreground">
                            {getIconComponent(link.icon, link.link_type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {link.title}
                            </h4>
                            <p className="text-sm text-primary">Premium</p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Call to Action */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-sage-50 rounded-2xl p-8 text-center"
              >
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">
                  Ready to Join?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Sign up today to become part of our supportive community. 
                  Get access to exclusive resources and connect with like-minded individuals.
                </p>
                <Link to="/auth">
                  <Button variant="hero" size="lg">
                    Become a Member
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Community;
