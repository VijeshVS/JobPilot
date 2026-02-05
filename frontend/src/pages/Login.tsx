import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type Role = "candidate" | "recruiter";

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // UI States
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState<Role>("candidate");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyRole, setCompanyRole] = useState("");
    const [loading, setLoading] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const isAuthenticated = localStorage.getItem("isAuthenticated");
            const userRole = localStorage.getItem("role");

            if (session && isAuthenticated === "true" && userRole) {
                toast.success("Already logged in! Redirecting to your dashboard...");
                
                setTimeout(() => {
                    navigate(userRole === "candidate" ? "/parse-resume" : "/find-candidates");
                }, 500);
            }
        };

        checkAuth();
    }, [navigate]);

    // Get role from URL params if provided
    useEffect(() => {
        const urlRole = searchParams.get("role");
        if (urlRole === "candidate" || urlRole === "recruiter") {
            setRole(urlRole);
        }
    }, [searchParams]);

    /* ---------------- AUTH LOGIC ---------------- */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                toast.error(signInError.message);
                setLoading(false);
                return;
            }

            if (!data.user) {
                toast.error("No user data returned");
                setLoading(false);
                return;
            }

            const userId = data.user.id;

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("role")
                .eq("id", userId)
                .single();

            if (userError) {
                toast.error("Failed to fetch user role");
                setLoading(false);
                return;
            }

            // Check if the user role matches the selected role
            if (userData.role !== role) {
                await supabase.auth.signOut();
                toast.error(`Access denied: You are registered as a ${userData.role}, not a ${role}`);
                setLoading(false);
                return;
            }

            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("role", userData.role);
            localStorage.setItem("userId", userId);

            toast.success(`Welcome back, ${userData.role}!`);

            // Small delay to show toast before navigation
            setTimeout(() => {
                navigate(userData.role === "candidate" ? "/parse-resume" : "/find-candidates");
            }, 500);
        } catch (err) {
            console.error("Login error:", err);
            toast.error("An unexpected error occurred");
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validate recruiter fields
        if (role === "recruiter" && (!companyName.trim() || !companyRole.trim())) {
            toast.error("Please fill in company name and your role");
            setLoading(false);
            return;
        }

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) {
                toast.error(signUpError.message);
                setLoading(false);
                return;
            }

            const userId = data.user?.id;
            if (!userId) {
                toast.error("No user ID returned");
                setLoading(false);
                return;
            }

            // Insert role into users table
            const { error: userInsertError } = await supabase
                .from("users")
                .insert([{ id: userId, role }]);

            if (userInsertError) {
                toast.error("Failed to create user profile");
                setLoading(false);
                return;
            }

            if (role === "recruiter") {
                const { error: recruiterError } = await supabase.from("recruiters").insert([
                    { id: userId, company_name: companyName, company_role: companyRole }
                ]);

                if (recruiterError) {
                    toast.error("Failed to create recruiter profile");
                    setLoading(false);
                    return;
                }
            }

            toast.success("Signup successful! You can now login with your credentials");
            
            setIsLogin(true);
            setPassword("");
            setLoading(false);
        } catch (err) {
            console.error("Signup error:", err);
            toast.error("An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background overflow-x-hidden flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 justify-center mb-2">
                        <Brain className="w-6 h-6 text-primary" />
                        <span className="text-xl font-bold text-primary">JobPilot</span>
                    </div>
                    <CardTitle className="text-2xl">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription>
                        {isLogin 
                            ? `Login as a ${role}` 
                            : `Sign up as a ${role}`}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Role Selector */}
                    <div className="flex gap-2 mb-6">
                        <Button
                            type="button"
                            variant={role === "candidate" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setRole("candidate")}
                        >
                            Candidate
                        </Button>
                        <Button
                            type="button"
                            variant={role === "recruiter" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setRole("recruiter")}
                        >
                            Recruiter
                        </Button>
                    </div>

                    <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {!isLogin && role === "recruiter" && (
                            <>
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Company Name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Your Role in Company"
                                        value={companyRole}
                                        onChange={(e) => setCompanyRole(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loading}
                        >
                            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        {isLogin ? (
                            <>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="text-primary underline hover:no-underline"
                                    onClick={() => {
                                        setIsLogin(false);
                                    }}
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="text-primary underline hover:no-underline"
                                    onClick={() => {
                                        setIsLogin(true);
                                    }}
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => navigate("/")}
                        >
                            ← Back to home
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}