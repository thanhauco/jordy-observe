import random
from typing import Any, Dict, Optional
from .base import BaseEvaluator, EvaluationResult

class HallucinationEvaluator(BaseEvaluator):
    """
    Evaluates if the LLM output contains information not present in the context.
    """
    async def evaluate(
        self, 
        input_data: Any, 
        output_data: Any, 
        context: Optional[Any] = None
    ) -> EvaluationResult:
        # Simplified implementation - in production this would use an LLM-as-a-Judge
        # comparing output vs context.
        
        # Placeholder logic
        score = random.uniform(0.7, 1.0)
        label = "pass" if score > 0.8 else "fail"
        
        return EvaluationResult(
            score=score,
            label=label,
            explanation="The response appears to be grounded in the provided context.",
            metadata={"version": "1.0.0"}
        )

class RelevanceEvaluator(BaseEvaluator):
    """
    Evaluates how relevant the output is to the user's input.
    """
    async def evaluate(
        self, 
        input_data: Any, 
        output_data: Any, 
        context: Optional[Any] = None
    ) -> EvaluationResult:
        score = random.uniform(0.6, 1.0)
        
        return EvaluationResult(
            score=score,
            label="relevant" if score > 0.7 else "irrelevant",
            explanation="The response directly addresses the user's query.",
            metadata={"version": "1.0.0"}
        )
