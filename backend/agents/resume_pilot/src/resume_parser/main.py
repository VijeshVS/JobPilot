#!/usr/bin/env python
import sys
from resume_parser.github_tools.github_append import append_json_data ,process_github_links
from resume_parser.skill_tools.skill_utils import TECH_SKILLS_MASTER
from resume_parser.verification_tools.verify_skills_tool import verify_skills
from resume_parser.db.db_main import insert_candidate_and_skills
import os
import warnings
from datetime import datetime
from pathlib import Path
from resume_parser.crew import ResumeParser
import logging

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")
BASE_DIR = Path(__file__).resolve().parents[2]

logging.getLogger("crewai.telemetry").setLevel(logging.CRITICAL)

# Silence OpenTelemetry exporter logs
logging.getLogger("opentelemetry").setLevel(logging.CRITICAL)

# Silence urllib3 retry/timeout logs
logging.getLogger("urllib3").setLevel(logging.CRITICAL)

def run():
    """
    Run the crew.
    """
    inputs = {
    }
    
    extracted_pdf = BASE_DIR / "extracted_pdf_data.json"
    skill_json = BASE_DIR / "skill_verification.json"
    resume_json = BASE_DIR / "resume_got_off.json"

    try:

        print("Step 1: Kickoff agent...")
        ResumeParser().crew().kickoff(inputs=inputs)

        print("Step 2: Appending JSON...")
        append_json_data(extracted_pdf, resume_json)

        print("Step 3: Processing GitHub links...")
        process_github_links(resume_json)

        print("Step 4: Verifying skills...")
        verify_skills()

        print("Step 5: Inserting candidate and skills...")
        result = insert_candidate_and_skills(resume_json, skill_json)
        print("Inserted candidate:", result)

    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
      
    }
    try:
        ResumeParser().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        ResumeParser().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
    }
    
    try:
        pass
    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

# test()