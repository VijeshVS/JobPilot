import os
import json

# -------------------------
# Helper functions
# -------------------------
def normalize(text):
    """Lowercase and strip for safe comparison"""
    return text.lower().strip()

# -------------------------
# Main skill verification
# -------------------------
def verify_skills_string_match(resume_skills, github_skills):
    resume_norm = [normalize(s) for s in resume_skills]
    github_norm = [normalize(s) for s in github_skills]

    present_skills = []
    total_matched_skills = 0

    for skill in resume_skills:
        skill_norm = normalize(skill)

        matched = any(
            skill_norm == g or skill_norm in g or g in skill_norm
            for g in github_norm
        )

        if matched:
            present_skills.append(skill)
            total_matched_skills += 1

    # Average score
    total_resume_skills = len(resume_skills)
    avg_score = total_matched_skills / total_resume_skills if total_resume_skills > 0 else 0.0

    return avg_score, present_skills , len(present_skills)

# -------------------------
# Load JSONs
# -------------------------
def verify_skills():
    # -------------------------
    # Load Resume JSON
    # -------------------------
    resume_path = "resume_got_off.json"
    with open(resume_path, "r", encoding="utf-8") as f:
        resume_data = json.load(f)

    resume_skills = resume_data.get("technical_skills", [])

    # -------------------------
    # Load GitHub Analysis JSON
    # -------------------------
    github_path = "github_analysis.json"
    if not os.path.exists(github_path):
        print("github_analysis.json not found.")
        return

    with open(github_path, "r", encoding="utf-8") as f:
        github_data = json.load(f)

    github_skills = []

    for repo in github_data.get("verified_repos", []):
        github_skills.extend(repo.get("languages", []))

    github_skills = list(set(github_skills))  # unique

    # -------------------------
    # Verify skills
    # -------------------------
    avg_score, present_skills, count_skills = verify_skills_string_match(
        resume_skills,
        github_skills
    )

    # -------------------------
    # Save output JSON
    # -------------------------
    output = {
        "resume_skills": resume_skills,
        "github_skills": github_skills,
        "percentage_score": avg_score * 100,
        "present_skills": present_skills,
        "count_skills": count_skills
    }

    with open("skill_verification.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print("Skill verification complete!")
    print(f"Average Score: {avg_score:.2f}")
    print(f"Percentage: {avg_score * 100:.2f}%")
    print("Saved to skill_verification.json")
