from __future__ import annotations

from typing import Any

from mcp.server.fastmcp import FastMCP

from uncorreotemporal_mcp.tools import (
    create_signup_inbox as create_signup_inbox_tool,
    extract_otp_code as extract_otp_code_tool,
    extract_verification_link as extract_verification_link_tool,
    get_latest_email as get_latest_email_tool,
    wait_for_verification_email as wait_for_verification_email_tool,
)
from uncorreotemporal_mcp.utils.api_client import ApiClient, ApiClientError

mcp = FastMCP(
    name="uncorreotemporal-mcp",
    json_response=True,
)


def _internal_error(exc: Exception) -> dict[str, Any]:
    return {
        "error": "internal_error",
        "status_code": 500,
        "detail": str(exc),
    }


@mcp.tool(description="Create a temporary signup inbox for a target service.")
async def create_signup_inbox(
    service_name: str,
    ttl_minutes: int | None = None,
) -> dict[str, Any]:
    try:
        async with ApiClient() as api:
            return await create_signup_inbox_tool.run(
                api=api,
                service_name=service_name,
                ttl_minutes=ttl_minutes,
            )
    except ApiClientError as exc:
        return exc.to_dict()
    except Exception as exc:  # pragma: no cover
        return _internal_error(exc)


@mcp.tool(description="Wait until a verification email arrives or timeout is reached.")
async def wait_for_verification_email(
    inbox_id: str,
    timeout_seconds: int = 90,
    poll_interval_seconds: int = 3,
    subject_contains: str | None = None,
    from_contains: str | None = None,
) -> dict[str, Any]:
    try:
        async with ApiClient() as api:
            return await wait_for_verification_email_tool.run(
                api=api,
                inbox_id=inbox_id,
                timeout_seconds=timeout_seconds,
                poll_interval_seconds=poll_interval_seconds,
                subject_contains=subject_contains,
                from_contains=from_contains,
            )
    except ApiClientError as exc:
        return exc.to_dict()
    except Exception as exc:  # pragma: no cover
        return _internal_error(exc)


@mcp.tool(description="Read and return the latest full email in an inbox.")
async def get_latest_email(
    inbox_id: str,
    mark_as_read: bool = False,
) -> dict[str, Any]:
    try:
        async with ApiClient() as api:
            return await get_latest_email_tool.run(
                api=api,
                inbox_id=inbox_id,
                mark_as_read=mark_as_read,
            )
    except ApiClientError as exc:
        return exc.to_dict()
    except Exception as exc:  # pragma: no cover
        return _internal_error(exc)


@mcp.tool(description="Extract a numeric OTP code from an email body or message reference.")
async def extract_otp_code(
    message_text: str | None = None,
    inbox_id: str | None = None,
    message_id: str | None = None,
    otp_length_min: int = 4,
    otp_length_max: int = 8,
) -> dict[str, Any]:
    try:
        async with ApiClient() as api:
            return await extract_otp_code_tool.run(
                api=api,
                message_text=message_text,
                inbox_id=inbox_id,
                message_id=message_id,
                otp_length_min=otp_length_min,
                otp_length_max=otp_length_max,
            )
    except ApiClientError as exc:
        return exc.to_dict()
    except Exception as exc:  # pragma: no cover
        return _internal_error(exc)


@mcp.tool(description="Extract the most likely verification link from an email.")
async def extract_verification_link(
    message_text: str | None = None,
    inbox_id: str | None = None,
    message_id: str | None = None,
    preferred_domains: list[str] | None = None,
) -> dict[str, Any]:
    try:
        async with ApiClient() as api:
            return await extract_verification_link_tool.run(
                api=api,
                message_text=message_text,
                inbox_id=inbox_id,
                message_id=message_id,
                preferred_domains=preferred_domains,
            )
    except ApiClientError as exc:
        return exc.to_dict()
    except Exception as exc:  # pragma: no cover
        return _internal_error(exc)


def main() -> None:
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
