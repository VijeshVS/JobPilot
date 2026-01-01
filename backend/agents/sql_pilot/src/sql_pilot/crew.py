import os
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from .tools.supabase_tools import ExecuteSQLTool, ListTablesTool, GetTableSchemaTool
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource

text_source = TextFileKnowledgeSource(
    file_paths=["tech.txt"]
)

@CrewBase
class SqlAgent():
    """SqlAgent crew"""

    agents: List[BaseAgent]
    tasks: List[Task]
    
    @agent
    def sql_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['sql_expert'], # type:ignore
            verbose=True,
            tools=[
                ExecuteSQLTool(),
                ListTablesTool(),
                GetTableSchemaTool()
            ],
            knowledge_sources=[text_source]
        )
    
    @task
    def sql_query_task(self) -> Task:
        return Task(
            config=self.tasks_config['sql_query_task'], # type:ignore
            output_file="output.txt"
        )

    @crew
    def crew(self) -> Crew:
        """Creates the SqlAgent crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            memory=True,
            verbose=True,
            tracing=True
        )
