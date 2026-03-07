from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from uncorreotemporal_mcp.server import complete_signup_flow  # noqa: E402


async def run(service_name: str) -> None:
    result = await complete_signup_flow(service_name=service_name)
    print("complete_signup_flow result:")
    print(json.dumps(result, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="LangChain agent integration example")
    parser.add_argument("--dry-run", action="store_true", help="Print integration skeleton and exit")
    parser.add_argument("--service-name", default=os.getenv("TARGET_SERVICE", "github"))
    args = parser.parse_args()

    if args.dry_run:
        print("Dry run: LangChain agent skeleton")
        print("- create LangChain agent")
        print("- attach MCP tools")
        print("- call complete_signup_flow(service_name)")
        return

    asyncio.run(run(args.service_name))


if __name__ == "__main__":
    main()
