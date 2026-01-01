#!/usr/bin/env python
import warnings
from sql_pilot.crew import SqlAgent
warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")
from pathlib import Path
from listeners import MyCustomListener

ROOT_DIR = Path(__file__).resolve().parents[2]  # project root
INPUT_FILE = ROOT_DIR / "input.txt"

my_listener = MyCustomListener()

def run():
    """
    Run the crew
    """

    with open(INPUT_FILE, "r") as f:
        user_query = f.read().strip()
        inputs = {
        'user_query': user_query,
        }
        try:
            crew = SqlAgent().crew()
            # crew.reset_memories(command_type='short')     # Short-term memory
            # crew.reset_memories(command_type='long')      # Long-term memory
            # crew.reset_memories(command_type='entity')    # Entity memory
            crew.kickoff(inputs=inputs)
        except Exception as e:
            raise Exception(f"An error occurred while running the crew: {e}")
    