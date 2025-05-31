from datetime import datetime, timedelta
from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session
from loguru import logger

from ..models import models
from .notification_service import NotificationService

class AlertEngine:
    """
    Background engine for evaluating alert rules against real-time metrics.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.notification_service = NotificationService()

    async def evaluate_rules(self, project_id: UUID):
        """
        Evaluate all active rules for a specific project.
        """
        active_alerts = self.db.query(models.Alert).filter(
            models.Alert.project_id == project_id,
            models.Alert.is_active == True
        ).all()
        
        for alert in active_alerts:
            value = await self._get_metric_value(alert)
            if value is None:
                continue
                
            if self._check_condition(value, alert.operator, alert.threshold):
                await self._trigger_alert(alert, value)

    async def _get_metric_value(self, alert: models.Alert) -> Optional[float]:
        """
        Query time-series data for the alert metric.
        """
        now = datetime.utcnow()
        start_time = now - timedelta(minutes=alert.window_minutes)
        
        if alert.metric == "latency_p95":
            # Simple average for demo purposes
            result = self.db.query(models.Trace.latency_ms).filter(
                models.Trace.project_id == alert.project_id,
                models.Trace.start_time >= start_time
            ).all()
            if not result: return None
            return float(np.percentile([r[0] for r in result if r[0]], 95))
            
        elif alert.metric == "error_rate":
            total = self.db.query(models.Trace).filter(
                models.Trace.project_id == alert.project_id,
                models.Trace.start_time >= start_time
            ).count()
            if total == 0: return 0.0
            
            errors = self.db.query(models.Trace).filter(
                models.Trace.project_id == alert.project_id,
                models.Trace.start_time >= start_time,
                models.Trace.status == "failed"
            ).count()
            return (errors / total) * 100
            
        return None

    def _check_condition(self, value: float, operator: str, threshold: float) -> bool:
        if operator == "gt": return value > threshold
        if operator == "lt": return value < threshold
        if operator == "gte": return value >= threshold
        if operator == "lte": return value <= threshold
        if operator == "eq": return value == threshold
        return False

    async def _trigger_alert(self, alert: models.Alert, value: float):
        """
        Record alert history and send notifications.
        """
        logger.warning(f"Alert Triggered: {alert.name} (Value: {value})")
        
        # Prevent spam (15 min cooldown)
        if alert.last_triggered_at and (datetime.utcnow() - alert.last_triggered_at).total_seconds() < 900:
            return

        history = models.AlertHistory(
            alert_id=alert.id,
            triggered_value=value,
            message=f"Metric {alert.metric} reached {value}, threshold was {alert.threshold}"
        )
        self.db.add(history)
        
        alert.last_triggered_at = datetime.utcnow()
        self.db.add(alert)
        self.db.commit()
        
        # Send Notifications
        for channel in alert.notification_channels:
            await self.notification_service.send(channel, history.message)
