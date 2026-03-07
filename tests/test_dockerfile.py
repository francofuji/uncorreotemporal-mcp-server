from pathlib import Path


def test_dockerfile_contains_runtime_entrypoint():
    root = Path(__file__).resolve().parents[1]
    dockerfile = root / "Dockerfile"
    assert dockerfile.exists()

    content = dockerfile.read_text(encoding="utf-8")
    assert "ENTRYPOINT [\"uncorreotemporal-mcp\"]" in content
    assert "UCT_MCP_TRANSPORT" in content
