import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "@/pages/Landing";
import Index from "./pages/Index";
import ResumeParserPage from "@/pages/ResumeParserPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/find-candidates"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <Index />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parse-resume"
          element={
            <ProtectedRoute allowedRole="candidate">
              <ResumeParserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
