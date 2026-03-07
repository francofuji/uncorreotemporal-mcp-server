from __future__ import annotations

from typing import Any

from uncorreotemporal_mcp.tools.common import tool_error
from uncorreotemporal_mcp.utils.api_client import ApiClient, ApiClientError


async def run(
    api: ApiClient,
    service_name: str,
    ttl_minutes: int | None = None,
) -> dict[str, Any]:
    if not service_name or not service_name.strip():
        return tool_error("validation_error", 400, "service_name is required")

    if ttl_minutes is not None and ttl_minutes < 1:
        return tool_error("validation_error", 400, "ttl_minutes must be >= 1")

    try:
        mailbox = await api.create_mailbox(ttl_minutes=ttl_minutes)
    except ApiClientError as exc:
        return exc.to_dict()

    email = mailbox.get("address")
    expires_at = mailbox.get("expires_at")
    if not isinstance(email, str) or not email:
        return tool_error("invalid_response", 502, "Missing mailbox address in API response")

    return {
        "inbox_id": email,
        "email": email,
        "expires_at": expires_at,
        "service_name": service_name.strip(),
    }
