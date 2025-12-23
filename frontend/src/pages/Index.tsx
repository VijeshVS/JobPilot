import { useState } from 'react';
import { Plane, FileSearch } from 'lucide-react';
import { SearchPrompt } from '@/components/SearchPrompt';
import { CandidateGrid } from '@/components/CandidateGrid';
import { AILoadingOverlay } from '@/components/AILoadingOverlay';
import { WorkflowReviewModal } from '@/components/WorkflowReviewModal';
import { Candidate } from '@/types/candidate';
import { mockCandidates } from '@/data/mockCandidates';
import { useSSEEvents } from '@/hooks/useSSEEvents';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showWorkflowReview, setShowWorkflowReview] = useState(false);
  const { events, isConnected, isComplete, connect, disconnect, resetEvents } = useSSEEvents();
  const { toast } = useToast();

  const fetchCandidates = async (prompt: string) => {
    try {
      const response = await fetch('http://localhost:8000/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "input": prompt })
      });

      const data = await response.json();
      console.log(data);
      const results = JSON.parse(data.result).candidates;
      console.log(results);
      setCandidates(results);
      setIsLoading(false);
      
      toast({
        title: "Candidates Found",
        description: `Found ${results.length} matching candidates`,
      });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch candidates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (prompt: string) => {
    // Disconnect existing connection before starting new one
    if (isConnected) {
      disconnect();
    }
    
    setIsLoading(true);
    setHasSearched(true);
    setCandidates([]);
    resetEvents();
    
    // Connect to SSE and fetch candidates concurrently
    // Small delay to ensure previous connection is closed
    setTimeout(() => connect(prompt), 100);
    fetchCandidates(prompt);
  };

  const handleCancel = () => {
    disconnect();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Job Pilot</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Candidate Search</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Find Your Perfect Candidates
            </h2>
            <p className="text-muted-foreground">
              Describe the ideal candidate and let our AI agents search through the talent pool
            </p>
          </div>
          
          <SearchPrompt onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="mb-12">
            <AILoadingOverlay 
              events={events} 
              isConnected={isConnected}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Results Section */}
        {!isLoading && hasSearched && (
          <div className="space-y-4">
            {events.length > 0 && (
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowWorkflowReview(true)}
                  className="gap-2"
                >
                  <FileSearch className="w-4 h-4" />
                  Review AI Workflow
                </Button>
              </div>
            )}
            <CandidateGrid candidates={candidates} isLoading={false} />
          </div>
        )}

        {/* Workflow Review Modal */}
        <WorkflowReviewModal 
          open={showWorkflowReview}
          onOpenChange={setShowWorkflowReview}
          events={events}
        />
      </main>
    </div>
  );
};

export default Index;
