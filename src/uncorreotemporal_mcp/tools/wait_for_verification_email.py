from __future__ import annotations

import asyncio
from time import monotonic
from typing import Any

from uncorreotemporal_mcp.tools.common import tool_error
from uncorreotemporal_mcp.utils.api_client import ApiClient, ApiClientError


async def run(
    api: ApiClient,
    inbox_id: str,
    timeout_seconds: int = 90,
    poll_interval_seconds: int = 3,
    subject_contains: str | None = None,
    from_contains: str | None = None,
) -> dict[str, Any]:
    if not inbox_id:
        return tool_error("validation_error", 400, "inbox_id is required")
    if timeout_seconds < 1:
        return tool_error("validation_error", 400, "timeout_seconds must be >= 1")
    if poll_interval_seconds < 1:
        return tool_error("validation_error", 400, "poll_interval_seconds must be >= 1")

    deadline = monotonic() + timeout_seconds
    subject_filter = subject_contains.lower() if subject_contains else None
    from_filter = from_contains.lower() if from_contains else None

    while monotonic() < deadline:
        try:
            messages = await api.list_messages(inbox_id, limit=20, offset=0)
        except ApiClientError as exc:
            return exc.to_dict()

        for message in messages:
            subject = str(message.get("subject") or "")
            from_address = str(message.get("from_address") or "")

            if subject_filter and subject_filter not in subject.lower():
                continue
            if from_filter and from_filter not in from_address.lower():
                continue

            return {
                "status": "received",
                "message_id": message.get("id"),
                "received_at": message.get("received_at"),
                "subject": subject,
                "from_address": from_address,
                "timeout_seconds": timeout_seconds,
            }

        remaining = deadline - monotonic()
        if remaining > 0:
            await asyncio.sleep(min(poll_interval_seconds, max(0.1, remaining)))

    return {
        "status": "timeout",
        "timeout_seconds": timeout_seconds,
    }
