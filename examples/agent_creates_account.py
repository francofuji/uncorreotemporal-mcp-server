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


async def perform_external_signup(service_name: str, email: str) -> None:
    raise NotImplementedError(
        f"Integrate browser/API automation for {service_name} using email {email}"
    )


async def run(service_name: str, timeout_seconds: int) -> None:
    inbox = await create_signup_inbox(service_name=service_name)
    print("Step 1 - create_signup_inbox")
    print(json.dumps(inbox, indent=2))
    if inbox.get("error"):
        return

    print("\nStep 2 - perform external signup")
    try:
        await perform_external_signup(service_name=service_name, email=inbox["email"])
    except NotImplementedError as exc:
        print(f"Placeholder: {exc}")

    print("\nStep 3 - wait_for_verification_email")
    waited = await wait_for_verification_email(
        inbox_id=inbox["inbox_id"],
        timeout_seconds=timeout_seconds,
        subject_contains="verify",
    )
    print(json.dumps(waited, indent=2))
    if waited.get("status") != "received":
        return

    print("\nStep 4 - extract_verification_link")
    link = await extract_verification_link(
        inbox_id=inbox["inbox_id"],
        message_id=waited["message_id"],
    )
    print(json.dumps(link, indent=2))

    print("\nStep 5 - confirm account")
    if link.get("verification_link"):
        print(f"Open verification link: {link['verification_link']}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Full agent signup flow example")
    parser.add_argument("--dry-run", action="store_true", help="Print steps and exit")
    parser.add_argument("--timeout-seconds", type=int, default=int(os.getenv("TIMEOUT_SECONDS", "90")))
    parser.add_argument("--service-name", default=os.getenv("TARGET_SERVICE", "github"))
    args = parser.parse_args()

    if args.dry_run:
        print("Dry run steps:")
        print("1. create inbox")
        print("2. signup service")
        print("3. wait verification email")
        print("4. extract link")
        print("5. confirm account")
        return

    asyncio.run(run(service_name=args.service_name, timeout_seconds=args.timeout_seconds))


if __name__ == "__main__":
    main()
