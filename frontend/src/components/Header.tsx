import { FileText } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">AI Resume Parser</h1>
          <p className="text-xs text-muted-foreground">Powered by AI Agents</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
