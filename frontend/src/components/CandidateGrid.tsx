import { Candidate } from "@/types/candidate";
import { CandidateCard } from "./CandidateCard";
import { Users } from "lucide-react";

interface CandidateGridProps {
  candidates: Candidate[];
  isLoading: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="bg-card rounded-xl p-6 shadow-card border border-border/50 animate-pulse"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary" />
            <div className="flex-1">
              <div className="h-5 bg-secondary rounded w-3/4 mb-2" />
              <div className="h-4 bg-secondary rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-secondary rounded w-full" />
            <div className="h-4 bg-secondary rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CandidateGrid({ candidates, isLoading }: CandidateGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No candidates yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Enter a description of your ideal candidate above to start searching
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Matching Candidates</h2>
          <span className="px-2 py-0.5 text-sm font-medium rounded-full bg-primary/10 text-primary">
            {candidates.length}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate, index) => (
          <CandidateCard 
            key={candidate.usn} 
            candidate={candidate} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
