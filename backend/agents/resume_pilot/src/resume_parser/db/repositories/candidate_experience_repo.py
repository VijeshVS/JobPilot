from resume_parser.db.client import supabase
from resume_parser.db.tables import CANDIDATE_EXPERIENCE


def insert_candidate_experience(
    candidate_id: str,
    years_of_experience: int,
    experience_description: str
):
    """
    Insert a single experience entry
    """
    return supabase.table(CANDIDATE_EXPERIENCE).insert({
        "candidate_id": candidate_id,
        "years_of_experience": years_of_experience,
        "experience_description": experience_description
    }).execute()


def insert_experience_for_candidate(
    candidate_id: str,
    years_of_experience: int,
    experience_list
):
    """
    Insert multiple experience records for a candidate
    """
    if not experience_list:
        return 0

    count = 0
    for exp in experience_list:
        try:
            insert_candidate_experience(
                candidate_id=candidate_id,
                years_of_experience=years_of_experience,
                experience_description=exp
            )
            count += 1
        except Exception as e:
            print(
                f"Failed to insert experience for candidate {candidate_id}: {e}"
            )

    return count
