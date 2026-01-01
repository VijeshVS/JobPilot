import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Search,
  Users,
  Zap,
  FileText,
  ArrowRight,
  Sparkles,
  Database,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";



const Home = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"candidate" | "recruiter" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


  // 2️⃣ Optional: update role in backend and refresh session
  const updateRole = async (role: "candidate" | "recruiter") => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;

    const res = await fetch("/api/update-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session.access_token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    console.log("Role updated:", data);

    // Refresh user session to get updated metadata
    await supabase.auth.getUser();
  };

  const handleAuth = async (expectedRole: "candidate" | "recruiter") => {
    try {
      // 1️⃣ Authenticate user (email + password)
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setAlertMessage("Invalid email or password");
        setShowAlert(true);
        return;
      }

      // 2️⃣ Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log(user);
      if (!user) {
        setAlertMessage("Authentication failed");
        setShowAlert(true);
        return;
      }

      // 3️⃣ Fetch role from DB
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !data?.role) {
        setAlertMessage("Role not found");
        setShowAlert(true);
        return;
      }

      // 4️⃣ 🔥 ROLE CHECK (THIS IS THE CORE)
      if (data.role !== expectedRole) {
        await supabase.auth.signOut();
        setAlertMessage(`Access denied: You are not a ${expectedRole}`);
        setShowAlert(true);
        return;
      }

      // 5️⃣ Role matched → redirect
      if (expectedRole === "candidate") navigate("/parse-resume");
      if (expectedRole === "recruiter") navigate("/");

      setOpen(false);
    } catch (err) {
      console.error(err);
      setAlertMessage("Something went wrong");
      setShowAlert(true);
    }
  };





  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-primary">JobPilot</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              AI-Powered
              <span className="block text-primary">Recruitment Platform</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Leveraging intelligent AI agents to connect the right candidates with the right opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="group text-lg px-8 py-6 rounded-xl"
                onClick={() => {
                  setRole("candidate");
                  setOpen(true);
                }}

              >
                I'm a Candidate
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="group text-lg px-8 py-6 rounded-xl"
                onClick={() => {
                  setRole("recruiter");
                  setOpen(true);
                }}

              >
                I'm an HR Professional
              </Button>

            </div>
          </div>
        </div >
      </section >

      {/* Features Section */}
      < section className="py-20 bg-muted/30" >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the future of recruitment with our AI-powered platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Add your feature cards here (MessageSquare, Brain, etc.) */}
          </div>
        </div>
      </section >

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {role === "candidate" ? "Candidate Login" : "Recruiter Login"}

            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              className="w-full text-lg py-6 rounded-xl"
              onClick={() => role && handleAuth(role)}
            >
              Continue
            </Button>


          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Error</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

    </div >
  );
};

export default Home;
