from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    
    allow_credentials=True,
    allow_methods=["*"],        
    allow_headers=["*"],       
)

BASE_DIR = os.path.abspath("./agents/sql_pilot")
INPUT_FILE = os.path.join(BASE_DIR, "input.txt")
OUTPUT_FILE = os.path.join(BASE_DIR, "output.txt")

class CompleteRequest(BaseModel):
    input: str


@app.post("/complete")
def complete(req: CompleteRequest):
    try:
        with open(INPUT_FILE, "w") as f:
            f.write(req.input)
    except Exception as e:
        raise HTTPException(500, f"Failed to write input.txt: {e}")

    try:
        print(f"Intiated the agentic task with the prompt {req.input}")
        subprocess.run(
            ["crewai", "run"],
            cwd=BASE_DIR,
            check=True,
            capture_output=True,
            text=True,
            timeout=120      
        )
    except subprocess.CalledProcessError as e:
        raise HTTPException(500, f"CrewAI failed: {e.stderr}")
    except subprocess.TimeoutExpired:
        raise HTTPException(504, "CrewAI execution timed out")

    if not os.path.exists(OUTPUT_FILE):
        raise HTTPException(500, "output.txt not found")

    with open(OUTPUT_FILE, "r") as f:
        return {"result": f.read()}
