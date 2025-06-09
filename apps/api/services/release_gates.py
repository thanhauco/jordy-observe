from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import models

class ReleaseGateService:
    """
    Compares current experimental metrics against a production baseline.
    Used in CI/CD to determine if a prompt change is safe to deploy.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def evaluate_gate(self, project_id: str, experiment_id: str, metrics: List[str]) -> Dict[str, Any]:
        """
        Check if experiment outperforms the baseline (main branch).
        """
        # 1. Fetch Baseline (last 100 traces from production)
        baseline = self.db.query(
            func.avg(models.Evaluation.score).label("avg_score"),
            func.avg(models.Trace.latency_ms).label("avg_latency")
        ).join(models.Trace).filter(
            models.Trace.project_id == project_id,
            models.Trace.tags.any("production")
        ).first()

        # 2. Fetch Experiment
        experiment = self.db.query(
            func.avg(models.Evaluation.score).label("avg_score"),
            func.avg(models.Trace.latency_ms).label("avg_latency")
        ).join(models.Trace).filter(
            models.Trace.project_id == project_id,
            models.Trace.tags.any(experiment_id)
        ).first()

        # 3. Decision Logic
        score_passed = (experiment.avg_score or 0) >= (baseline.avg_score or 0) * 0.95
        latency_passed = (experiment.avg_latency or 0) <= (baseline.avg_latency or 0) * 1.10

        return {
            "status": "passed" if (score_passed and latency_passed) else "failed",
            "results": {
                "score": {"baseline": baseline.avg_score, "experiment": experiment.avg_score, "passed": score_passed},
                "latency": {"baseline": baseline.avg_latency, "experiment": experiment.avg_latency, "passed": latency_passed}
            },
            "recommendation": "Deploy recommended" if score_passed else "Reject: Performance drop detected"
        }
