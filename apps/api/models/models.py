"""
Jordy Observe - Core SQLAlchemy Models

This module defines the complete database schema for the AI observability platform,
including multi-tenant projects, distributed traces, LLM evaluations, datasets,
prompts, and alerting.
"""

import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    Column, String, DateTime, ForeignKey, Float, JSON, Text, 
    Boolean, Integer, Enum, Index, UniqueConstraint, event
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.hybrid import hybrid_property
import enum

from ..core.database import Base


# ============================================================================
# ENUMS
# ============================================================================

class TraceStatus(str, enum.Enum):
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    TIMEOUT = "timeout"


class SpanType(str, enum.Enum):
    LLM = "llm"
    RETRIEVAL = "retrieval"
    TOOL = "tool"
    AGENT = "agent"
    CHAIN = "chain"
    EMBEDDING = "embedding"
    RERANK = "rerank"
    CUSTOM = "custom"


class EvaluatorType(str, enum.Enum):
    HALLUCINATION = "hallucination"
    RELEVANCE = "relevance"
    TOXICITY = "toxicity"
    QA_CORRECTNESS = "qa_correctness"
    SUMMARIZATION = "summarization"
    CODE_QUALITY = "code_quality"
    SQL_CORRECTNESS = "sql_correctness"
    LLM_JUDGE = "llm_judge"
    CUSTOM = "custom"


class AlertSeverity(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class AlertStatus(str, enum.Enum):
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"


# ============================================================================
# MULTI-TENANT MODELS
# ============================================================================

class Organization(Base):
    """
    Top-level tenant for multi-organization support.
    Organizations contain multiple projects and users.
    """
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    plan = Column(String(50), default="free")  # free, pro, enterprise
    settings = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="organization", cascade="all, delete-orphan")


class User(Base):
    """
    User accounts with role-based access control.
    """
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default="member")  # admin, member, viewer
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    organization = relationship("Organization", back_populates="users")
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")


class APIKey(Base):
    """
    API keys for SDK authentication with scopes and expiration.
    """
    __tablename__ = "api_keys"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key_hash = Column(String(64), unique=True, nullable=False, index=True)
    key_prefix = Column(String(10), nullable=False)  # First chars for identification
    name = Column(String(100), nullable=False)
    scopes = Column(ARRAY(String), default=["read", "write"])
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True)
    expires_at = Column(DateTime, nullable=True)
    last_used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")
    project = relationship("Project", back_populates="api_keys")


class Project(Base):
    """
    Projects group traces, evaluations, and configurations.
    Each project has its own API key for SDK integration.
    """
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    api_key = Column(String(64), unique=True, nullable=False, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"))
    settings = Column(JSONB, default={})
    
    # Feature flags
    auto_evaluation_enabled = Column(Boolean, default=True)
    auto_healing_enabled = Column(Boolean, default=False)
    drift_detection_enabled = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    organization = relationship("Organization", back_populates="projects")
    traces = relationship("Trace", back_populates="project", cascade="all, delete-orphan")
    prompts = relationship("Prompt", back_populates="project", cascade="all, delete-orphan")
    datasets = relationship("Dataset", back_populates="project", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="project", cascade="all, delete-orphan")
    api_keys = relationship("APIKey", back_populates="project", cascade="all, delete-orphan")
    
    __table_args__ = (
        UniqueConstraint("organization_id", "slug", name="uq_project_org_slug"),
    )


# ============================================================================
# TRACING MODELS
# ============================================================================

class Trace(Base):
    """
    Root trace representing a complete agent/LLM interaction.
    Contains metadata and aggregated metrics.
    """
    __tablename__ = "traces"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    
    # Identity
    session_id = Column(String(255), nullable=True, index=True)
    user_id = Column(String(255), nullable=True, index=True)
    name = Column(String(255), nullable=True)
    
    # Status
    status = Column(Enum(TraceStatus), default=TraceStatus.RUNNING)
    error_message = Column(Text, nullable=True)
    
    # Timing
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=True)
    
    # I/O
    input = Column(JSONB, nullable=True)
    output = Column(JSONB, nullable=True)
    
    # Aggregated Metrics (computed from spans)
    total_tokens = Column(Integer, default=0)
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    total_cost_usd = Column(Float, default=0.0)
    latency_ms = Column(Float, nullable=True)
    
    # Metadata
    metadata = Column(JSONB, default={})
    tags = Column(ARRAY(String), default=[])
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="traces")
    spans = relationship("Span", back_populates="trace", cascade="all, delete-orphan", order_by="Span.start_time")
    evaluations = relationship("Evaluation", back_populates="trace", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="trace", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index("ix_traces_project_time", "project_id", "start_time"),
        Index("ix_traces_session", "session_id"),
        Index("ix_traces_status", "status"),
    )
    
    @hybrid_property
    def duration_ms(self) -> Optional[float]:
        if self.end_time and self.start_time:
            return (self.end_time - self.start_time).total_seconds() * 1000
        return None


class Span(Base):
    """
    Individual span within a trace (LLM call, retrieval, tool use, etc.).
    Supports hierarchical parent-child relationships for complex workflows.
    """
    __tablename__ = "spans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trace_id = Column(UUID(as_uuid=True), ForeignKey("traces.id", ondelete="CASCADE"), nullable=False)
    parent_span_id = Column(UUID(as_uuid=True), ForeignKey("spans.id", ondelete="SET NULL"), nullable=True)
    
    # Identity
    name = Column(String(255), nullable=False)
    span_type = Column(Enum(SpanType), nullable=False, index=True)
    
    # Timing
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    latency_ms = Column(Float, nullable=True)
    
    # I/O
    input = Column(JSONB, nullable=True)
    output = Column(JSONB, nullable=True)
    
    # LLM-specific fields
    model = Column(String(100), nullable=True, index=True)
    prompt_tokens = Column(Integer, nullable=True)
    completion_tokens = Column(Integer, nullable=True)
    total_tokens = Column(Integer, nullable=True)
    cost_usd = Column(Float, nullable=True)
    
    # RAG-specific fields (for retrieval spans)
    documents = Column(JSONB, nullable=True)  # Retrieved documents
    retrieval_scores = Column(ARRAY(Float), nullable=True)  # Relevance scores
    
    # Status
    status = Column(String(20), default="ok")  # ok, error
    error_message = Column(Text, nullable=True)
    
    # Metadata
    attributes = Column(JSONB, default={})
    events = Column(JSONB, default=[])  # List of timestamped events
    
    # Embedding for semantic search
    embedding_id = Column(String(255), nullable=True)  # Reference to Qdrant
    
    # Auto-healing reference
    prompt_version_id = Column(UUID(as_uuid=True), ForeignKey("prompt_versions.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    trace = relationship("Trace", back_populates="spans")
    parent = relationship("Span", remote_side=[id], backref=backref("children", cascade="all, delete-orphan"))
    evaluations = relationship("Evaluation", back_populates="span", cascade="all, delete-orphan")
    prompt_version = relationship("PromptVersion", back_populates="spans")
    
    __table_args__ = (
        Index("ix_spans_trace_type", "trace_id", "span_type"),
        Index("ix_spans_model", "model"),
    )


# ============================================================================
# EVALUATION MODELS
# ============================================================================

class Evaluation(Base):
    """
    Evaluation result from running an evaluator on a span or trace.
    Stores score, label, and detailed explanation.
    """
    __tablename__ = "evaluations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trace_id = Column(UUID(as_uuid=True), ForeignKey("traces.id", ondelete="CASCADE"), nullable=True)
    span_id = Column(UUID(as_uuid=True), ForeignKey("spans.id", ondelete="CASCADE"), nullable=True)
    
    # Evaluator info
    evaluator_type = Column(Enum(EvaluatorType), nullable=False, index=True)
    evaluator_config = Column(JSONB, default={})  # Custom evaluator settings
    
    # Results
    score = Column(Float, nullable=False)  # 0.0 to 1.0
    label = Column(String(50), nullable=True)  # pass/fail, good/bad/neutral
    explanation = Column(Text, nullable=True)  # LLM-generated explanation
    
    # Metadata
    metadata = Column(JSONB, default={})
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    trace = relationship("Trace", back_populates="evaluations")
    span = relationship("Span", back_populates="evaluations")
    
    __table_args__ = (
        Index("ix_evaluations_type_score", "evaluator_type", "score"),
    )


class Feedback(Base):
    """
    Human feedback on traces for RLHF and quality tracking.
    """
    __tablename__ = "feedback"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trace_id = Column(UUID(as_uuid=True), ForeignKey("traces.id", ondelete="CASCADE"), nullable=False)
    
    # Feedback type
    score = Column(Integer, nullable=False)  # 1-5 or thumbs up/down (-1, 1)
    category = Column(String(50), nullable=True)  # accuracy, helpfulness, safety
    comment = Column(Text, nullable=True)
    
    # Source
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    source = Column(String(50), default="manual")  # manual, api, annotation
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    trace = relationship("Trace", back_populates="feedback")


# ============================================================================
# PROMPT MANAGEMENT MODELS
# ============================================================================

class Prompt(Base):
    """
    Named prompt template with version history for A/B testing.
    """
    __tablename__ = "prompts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Active version
    active_version_id = Column(UUID(as_uuid=True), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="prompts")
    versions = relationship("PromptVersion", back_populates="prompt", cascade="all, delete-orphan", order_by="PromptVersion.version.desc()")
    
    __table_args__ = (
        UniqueConstraint("project_id", "name", name="uq_prompt_project_name"),
    )


class PromptVersion(Base):
    """
    Immutable version of a prompt for tracking and rollback.
    """
    __tablename__ = "prompt_versions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prompt_id = Column(UUID(as_uuid=True), ForeignKey("prompts.id", ondelete="CASCADE"), nullable=False)
    
    version = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    
    # Template variables
    variables = Column(ARRAY(String), default=[])
    
    # Metadata
    commit_message = Column(String(500), nullable=True)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Performance metrics (aggregated from traces using this version)
    avg_score = Column(Float, nullable=True)
    usage_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    prompt = relationship("Prompt", back_populates="versions")
    spans = relationship("Span", back_populates="prompt_version")
    
    __table_args__ = (
        UniqueConstraint("prompt_id", "version", name="uq_prompt_version"),
    )


# ============================================================================
# DATASET MODELS
# ============================================================================

class Dataset(Base):
    """
    Curated dataset for evaluation and fine-tuning.
    """
    __tablename__ = "datasets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(50), default="golden_set")  # golden_set, test_set, train_set
    
    # Stats
    item_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="datasets")
    items = relationship("DatasetItem", back_populates="dataset", cascade="all, delete-orphan")
    
    __table_args__ = (
        UniqueConstraint("project_id", "name", name="uq_dataset_project_name"),
    )


class DatasetItem(Base):
    """
    Individual item in a dataset with input/output pairs.
    Optionally linked to source trace for provenance.
    """
    __tablename__ = "dataset_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dataset_id = Column(UUID(as_uuid=True), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    
    input = Column(JSONB, nullable=False)
    expected_output = Column(JSONB, nullable=True)
    
    # Source trace reference
    trace_id = Column(UUID(as_uuid=True), ForeignKey("traces.id", ondelete="SET NULL"), nullable=True)
    span_id = Column(UUID(as_uuid=True), ForeignKey("spans.id", ondelete="SET NULL"), nullable=True)
    
    # Annotations
    annotations = Column(JSONB, default={})
    tags = Column(ARRAY(String), default=[])
    
    # Embedding for semantic search
    embedding_id = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    dataset = relationship("Dataset", back_populates="items")


# ============================================================================
# ALERTING MODELS
# ============================================================================

class Alert(Base):
    """
    Alert rule configuration for monitoring.
    """
    __tablename__ = "alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Condition
    metric = Column(String(100), nullable=False)  # latency_p95, error_rate, eval_score_avg
    operator = Column(String(20), nullable=False)  # gt, lt, gte, lte, eq
    threshold = Column(Float, nullable=False)
    window_minutes = Column(Integer, default=5)
    
    # Severity
    severity = Column(Enum(AlertSeverity), default=AlertSeverity.WARNING)
    
    # Notification
    notification_channels = Column(JSONB, default=[])  # [{type: "slack", url: "..."}]
    
    # Status
    is_active = Column(Boolean, default=True)
    last_triggered_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="alerts")
    history = relationship("AlertHistory", back_populates="alert", cascade="all, delete-orphan")


class AlertHistory(Base):
    """
    Historical record of triggered alerts.
    """
    __tablename__ = "alert_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    alert_id = Column(UUID(as_uuid=True), ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False)
    
    # Trigger info
    triggered_value = Column(Float, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(Enum(AlertStatus), default=AlertStatus.ACTIVE)
    
    # Related trace (if applicable)
    trace_id = Column(UUID(as_uuid=True), nullable=True)
    
    # Resolution
    acknowledged_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    
    triggered_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    alert = relationship("Alert", back_populates="history")


# ============================================================================
# EXPERIMENT MODELS
# ============================================================================

class Experiment(Base):
    """
    A/B experiment for comparing prompt versions or models.
    """
    __tablename__ = "experiments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Variants
    control_prompt_version_id = Column(UUID(as_uuid=True), ForeignKey("prompt_versions.id"), nullable=True)
    treatment_prompt_version_id = Column(UUID(as_uuid=True), ForeignKey("prompt_versions.id"), nullable=True)
    
    # Traffic split
    traffic_percentage = Column(Float, default=50.0)  # % going to treatment
    
    # Status
    status = Column(String(20), default="draft")  # draft, running, completed, stopped
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    
    # Results
    winner = Column(String(20), nullable=True)  # control, treatment, inconclusive
    results = Column(JSONB, default={})
    
    created_at = Column(DateTime, default=datetime.utcnow)


# ============================================================================
# BATCH PROCESSING MODELS
# ============================================================================

class BatchRun(Base):
    """
    Batch evaluation run against a dataset.
    """
    __tablename__ = "batch_runs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    dataset_id = Column(UUID(as_uuid=True), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=True)
    
    # Configuration
    evaluator_configs = Column(JSONB, default=[])  # List of evaluators to run
    prompt_version_id = Column(UUID(as_uuid=True), ForeignKey("prompt_versions.id"), nullable=True)
    
    # Progress
    status = Column(String(20), default="pending")  # pending, running, completed, failed
    total_items = Column(Integer, default=0)
    processed_items = Column(Integer, default=0)
    
    # Results
    results_summary = Column(JSONB, default={})
    
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    results = relationship("BatchResult", back_populates="batch_run", cascade="all, delete-orphan")


class BatchResult(Base):
    """
    Individual result from a batch run.
    """
    __tablename__ = "batch_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_run_id = Column(UUID(as_uuid=True), ForeignKey("batch_runs.id", ondelete="CASCADE"), nullable=False)
    dataset_item_id = Column(UUID(as_uuid=True), ForeignKey("dataset_items.id", ondelete="CASCADE"), nullable=False)
    
    # Generated output
    output = Column(JSONB, nullable=True)
    
    # Evaluation scores
    scores = Column(JSONB, default={})  # {evaluator_type: score}
    
    # Timing
    latency_ms = Column(Float, nullable=True)
    
    # Error
    error = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    batch_run = relationship("BatchRun", back_populates="results")
