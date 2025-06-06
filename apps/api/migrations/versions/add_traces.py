"""Add traces and spans

Revision ID: 002
Revises: 001
Create Date: 2025-02-15
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSON

revision = '002'
down_revision = '001'

def upgrade():
    op.create_table('traces',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', UUID(as_uuid=True), sa.ForeignKey('projects.id')),
        sa.Column('status', sa.String()),
        sa.Column('start_time', sa.DateTime()),
        sa.Column('end_time', sa.DateTime()),
        sa.Column('input', JSON()),
        sa.Column('output', JSON()),
    )
    op.create_table('spans',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('trace_id', UUID(as_uuid=True), sa.ForeignKey('traces.id')),
        sa.Column('parent_span_id', UUID(as_uuid=True), nullable=True),
        sa.Column('name', sa.String()),
        sa.Column('span_type', sa.String()),
        sa.Column('start_time', sa.DateTime()),
        sa.Column('end_time', sa.DateTime()),
        sa.Column('input', JSON()),
        sa.Column('output', JSON()),
        sa.Column('latency_ms', sa.Float()),
    )

def downgrade():
    op.drop_table('spans')
    op.drop_table('traces')
