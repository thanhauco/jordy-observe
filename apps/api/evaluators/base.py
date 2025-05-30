from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel

class EvaluationResult(BaseModel):
    score: float
    label: Optional[str] = None
    explanation: Optional[str] = None
    metadata: Dict[str, Any] = {}

class BaseEvaluator(ABC):
    @abstractmethod
    async def evaluate(
        self, 
        input_data: Any, 
        output_data: Any, 
        context: Optional[Any] = None
    ) -> EvaluationResult:
        """
        Evaluate the quality of an LLM output given its input and context.
        Returns a score between 0.0 and 1.0.
        """
        pass
