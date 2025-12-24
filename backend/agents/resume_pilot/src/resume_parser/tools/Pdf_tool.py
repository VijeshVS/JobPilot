from crewai.tools import BaseTool
from typing import Type, List
from pydantic import BaseModel, Field
import PyPDF2
import fitz  # PyMuPDF
import json
import os


# -------------------------------
# Input Schema
# -------------------------------
class PDFReaderToolInput(BaseModel):
    file_path: str = Field(
        ...,
        description="Absolute path to the PDF file to read."
    )


# -------------------------------
# Tool
# -------------------------------
class PDFReaderTool(BaseTool):
    name: str = "pdf_reader_github_extractor"
    description: str = (
        "Reads PDF text, extracts GitHub links, and saves the result into a JSON file."
    )
    args_schema: Type[BaseModel] = PDFReaderToolInput

    def _run(self, file_path: str) -> dict:

        if not os.path.exists(file_path):
            return {"error": f"File not found: {file_path}"}

        # ---------------------------
        # 1. Extract text from PDF
        # ---------------------------
        pdf_text = ""
        try:
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        pdf_text += text + "\n"
        except Exception as e:
            return {"error": f"Error reading PDF text: {e}"}

        # ---------------------------
        # 2. Extract GitHub links
        # ---------------------------
        github_links: List[str] = []
        try:
            doc = fitz.open(file_path)
            for page in doc:
                for link in page.get_links():
                    if "uri" in link:
                        url = link["uri"]
                        if "github.com" in url.lower():
                            github_links.append(url)
            doc.close()
        except Exception as e:
            return {"error": f"Error extracting GitHub links: {e}"}

        github_links = list(set(github_links))  # dedupe

        # ---------------------------
        # 3. Save to JSON
        # ---------------------------
        result = {
            "file_path": file_path,
            "pdf_text": pdf_text.strip(),
            "github_links": github_links,
            "github_links_count": len(github_links)
        }

        output_json = "extracted_pdf_data.json"
        try:
            with open(output_json, "w", encoding="utf-8") as jf:
                json.dump(result, jf, indent=4, ensure_ascii=False)
        except Exception as e:
            return {"error": f"Failed to save JSON: {e}"}

        return result


# -------------------------------
# Standalone Execution
# -------------------------------
# if __name__ == "__main__":
#     pdf_path = r""

#     tool = PDFReaderTool()
#     output = tool.run(file_path=pdf_path)

#     print("\n--- Extracted PDF Data ---")
#     print(json.dumps(output, indent=4))
