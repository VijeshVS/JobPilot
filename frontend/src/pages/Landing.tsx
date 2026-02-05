import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Search,
  Zap,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  ArrowRight,
  CheckCircle2,
  Rocket,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse delay-500" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 hover:bg-primary/15 transition-all">
            <Brain className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-primary font-mono tracking-tight">
              JobPilot
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight">
            AI-Powered
            <span className="block text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Recruitment Platform
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Smarter hiring for recruiters. Faster shortlisting for candidates.
            Leveraging intelligent AI agents to bridge the talent gap.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="group text-lg px-8 py-7 rounded-xl shadow-lg hover:shadow-primary/20 transition-all hover:scale-105"
              onClick={() => navigate("/login?role=candidate")}
            >
              I'm a Candidate
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="group text-lg px-8 py-7 rounded-xl border-2 hover:bg-primary/5 transition-all hover:scale-105"
              onClick={() => navigate("/login?role=recruiter")}
            >
              I'm a Recruiter
              <Rocket className="ml-2 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
            <div className="p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
              <div className="text-3xl font-bold text-primary mb-1">10x</div>
              <div className="text-sm text-muted-foreground">Faster Hiring</div>
            </div>
            <div className="p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
              <div className="text-3xl font-bold text-primary mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Match Accuracy</div>
            </div>
            <div className="p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">AI Assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the future of recruitment with our AI-powered platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
            <FeatureCard
              icon={<Target className="w-7 h-7 text-primary" />}
              title="Precision Matching"
              desc="Advanced algorithms ensure you get the most relevant candidates every time."
            />
            <FeatureCard
              icon={<TrendingUp className="w-7 h-7 text-primary" />}
              title="Continuous Learning"
              desc="Our AI gets smarter with every search, improving results over time."
            />
            <FeatureCard
              icon={<Users className="w-7 h-7 text-primary" />}
              title="Talent Pool Access"
              desc="Connect with qualified candidates across diverse backgrounds and skill sets."
            />
          </div>
        </div>
      </section>

      {/* --- EXAMPLE SEARCHES --- */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Try searching for...
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              See how natural language makes hiring effortless
            </p>
            <div className="space-y-4">
              {[
                "Backend developers with 3+ years of experience in Python",
                "Frontend engineers who know React and Tailwind CSS",
                "Fresh graduates with a CGPA above 3.5 for Intern roles",
                "Data scientists with machine learning expertise",
                "Full-stack developers familiar with cloud technologies",
              ].map((query, i) => (
                <div
                  key={i}
                  className="p-5 bg-card rounded-xl border border-border flex items-center gap-4 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground italic group-hover:text-foreground transition-colors">
                    "{query}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* For Recruiters */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-primary" />
                  For Recruiters
                </h3>
                <ul className="space-y-4">
                  {[
                    "Save hours on manual resume screening",
                    "Find the perfect match with AI precision",
                    "Reduce time-to-hire by up to 70%",
                    "Access detailed candidate insights",
                    "Make data-driven hiring decisions",
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Candidates */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  For Candidates
                </h3>
                <ul className="space-y-4">
                  {[
                    "Get matched with relevant opportunities",
                    "Showcase your skills effectively",
                    "Receive instant feedback on applications",
                    "Stand out with AI-powered insights",
                    "Fast-track your career growth",
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 -z-10" />
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of companies and candidates already using JobPilot
          </p>
          <Button
            size="lg"
            className="text-lg px-10 py-7 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            onClick={() => navigate("/login")}
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">JobPilot</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 JobPilot. AI-Powered Recruitment Platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Helper Component for Features
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
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

export default Landing;
