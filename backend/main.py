from fastapi import FastAPI, HTTPException, Request ,UploadFile,File
from fastapi.responses import StreamingResponse,JSONResponse
from pydantic import BaseModel
import subprocess
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import asyncio
import json
import time
from pathlib import Path
import shutil
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime
from typing import Optional

load_dotenv()
app = FastAPI()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

clients: List[asyncio.Queue] = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


AGENTS_DIR = os.path.abspath("./agents")

SQL_BASE_DIR = os.path.join(AGENTS_DIR, "sql_pilot")
SQL_INPUT_FILE = os.path.join(SQL_BASE_DIR, "input.txt")
SQL_OUTPUT_FILE = os.path.join(SQL_BASE_DIR, "output.txt")

RESUME_BASE_DIR = os.path.join(AGENTS_DIR, "resume_pilot")


class CompleteRequest(BaseModel):
    input: str

class CandidateByUSNRequest(BaseModel):
    usn: str

class InterviewData(BaseModel):
    title: str
    role: str
    ctc: Optional[str] = None
    interview_date: Optional[datetime] = None
    mode: str = "online"  # 'online' or 'offline'
    notes: Optional[str] = None

class ShortlistData(BaseModel):
    interview: InterviewData
    candidate_ids: List[int]  # candidate_id from your candidates table
    
@app.post("/complete")
def complete(req: CompleteRequest):
    try:
        with open(SQL_INPUT_FILE, "w") as f:
            f.write(req.input)
    except Exception as e:
        raise HTTPException(500, f"Failed to write input.txt: {e}")

    try:
        print(f"🚀 Running SQL agent with prompt: {req.input}")
        subprocess.run(
            ["crewai", "run"],
            cwd=SQL_BASE_DIR,
            check=True,
            # capture_output=True,
            text=True,
            timeout=300
        )
    except subprocess.CalledProcessError as e:
        raise HTTPException(500, f"CrewAI failed: {e.stderr}")
    except subprocess.TimeoutExpired:
        raise HTTPException(504, "CrewAI execution timed out")

    if not os.path.exists(SQL_OUTPUT_FILE):
        raise HTTPException(500, "output.txt not found")

    with open(SQL_OUTPUT_FILE, "r") as f:
        return {"result": f.read()}


@app.get("/events")
async def events(request: Request):
    queue = asyncio.Queue()
    clients.append(queue)

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    print("❌ Client disconnected")
                    break

                event = await queue.get()

                payload = f"data: {json.dumps(event)}\n\n"

                # ✅ LOG EXACTLY WHEN YOU SEND
                print(f"📤 [{time.strftime('%H:%M:%S')}] Sent event → {event}", flush=True)

                yield payload

        finally:
            clients.remove(queue)
            print("🧹 Client queue removed", flush=True)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

@app.post("/emit")
async def emit(event: dict):
    for queue in clients:
        await queue.put(event)

    return {"status": "ok"}

# frontend -> backend, resume.pdf 

BASE_DIR = Path(__file__).resolve().parent  # directory of this python file

RESUME_SAVE_PATH = BASE_DIR / "agents" / "resume_pilot" / "resume.pdf"

RESUME_BASE_DIR = RESUME_SAVE_PATH.parent

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    try:
        # 1️⃣ Ensure directory exists
        RESUME_BASE_DIR.mkdir(parents=True, exist_ok=True)

        # 2️⃣ Save resume as resume.pdf
        with open(RESUME_SAVE_PATH, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 3️⃣ Run CrewAI
        subprocess.run(
            ["crewai", "run"],
            cwd=RESUME_BASE_DIR,
            check=True,
            text=True,
            timeout=120
        )

        # 4️⃣ Load skill_verification.json
        skill_json_path = RESUME_BASE_DIR / "skill_verification.json"

        if not skill_json_path.exists():
            raise HTTPException(
                status_code=500,
                detail="skill_verification.json not found"
            )

        with open(skill_json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # 5️⃣ Extract ONLY required fields
        response = {
            "present_skills": data.get("present_skills", []),
            "percentage_score": data.get("percentage_score", 0),
            "count_skills": data.get("count_skills", 0)
        }

        return JSONResponse(content=response)

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="CrewAI execution timed out")

    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"CrewAI failed: {e}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/candidates/by-usn")
def get_candidate_by_usn(req: CandidateByUSNRequest):
    response = (
        supabase
        .from_("candidates")
        .select("""
            candidate_id,
            name,
            email,
            usn,
            phone,
            gender,
            cgpa,
            field_of_study,
            years_of_experience,
            resume_score,
            no_of_skills,
            created_at,
            updated_at,
            candidate_skills (
                skill_name
            )
        """)
        .eq("usn", req.usn)
        .single()
        .execute()
    )

    return response.data

@app.post("/interviews/shortlist")
def create_interview_and_shortlist(req: ShortlistData):
    # 1️⃣ Insert interview
    interview_payload = {
        "title": req.interview.title,
        "role": req.interview.role,
        "ctc": req.interview.ctc,
        "interview_date": req.interview.interview_date.isoformat() if req.interview.interview_date else None,
        "mode": req.interview.mode,
        "notes": req.interview.notes
    }

    # Insert interview
    insert_resp = supabase.from_("interviews").insert(interview_payload).execute()

    # # ✅ Check for errors using status_code
    # if insert_resp.status_code != 201:
    #     raise HTTPException(status_code=500, detail=f"Failed to create interview: {insert_resp.data}")

    # The inserted row's ID is in data[0]
    interview_id = insert_resp.data[0]["interview_id"]

    # 2️⃣ Insert shortlist entries
    shortlist_rows = [
        {"candidate_id": cid, "interview_id": interview_id} for cid in req.candidate_ids
    ]

    shortlist_resp = supabase.from_("shortlists").insert(shortlist_rows).execute()

    # if shortlist_resp.status_code != 201:
    #     raise HTTPException(status_code=500, detail=f"Failed to create shortlists: {shortlist_resp.data}")

    return {
        "status": "success",
        "interview_id": interview_id,
        "shortlisted_count": len(shortlist_rows)
    }
