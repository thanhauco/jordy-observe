import uuid
from datetime import datetime, timedelta
import secrets
from sqlalchemy.orm import Session
from apps.api.core.database import SessionLocal, engine
from apps.api.models import models

def seed_data():
    db = SessionLocal()
    
    try:
        # 1. Create Organization
        org = models.Organization(
            id=uuid.uuid4(),
            name="Acme AI Corp",
            slug="acme-ai",
            plan="pro"
        )
        db.add(org)
        
        # 2. Create User
        user = models.User(
            id=uuid.uuid4(),
            email="admin@acmeai.com",
            hashed_password="hashed_password_placeholder",
            full_name="Thanh Vu",
            role="admin",
            organization_id=org.id
        )
        db.add(user)
        
        # 3. Create Project
        project = models.Project(
            id=uuid.uuid4(),
            name="Legal Assistant Agent",
            slug="legal-assistant",
            api_key=f"jo_{secrets.token_urlsafe(32)}",
            organization_id=org.id,
            auto_evaluation_enabled=True
        )
        db.add(project)
        
        # 4. Create Trace & Spans
        trace_id = uuid.uuid4()
        trace = models.Trace(
            id=trace_id,
            project_id=project.id,
            name="Contract Summary Request",
            status=models.TraceStatus.COMPLETED,
            start_time=datetime.utcnow() - timedelta(minutes=10),
            end_time=datetime.utcnow() - timedelta(minutes=9),
            input={"query": "Summarize Section 4.5 of the MSA"},
            output={"summary": "Section 4.5 requires monthly audit reports."},
            latency_ms=1200.0,
            total_tokens=450,
            total_cost_usd=0.0009
        )
        db.add(trace)
        
        span_id = uuid.uuid4()
        span = models.Span(
            id=span_id,
            trace_id=trace_id,
            name="GPT-4 Summarization",
            span_type=models.SpanType.LLM,
            start_time=trace.start_time + timedelta(milliseconds=100),
            end_time=trace.end_time - timedelta(milliseconds=100),
            latency_ms=1000.0,
            model="gpt-4",
            prompt_tokens=300,
            completion_tokens=150,
            total_tokens=450,
            cost_usd=0.0009
        )
        db.add(span)
        
        # 5. Create Evaluation
        evaluation = models.Evaluation(
            id=uuid.uuid4(),
            trace_id=trace_id,
            span_id=span_id,
            evaluator_type="relevance",
            score=0.95,
            label="pass",
            explanation="The summary accurately covers the requested section."
        )
        db.add(evaluation)
        
        # 6. Create Alert
        alert = models.Alert(
            id=uuid.uuid4(),
            project_id=project.id,
            name="High Latency Alert",
            metric="latency_p95",
            operator="gt",
            threshold=2000.0,
            window_minutes=5,
            severity=models.AlertSeverity.WARNING,
            notification_channels=[{"type": "slack", "webhook_url": "https://hooks.slack.com/..."}]
        )
        db.add(alert)
        
        db.commit()
        print("Database successfully seeded with realistic sample data!")
        print(f"Project API Key: {project.api_key}")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
