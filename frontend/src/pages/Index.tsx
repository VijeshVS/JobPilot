import { useState } from 'react';
import { FileSearch, ArrowLeft, LogOut, Sparkles } from 'lucide-react';
import { Briefcase, FileUp } from 'lucide-react';
import { supabase } from "../lib/supabaseClient";
import { SearchPrompt } from '@/components/SearchPrompt';
import { CandidateGrid } from '@/components/CandidateGrid';
import { AILoadingOverlay } from '@/components/AILoadingOverlay';
import { WorkflowReviewModal } from '@/components/WorkflowReviewModal';
import { CandidateDetailsModal } from '@/components/CandidateDetailsModal';
import { Candidate, CandidateDetails } from '@/types/candidate';
import { useSSEEvents } from '@/hooks/useSSEEvents';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const Index = () => {
  const { updateAuth } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showWorkflowReview, setShowWorkflowReview] = useState(false);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState<CandidateDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { events, isConnected, isComplete, connect, disconnect, resetEvents } = useSSEEvents();

  const fetchCandidates = async (prompt: string) => {
    try {
      const response = await fetch('http://localhost:8000/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "input": prompt })
      });

      const data = await response.json();
      const results = data.result == "null" ? [] : JSON.parse(data.result);
      setCandidates(results);
      setIsLoading(false);

      toast.success(`Found ${results.length} matching candidates`);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error("Failed to fetch candidates");
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    
    // Update auth context
    updateAuth(false, null);

    toast.success("You have been successfully signed out");

    navigate("/login");
  };

  const handleCandidateClick = async (candidate: Candidate) => {
    if (!candidate.usn) {
      toast.error("Candidate USN is not available");
      return;
    }

    setShowCandidateDetails(true);
    setIsLoadingDetails(true);
    setSelectedCandidateDetails(null);

    try {
      const response = await fetch('http://localhost:8000/candidates/by-usn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: candidate.usn }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch candidate details');
      }

      const data: CandidateDetails = await response.json();
      setSelectedCandidateDetails(data);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      toast.error("Failed to fetch candidate details");
      setShowCandidateDetails(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">

          {/* Left */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-foreground">Job Pilot</h1>
              <p className="text-xs text-muted-foreground">
                AI-Powered Candidate Search
              </p>
            </div>
          </button>

          {/* Right Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="group gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Sign Out
            </Button>
          </div>


        </div>
      </header>


      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Search</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Find Your Perfect Candidates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
            <CandidateGrid
              candidates={candidates}
              isLoading={false}
              onCandidateClick={handleCandidateClick}
            />
          </div>
        )}

        {/* Workflow Review Modal */}
        <WorkflowReviewModal
          open={showWorkflowReview}
          onOpenChange={setShowWorkflowReview}
          events={events}
        />

        {/* Candidate Details Modal */}
        <CandidateDetailsModal
          open={showCandidateDetails}
          onOpenChange={setShowCandidateDetails}
          candidate={selectedCandidateDetails}
          isLoading={isLoadingDetails}
        />
      </main>

    </div>
  );
};

export default Index;
