import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Sparkles, Lightbulb } from "lucide-react";

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
    {
      text: "Find candidates with CGPA above 9.0",
      category: "Academic"
    },
    {
      text: "Backend developers with Python and Django experience",
      category: "Tech Stack"
    },
    {
      text: "Candidates with 3+ years of experience in NoSQL technologies",
      category: "Experience"
    },
    {
      text: "Frontend engineers skilled in React, TypeScript, and Tailwind CSS",
      category: "Tech Stack"
    },
    {
      text: "Full-stack developers with CGPA above 8.5 and 2+ years experience",
      category: "Combined"
    },
    {
      text: "Data scientists with machine learning and Python expertise",
      category: "Specialization"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Search Input */}
        <div className="relative">
          <div className="relative group">
            <Textarea
              placeholder="Describe your ideal candidate in plain English... (e.g., 'Find backend developers with 3+ years in Python and strong database skills')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[180px] resize-none bg-card/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground text-base p-6 pr-14 rounded-2xl shadow-sm transition-all duration-200 focus:shadow-xl focus:ring-4 focus:ring-primary/10 hover:border-border group-hover:shadow-md"
            />
            <div className="absolute top-5 right-5 transition-transform duration-300 group-focus-within:scale-110">
              <Sparkles className="w-6 h-6 text-primary/50" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground px-2">
            <div className="w-1 h-1 rounded-full bg-primary/60"></div>
            <Lightbulb className="w-3.5 h-3.5 text-primary/60" />
            <span>Be specific about skills, experience, education, or any combination you need</span>
          </div>
        </div>

        {/* Example Prompts with Categories */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Try these examples</h4>
              <p className="text-xs text-muted-foreground">Click any prompt to use it</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(example.text)}
                className="group relative text-left p-5 rounded-xl bg-gradient-to-br from-card to-card/50 border-2 border-border/50 hover:border-primary/40 hover:from-card hover:to-primary/5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80 bg-primary/15 px-2.5 py-1 rounded-full border border-primary/20">
                        {example.category}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 group-hover:text-foreground transition-colors leading-relaxed font-medium">
                      "{example.text}"
                    </p>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/5 group-hover:bg-primary/15 flex items-center justify-center transition-all duration-300">
                    <Search className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-2">
          <Button 
            type="submit" 
            size="lg"
            disabled={!prompt.trim() || isLoading}
            className="w-full px-8 py-7 text-base font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl group relative overflow-hidden"
          >
            <div className="flex items-center justify-center gap-3 relative z-10">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Finding candidates...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Find Candidates</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
}
