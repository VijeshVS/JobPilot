import { useState, useCallback } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "./FileUpload";
import TerminalOutput, { LogEntry } from "./TerminalOutput";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8000";

const ResumeParser = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const { toast } = useToast();

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: new Date(),
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      addLog("info", `File selected: ${file.name}`);
    }
  };

  const handleParseResume = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a resume PDF first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setLogs([]);
    
    addLog("info", "Initializing resume parser...");
    addLog("loading", `Uploading ${selectedFile.name}...`);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      addLog("loading", "Sending request to AI agents...");

      const response = await fetch(`${API_BASE_URL}/parse-resume`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      addLog("success", "Resume received by server");
      addLog("loading", "AI agents processing resume...");

      const data = await response.json();
      
      addLog("success", "Processing complete!");
      addLog("info", "─".repeat(50));
      addLog("success", "Parsed Resume Data:");
      addLog("info", JSON.stringify(data, null, 2));

      toast({
        title: "Success!",
        description: "Resume parsed successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      addLog("error", `Error: ${errorMessage}`);
      
      toast({
        title: "Parsing failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Hero Section */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Parse Your Resume
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Upload a resume and let our AI agents extract structured insights automatically
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card p-6 md:p-8 space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* File Upload */}
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            disabled={isProcessing}
          />

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {["Extract skills", "Get experience", "Find education", "Contact info"].map((action) => (
              <span
                key={action}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground transition-colors cursor-default"
              >
                {action}
              </span>
            ))}
          </div>

          {/* Parse Button */}
          <div className="flex justify-end">
            <Button
              // variant="primary"
              size="lg"
              onClick={handleParseResume}
              disabled={!selectedFile || isProcessing}
              className="min-w-[180px]"
            >
              <Search className="w-5 h-5" />
              {isProcessing ? "Processing..." : "Parse Resume"}
            </Button>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <TerminalOutput logs={logs} isProcessing={isProcessing} />
        </div>
      </div>
    </div>
  );
};

export default ResumeParser;
