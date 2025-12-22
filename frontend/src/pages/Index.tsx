import { useState } from "react";
import { SearchPrompt } from "@/components/SearchPrompt";
import { CandidateGrid } from "@/components/CandidateGrid";
import { AILoadingOverlay } from "@/components/AILoadingOverlay";
import { mockCandidates } from "@/data/mockCandidates";
import { Candidate } from "@/types/candidate";
import { useToast } from "@/hooks/use-toast";
import { Plane, Sparkles } from "lucide-react";

const Index = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (prompt: string) => {
    setIsLoading(true);
    setHasSearched(true);

    const response = await fetch('http://localhost:8000/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "input": prompt })
    });

    const data = await response.json();

    console.log(data)
    const results = JSON.parse(data.result).candidates;
    console.log(results)
    setCandidates(results);
    setIsLoading(false);

    toast({
      title: "Search complete",
      description: `Found ${results.length} matching candidates`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Job Pilot</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Candidate Search</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Smart Candidate Matching
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Find Your Perfect Candidate
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Describe the skills, experience, and qualities you're looking for. 
            Our AI will match you with the best candidates instantly.
          </p>

          <SearchPrompt onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Results Section */}
        {hasSearched && (
          <section className="mt-16">
            {isLoading ? (
              <AILoadingOverlay isLoading={isLoading} />
            ) : (
              <CandidateGrid candidates={candidates} isLoading={false} />
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Job Pilot. Streamline your hiring process with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
