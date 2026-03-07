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

PROMPT_TEMPLATE = """Use MCP tool complete_signup_flow with service_name='{service_name}'.
If status is success, continue with account confirmation using verification_link or otp_code."""


async def run(service_name: str) -> None:
    result = await complete_signup_flow(service_name=service_name)
    print("complete_signup_flow result:")
    print(json.dumps(result, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="OpenAI agent integration example")
    parser.add_argument("--dry-run", action="store_true", help="Print integration skeleton and exit")
    parser.add_argument("--service-name", default=os.getenv("TARGET_SERVICE", "github"))
    args = parser.parse_args()

    if args.dry_run:
        print("Dry run: OpenAI agent skeleton")
        print(PROMPT_TEMPLATE.format(service_name=args.service_name))
        print("\nPseudo-code:")
        print("- create OpenAI Responses client")
        print("- register MCP server tools")
        print("- ask agent to call complete_signup_flow")
        return

    asyncio.run(run(args.service_name))


if __name__ == "__main__":
    main()
