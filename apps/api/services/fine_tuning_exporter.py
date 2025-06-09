import json
from typing import List, Optional
from sqlalchemy.orm import Session
from ..models import models

class FineTuningExporter:
    """
    Exports high-quality traces to JSONL format for model fine-tuning.
    Filters traces based on evaluation scores and 'golden' flags.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def export_dataset(self, project_id: str, min_score: float = 0.9) -> List[str]:
        """
        Gathers high-relevance traces and formats them for OpenAI/Llama fine-tuning.
        """
        # 1. Fetch traces with high evaluations
        top_traces = self.db.query(models.Trace).join(models.Evaluation).filter(
            models.Trace.project_id == project_id,
            models.Evaluation.score >= min_score
        ).limit(1000).all()

        formatted_lines = []
        for trace in top_traces:
            # 2. Convert to ChatML format
            chat_format = {
                "messages": [
                    {"role": "user", "content": str(trace.input)},
                    {"role": "assistant", "content": str(trace.output)}
                ]
            }
            formatted_lines.append(json.dumps(chat_format))
            
        return formatted_lines

    def save_to_file(self, formatted_lines: List[str], filename: str):
        with open(filename, "w") as f:
            for line in formatted_lines:
                f.write(line + "\n")
