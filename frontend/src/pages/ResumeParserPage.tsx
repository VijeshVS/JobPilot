import React, { useState } from 'react'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Upload, Briefcase, ArrowLeft, LogOut, CheckCircle2, Loader2, Github, FileText, Sparkles } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient";
import { toast } from "@/components/ui/sonner";
import { Button } from '@/components/ui/button';

type ProcessStep = {
  label: string;
  status: 'pending' | 'processing' | 'completed';
};

const ResumeUploadPage: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [result, setResult] = useState<{
    present_skills: string[]
    percentage_score: number
    count_skills: number
  } | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessStep[]>([
    { label: 'Parsing resume...', status: 'pending' },
    { label: 'Extracting features...', status: 'pending' },
    { label: 'Analyzing skills...', status: 'pending' },
    { label: 'Matching skills with GitHub...', status: 'pending' },
    { label: 'Comparing skills...', status: 'pending' },
    { label: 'Compiling final results...', status: 'pending' },
  ])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setResumeFile(file)
      toast.success(`File selected: ${file.name}`);
    }
  }

  const handleSubmit = async () => {
    if (!resumeFile) {
      toast.error('Please upload a resume PDF');
      return
    }

    setLoading(true)
    setResult(null)

    // Reset all steps to pending
    const resetSteps = processingSteps.map(step => ({ ...step, status: 'pending' as const }));
    setProcessingSteps(resetSteps);

    // Simulate progressive step updates
    const stepTimings = [800, 1200, 1000, 1500, 1000, 800]; // ms for each step

    const formData = new FormData()
    formData.append('file', resumeFile)

    try {
      // Start the API call
      const responsePromise = fetch('http://localhost:8000/parse-resume', {
        method: 'POST',
        body: formData
      });

      // Animate through steps while waiting for response
      for (let i = 0; i < processingSteps.length; i++) {
        // Mark current step as processing
        setProcessingSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'processing' as const } : step
        ));

        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, stepTimings[i]));

        // Mark current step as completed
        setProcessingSteps(prev => prev.map((step, idx) => 
          idx === i ? { ...step, status: 'completed' as const } : step
        ));
      }

      // Wait for API response
      const response = await responsePromise;

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Failed to parse resume')
      }

      const data = await response.json()
      setResult(data)
      toast.success(`Resume parsed successfully! Found ${data.count_skills} matching skills`);
    } catch (err: unknown) {
      console.error('Resume parsing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse resume';
      toast.error(errorMessage);
      // Reset steps on error
      setProcessingSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");

    toast.success('You have been successfully signed out');

    navigate("/login");
  };

  const navigate = useNavigate()


  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col ">

      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">

          {/* Left branding */}
          {/* Left */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-foreground">Job Pilot</h1>
              <p className="text-xs text-muted-foreground">
                AI-Powered Candidate Search
              </p>
            </div>
          </button>

          {/* Right action */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="group gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Sign Out
            </Button>
          </div>



        </div>
      </header>

      <div className="flex flex-col items-center p-6">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Apply for This Position</h1>
          <p className="text-gray-400">
            Upload your resume to submit your application. Our team will review it and contact you if there’s a match.
          </p>
        </div>


        {/* Upload Card */}
        <Card className="w-full max-w-3xl bg-gray-900 border-gray-700">
          <CardContent className="p-8">

            {/* Upload Box */}
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg h-48 cursor-pointer hover:border-green-500 transition"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-foreground font-semibold text-lg mb-1">
                Drop your resume here
              </p>
              <p className="text-muted-foreground text-sm">
                or click to browse (PDF only)
              </p>

              <Input
                id="resume-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <div className="flex items-center gap-2 mt-4">
              {resumeFile && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              <p className="text-sm text-muted-foreground">
                {resumeFile
                  ? `${resumeFile.name} selected`
                  : 'No file selected'}
              </p>
            </div>

            {/* Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !resumeFile}
              size="lg"
              className="mt-8 w-full py-7 text-base font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl relative overflow-hidden group"
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </div>
            </Button>

            {/* Processing Steps */}
            {loading && (
              <div className="mt-10 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">AI Agents Processing</h3>
                </div>
                
                {processingSteps.map((step, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                      step.status === 'processing' 
                        ? 'bg-primary/10 border-2 border-primary/30 shadow-lg' 
                        : step.status === 'completed'
                        ? 'bg-green-500/10 border-2 border-green-500/30'
                        : 'bg-card/30 border-2 border-border/30'
                    }`}
                  >
                    {step.status === 'processing' && (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    )}
                    {step.status === 'completed' && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {step.status === 'pending' && (
                      <div className="w-5 h-5 rounded-full border-2 border-border" />
                    )}
                    <span className={`font-medium ${
                      step.status === 'processing' 
                        ? 'text-primary' 
                        : step.status === 'completed'
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Result Section */}
            {result && !loading && (
              <div className="mt-10 bg-gradient-to-br from-card to-card/50 border-2 border-border/50 rounded-2xl p-8 shadow-xl animate-fadeIn">

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Skill Match Summary
                  </h2>
                </div>

                {/* Percentage */}
                <div className="mb-6 p-6 bg-card/50 rounded-xl border border-border/30">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="font-semibold text-foreground">Match Percentage</span>
                    <span className="text-2xl font-bold text-primary">{result.percentage_score.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-border/30 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-4 rounded-full transition-all duration-1000 shadow-lg shadow-green-500/30"
                      style={{ width: `${result.percentage_score.toFixed(2)}%` }}
                    />
                  </div>
                </div>

                {/* Count */}
                <div className="mb-6 p-5 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-foreground text-lg">
                    Skills Matched: <span className="font-bold text-2xl text-primary ml-2">{result.count_skills}</span>
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Matched Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {result.present_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-primary/10 border-2 border-primary/30 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}


          </CardContent>
        </Card>
      </div>

    </div>

  )
}

export default ResumeUploadPage
