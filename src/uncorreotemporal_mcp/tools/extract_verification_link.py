from __future__ import annotations

from typing import Any

from uncorreotemporal_mcp.tools.common import resolve_message_text, tool_error
from uncorreotemporal_mcp.utils.api_client import ApiClient
from uncorreotemporal_mcp.utils.email_parser import extract_verification_link_candidates


async def run(
    api: ApiClient,
    message_text: str | None = None,
    inbox_id: str | None = None,
    message_id: str | None = None,
    preferred_domains: list[str] | None = None,
) -> dict[str, Any]:
    resolved_text, error, _ = await resolve_message_text(
        api=api,
        message_text=message_text,
        inbox_id=inbox_id,
        message_id=message_id,
    )
    if error:
        return error
    if not resolved_text:
        return tool_error("empty_message", 422, "Message body is empty")

    candidates = extract_verification_link_candidates(
        text=resolved_text,
        preferred_domains=preferred_domains,
    )

    return {
        "verification_link": candidates[0] if candidates else None,
        "candidates": candidates,
    }
