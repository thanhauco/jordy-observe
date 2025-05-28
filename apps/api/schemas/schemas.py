from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

# ============================================================================
# SHARED SCHEMAS
# ============================================================================

class Message(BaseModel):
    message: str


# ============================================================================
# TRACE SCHEMAS
# ============================================================================

class SpanBase(BaseModel):
    name: str
    span_type: str
    start_time: datetime
    end_time: Optional[datetime] = None
    input: Optional[Dict[str, Any]] = None
    output: Optional[Dict[str, Any]] = None
    attributes: Optional[Dict[str, Any]] = Field(default_factory=dict)
    parent_span_id: Optional[UUID] = None

class SpanCreate(SpanBase):
    id: Optional[UUID] = None
    trace_id: Optional[UUID] = None
    model: Optional[str] = None
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    total_tokens: Optional[int] = None

class Span(SpanBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    trace_id: UUID
    latency_ms: Optional[float] = None
    cost_usd: Optional[float] = None

class TraceBase(BaseModel):
    name: Optional[str] = None
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    input: Optional[Dict[str, Any]] = None
    output: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    tags: Optional[List[str]] = Field(default_factory=list)

class TraceCreate(TraceBase):
    id: Optional[UUID] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    spans: List[SpanCreate] = Field(default_factory=list)

class Trace(TraceBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    project_id: UUID
    status: str
    start_time: datetime
    end_time: Optional[datetime] = None
    total_tokens: int
    total_cost_usd: float
    latency_ms: Optional[float] = None

class TraceDetailed(Trace):
    spans: List[Span]


# ============================================================================
# EVALUATION SCHEMAS
# ============================================================================

class EvaluationBase(BaseModel):
    evaluator_type: str
    score: float
    label: Optional[str] = None
    explanation: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class EvaluationCreate(EvaluationBase):
    trace_id: Optional[UUID] = None
    span_id: Optional[UUID] = None

class Evaluation(EvaluationBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    trace_id: Optional[UUID]
    span_id: Optional[UUID]
    created_at: datetime


# ============================================================================
# PROJECT SCHEMAS
# ============================================================================

class ProjectBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    auto_evaluation_enabled: bool = True

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    auto_evaluation_enabled: Optional[bool] = None

class Project(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    api_key: str
    organization_id: UUID
    created_at: datetime


# ============================================================================
# DATASET SCHEMAS
# ============================================================================

class DatasetItemBase(BaseModel):
    input: Dict[str, Any]
    expected_output: Optional[Dict[str, Any]] = None

class DatasetItemCreate(DatasetItemBase):
    trace_id: Optional[UUID] = None
    span_id: Optional[UUID] = None

class DatasetItem(DatasetItemBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    dataset_id: UUID
    created_at: datetime

class DatasetBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "golden_set"

class DatasetCreate(DatasetBase):
    pass

class Dataset(DatasetBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    project_id: UUID
    item_count: int
    created_at: datetime
