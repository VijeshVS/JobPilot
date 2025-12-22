import { useState, useEffect } from "react";
import { Brain, Database, Search, Users, CheckCircle2, Sparkles } from "lucide-react";

interface AILoadingOverlayProps {
  isLoading: boolean;
}

const loadingSteps = [
  { icon: Brain, text: "Analyzing your requirements...", duration: 800 },
  { icon: Database, text: "Searching candidate database...", duration: 1000 },
  { icon: Search, text: "Matching skills & experience...", duration: 1200 },
  { icon: Users, text: "Ranking top candidates...", duration: 1000 },
  { icon: CheckCircle2, text: "Preparing results...", duration: 500 },
];

export function AILoadingOverlay({ isLoading }: AILoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    let stepIndex = 0;
    const runStep = () => {
      if (stepIndex < loadingSteps.length) {
        setCurrentStep(stepIndex);
        const timer = setTimeout(() => {
          setCompletedSteps((prev) => [...prev, stepIndex]);
          stepIndex++;
          runStep();
        }, loadingSteps[stepIndex].duration);
        return () => clearTimeout(timer);
      }
    };

    runStep();
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 rounded-xl gradient-primary opacity-50 blur-lg animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Agent Working</h3>
            <p className="text-sm text-muted-foreground">Finding your perfect candidates</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {loadingSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index && !completedSteps.includes(index);
            const isCompleted = completedSteps.includes(index);
            const isPending = index > currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 border border-primary/30"
                    : isCompleted
                    ? "bg-secondary/50"
                    : "opacity-40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "gradient-primary shadow-elevated"
                      : isCompleted
                      ? "bg-primary/20"
                      : "bg-secondary"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.text}
                  </p>
                  {isActive && (
                    <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-[loading_1s_ease-in-out_infinite]" />
                    </div>
                  )}
                </div>
                {isCompleted && (
                  <span className="text-xs text-primary font-medium">Done</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
