"""Add datasets tables
Revision ID: 005
Revises: 004
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSON

revision = '005'
down_revision = '004'

def upgrade():
    op.create_table('datasets',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', UUID(as_uuid=True), sa.ForeignKey('projects.id')),
        sa.Column('name', sa.String()),
        sa.Column('created_at', sa.DateTime()),
    )
    op.create_table('dataset_items',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('dataset_id', UUID(as_uuid=True), sa.ForeignKey('datasets.id')),
        sa.Column('input', JSON()),
        sa.Column('expected_output', JSON()),
        sa.Column('trace_id', UUID(as_uuid=True), nullable=True),
    )

def downgrade():
    op.drop_table('dataset_items')
    op.drop_table('datasets')
