from datetime import datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..models import models

class AnalyticsService:
    """
    High-performance analytics service for dashboard metrics.
    Aggregates data across projects and time windows.
    """
    
    @staticmethod
    def get_project_summary(db: Session, project_id: Any, days: int = 7) -> Dict[str, Any]:
        since = datetime.utcnow() - timedelta(days=days)
        
        # 1. Volume and Basic Stats
        stats = db.query(
            func.count(models.Trace.id).label("total_traces"),
            func.avg(models.Trace.latency_ms).label("avg_latency"),
            func.sum(models.Trace.total_cost_usd).label("total_cost"),
            func.sum(models.Trace.total_tokens).label("total_tokens")
        ).filter(
            models.Trace.project_id == project_id,
            models.Trace.start_time >= since
        ).first()

        # 2. Daily Volume
        daily_stats = db.query(
            func.date_trunc('day', models.Trace.start_time).label("day"),
            func.count(models.Trace.id).label("count")
        ).filter(
            models.Trace.project_id == project_id,
            models.Trace.start_time >= since
        ).group_by("day").order_by("day").all()

        # 3. Model Distribution
        model_dist = db.query(
            models.Span.model,
            func.count(models.Span.id).label("count")
        ).join(models.Trace).filter(
            models.Trace.project_id == project_id,
            models.Span.span_type == "llm"
        ).group_by(models.Span.model).all()

        return {
            "summary": {
                "total_traces": stats.total_traces or 0,
                "avg_latency": float(stats.avg_latency or 0),
                "total_cost": float(stats.total_cost or 0),
                "total_tokens": int(stats.total_tokens or 0)
            },
            "timeline": [{"day": str(s.day.date()), "count": s.count} for s in daily_stats],
            "models": [{"model": s.model, "count": s.count} for s in model_dist if s.model]
        }
