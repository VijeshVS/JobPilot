import json
from pathlib import Path
from resume_parser.db.repositories.skills_repo import insert_skills_for_candidate
from resume_parser.db.repositories.candidate_repo import insert_candidate
import random


def generate_usn():
    year = random.randint(20, 24)
    roll = random.randint(1, 300)
    return f"1RV{year}CS{roll:03d}"

def safe_get(value, default):
    """Return default if value is None or empty"""
    if value is None:
        return default
    if isinstance(value, str) and value.strip() == "":
        return default
    return value


def calculate_years_of_experience(experience_list):
    """
    Very basic fallback logic:
    - If experience array is empty or null → 0
    - Otherwise → number of experience entries
    """
    if not experience_list:
        return 0
    return len(experience_list)


def insert_candidate_and_skills(json_path: Path):
    # Load JSON
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Candidate fields with defaults
    name = safe_get(data.get("name"), "Unknown")
    email = safe_get(data.get("email"), "unknown@example.com")
    phone = safe_get(data.get("phone"), "0000000000")
    gender = safe_get(data.get("gender"), "Male")
    cgpa = safe_get(data.get("cgpa"), 0.0)
    try:
        cgpa = float(cgpa)
    except Exception:
        cgpa = 0.0
    field_of_study = safe_get(data.get("field_of_study"), "Unknown")
    experience_list = data.get("experience", [])
    years_of_experience = calculate_years_of_experience(experience_list)

    # USN generation
    usn = safe_get(data.get("usn"), None)
    if usn is None:
        usn = generate_usn()

    # Insert candidate
    candidate_payload = {
        "name": name,
        "email": email,
        "usn": usn,
        "phone": phone,
        "gender": gender,
        "cgpa": cgpa,
        "field_of_study": field_of_study,
        "years_of_experience": years_of_experience
    }

    response = insert_candidate(candidate_payload)
    if not response.data:
        raise Exception("Candidate insertion failed")

    candidate_id = response.data[0]["candidate_id"]

    # Insert skills
    skills = data.get("technical_skills", [])
    skills_inserted = insert_skills_for_candidate(candidate_id, skills)

    return {
        "candidate_id": candidate_id,
        "usn": usn,
        "skills_inserted": skills_inserted
    }


json_path ="C:\\Users\\ajayr\\OneDrive\\Documents\\ML\\LAB\\resume_parser\\resume_got_off.json"

result = insert_candidate_and_skills(json_path)
print("Inserted candidate:", result)