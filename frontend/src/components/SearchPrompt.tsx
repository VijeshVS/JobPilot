import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Sparkles } from "lucide-react";

interface SearchPromptProps {
  onSearch: (prompt: string) => void;
  isLoading: boolean;
}

export function SearchPrompt({ onSearch, isLoading }: SearchPromptProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSearch(prompt.trim());
    }
  };

  const examplePrompts = [
    "Get me the candidates who has cgpa >= 9.0",
    "Get me the candidates who are into backend technologies",
    "Get me the candidates who has more than 4 yoe",
    "Get me the candidates who has cgpa more than 8.8 and knows React"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Describe the ideal candidate you're looking for..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[140px] resize-none bg-card border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground text-base p-4 pr-4 rounded-xl shadow-card transition-all duration-200 focus:shadow-elevated"
          />
          <div className="absolute bottom-4 right-4">
            <Sparkles className="w-5 h-5 text-primary/30" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(example)}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors truncate max-w-[200px]"
              >
                {example}
              </button>
            ))}
          </div>

          <Button 
            type="submit" 
            variant="gradient" 
            size="lg"
            disabled={!prompt.trim() || isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Find Candidates
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
