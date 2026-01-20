import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MemberDashboard } from "@/components/dashboard/MemberDashboard";
import { CounselorDashboard } from "@/components/dashboard/CounselorDashboard";
import { ExecutiveDashboard } from "@/components/dashboard/ExecutiveDashboard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (role) {
      case "executive":
        return <ExecutiveDashboard />;
      case "counselor":
        return <CounselorDashboard />;
      case "member":
      default:
        return <MemberDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 lg:pt-24 pb-12">
        <div className="container mx-auto px-4">
          {renderDashboard()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
