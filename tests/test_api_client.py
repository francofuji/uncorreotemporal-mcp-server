import httpx
import pytest
import respx

from uncorreotemporal_mcp.utils.api_client import ApiClient, ApiClientError

BASE = "https://uncorreotemporal.com"


@pytest.mark.asyncio
@respx.mock
async def test_api_client_sets_bearer_header():
    route = respx.post(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(
            201,
            json={
                "address": "agent@uncorreotemporal.com",
                "expires_at": "2026-03-08T00:00:00Z",
            },
        )
    )

    async with ApiClient(api_key="uct_test_key", base_url=BASE) as api:
        payload = await api.create_mailbox(ttl_minutes=10)

    assert payload["address"] == "agent@uncorreotemporal.com"
    assert route.called
    request = route.calls.last.request
    assert request.headers["Authorization"] == "Bearer uct_test_key"


@pytest.mark.asyncio
@respx.mock
async def test_api_client_maps_status_errors():
    respx.get(f"{BASE}/api/v1/mailboxes").mock(
        return_value=httpx.Response(401, json={"detail": "invalid api key"})
    )

    async with ApiClient(api_key="uct_test_key", base_url=BASE) as api:
        with pytest.raises(ApiClientError) as exc_info:
            await api.list_mailboxes()

    err = exc_info.value
    assert err.error == "api_error"
    assert err.status_code == 401
    assert "invalid api key" in err.detail


@pytest.mark.asyncio
@respx.mock
async def test_api_client_maps_network_errors():
    respx.get(f"{BASE}/api/v1/mailboxes").mock(side_effect=httpx.ConnectError("offline"))

    async with ApiClient(api_key="uct_test_key", base_url=BASE) as api:
        with pytest.raises(ApiClientError) as exc_info:
            await api.list_mailboxes()

    err = exc_info.value
    assert err.error == "network_error"
    assert err.status_code == 503


def test_api_client_requires_api_key():
    with pytest.raises(ApiClientError) as exc_info:
        ApiClient(api_key="", base_url=BASE)
    assert exc_info.value.error == "missing_api_key"
