export interface Candidate {
  candidate_id: number;
  name: string;
  email: string;
  usn: string | null;
  phone: string | null;
  gender: string | null;
  cgpa: number | null;
  field_of_study: string | null;
  years_of_experience: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CandidateSkill {
  skill_name: string;
}

export interface CandidateLink {
  link_type: string;
  link_url: string;
}

export interface CandidateExperience {
  role_title: string;
  company_name: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
}

export interface CandidateDetails extends Candidate {
  resume_score: number | null;
  no_of_skills: number | null;
  candidate_skills: CandidateSkill[];
  candidate_links: CandidateLink[];
  candidate_experience: CandidateExperience[];
}
