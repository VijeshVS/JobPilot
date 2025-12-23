import json
import os
import requests
from resume_parser.skill_tools.skill_utils import TECH_SKILLS_MASTER
from resume_parser.utils import extract_edit_and_clean_json
import fitz

def extract_github_links(pdf_path):
    doc = fitz.open(pdf_path)
    github_links = []

    for page_number in range(len(doc)):
        page = doc[page_number]

        # Extract links
        for link in page.get_links():
            if "uri" in link:
                url = link["uri"]
                if "github.com" in url.lower():
                    github_links.append(url)

    doc.close()

    # Remove duplicates
    github_links = list(set(github_links))

    # Save to JSON
    output = {
        "github_links": github_links,
        "count": len(github_links)
    }

    with open("extracted_github_links.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print("✅ Extracted GitHub links saved to extracted_github_links.json")

    return github_links


def append_json_data(source_file: str, destination_file: str):
    """
    Removes markdown ```json fences from destination file,
    then merges ONLY github_links from source into destination.
    Destination will be a SINGLE JSON object.
    """

    # extract_github_links("C:\\Users\\ajayr\\OneDrive\\Documents\\ML\\LAB\\resume_parser\\resume.pdf")
    
    # ---------- CLEAN DESTINATION FILE (REMOVE ```json FENCES) ----------
    extract_edit_and_clean_json(destination_file)

    # ---------- CHECK SOURCE ----------
    if not os.path.exists(source_file):
        print(f"Source file not found: {source_file}")
        return

    # ---------- LOAD SOURCE ----------
    try:
        with open(source_file, "r", encoding="utf-8") as f:
            source_data = json.load(f)
    except json.JSONDecodeError:
        print("Invalid JSON in source file")
        return

    # ---------- LOAD DESTINATION ----------
    try:
        with open(destination_file, "r", encoding="utf-8") as f:
            dest_data = json.load(f)
    except json.JSONDecodeError:
        print("Destination JSON still invalid after cleanup")
        return

    # ---------- NORMALIZE ----------
    if isinstance(source_data, list):
        source_data = source_data[0]

    if isinstance(dest_data, list):
        dest_data = dest_data[0]

    # ---------- MERGE ONLY github_links ----------
    if "github_links" in source_data:
        dest_data["github_links"] = source_data["github_links"]

    # ---------- WRITE BACK (PURE JSON, NO FENCES) ----------
    with open(destination_file, "w", encoding="utf-8") as f:
        json.dump(dest_data, f, indent=2)

    print("github_links merged successfully")


def _fetch_readme(readme_url: str) -> str:
    try:
        readme_response = requests.get(readme_url)
        readme_response.raise_for_status()
        return readme_response.text
    except requests.exceptions.RequestException as e:
        return f"Error fetching README from {readme_url}: {e}"

def extract_skills_from_readme(readme_text: str, master_skills: list) -> list:
    if not readme_text or readme_text.startswith("Error"):
        return []

    readme_lower = readme_text.lower()
    found = set()

    for skill in master_skills:
        if skill.lower() in readme_lower:
            found.add(skill)

    return list(found)


def process_github_links(resume_got_off_path: str) -> str:
    try:
        # -------------------------------
        # Load resume JSON
        # -------------------------------
        with open(resume_got_off_path, "r", encoding="utf-8") as f:
            resume_data = json.load(f)

        # -------------------------------
        # 1️⃣ Extract GitHub username
        # -------------------------------
        github_username = None

        for link in resume_data.get("links", []):
            if link.get("platform", "").lower() == "github":
                github_username = link.get("username")
                break

        if not github_username:
            github_links = resume_data.get("github_links", [])
            if github_links:
                github_username = github_links[0].split("/")[3]

        if not github_username:
            return "GitHub username not found."

        # -------------------------------
        # 2️⃣ Process repositories
        # -------------------------------
        github_links = resume_data.get("github_links", [])
        verified_repos = []

        for link in github_links:
            parts = link.split("/")
            if len(parts) < 5 or parts[2] != "github.com":
                continue

            owner = parts[3]
            repo_name = parts[4]

            print(f"Processing repo: {repo_name}")

            # Repo details
            repo_api = f"https://api.github.com/repos/{owner}/{repo_name}"
            repo = requests.get(repo_api).json()

            # Languages
            lang_api = f"https://api.github.com/repos/{owner}/{repo_name}/languages"
            languages_json = requests.get(lang_api).json()
            languages = list(languages_json.keys())

            # Commits count
            commits_api = f"https://api.github.com/repos/{owner}/{repo_name}/commits"
            commits_response = requests.get(commits_api).json()
            commit_count = len(commits_response) if isinstance(commits_response, list) else 0

            # README
            readme_url = f"https://raw.githubusercontent.com/{owner}/{repo_name}/main/README.md"
            readme_content = _fetch_readme(readme_url)

            readme_skills = extract_skills_from_readme(
                readme_content,
                TECH_SKILLS_MASTER
            )

            # Merge README skills into languages
            language_set = {lang.lower() for lang in languages}
            for skill in readme_skills:
                if skill.lower() not in language_set:
                    languages.append(skill)

            repo_data = {
                "repo_name": repo_name,
                "owner": owner,
                "languages": languages,
                "forks": repo.get("forks_count", 0),
                "stars": repo.get("stargazers_count", 0),
                "commit_count": commit_count,
                "readme_content": readme_content
            }

            verified_repos.append(repo_data)

        # -------------------------------
        # Final JSON
        # -------------------------------
        final_json = {
            "github_username": github_username,
            "total_repositories": len(verified_repos),
            "verified_repos": verified_repos
        }

        # -------------------------------
        # Save JSON in parent directory
        # -------------------------------
        output_file = "github_analysis.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(final_json, f, indent=2)

        print(f"\n✅ GitHub analysis saved to: {output_file}")

        return json.dumps(final_json, indent=2)

    except requests.exceptions.RequestException as e:
        return f"GitHub API error: {e}"
    except json.JSONDecodeError:
        return f"Invalid JSON in {resume_got_off_path}"
    except FileNotFoundError:
        return f"File not found: {resume_got_off_path}"
