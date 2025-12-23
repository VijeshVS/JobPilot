from resume_parser.db.client import supabase
from resume_parser.db.tables import CANDIDATE_SKILLS

def insert_skill(candidate_id: str, skill_name: str):
    return supabase.table(CANDIDATE_SKILLS).insert({
        "candidate_id": candidate_id,
        "skill_name": skill_name
    }).execute()


def insert_skills_for_candidate(candidate_id: str, skills_list):
    """
    Insert skills for a candidate into candidate_skills table.
    
    Args:
        candidate_id (str): The unique ID of the candidate (FK in skills table).
        skills_list (List[str]): List of skills to insert.
    
    Returns:
        int: Number of skills successfully inserted.
    """
    if not skills_list:
        return 0  # No skills to insert

    count = 0
    for skill in skills_list:
        try:
            insert_skill(candidate_id=candidate_id, skill_name=skill)
            count += 1
        except Exception as e:
            # Log or handle individual skill insertion failure
            print(f"Failed to insert skill '{skill}' for candidate {candidate_id}: {e}")

    return count