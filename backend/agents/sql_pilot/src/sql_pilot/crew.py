import os
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from .tools.supabase_tools import ExecuteSQLTool, ListTablesTool, GetTableSchemaTool
from pydantic import BaseModel, Field
from crewai.knowledge.source.json_knowledge_source import JSONKnowledgeSource
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource

json_source = JSONKnowledgeSource(
    file_paths=["technology.json"]
)

text_source = TextFileKnowledgeSource(
    file_paths=["tech.txt"]
)

class Candidate(BaseModel):
    """Candidate model"""
    name: str = Field(
        ..., max_length=100, description="Full name of the candidate"
    )
    email: str = Field(
        ..., description="Unique email address of the candidate"
    )
    usn: str = Field(
        None, max_length=20, description="University Seat Number"
    )
    phone: str = Field(
        None, max_length=20, description="Phone number of the candidate"
    )
    gender: str = Field(
        None, max_length=10, description="Gender of the candidate"
    )
    cgpa: str = Field(
        None, description="CGPA of the candidate"
    )
    field_of_study: str = Field(
        None, max_length=100, description="Field of study"
    )
    years_of_experience: str = Field(
        None, ge=0, description="Years of professional experience"
    )
    created_at: str = Field(
        None, description="Timestamp when the record was created"
    )
    updated_at: str = Field(
        None, description="Timestamp when the record was last updated"
    )

class CandidateList(BaseModel):
    candidates: List[Candidate]

@CrewBase
class SqlAgent():
    """SqlAgent crew"""

    agents: List[BaseAgent]
    tasks: List[Task]
    
    @agent
    def sql_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['sql_expert'],
            verbose=True,
            tools=[
                ExecuteSQLTool(),
                ListTablesTool(),
                GetTableSchemaTool()
            ],
            # knowledge_sources=[text_source]
        )
    
    @task
    def sql_query_task(self) -> Task:
        return Task(
            config=self.tasks_config['sql_query_task'],
            output_file="output.txt",
            output_json=CandidateList
        )

    @crew
    def crew(self) -> Crew:
        """Creates the SqlAgent crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            # memory=True,
            verbose=True,
            tracing=True
        )
