import { X, Mail, Phone, User, GraduationCap, Star } from "lucide-react";
import { CandidateDetails } from "@/types/candidate";

interface CandidateHoverCardProps {
  open: boolean;
  isLoading: boolean;
  candidate: CandidateDetails | null;
  onClose: () => void;
}

const CandidateHoverCard = ({
  open,
  isLoading,
  candidate,
  onClose,
}: CandidateHoverCardProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl bg-gradient-to-br from-[#0b1220] to-[#020617] p-8 border border-white/10 shadow-2xl">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"
        >
          <X />
        </button>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        )}

        {/* Content */}
        {!isLoading && candidate && (
          <>
            {/* Header */}
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-xl font-bold text-black">
                {candidate.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {candidate.name}
                </h2>
                <p className="text-muted-foreground">
                  {candidate.field_of_study}
                </p>

                <div className="flex gap-3 mt-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
                    GPA: {candidate.cgpa}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Score: {candidate.resume_score}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-white/10 mb-6" />

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                {candidate.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                {candidate.phone}
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                {candidate.usn}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                {candidate.gender}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                {candidate.years_of_experience} years experience
              </div>
            </div>

            <hr className="border-white/10 mb-6" />

            {/* Skills */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <Star className="w-4 h-4 text-emerald-400" />
                Skills ({candidate.no_of_skills})
              </h3>

              <div className="flex flex-wrap gap-2">
                {candidate.candidate_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/10 text-sm"
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateHoverCard;
