import httpx
import pytest
import respx

from uncorreotemporal_mcp.server import (
    create_signup_inbox,
    extract_otp_code,
    extract_verification_link,
    get_latest_email,
    mcp,
    wait_for_verification_email,
)

BASE = "https://uncorreotemporal.com"


@pytest.mark.asyncio
async def test_contract_only_high_level_tools_registered():
    names = sorted(tool.name for tool in await mcp.list_tools())
    assert names == [
        "create_signup_inbox",
        "extract_otp_code",
        "extract_verification_link",
        "get_latest_email",
        "wait_for_verification_email",
    ]


@pytest.mark.asyncio
@respx.mock
async def test_create_signup_inbox_shape():
    respx.post(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(
            201,
            json={
                "address": "agent@uncorreotemporal.com",
                "expires_at": "2026-03-08T00:00:00Z",
            },
        )
    )

    result = await create_signup_inbox("github")
    assert result["inbox_id"] == "agent@uncorreotemporal.com"
    assert result["email"] == "agent@uncorreotemporal.com"
    assert result["service_name"] == "github"


@pytest.mark.asyncio
@respx.mock
async def test_wait_for_verification_email_received():
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages").mock(
        return_value=httpx.Response(
            200,
            json=[
                {
                    "id": "msg-1",
                    "subject": "Verify your account",
                    "from_address": "noreply@example.com",
                    "received_at": "2026-03-08T00:00:00Z",
                }
            ],
        )
    )

    result = await wait_for_verification_email(
        inbox_id="agent@uncorreotemporal.com",
        timeout_seconds=2,
        poll_interval_seconds=1,
        subject_contains="verify",
    )
    assert result["status"] == "received"
    assert result["message_id"] == "msg-1"


@pytest.mark.asyncio
@respx.mock
async def test_wait_for_verification_email_timeout():
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages").mock(
        return_value=httpx.Response(200, json=[])
    )

    result = await wait_for_verification_email(
        inbox_id="agent@uncorreotemporal.com",
        timeout_seconds=1,
        poll_interval_seconds=1,
    )
    assert result["status"] == "timeout"


@pytest.mark.asyncio
@respx.mock
async def test_get_latest_email_ok():
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages").mock(
        return_value=httpx.Response(
            200,
            json=[{"id": "msg-9", "subject": "Welcome"}],
        )
    )
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages/msg-9").mock(
        return_value=httpx.Response(
            200,
            json={
                "id": "msg-9",
                "subject": "Welcome",
                "from_address": "noreply@example.com",
                "received_at": "2026-03-08T00:00:00Z",
                "body_text": "Your code is 483920",
                "body_html": None,
                "attachments": [],
            },
        )
    )

    result = await get_latest_email("agent@uncorreotemporal.com")
    assert result["message_id"] == "msg-9"
    assert result["body_text"] == "Your code is 483920"


@pytest.mark.asyncio
@respx.mock
async def test_get_latest_email_no_messages():
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages").mock(
        return_value=httpx.Response(200, json=[])
    )

    result = await get_latest_email("agent@uncorreotemporal.com")
    assert result["error"] == "no_messages"


@pytest.mark.asyncio
async def test_extract_otp_code_from_message_text():
    result = await extract_otp_code(message_text="Your verification code is 483920")
    assert result["otp_code"] == "483920"


@pytest.mark.asyncio
@respx.mock
async def test_extract_otp_code_from_inbox_message_id():
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages/msg-1").mock(
        return_value=httpx.Response(
            200,
            json={"id": "msg-1", "body_text": "OTP: 112233", "body_html": None},
        )
    )

    result = await extract_otp_code(
        inbox_id="agent@uncorreotemporal.com",
        message_id="msg-1",
    )
    assert result["otp_code"] == "112233"


@pytest.mark.asyncio
async def test_extract_verification_link_prefers_domain():
    result = await extract_verification_link(
        message_text=(
            "Open https://foo.com/hello first. "
            "Then verify at https://example.com/confirm?token=abc"
        ),
        preferred_domains=["example.com"],
    )
    assert result["verification_link"].startswith("https://example.com/confirm")


@pytest.mark.asyncio
async def test_extract_tools_validate_inputs():
    otp_result = await extract_otp_code()
    link_result = await extract_verification_link()

    assert otp_result["error"] == "validation_error"
    assert link_result["error"] == "validation_error"
