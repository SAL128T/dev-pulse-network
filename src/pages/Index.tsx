
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      navigate(isAuthenticated ? "/" : "/auth/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-devpulse-background">
      <div className="mb-8 animate-pulse-subtle">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-devpulse-secondary bg-clip-text text-transparent">
          DevCollab Network
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          Connect with developers from around the world
        </p>
      </div>
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  );
};

export default Index;
