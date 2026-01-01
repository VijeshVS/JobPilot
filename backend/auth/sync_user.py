def sync_user(auth_user):
    supabase.table("users").upsert({
        "id": auth_user["id"],
        "email": auth_user["email"],
        "role": auth_user["user_metadata"]["role"]
    }).execute()
