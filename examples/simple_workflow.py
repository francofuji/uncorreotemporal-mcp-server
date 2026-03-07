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

from uncorreotemporal_mcp.server import (  # noqa: E402
    create_signup_inbox,
    extract_verification_link,
    wait_for_verification_email,
)


async def run(service_name: str, timeout_seconds: int) -> None:
    inbox = await create_signup_inbox(service_name=service_name)
    print("inbox:")
    print(json.dumps(inbox, indent=2))

    if inbox.get("error"):
        return

    print("\nTrigger your signup flow now using:", inbox["email"])
    wait_result = await wait_for_verification_email(
        inbox_id=inbox["inbox_id"],
        timeout_seconds=timeout_seconds,
        subject_contains="verify",
    )
    print("\nwait_for_verification_email:")
    print(json.dumps(wait_result, indent=2))

    if wait_result.get("status") != "received":
        return

    link = await extract_verification_link(
        inbox_id=inbox["inbox_id"],
        message_id=wait_result["message_id"],
    )
    print("\nextract_verification_link:")
    print(json.dumps(link, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="Minimal MCP workflow example")
    parser.add_argument("--dry-run", action="store_true", help="Print steps and exit")
    parser.add_argument("--timeout-seconds", type=int, default=int(os.getenv("TIMEOUT_SECONDS", "90")))
    parser.add_argument("--service-name", default=os.getenv("TARGET_SERVICE", "github"))
    args = parser.parse_args()

    if args.dry_run:
        print("Dry run steps:")
        print("1. create_signup_inbox(service_name)")
        print("2. wait_for_verification_email(inbox_id)")
        print("3. extract_verification_link(inbox_id, message_id)")
        return

    asyncio.run(run(args.service_name, args.timeout_seconds))


if __name__ == "__main__":
    main()
