#!/usr/bin/env python
import warnings
from sql_pilot.crew import SqlAgent
from pathlib import Path
from sql_pilot.listeners import MyCustomListener
from sql_pilot.tools.supabase_tools import supabase
import re
import json

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")
ROOT_DIR = Path(__file__).resolve().parents[2]  # project root
INPUT_FILE = ROOT_DIR / "input.txt"
OUTPUT_FILE = ROOT_DIR / "output.txt"
QUERY_FILE = ROOT_DIR / "query.txt"

my_listener = MyCustomListener()

def execute_sql_without_limit(input_path: str, output_path: str, supabase):

    with open(input_path, "r") as f:
        query = f.read().strip()

    cleaned_query = re.sub(
        r"\s+LIMIT\s+\d+(\s*,\s*\d+)?;?",
        "",
        query,
        flags=re.IGNORECASE
    )

    cleaned_query = cleaned_query.strip()
    cleaned_query = cleaned_query.rstrip(";") + ";"

    print(f"Query: {cleaned_query}")

    response = (
        supabase
        .rpc("execute_sql", {"query": cleaned_query})
        .execute()
    )

    with open(output_path, "w") as f:
        f.write(json.dumps(response.data, indent=2))

    with open(QUERY_FILE, "w") as f:
        f.write(cleaned_query)
    
    print("Executed the sql query successfully !!")


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
            execute_sql_without_limit(str(OUTPUT_FILE),str(OUTPUT_FILE),supabase)
        except Exception as e:
            raise Exception(f"An error occurred while running the crew: {e}")
    