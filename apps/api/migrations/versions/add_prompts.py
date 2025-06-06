"""Add prompts tables
Revision ID: 004
Revises: 003
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = '004'
down_revision = '003'

def upgrade():
    op.create_table('prompts',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('project_id', UUID(as_uuid=True), sa.ForeignKey('projects.id')),
        sa.Column('name', sa.String()),
        sa.Column('created_at', sa.DateTime()),
    )
    op.create_table('prompt_versions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('prompt_id', UUID(as_uuid=True), sa.ForeignKey('prompts.id')),
        sa.Column('version', sa.Integer()),
        sa.Column('content', sa.Text()),
        sa.Column('is_active', sa.Boolean()),
        sa.Column('created_at', sa.DateTime()),
    )

def downgrade():
    op.drop_table('prompt_versions')
    op.drop_table('prompts')
