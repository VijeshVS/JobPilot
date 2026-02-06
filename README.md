# 🚀 JobPilot

**AI-Powered Candidate Search & Resume Intelligence Platform**

---

## 📌 Introduction

JobPilot is an intelligent recruitment platform that helps recruiters find relevant candidates using natural language queries instead of rigid filters and keyword-based searches. It uses agentic AI workflows to convert unstructured resume data into structured candidate profiles and enables semantic candidate discovery.

Candidates can upload their resumes, which are parsed to extract skills, education, and experience. These extracted skills are cross-validated using public GitHub data to improve skill authenticity. Recruiters can then search the candidate pool using plain English prompts, and JobPilot automatically translates these queries into executable database searches.

---

## ❌ Problem

The current hiring process is inefficient and inaccurate due to limitations in traditional ATS platforms:

* Recruiters manually screen large volumes of resumes, making hiring slow and error-prone.
* Existing ATS systems rely on raw keyword matching and rigid filters.
* Semantically similar skills are missed due to exact-word filtering.
* Good candidates are filtered out due to resume wording rather than actual capability.
* Resumes are unstructured and inconsistent, making reliable data extraction difficult.
* Recruiters are forced to think in database filters instead of natural language.
* Skill claims on resumes are not validated against real-world evidence (e.g., GitHub).
* Candidate discovery is fragmented across resumes, ATS tools, and external platforms.

---

## ✅ Solution

JobPilot addresses these limitations by combining semantic search with agentic AI workflows:

* Enables recruiters to search candidates using natural language prompts.
* Converts semantic intent into structured SQL queries automatically.
* Parses resumes to extract structured candidate information.
* Normalizes different wordings of the same skill into a common representation.
* Cross-verifies resume skills with public GitHub activity to improve authenticity.
* Unifies resume parsing, skill validation, and candidate search into a single platform.
* Reduces false positives and false negatives in candidate shortlisting.
* Speeds up hiring by automating candidate discovery and screening.

---

## 🛠 Technologies Used

**Frontend**

* React
* Vite
* TypeScript
* Tailwind CSS

**Backend**

* Node.js
* Express

**AI / NLP**

* Large Language Models (LLMs) for:

  * Natural language query understanding
  * Resume parsing
  * Skill extraction
  * Semantic SQL generation
* CrewAI for agentic workflow orchestration

**Database**

* Postgres (Supabase)

**External Signals**

* GitHub public profile & repository analysis for skill verification