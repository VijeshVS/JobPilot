from resume_parser.db.client import supabase
from resume_parser.db.tables import CANDIDATE_LINKS


def insert_candidate_link(candidate_id: str, platform: str, link: str):
    """
    Insert a single candidate link
    """
    return supabase.table(CANDIDATE_LINKS).insert({
        "candidate_id": candidate_id,
        "platform": platform,
        "link": link
    }).execute()


def insert_links_for_candidate(candidate_id: str, links_list):
    """
    Insert multiple links for a candidate.

    links_list format:
    [
        {"platform": "Github", "username": "ajayrm04"},
        {"platform": "LinkedIn", "username": "ajay-reddy"}
    ]
    """
    if not links_list:
        return 0

    count = 0
    for item in links_list:
        try:
            insert_candidate_link(
                candidate_id=candidate_id,
                platform=item.get("platform"),
                link=item.get("username")  # storing username in 'link' column
            )
            count += 1
        except Exception as e:
            print(
                f"Failed to insert link {item} for candidate {candidate_id}: {e}"
            )

    return count
