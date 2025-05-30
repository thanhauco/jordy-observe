import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from loguru import logger

from ..models import models
from ..evaluators.builtins import HallucinationEvaluator, RelevanceEvaluator
from ..evaluators.base import BaseEvaluator

class EvaluationService:
    """
    Orchestrates the running of evaluators on traces and spans.
    Supports plural evaluators per object and background processing.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.evaluators = {
            "hallucination": HallucinationEvaluator(),
            "relevance": RelevanceEvaluator()
        }

    async def run_evaluations_for_trace(self, trace_id: uuid.UUID):
        """
        Runs configured evaluators for a complete trace and its child spans.
        """
        trace = self.db.query(models.Trace).filter(models.Trace.id == trace_id).first()
        if not trace:
            logger.error(f"Trace {trace_id} not found for evaluation")
            return

        # 1. Evaluate child spans (LLM calls)
        spans = self.db.query(models.Span).filter(
            models.Span.trace_id == trace_id,
            models.Span.span_type == "llm"
        ).all()

        for span in spans:
            # Run Relevance Evaluator for every LLM span
            await self._execute_and_store(
                evaluator_name="relevance",
                input_data=span.input,
                output_data=span.output,
                trace_id=trace_id,
                span_id=span.id
            )

            # Run Hallucination Evaluator if context is available in attributes
            if span.attributes and "context" in span.attributes:
                await self._execute_and_store(
                    evaluator_name="hallucination",
                    input_data=span.input,
                    output_data=span.output,
                    context=span.attributes["context"],
                    trace_id=trace_id,
                    span_id=span.id
                )

        # 2. Trace-level evaluations (Overall performance)
        await self._execute_and_store(
            evaluator_name="relevance",
            input_data=trace.input,
            output_data=trace.output,
            trace_id=trace_id
        )

        self.db.commit()

    async def _execute_and_store(
        self, 
        evaluator_name: str, 
        input_data: any, 
        output_data: any, 
        context: Optional[any] = None,
        trace_id: Optional[uuid.UUID] = None,
        span_id: Optional[uuid.UUID] = None
    ):
        evaluator = self.evaluators.get(evaluator_name)
        if not evaluator:
            return

        try:
            result = await evaluator.evaluate(input_data, output_data, context)
            
            db_eval = models.Evaluation(
                id=uuid.uuid4(),
                trace_id=trace_id,
                span_id=span_id,
                evaluator_type=evaluator_name,
                score=result.score,
                label=result.label,
                explanation=result.explanation,
                metadata=result.metadata
            )
            self.db.add(db_eval)
        except Exception as e:
            logger.error(f"Evaluator {evaluator_name} failed: {e}")
