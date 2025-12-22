import { Candidate } from "@/types/candidate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, GraduationCap, Briefcase, User } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

export function CandidateCard({ candidate, index }: CandidateCardProps) {
  return (
    <Card 
      className="group shadow-card hover:shadow-elevated transition-all duration-300 border-border/50 hover:border-primary/20 bg-card overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-lg">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                {candidate.name}
              </h3>
              <p className="text-muted-foreground text-sm">{candidate.field_of_study || 'Not specified'}</p>
            </div>
          </div>
          {candidate.cgpa && (
            <Badge variant="secondary" className="font-medium">
              GPA: {candidate.cgpa}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-primary/70" />
            <span className="truncate">{candidate.email}</span>
          </div>

          {candidate.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 text-primary/70" />
              <span>{candidate.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-4 pt-3 border-t border-border/50">
            {candidate.years_of_experience !== null && (
              <div className="flex items-center gap-1.5 text-sm">
                <Briefcase className="w-4 h-4 text-primary/70" />
                <span className="text-foreground font-medium">{candidate.years_of_experience}</span>
                <span className="text-muted-foreground">years exp.</span>
              </div>
            )}

            {candidate.gender && (
              <div className="flex items-center gap-1.5 text-sm">
                <User className="w-4 h-4 text-primary/70" />
                <span className="text-muted-foreground">{candidate.gender}</span>
              </div>
            )}

            {candidate.usn && (
              <div className="flex items-center gap-1.5 text-sm">
                <GraduationCap className="w-4 h-4 text-primary/70" />
                <span className="text-muted-foreground">{candidate.usn}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
