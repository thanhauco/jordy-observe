"""Add evaluations table
Revision ID: 003
Revises: 002
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = '003'
down_revision = '002'

def upgrade():
    op.create_table('evaluations',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('span_id', UUID(as_uuid=True), sa.ForeignKey('spans.id')),
        sa.Column('evaluator_type', sa.String()),
        sa.Column('score', sa.Float()),
        sa.Column('label', sa.String()),
        sa.Column('explanation', sa.Text()),
        sa.Column('created_at', sa.DateTime()),
    )

def downgrade():
    op.drop_table('evaluations')
