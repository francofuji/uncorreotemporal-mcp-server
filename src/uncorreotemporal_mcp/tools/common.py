from __future__ import annotations

from typing import Any

from uncorreotemporal_mcp.utils.api_client import ApiClient, ApiClientError


def tool_error(error: str, status_code: int, detail: str) -> dict[str, Any]:
    return {
        "error": error,
        "status_code": status_code,
        "detail": detail,
    }


async def resolve_message_text(
    api: ApiClient,
    message_text: str | None,
    inbox_id: str | None,
    message_id: str | None,
) -> tuple[str | None, dict[str, Any] | None, dict[str, Any] | None]:
    if message_text:
        return message_text, None, None

    if not inbox_id or not message_id:
        return None, tool_error(
            "validation_error",
            400,
            "Provide message_text or both inbox_id and message_id",
        ), None

    try:
        message = await api.read_message(inbox_id, message_id)
    except ApiClientError as exc:
        return None, exc.to_dict(), None

    body_text = str(message.get("body_text") or "")
    body_html = str(message.get("body_html") or "")
    combined = body_text if body_text.strip() else body_html
    if not combined.strip():
        return None, tool_error("empty_message", 422, "Message body is empty"), message

    return combined, None, message
