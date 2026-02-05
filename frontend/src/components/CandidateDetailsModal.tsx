import { CandidateDetails } from "@/types/candidate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  User,
  Star,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Calendar,
  Building2,
  Loader2,
} from "lucide-react";

interface CandidateDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateDetails | null;
  isLoading: boolean;
}

function getLinkIcon(linkType: string) {
  switch (linkType.toLowerCase()) {
    case "github":
      return <Github className="w-4 h-4" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    default:
      return <Globe className="w-4 h-4" />;
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function CandidateDetailsModal({
  open,
  onOpenChange,
  candidate,
  isLoading,
}: CandidateDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
        Candidate Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading details...</span>
          </div>
        ) : candidate ? (
          <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-xl">
              {candidate.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">
              {candidate.name}
            </h2>
            <p className="text-muted-foreground">
              {candidate.field_of_study || "Not specified"}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {candidate.cgpa && (
            <Badge variant="secondary">GPA: {candidate.cgpa}</Badge>
              )}
              {candidate.resume_score && (
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Star className="w-3 h-3 mr-1" />
              Score: {candidate.resume_score}
            </Badge>
              )}
            </div>
          </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-primary/70" />
            <span className="text-foreground">{candidate.email}</span>
          </div>
          {candidate.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-primary/70" />
              <span className="text-foreground">{candidate.phone}</span>
            </div>
          )}
          {candidate.usn && (
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="w-4 h-4 text-primary/70" />
              <span className="text-foreground">{candidate.usn}</span>
            </div>
          )}
          {candidate.gender && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-primary/70" />
              <span className="text-foreground">{candidate.gender}</span>
            </div>
          )}
          {candidate.years_of_experience !== null && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-primary/70" />
              <span className="text-foreground">
            {candidate.years_of_experience} years experience
              </span>
            </div>
          )}
            </div>

            {/* Links */}
            {candidate.candidate_links && candidate.candidate_links.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-primary" />
            Links
              </h3>
              <div className="flex flex-wrap gap-2">
            {candidate.candidate_links.map((link, idx) => (
              <a
                key={idx}
                href={link.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
              >
                {getLinkIcon(link.link_type)}
                <span className="capitalize">{link.link_type}</span>
              </a>
            ))}
              </div>
            </div>
          </>
            )}

            {/* Skills */}
            {candidate.candidate_skills && candidate.candidate_skills.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Skills ({candidate.no_of_skills || candidate.candidate_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
            {candidate.candidate_skills.map((skill, idx) => (
              <Badge key={idx} variant="outline" className="font-normal">
                {skill.skill_name}
              </Badge>
            ))}
              </div>
            </div>
          </>
            )}

            {/* Experience */}
            {candidate.candidate_experience && candidate.candidate_experience.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Experience
              </h3>
              <div className="space-y-4">
            {candidate.candidate_experience.map((exp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">
                  {exp.role_title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{exp.company_name}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                </span>
              </div>
                </div>
                {exp.description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {exp.description}
              </p>
                )}
              </div>
            ))}
              </div>
            </div>
          </>
            )}
          </div>
        </ScrollArea>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
        No candidate data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
