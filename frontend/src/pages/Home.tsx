import { Link } from "react-router-dom";
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
  MessageSquare
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Brand */}
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-primary">JobPilot</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              AI-Powered
              <span className="block text-primary">Recruitment Platform</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Leveraging intelligent AI agents to connect the right candidates with the right opportunities. 
              Natural language search meets advanced query generation.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/parse-resume">
                <Button size="lg" className="group text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  <FileText className="w-5 h-5 mr-2" />
                  I'm a Candidate
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/">
                <Button size="lg" variant="outline" className="group text-lg px-8 py-6 rounded-xl border-2 hover:bg-primary hover:text-primary-foreground transition-all">
                  <Search className="w-5 h-5 mr-2" />
                  I'm an HR Professional
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the future of recruitment with our AI-powered platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Natural Language Search</h3>
              <p className="text-muted-foreground leading-relaxed">
                Describe your ideal candidate in plain English. No complex filters or boolean queries needed.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered Queries</h3>
              <p className="text-muted-foreground leading-relaxed">
                CrewAI agents intelligently generate SQL queries, understanding skills, experience, and requirements.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Updates</h3>
              <p className="text-muted-foreground leading-relaxed">
                Watch the AI work with live progress updates via Server-Sent Events as it searches candidates.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Semantic Understanding</h3>
              <p className="text-muted-foreground leading-relaxed">
                The platform understands context, synonyms, and related skills for smarter matching.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Database className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Database Integration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seamlessly integrated with your candidate database for instant, accurate results.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Rich Candidate Profiles</h3>
              <p className="text-muted-foreground leading-relaxed">
                View detailed profiles with skills, experience, education, CGPA, and contact information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Queries Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Example Searches
            </h2>
            <p className="text-muted-foreground text-lg">
              Just type what you're looking for
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              "Find me backend developers with 3+ years of experience in Python",
              "Show me frontend developers who know React and TypeScript",
              "Find freshers with good CGPA interested in full-stack development"
            ].map((query, index) => (
              <div 
                key={index}
                className="p-5 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-foreground text-lg leading-relaxed">"{query}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Whether you're looking for your next opportunity or searching for top talent, JobPilot has you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/parse-resume">
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
                <FileText className="w-5 h-5 mr-2" />
                Submit Your Resume
              </Button>
            </Link>
            
            <Link to="/">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-2">
                <Search className="w-5 h-5 mr-2" />
                Search Candidates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold">JobPilot</span>
            <span className="text-sm">— AI-Powered Recruitment</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
