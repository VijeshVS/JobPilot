import { useState } from "react";
import { Candidate } from "@/types/candidate";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InterviewFormData {
  title: string;
  role: string;
  ctc: string;
  mode: "online" | "offline";
  interviewDate: Date | undefined;
  notes: string;
}

interface InterviewSetupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InterviewFormData) => void;
  selectedCandidates: Candidate[];
}

const InterviewSetupModal = ({
  open,
  onClose,
  onSubmit,
  selectedCandidates,
}: InterviewSetupModalProps) => {
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [ctc, setCtc] = useState("");
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      // 1️⃣ Get candidate IDs from USNs
      const candidateIds = await Promise.all(
        selectedCandidates.map((c) => fetchCandidateIdByUSN(c.usn))
      );

      // 2️⃣ Build request payload
      const payload = {
        interview: {
          title,
          role,
          ctc,
          interview_date: interviewDate
            ? interviewDate.toISOString()
            : null,
          mode,
          notes,
        },
        candidate_ids: candidateIds,
      };

      // 3️⃣ Call backend
      const res = await fetch("http://localhost:8000/interviews/shortlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create interview & shortlist");
      }

      // 4️⃣ Success
      onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while shortlisting candidates");
    }
  };


  const fetchCandidateIdByUSN = async (usn: string): Promise<number> => {
    const res = await fetch("http://localhost:8000/candidates/by-usn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usn }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch candidate for USN ${usn}`);
    }

    const data = await res.json();
    return data.candidate_id;
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-gradient-to-br from-[#0b1220] to-[#020617] border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground"
        >

        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-white/10">
          <h2 className="text-2xl font-bold">Setup Interview</h2>
          <p className="text-muted-foreground text-sm">
            Provide interview details before shortlisting candidates
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6 overflow-y-auto">

          {/* Selected Candidates */}
          {selectedCandidates.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                Selected Candidates ({selectedCandidates.length})
              </h4>

              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto rounded-lg border border-border p-3 bg-muted/30">
                {selectedCandidates.map((candidate) => (
                  <div
                    key={candidate.usn}
                    className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/30"
                  >
                    {candidate.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({candidate.usn})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium">Interview Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg bg-background border border-border px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Role</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-background border border-border px-4 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Stipend / CTC</label>
                <input
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-background border border-border px-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "online" | "offline")}
                className="mt-1 w-full rounded-lg bg-background border border-border px-4 py-2"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Interview Date</label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-1 w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {interviewDate ? (
                      format(interviewDate, "PPP")
                    ) : (
                      <span className="text-muted-foreground">
                        Select interview date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={interviewDate}
                    onSelect={setInterviewDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>


            <div>
              <label className="text-sm font-medium">
                Notes <span className="text-muted-foreground">(Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg bg-background border border-border px-4 py-2 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-white/10 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Confirm & Shortlist
          </Button>
        </div>

      </div>
    </div>
  );
};

export default InterviewSetupModal;
