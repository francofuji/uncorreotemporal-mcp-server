from __future__ import annotations

from typing import Any

from uncorreotemporal_mcp.tools.common import tool_error
from uncorreotemporal_mcp.utils.api_client import ApiClient, ApiClientError


async def run(
    api: ApiClient,
    inbox_id: str,
    mark_as_read: bool = False,
) -> dict[str, Any]:
    if not inbox_id:
        return tool_error("validation_error", 400, "inbox_id is required")

    try:
        messages = await api.list_messages(inbox_id, limit=1, offset=0)
    except ApiClientError as exc:
        return exc.to_dict()

    if not messages:
        return tool_error("no_messages", 404, "No messages found for inbox")

    latest = messages[0]
    message_id = str(latest.get("id") or "")
    if not message_id:
        return tool_error("invalid_response", 502, "Missing message id in API response")

    try:
        full_message = await api.read_message(inbox_id, message_id)
    except ApiClientError as exc:
        return exc.to_dict()

    return {
        "message_id": str(full_message.get("id") or message_id),
        "subject": full_message.get("subject"),
        "from_address": full_message.get("from_address"),
        "received_at": full_message.get("received_at"),
        "body_text": full_message.get("body_text"),
        "body_html": full_message.get("body_html"),
        "has_attachments": bool(full_message.get("attachments")),
        # API read_message marks messages as read; this side effect is always true.
        "marked_as_read": True,
        "mark_as_read_requested": mark_as_read,
    }
