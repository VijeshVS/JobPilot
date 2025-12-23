from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from resume_parser.tools.Pdf_tool import PDFReaderTool

def verify_resume():
        """Verify the resume"""
        tool=PDFReaderTool()
        return tool

@CrewBase
class ResumeParser():
    """ResumeParser crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def link_extractor(self) -> Agent:
        return Agent(
            config=self.agents_config['link_extractor'],
            verbose=True,
        )

    @task
    def link_extraction_task(self) -> Task:
        return Task(
            config=self.tasks_config['link_extraction_task'], # type: ignore[index]
            tools=[verify_resume()],
        )

    
    @crew
    def crew(self) -> Crew:
        """Creates the VerificationAgent crew"""
        link_extraction_task_instance = self.link_extraction_task()

        return Crew(
            agents=self.agents,
            tasks=[link_extraction_task_instance],
            process=Process.sequential,
            verbose=True,
        )
    
