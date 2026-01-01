import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  role: "candidate" | "recruiter" | null;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<"candidate" | "recruiter" | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const storedRole = localStorage.getItem("role") as
      | "candidate"
      | "recruiter"
      | null;

    setIsAuthenticated(auth);
    setRole(storedRole);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
