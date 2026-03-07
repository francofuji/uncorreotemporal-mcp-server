import httpx
import pytest
import respx

from uncorreotemporal_mcp.server import call_tool

BASE = "https://uncorreotemporal.com"


@pytest.mark.asyncio
@respx.mock
async def test_create_mailbox():
    respx.post(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(
            201,
            json={
                "address": "test@uncorreotemporal.com",
                "expires_at": "2026-03-07T12:00:00Z",
                "session_token": "tok",
            },
        )
    )
    result = await call_tool("create_mailbox", {"ttl_minutes": 30})
    assert "test@uncorreotemporal.com" in result[0].text


@pytest.mark.asyncio
@respx.mock
async def test_list_mailboxes():
    respx.get(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(
            200,
            json=[
                {
                    "address": "test@uncorreotemporal.com",
                    "expires_at": "2026-03-07T12:00:00Z",
                    "message_count": 0,
                }
            ],
        )
    )
    result = await call_tool("list_mailboxes", {})
    assert "test@uncorreotemporal.com" in result[0].text


@pytest.mark.asyncio
@respx.mock
async def test_get_messages():
    respx.get(f"{BASE}/api/v1/mailboxes/test@uncorreotemporal.com/messages").mock(
        return_value=httpx.Response(
            200,
            json=[{"id": "msg-1", "subject": "Hello", "is_read": False}],
        )
    )
    result = await call_tool("get_messages", {"address": "test@uncorreotemporal.com"})
    assert "msg-1" in result[0].text


@pytest.mark.asyncio
@respx.mock
async def test_read_message():
    respx.get(
        f"{BASE}/api/v1/mailboxes/test@uncorreotemporal.com/messages/msg-1"
    ).mock(
        return_value=httpx.Response(
            200,
            json={"id": "msg-1", "body_text": "Hello world", "body_html": None},
        )
    )
    result = await call_tool(
        "read_message", {"address": "test@uncorreotemporal.com", "message_id": "msg-1"}
    )
    assert "Hello world" in result[0].text


@pytest.mark.asyncio
@respx.mock
async def test_delete_mailbox():
    respx.delete(f"{BASE}/api/v1/mailboxes/test@uncorreotemporal.com").mock(
        return_value=httpx.Response(204)
    )
    result = await call_tool("delete_mailbox", {"address": "test@uncorreotemporal.com"})
    assert "Deleted" in result[0].text
