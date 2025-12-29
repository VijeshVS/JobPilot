import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <Link to="/home" className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">JobPilot</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Recruitment</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
