import React, { useState } from 'react'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Upload, Plane, ArrowLeft } from 'lucide-react'
import { useNavigate } from "react-router-dom"


const ResumeUploadPage: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [result, setResult] = useState<{
    present_skills: string[]
    percentage_score: number
    count_skills: number
  } | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!resumeFile) {
      setError('Please upload a resume PDF.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', resumeFile)

    try {
      const response = await fetch('http://localhost:8000/parse-resume', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Failed to parse resume')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const navigate = useNavigate()


  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col ">

      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">

          {/* Left branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Job Pilot</h1>
              <p className="text-xs text-muted-foreground">
                AI Resume Parser
              </p>
            </div>
          </div>

          {/* Right action */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                 bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </button>

        </div>
      </header>

      <div className="flex flex-col items-center p-6">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Parse Your Resume</h1>
          <p className="text-gray-400">
            Upload a resume and let our AI extract structured insights automatically
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
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-gray-300 font-medium">
                Drop your resume here
              </p>
              <p className="text-gray-500 text-sm">
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

            <p className="text-sm text-gray-400 mt-2">
              {resumeFile
                ? `✔ ${resumeFile.name} selected`
                : 'No file selected'}
            </p>

            {/* Error */}
            {error && (
              <p className="mt-3 text-red-400 text-sm">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-6 px-6 py-2 rounded transition-all flex items-center gap-2
              ${loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}
            `}
            >
              {loading && <span className="loader" />}
              {loading ? 'Parsing resume...' : 'Parse Resume'}
            </button>

            {/* Result Section */}
            {result && (
              <div className="mt-8 bg-gray-800 rounded-lg p-6 animate-fadeIn">

                <h2 className="text-xl font-semibold mb-4">
                  Skill Match Summary
                </h2>

                {/* Percentage */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Match Percentage</span>
                    <span>{result.percentage_score.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${result.percentage_score.toFixed(2)}%` }}
                    />
                  </div>
                </div>

                {/* Count */}
                <p className="text-gray-300 mb-4">
                  Skills Matched: <span className="font-bold">{result.count_skills}</span>
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {result.present_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-600/20 border border-blue-500 text-blue-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
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
