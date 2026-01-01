import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const SignupDialog = ({
  open,
  onOpenChange,
  role,
  email,
  password,
  companyName,
  companyRole,
  setEmail,
  setPassword,
  setCompanyName,
  setCompanyRole,
  onSignup,
  switchToLogin,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: "candidate" | "recruiter";
  email: string;
  password: string;
  companyName?: string;
  companyRole?: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setCompanyName?: (value: string) => void;
  setCompanyRole?: (value: string) => void;
  onSignup: () => void;
  switchToLogin: () => void;
}) => {return(
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-center">
          {role === "candidate" ? "Candidate Signup" : "Recruiter Signup"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {role === "recruiter" && (
          <>
            <Input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <Input placeholder="Your Role in Company" value={companyRole} onChange={(e) => setCompanyRole(e.target.value)} />
          </>
        )}

        <Button className="w-full" onClick={onSignup}>
          Sign Up
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <button className="text-primary underline" onClick={switchToLogin}>
            Login
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
}
export default SignupDialog;