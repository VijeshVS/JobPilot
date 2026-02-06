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
  Clock,
  FileText,
  Filter,
  AlertTriangle,
  XCircle,
  TrendingDown,
  Shuffle,
  Hourglass,
  Languages,
  Network,
  Github,
  UserCheck,
  Gauge,
  Shield,
  Lightbulb,
  Layers,
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

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Smarter hiring for recruiters. Faster shortlisting for candidates.
            Leveraging intelligent AI agents to bridge the talent gap.
          </p>

          {/* Quote Section */}
          <div className="mb-10">
            <p className="text-xl md:text-2xl font-semibold text-primary/90 italic">
              "Hiring at the speed of thought"
            </p>
          </div>

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

      {/* --- PROBLEMS SECTION --- */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-destructive/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full border border-destructive/20 mb-6">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="text-sm font-semibold text-destructive">The Problem</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Traditional Hiring is
              <span className="block text-destructive mt-2">Broken</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Current ATS systems rely on raw keyword matching and rigid filters, failing to understand semantic meaning, validate skills, or unify unstructured data with real-world evidence.
            </p>
          </div>

          {/* Main Problems Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            <ProblemCard
              icon={<Clock className="w-6 h-6" />}
              title="Painfully Slow"
              description="Recruiters manually screen hundreds of resumes per role, wasting countless hours on repetitive tasks."
              gradient="from-red-500/10 to-orange-500/10"
              iconBg="bg-red-500/10"
              iconColor="text-red-500"
            />
            
            <ProblemCard
              icon={<FileText className="w-6 h-6" />}
              title="Keyword Obsessed"
              description="Current ATS relies on raw keyword matching, not actual understanding of skills and capabilities."
              gradient="from-orange-500/10 to-yellow-500/10"
              iconBg="bg-orange-500/10"
              iconColor="text-orange-500"
            />
            
            <ProblemCard
              icon={<XCircle className="w-6 h-6" />}
              title="Missing Great Talent"
              description="Semantically similar skills are missed due to exact-word filtering. 'React.js' ≠ 'ReactJS' in old systems."
              gradient="from-yellow-500/10 to-amber-500/10"
              iconBg="bg-yellow-500/10"
              iconColor="text-yellow-500"
            />
            
            <ProblemCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Wording Over Ability"
              description="Good candidates get filtered out due to resume wording, not their actual capability or potential."
              gradient="from-amber-500/10 to-red-500/10"
              iconBg="bg-amber-500/10"
              iconColor="text-amber-500"
            />
            
            <ProblemCard
              icon={<Shuffle className="w-6 h-6" />}
              title="Chaos & Inconsistency"
              description="Resumes are unstructured, inconsistent, and hard to standardize for machines to process effectively."
              gradient="from-purple-500/10 to-pink-500/10"
              iconBg="bg-purple-500/10"
              iconColor="text-purple-500"
            />
            
            <ProblemCard
              icon={<Filter className="w-6 h-6" />}
              title="Rigid Filters"
              description="Recruiters must think in rigid filters instead of natural language, making searches complex and unintuitive."
              gradient="from-pink-500/10 to-rose-500/10"
              iconBg="bg-pink-500/10"
              iconColor="text-pink-500"
            />
            
            <ProblemCard
              icon={<TrendingDown className="w-6 h-6" />}
              title="Doesn't Scale"
              description="Screening does not scale with high-volume campus or internship hiring, creating bottlenecks."
              gradient="from-blue-500/10 to-cyan-500/10"
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
            />
            
            <ProblemCard
              icon={<Search className="w-6 h-6" />}
              title="Fragmented Discovery"
              description="Candidate discovery is scattered across resumes, ATS databases, and external platforms—no single source of truth."
              gradient="from-cyan-500/10 to-teal-500/10"
              iconBg="bg-cyan-500/10"
              iconColor="text-cyan-500"
            />
            
            <ProblemCard
              icon={<Hourglass className="w-6 h-6" />}
              title="Losing Top Talent"
              description="Time-to-hire increases dramatically, causing companies to lose top talent to faster-moving competitors."
              gradient="from-teal-500/10 to-emerald-500/10"
              iconBg="bg-teal-500/10"
              iconColor="text-teal-500"
            />
          </div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <ImpactStat
              number="250+"
              label="Resumes per role"
              sublabel="manually screened"
            />
            <ImpactStat
              number="40%"
              label="Qualified candidates"
              sublabel="filtered out wrongly"
            />
            <ImpactStat
              number="30+ days"
              label="Average time-to-hire"
              sublabel="in traditional ATS"
            />
          </div>
        </div>
      </section>

      {/* --- SOLUTIONS SECTION --- */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">The Solution</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              How JobPilot
              <span className="block text-primary mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Solves Everything</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform transforms hiring with semantic understanding, skill validation, and intelligent automation.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            <SolutionCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Natural Language Search"
              description="Converts natural language hiring needs into structured candidate search automatically—no complex queries needed."
              gradient="from-emerald-500/10 to-green-500/10"
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-500"
            />
            
            <SolutionCard
              icon={<Brain className="w-6 h-6" />}
              title="Semantic Understanding"
              description="Replaces raw keyword filtering with semantic intent understanding that grasps what you really mean."
              gradient="from-green-500/10 to-teal-500/10"
              iconBg="bg-green-500/10"
              iconColor="text-green-500"
            />
            
            <SolutionCard
              icon={<Layers className="w-6 h-6" />}
              title="Smart Skill Mapping"
              description="Maps different wordings of the same skill to the same underlying capability. 'React.js' = 'ReactJS' = 'React'."
              gradient="from-teal-500/10 to-cyan-500/10"
              iconBg="bg-teal-500/10"
              iconColor="text-teal-500"
            />
            
            <SolutionCard
              icon={<UserCheck className="w-6 h-6" />}
              title="Context-Aware Matching"
              description="Prevents good candidates from being missed due to resume phrasing differences by understanding context."
              gradient="from-cyan-500/10 to-blue-500/10"
              iconBg="bg-cyan-500/10"
              iconColor="text-cyan-500"
            />
            
            <SolutionCard
              icon={<Github className="w-6 h-6" />}
              title="Skill Verification"
              description="Cross-verifies claimed skills using real-world GitHub activity and project contributions."
              gradient="from-blue-500/10 to-indigo-500/10"
              iconBg="bg-blue-500/10"
              iconColor="text-blue-500"
            />
            
            <SolutionCard
              icon={<Lightbulb className="w-6 h-6" />}
              title="Human-Centric Search"
              description="Lets recruiters search candidates the way humans think, not the way databases think."
              gradient="from-indigo-500/10 to-purple-500/10"
              iconBg="bg-indigo-500/10"
              iconColor="text-indigo-500"
            />
            
            <SolutionCard
              icon={<Gauge className="w-6 h-6" />}
              title="Automated Screening"
              description="Automates screening to scale effortlessly for high-volume hiring scenarios like campus recruitment."
              gradient="from-purple-500/10 to-primary/10"
              iconBg="bg-purple-500/10"
              iconColor="text-purple-500"
            />
            
            <SolutionCard
              icon={<Zap className="w-6 h-6" />}
              title="Lightning Fast"
              description="Cuts time-to-hire by automating candidate discovery and filtering—get results in seconds, not days."
              gradient="from-primary/10 to-emerald-500/10"
              iconBg="bg-primary/10"
              iconColor="text-primary"
            />
            
            <SolutionCard
              icon={<Shield className="w-6 h-6" />}
              title="Validated Results"
              description="Reduces false positives by validating skills before shortlisting—only genuine matches reach you."
              gradient="from-green-500/10 to-emerald-500/10"
              iconBg="bg-green-500/10"
              iconColor="text-green-500"
            />
          </div>

          {/* Before vs After Comparison */}
          <div className="max-w-5xl mx-auto mt-16">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="relative p-8 bg-destructive/5 rounded-2xl border-2 border-destructive/20">
                <div className="absolute -top-4 left-6 px-4 py-1 bg-destructive/90 text-destructive-foreground text-sm font-bold rounded-full">
                  Before
                </div>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Manual screening of 250+ resumes</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">30+ days to hire</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">40% qualified candidates missed</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Complex keyword searches</span>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="relative p-8 bg-primary/5 rounded-2xl border-2 border-primary/20">
                <div className="absolute -top-4 left-6 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                  With JobPilot
                </div>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">AI screens all candidates instantly</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">3-5 days to hire</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">95%+ match accuracy</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Natural language queries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="inline-block p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-xl">
              <h3 className="text-2xl font-bold mb-3">Ready to Experience the Future?</h3>
              <p className="text-muted-foreground mb-6 max-w-lg">
                Join leading companies already using AI-powered hiring to find better candidates faster.
              </p>
              <Button
                size="lg"
                className="group"
                onClick={() => navigate("/login")}
              >
                Start Hiring Smarter
                <Rocket className="ml-2 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
              </Button>
            </div>
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
}

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

// Helper Component for Problem Cards
function ProblemCard({
  icon,
  title,
  description,
  gradient,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className={`group relative p-6 bg-gradient-to-br ${gradient} rounded-2xl border border-border/50 hover:border-destructive/30 hover:shadow-lg transition-all duration-300 overflow-hidden`}>
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Helper Component for Impact Stats
function ImpactStat({
  number,
  label,
  sublabel,
}: {
  number: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="relative p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-destructive/20 text-center group hover:border-destructive/40 transition-all">
      <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="text-4xl font-extrabold text-destructive mb-2">{number}</div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>
      </div>
    </div>
  );
}

// Helper Component for Solution Cards
function SolutionCard({
  icon,
  title,
  description,
  gradient,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className={`group relative p-6 bg-gradient-to-br ${gradient} rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden`}>
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      
      <div className="relative z-10">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default Landing;

