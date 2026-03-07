from __future__ import annotations

from typing import Any

from uncorreotemporal_mcp.tools.common import resolve_message_text, tool_error
from uncorreotemporal_mcp.utils.api_client import ApiClient
from uncorreotemporal_mcp.utils.email_parser import extract_otp_candidates


async def run(
    api: ApiClient,
    message_text: str | None = None,
    inbox_id: str | None = None,
    message_id: str | None = None,
    otp_length_min: int = 4,
    otp_length_max: int = 8,
) -> dict[str, Any]:
    if otp_length_min < 1 or otp_length_max < otp_length_min:
        return tool_error("validation_error", 400, "otp_length_min/max are invalid")

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

    candidates = extract_otp_candidates(
        resolved_text,
        otp_length_min=otp_length_min,
        otp_length_max=otp_length_max,
    )

    return {
        "otp_code": candidates[0] if candidates else None,
        "candidates": candidates,
    }
