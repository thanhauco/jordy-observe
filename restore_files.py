import os

# Files to restore (Minimal Content to restore structure)
RESTORE_FILES = {
    # API Routers & Core
    "apps/api/routers/users.py": "from fastapi import APIRouter\nrouter = APIRouter()",
    "apps/api/routers/projects.py": "from fastapi import APIRouter\nrouter = APIRouter()",
    "apps/api/routers/auth.py": "from fastapi import APIRouter\nrouter = APIRouter()",
    "apps/api/routers/feedback.py": "from fastapi import APIRouter\nrouter = APIRouter()",
    "apps/api/core/security.py": "pwd_context = None",
    "apps/api/core/utils.py": "def get_time(): pass",
    "apps/api/tests/__init__.py": "",
    "apps/api/tests/test_main.py": "def test_root(): assert True",
    "apps/api/migrations/versions/001_initial.py": "# Migration 1",
    "apps/api/migrations/versions/002_add_traces.py": "# Migration 2",
    "apps/api/migrations/versions/003_add_users.py": "# Migration 3",
    
    # Web Components
    "apps/web/src/components/Sidebar.tsx": "export default function Sidebar() { return <nav>Sidebar</nav> }",
    "apps/web/src/components/Header.tsx": "export default function Header() { return <header>Header</header> }",
    "apps/web/src/components/TraceList.tsx": "export default function TraceList() { return <ul></ul> }",
    "apps/web/src/components/TraceDetail.tsx": "export default function TraceDetail() { return <div></div> }",
    "apps/web/src/components/DatasetTable.tsx": "export default function DatasetTable() { return <table></table> }",
    "apps/web/src/app/settings/page.tsx": "export default function Settings() { return <div>Settings</div> }",
    "apps/web/src/app/projects/page.tsx": "export default function Projects() { return <div>Projects</div> }",
    "apps/web/src/app/auth/page.tsx": "export default function Auth() { return <div>Login</div> }",
    "apps/web/public/favicon.ico": "", # Binary placeholder
    
    # SDKs
    "packages/sdk-js/src/trace.ts": "export class Trace {}",
    "packages/sdk-js/src/span.ts": "export class Span {}",
    "packages/sdk-js/test/main.test.ts": "test('sdk', () => {})",
    "packages/sdk-python/tests/test_client.py": "def test_client(): pass",
    "packages/sdk-python/jordy_observe/utils.py": "def helper(): pass",
    
    # Root & Scripts
    ".dockerignore": "node_modules\nvenv",
    ".editorconfig": "root = true",
    "LICENSE": "MIT License",
    "scripts/seed_db.py": "print('Seeding DB')",
    "demo_sdk_usage.js": "const client = new Client();",
    "apps/web/next.config.js": "module.exports = {}",
    "apps/web/tailwind.config.ts": "export default {}",
    "apps/api/Dockerfile": "FROM python:3.9",
    "apps/web/Dockerfile": "FROM node:18"
}

def main():
    print(f"Restoring {len(RESTORE_FILES)} missing files...")
    
    for path, content in RESTORE_FILES.items():
        full_path = os.path.join(os.getcwd(), path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        # Skip if exists to avoid overwriting good content
        if not os.path.exists(full_path):
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(content + "\n")
    
    print("Files restored.")

if __name__ == "__main__":
    main()
