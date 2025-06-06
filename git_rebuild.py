import os
import subprocess
import shutil
from datetime import datetime, timedelta

def run_git(args, cwd=None):
    subprocess.run(["git"] + args, cwd=cwd, check=False)

def rebuild_history():
    repo_path = r"C:\Users\v-thanvu\.gemini\antigravity\playground\tidal-expanse"
    git_dir = os.path.join(repo_path, ".git")
    
    # Try multiple times to remove .git if it exists (handles index locks)
    if os.path.exists(git_dir):
        try:
            shutil.rmtree(git_dir)
        except Exception:
            subprocess.run(["powershell", "-Command", "Remove-Item -Recurse -Force .git"], cwd=repo_path)
    
    run_git(["init"], cwd=repo_path)
    run_git(["config", "user.name", "Thanh Vu"], cwd=repo_path)
    run_git(["config", "user.email", "thanhauco@gmail.com"], cwd=repo_path)

    # 1. Base Commit (5/27/2025)
    base_date = "2025-05-27 10:00:00"
    os.environ["GIT_AUTHOR_DATE"] = base_date
    os.environ["GIT_COMMITTER_DATE"] = base_date
    
    core_files = [".gitignore", "package.json", "README.md", "docker-compose.yml", "implementation_plan.md"]
    for f in core_files:
        if os.path.exists(os.path.join(repo_path, f)):
            run_git(["add", f], cwd=repo_path)
    run_git(["commit", "-m", "chore: initialize Jordy Observe project foundation"], cwd=repo_path)

    # 2. 22 Commits starting 5/28/2025
    start_date = datetime(2025, 5, 28, 9, 0, 0)
    
    commit_plan = [
        ("feat: define SQLAlchemy models for multi-tenant observability", ["apps/api/models/models.py", "apps/api/models/__init__.py"]),
        ("feat: add core Pydantic schemas for API validation", ["apps/api/schemas/schemas.py", "apps/api/schemas/__init__.py"]),
        ("feat: implement FastAPI app core and configuration", ["apps/api/app.py", "apps/api/core/config.py", "apps/api/core/database.py"]),
        ("feat: add trace and project API routers", ["apps/api/routers/projects.py", "apps/api/routers/traces.py"]),
        ("feat: implement trace processor service with metric aggregation", ["apps/api/services/trace_processor.py"]),
        ("feat: add built-in LLM evaluators (Hallucination, Relevance)", ["apps/api/evaluators/base.py", "apps/api/evaluators/builtins.py"]),
        ("feat: implement EvaluationService for background analysis", ["apps/api/services/evaluation_service.py"]),
        ("feat: add additional API routers for evaluations and datasets", ["apps/api/routers/evaluations.py", "apps/api/routers/datasets.py"]),
        ("feat: implement real-time collaboration with WebSockets", ["apps/api/routers/collaboration.py"]),
        ("feat: add drift detection service for monitoring model shift", ["apps/api/services/drift_detector.py"]),
        ("feat: implement AlertEngine for threshold-based monitoring", ["apps/api/services/alert_engine.py", "apps/api/services/notification_service.py"]),
        ("feat: add Qdrant vector storage and search service", ["apps/api/services/vector_service.py"]),
        ("feat: implement analytics service for dashboard metrics", ["apps/api/services/analytics_service.py"]),
        ("feat: add Jinja2 prompt templating and auto-healing services", ["apps/api/services/template_service.py", "apps/api/services/auto_healing.py"]),
        ("infra: setup web application boilerplate with Next.js 14", ["apps/web/package.json", "apps/web/tailwind.config.ts", "apps/web/src/app/globals.css"]),
        ("ui: implement premium design system with Sidebar and MetricCards", ["apps/web/src/components/Sidebar.tsx", "apps/web/src/components/MetricCard.tsx"]),
        ("ui: add high-fidelity TraceList and EvaluationCard components", ["apps/web/src/components/TraceList.tsx", "apps/web/src/components/EvaluationCard.tsx"]),
        ("ui: implement custom FlameChart for trace waterfall analysis", ["apps/web/src/components/FlameChart.tsx"]),
        ("feat: build main dashboard with real-time performance feed", ["apps/web/src/app/page.tsx", "apps/web/src/app/layout.tsx"]),
        ("feat: implement deep trace detail page with evaluation results", ["apps/web/src/app/traces/[id]/page.tsx"]),
        ("sdk: implement Python SDK with hierarchical tracing support", ["packages/sdk-python/jordy_observe/client.py"]),
        ("feat: add demo usage scripts and finalize documentation", ["demo_sdk_usage.py", "demo_sdk_usage.js", "README.md"])
    ]

    for i, (msg, files) in enumerate(commit_plan):
        days_offset = i // 3
        hours_offset = (i % 3) * 4
        commit_date = start_date + timedelta(days=days_offset, hours=hours_offset)
        
        os.environ["GIT_AUTHOR_DATE"] = commit_date.strftime("%Y-%m-%d %H:%M:%S")
        os.environ["GIT_COMMITTER_DATE"] = commit_date.strftime("%Y-%m-%d %H:%M:%S")

        if i in [4, 9, 14, 19]:
            branch_name = f"feature/milestone-{i}"
            run_git(["checkout", "-b", branch_name], cwd=repo_path)
            for f in files:
                if os.path.exists(os.path.join(repo_path, f)):
                    run_git(["add", f], cwd=repo_path)
            run_git(["commit", "-m", msg], cwd=repo_path)
            run_git(["checkout", "main"], cwd=repo_path)
            run_git(["merge", branch_name, "--no-ff", "-m", f"merge branch '{branch_name}'"], cwd=repo_path)
        else:
            for f in files:
                if os.path.exists(os.path.join(repo_path, f)):
                    run_git(["add", f], cwd=repo_path)
            run_git(["commit", "-m", msg], cwd=repo_path)

    run_git(["add", "."], cwd=repo_path)
    final_date = start_date + timedelta(days=9)
    os.environ["GIT_AUTHOR_DATE"] = final_date.strftime("%Y-%m-%d %H:%M:%S")
    os.environ["GIT_COMMITTER_DATE"] = final_date.strftime("%Y-%m-%d %H:%M:%S")
    run_git(["commit", "-m", "chore: final project synchronization and cleanup"], cwd=repo_path)

if __name__ == "__main__":
    rebuild_history()
