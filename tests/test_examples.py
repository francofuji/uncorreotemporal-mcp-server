import subprocess
import sys
from pathlib import Path

EXAMPLES = [
    "simple_workflow.py",
    "openai_agent_signup.py",
    "langchain_agent_signup.py",
    "agent_creates_account.py",
]


def test_examples_dry_run_smoke():
    root = Path(__file__).resolve().parents[1]
    examples_dir = root / "examples"

    for script in EXAMPLES:
        proc = subprocess.run(
            [sys.executable, str(examples_dir / script), "--dry-run"],
            cwd=str(root),
            check=False,
            capture_output=True,
            text=True,
        )
        assert proc.returncode == 0, f"{script} failed: {proc.stderr}"
        assert "Dry run" in proc.stdout
