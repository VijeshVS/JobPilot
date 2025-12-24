from resume_parser.db.client import supabase
from resume_parser.db.tables import CANDIDATES

def insert_candidate(data: dict):
    return supabase.table(CANDIDATES).insert(data).execute()

def get_candidate_by_email(email: str):
    return (
        supabase
        .table(CANDIDATES)
        .select("*")
        .eq("email", email)
        .single()
        .execute()
    )
