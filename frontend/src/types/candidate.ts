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
