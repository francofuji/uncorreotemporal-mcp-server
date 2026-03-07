import httpx
import pytest
import respx

from uncorreotemporal_mcp.server import complete_signup_flow

BASE = "https://uncorreotemporal.com"


@pytest.mark.asyncio
@respx.mock
async def test_complete_signup_flow_success_with_link():
    respx.post(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(
            201,
            json={
                "address": "agent@uncorreotemporal.com",
                "expires_at": "2026-03-08T00:00:00Z",
            },
        )
    )
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
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages/msg-1").mock(
        return_value=httpx.Response(
            200,
            json={
                "id": "msg-1",
                "subject": "Verify your account",
                "from_address": "noreply@example.com",
                "received_at": "2026-03-08T00:00:00Z",
                "body_text": "Click https://example.com/verify?t=abc and use code 483920",
                "body_html": None,
                "attachments": [],
            },
        )
    )

    result = await complete_signup_flow(service_name="github", preferred_domains=["example.com"])
    assert result["status"] == "success"
    assert result["verification_link"].startswith("https://example.com/verify")
    assert result["otp_code"] == "483920"


@pytest.mark.asyncio
@respx.mock
async def test_complete_signup_flow_success_with_otp_only():
    respx.post(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(
            201,
            json={
                "address": "agent@uncorreotemporal.com",
                "expires_at": "2026-03-08T00:00:00Z",
            },
        )
    )
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages").mock(
        return_value=httpx.Response(
            200,
            json=[
                {
                    "id": "msg-2",
                    "subject": "OTP",
                    "from_address": "noreply@example.com",
                    "received_at": "2026-03-08T00:00:00Z",
                }
            ],
        )
    )
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages/msg-2").mock(
        return_value=httpx.Response(
            200,
            json={
                "id": "msg-2",
                "subject": "OTP",
                "from_address": "noreply@example.com",
                "received_at": "2026-03-08T00:00:00Z",
                "body_text": "Your OTP is 112233",
                "body_html": None,
                "attachments": [],
            },
        )
    )

    result = await complete_signup_flow(service_name="notion")
    assert result["status"] == "success"
    assert result["verification_link"] is None
    assert result["otp_code"] == "112233"


@pytest.mark.asyncio
@respx.mock
async def test_complete_signup_flow_timeout():
    respx.post(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(
            201,
            json={
                "address": "agent@uncorreotemporal.com",
                "expires_at": "2026-03-08T00:00:00Z",
            },
        )
    )
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages").mock(
        return_value=httpx.Response(200, json=[])
    )

    result = await complete_signup_flow(
        service_name="github",
        timeout_seconds=1,
        poll_interval_seconds=1,
    )
    assert result["status"] == "timeout"
    assert result["verification_link"] is None


@pytest.mark.asyncio
@respx.mock
async def test_complete_signup_flow_api_error_passthrough():
    respx.post(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(403, json={"detail": "plan without access"})
    )

    result = await complete_signup_flow(service_name="github")
    assert result["error"] == "api_error"
    assert result["status_code"] == 403


@pytest.mark.asyncio
@respx.mock
async def test_complete_signup_flow_filtering_subject_from():
    respx.post(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(
            201,
            json={
                "address": "agent@uncorreotemporal.com",
                "expires_at": "2026-03-08T00:00:00Z",
            },
        )
    )
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages").mock(
        return_value=httpx.Response(
            200,
            json=[
                {
                    "id": "msg-3",
                    "subject": "Please Verify",
                    "from_address": "accounts@example.com",
                    "received_at": "2026-03-08T00:00:00Z",
                }
            ],
        )
    )
    respx.get(f"{BASE}/api/v1/mailboxes/agent@uncorreotemporal.com/messages/msg-3").mock(
        return_value=httpx.Response(
            200,
            json={
                "id": "msg-3",
                "subject": "Please Verify",
                "from_address": "accounts@example.com",
                "received_at": "2026-03-08T00:00:00Z",
                "body_text": "verify https://example.com/confirm",
                "body_html": None,
                "attachments": [],
            },
        )
    )

    result = await complete_signup_flow(
        service_name="github",
        subject_contains="verify",
        from_contains="accounts",
    )
    assert result["status"] == "success"
