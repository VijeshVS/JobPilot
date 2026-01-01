import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
    Brain,
    Search,
    Users,
    Zap,
    FileText,
    Sparkles,
    Database,
    MessageSquare
} from "lucide-react";

import SignupDialog from "../components/SignupDialog";
import LoginDialog from "../components/LoginDialog";

type Role = "candidate" | "recruiter";

export default function LoginPage() {
    const navigate = useNavigate();

    // UI States
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    // Form States
    const [role, setRole] = useState<Role>("candidate");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyRole, setCompanyRole] = useState("");

    /* ---------------- AUTH LOGIC ---------------- */
    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        const userId = data.user.id;

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();

        if (userError) {
            alert("Failed to fetch user role");
            return;
        }

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", userData.role);
        localStorage.setItem("userId", userId);

        navigate(userData.role === "candidate" ? "/parse-resume" : "/find-candidates");
    };

    const handleSignup = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        const userId = data.user?.id;
        if (!userId) return;

        // Insert role into users table
        console.log("hi")
        const { error: userInsertError } = await supabase.from("users").insert([{ id: userId, role }]);

        if (role === "recruiter") {
            await supabase.from("recruiters").insert([
                { id: userId, company_name: companyName, company_role: companyRole }
            ]);
        }

        alert("Signup successful! Please login.");
        setShowSignup(false);
        setShowLogin(true);

        // Reload the page
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="relative py-20 lg:py-32">
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <Brain className="w-6 h-6 text-primary" />
                        <span className="text-lg font-semibold text-primary font-mono tracking-tight">JobPilot</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                        AI-Powered
                        <span className="block text-primary">Recruitment Platform</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Smarter hiring for recruiters. Faster shortlisting for candidates.
                        Leveraging intelligent AI agents to bridge the talent gap.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="group text-lg px-8 py-7 rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
                            onClick={() => {
                                setRole("candidate");
                                setShowLogin(true);
                            }}
                        >
                            I'm a Candidate
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="group text-lg px-8 py-7 rounded-xl border-2 hover:bg-primary/5 transition-all"
                            onClick={() => {
                                setRole("recruiter");
                                setShowLogin(true);
                            }}
                        >
                            I'm a Recruiter
                        </Button>
                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section className="py-24 bg-muted/30 border-y border-border/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Experience the future of recruitment with our AI-powered platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<MessageSquare className="w-7 h-7 text-primary" />}
                            title="Natural Language Search"
                            desc="Describe your ideal candidate in plain English. No complex filters needed."
                        />
                        <FeatureCard
                            icon={<Brain className="w-7 h-7 text-primary" />}
                            title="AI-Powered Queries"
                            desc="Agents intelligently parse skills, experience, and education contextually."
                        />
                        <FeatureCard
                            icon={<Zap className="w-7 h-7 text-primary" />}
                            title="Automated Scoring"
                            desc="Instantly rank candidates based on their match to your specific job description."
                        />
                    </div>
                </div>
            </section>

            {/* --- EXAMPLE SEARCHES --- */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Try searching for...
                        </h2>
                        <div className="space-y-4">
                            {[
                                "Backend developers with 3+ years of experience in Python",
                                "Frontend engineers who know React and Tailwind CSS",
                                "Fresh graduates with a CGPA above 3.5 for Intern roles"
                            ].map((query, i) => (
                                <div key={i} className="p-5 bg-card rounded-xl border border-border flex items-center gap-4 hover:border-primary/40 transition-colors">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Search className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-muted-foreground italic">"{query}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- MODULAR DIALOGS --- */}
            <LoginDialog
                open={showLogin}
                onOpenChange={setShowLogin}
                role={role}
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                onLogin={handleLogin}
                switchToSignup={() => {
                    setShowLogin(false);
                    setShowSignup(true);
                }}
            />

            <SignupDialog
                open={showSignup}
                onOpenChange={setShowSignup}
                role={role}
                email={email}
                password={password}
                companyName={companyName}
                companyRole={companyRole}
                setEmail={setEmail}
                setPassword={setPassword}
                setCompanyName={setCompanyName}
                setCompanyRole={setCompanyRole}
                onSignup={handleSignup}
                switchToLogin={() => {
                    setShowSignup(false);
                    setShowLogin(true);
                }}
            />
        </div>
    );
}

// Helper Component for Features
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    );
}