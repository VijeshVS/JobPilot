import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const LoginDialog = ({
  open,
  onOpenChange,
  role,
  email,
  password,
  setEmail,
  setPassword,
  onLogin,
  switchToSignup,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: "candidate" | "recruiter";
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  onLogin: () => void;
  switchToSignup: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {role === "candidate" ? "Candidate Login" : "Recruiter Login"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={onLogin}>
            Login
          </Button>

          <div className="text-center text-sm">
            Don’t have an account?{" "}
            <button className="text-primary underline" onClick={switchToSignup}>
              Sign up
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
