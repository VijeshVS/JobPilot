import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  role: "candidate" | "recruiter" | null;
  updateAuth: (auth: boolean, userRole: "candidate" | "recruiter" | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  updateAuth: () => {},
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

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      const updatedAuth = localStorage.getItem("isAuthenticated") === "true";
      const updatedRole = localStorage.getItem("role") as "candidate" | "recruiter" | null;
      setIsAuthenticated(updatedAuth);
      setRole(updatedRole);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateAuth = (auth: boolean, userRole: "candidate" | "recruiter" | null) => {
    setIsAuthenticated(auth);
    setRole(userRole);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
