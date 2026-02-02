from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import json
import re
from supabase import create_client, Client
import os

url: str = os.environ.get("SUPABASE_URL") # type:ignore
key: str = os.environ.get("SUPABASE_KEY") # type:ignore
supabase: Client = create_client(url, key)

def normalize_sql(query: str) -> str:
    if not query:
        return ""

    q = query
    q = q.replace("\\n", " ")
    q = re.sub(r"[│─┌┐└┘├┤┬┴┼]", " ", q)
    q = q.replace("\\", " ")
    q = q.rstrip().rstrip(";")
    q = re.sub(r"\s+", " ", q)

    return q.strip()

class ExecuteSQLInput(BaseModel):
    query_string: str = Field(
        ...,
        description="Raw SQL query string to be executed on Supabase"
    )

class ExecuteSQLTool(BaseTool):
    name: str = "execute_sql"
    description: str = (
        "Executes a raw SQL query on Supabase using an RPC function and returns the result"
    )
    args_schema: Type[BaseModel] = ExecuteSQLInput

    def _run(self, query_string: str) -> str:
        try:
            cleaned_query = normalize_sql(query_string)
            response = (
                supabase
                .rpc("execute_sql", {"query": cleaned_query})
                .execute()
            )

            return json.dumps(response.data)

        except Exception as e:
            return f"SQL execution failed: {str(e)}"

table_to_schema_mapping = {
    "candidates": """
    create table public.candidates (
        candidate_id serial not null,
        name character varying(100) not null,
        email character varying(120) not null,
        usn character varying(20) null,
        phone character varying(20) null,
        gender character varying(10) null,
        cgpa numeric(3, 2) null,
        field_of_study character varying(100) null,
        years_of_experience integer null,
        created_at timestamp without time zone null default CURRENT_TIMESTAMP,
        updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
        constraint candidates_pkey primary key (candidate_id),
        constraint candidates_email_key unique (email)
    )   
    TABLESPACE pg_default;
    """,
    "candidate_skills": """
    create table public.candidate_skills (
        skill_id serial not null,
        candidate_id integer not null,
        skill_name character varying(100) not null,
        constraint candidate_skills_pkey primary key (skill_id),
        constraint candidate_skills_candidate_id_fkey foreign KEY (candidate_id) references candidates (candidate_id) on delete CASCADE
    ) 
    TABLESPACE pg_default;
    """,
    "candidate_links": """
    create table public.candidate_links (
        link_id serial not null,
        candidate_id integer not null,
        link_type character varying(50) not null,
        link_url character varying(500) not null,
        constraint candidate_links_pkey primary key (link_id),
        constraint candidate_links_candidate_id_fkey foreign KEY (candidate_id) references candidates (candidate_id) on delete CASCADE
    ) 
    TABLESPACE pg_default;
    """,
    "candidate_experience": """
    create table public.candidate_skills (
        skill_id serial not null,
        candidate_id integer not null,
        skill_name character varying(100) not null,
        constraint candidate_skills_pkey primary key (skill_id),
        constraint candidate_skills_candidate_id_fkey foreign KEY (candidate_id) references candidates (candidate_id) on delete CASCADE
    ) 
    TABLESPACE pg_default;
    """
}

class GetTableSchemaArgument(BaseModel):
    table_name: str = Field(
        ...,
        description="Name of the table whose column schema should be retrieved"
    )

class GetTableSchemaTool(BaseTool):
    name: str = "get_table_schema"
    description: str = (
        "Gets the schema of the table"
    )
    args_schema: Type[BaseModel] = GetTableSchemaArgument

    def _run(self, table_name: str) -> str:
        return table_to_schema_mapping[table_name]

class ListTablesTool(BaseTool):
    name: str = "list_tables"
    description: str = (
        "Returns a list of all tables in the Supabase database"
    )

    def _run(self) -> str:
        return """Tables present in the database:
        - candidates (Description: Contains candidate information)
        - candidate_skills (Description: Maps candidates to their skills)
        - candidate_links (Description: Contains links to candidates’ portfolios and profiles)
        - candidate_experience (Description: Contains details about candidates’ work experience)
        """