from __future__ import annotations

from typing import Any

from uncorreotemporal_mcp.tools import (
    create_signup_inbox,
    extract_otp_code,
    extract_verification_link,
    wait_for_verification_email,
)
from uncorreotemporal_mcp.tools.common import tool_error
from uncorreotemporal_mcp.utils.api_client import ApiClient, ApiClientError


async def run(
    api: ApiClient,
    service_name: str,
    timeout_seconds: int = 90,
    poll_interval_seconds: int = 3,
    subject_contains: str | None = None,
    from_contains: str | None = None,
    preferred_domains: list[str] | None = None,
    ttl_minutes: int | None = None,
) -> dict[str, Any]:
    created = await create_signup_inbox.run(
        api=api,
        service_name=service_name,
        ttl_minutes=ttl_minutes,
    )
    if created.get("error"):
        return created

    inbox_id = str(created["inbox_id"])
    waited = await wait_for_verification_email.run(
        api=api,
        inbox_id=inbox_id,
        timeout_seconds=timeout_seconds,
        poll_interval_seconds=poll_interval_seconds,
        subject_contains=subject_contains,
        from_contains=from_contains,
    )

    if waited.get("status") == "timeout":
        return {
            "status": "timeout",
            "inbox_id": created["inbox_id"],
            "email": created["email"],
            "verification_message": None,
            "verification_link": None,
            "otp_code": None,
        }

    if waited.get("error"):
        return waited

    message_id = waited.get("message_id")
    if not message_id:
        return tool_error("invalid_response", 502, "Missing message_id after wait_for_verification_email")

    try:
        message = await api.read_message(inbox_id, str(message_id))
    except ApiClientError as exc:
        return exc.to_dict()

    message_text = str(message.get("body_text") or "")
    if not message_text.strip():
        message_text = str(message.get("body_html") or "")

    link_result = await extract_verification_link.run(
        api=api,
        message_text=message_text,
        preferred_domains=preferred_domains,
    )
    otp_result = await extract_otp_code.run(api=api, message_text=message_text)

    verification_link = link_result.get("verification_link") if not link_result.get("error") else None
    otp_code = otp_result.get("otp_code") if not otp_result.get("error") else None

    if verification_link or otp_code:
        status = "success"
    else:
        status = "partial_success"

    return {
        "status": status,
        "inbox_id": created["inbox_id"],
        "email": created["email"],
        "verification_message": {
            "message_id": str(message.get("id") or message_id),
            "subject": message.get("subject"),
            "from_address": message.get("from_address"),
            "received_at": message.get("received_at"),
        },
        "verification_link": verification_link,
        "otp_code": otp_code,
        "link_candidates": link_result.get("candidates", []) if isinstance(link_result, dict) else [],
        "otp_candidates": otp_result.get("candidates", []) if isinstance(otp_result, dict) else [],
    }
