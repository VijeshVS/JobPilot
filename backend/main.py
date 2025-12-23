from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import subprocess
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import asyncio
import json
import time

app = FastAPI()
clients: List[asyncio.Queue] = []

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