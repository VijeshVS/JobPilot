import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "@/pages/Home";
import Index from "./pages/Index";
import ResumeParserPage from "@/pages/ResumeParserPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/find-candidates"
          element={
            <Index/>
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
    </BrowserRouter>
  </AuthProvider>
);

export default App;
