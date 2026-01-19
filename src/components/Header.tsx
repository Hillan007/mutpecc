import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/vlog", label: "Vlog" },
  { href: "/events", label: "Events" },
  { href: "/activities", label: "Activities" },
  { href: "/ask-executive", label: "Ask Executive" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-sage flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-bold text-foreground">
              MUTPECC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="lg:hidden overflow-hidden bg-card border-b border-border"
      >
        <nav className="container mx-auto px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button variant="hero" className="w-full">
              Get Started
            </Button>
          </div>
        </nav>
      </motion.div>
    </header>
  );
}
