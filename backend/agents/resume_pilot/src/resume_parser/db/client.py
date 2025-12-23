from supabase import create_client
from resume_parser.config.settings import settings

supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY
)
