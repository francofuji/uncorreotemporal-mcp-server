from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any

import httpx


@dataclass
class ApiClientError(Exception):
    error: str
    status_code: int
    detail: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "error": self.error,
            "status_code": self.status_code,
            "detail": self.detail,
        }


class ApiClient:
    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        timeout_seconds: float | None = None,
    ) -> None:
        self.api_key = api_key if api_key is not None else os.getenv("UCT_API_KEY", "")
        self.base_url = base_url if base_url is not None else os.getenv("UCT_API_BASE", "https://uncorreotemporal.com")
        if timeout_seconds is None:
            timeout_seconds = float(os.getenv("UCT_HTTP_TIMEOUT_SECONDS", "20"))
        self.timeout_seconds = timeout_seconds
        self._client: httpx.AsyncClient | None = None

        if not self.api_key:
            raise ApiClientError(
                error="missing_api_key",
                status_code=401,
                detail="UCT_API_KEY is required",
            )

    async def __aenter__(self) -> "ApiClient":
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={"Authorization": f"Bearer {self.api_key}"},
            timeout=self.timeout_seconds,
        )
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        if self._client is not None:
            await self._client.aclose()
            self._client = None

    async def create_mailbox(self, ttl_minutes: int | None = None) -> dict[str, Any]:
        params: dict[str, Any] = {}
        if ttl_minutes is not None:
            params["ttl_minutes"] = ttl_minutes
        return await self._request("POST", "/api/v1/mailboxes", params=params)

    async def list_mailboxes(self) -> list[dict[str, Any]]:
        payload = await self._request("GET", "/api/v1/mailboxes")
        if not isinstance(payload, list):
            raise ApiClientError(
                error="invalid_response",
                status_code=502,
                detail="Expected list for list_mailboxes",
            )
        return payload

    async def list_messages(
        self,
        address: str,
        limit: int = 20,
        offset: int = 0,
    ) -> list[dict[str, Any]]:
        payload = await self._request(
            "GET",
            f"/api/v1/mailboxes/{address}/messages",
            params={"limit": limit, "offset": offset},
        )
        if not isinstance(payload, list):
            raise ApiClientError(
                error="invalid_response",
                status_code=502,
                detail="Expected list for list_messages",
            )
        return payload

    async def read_message(self, address: str, message_id: str) -> dict[str, Any]:
        payload = await self._request("GET", f"/api/v1/mailboxes/{address}/messages/{message_id}")
        if not isinstance(payload, dict):
            raise ApiClientError(
                error="invalid_response",
                status_code=502,
                detail="Expected object for read_message",
            )
        return payload

    async def _request(self, method: str, path: str, **kwargs) -> Any:
        try:
            if self._client is None:
                async with httpx.AsyncClient(
                    base_url=self.base_url,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=self.timeout_seconds,
                ) as ephemeral_client:
                    response = await ephemeral_client.request(method, path, **kwargs)
            else:
                response = await self._client.request(method, path, **kwargs)

            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as exc:
            raise self._map_status_error(exc) from exc
        except httpx.RequestError as exc:
            raise ApiClientError(
                error="network_error",
                status_code=503,
                detail=str(exc),
            ) from exc

    @staticmethod
    def _map_status_error(exc: httpx.HTTPStatusError) -> ApiClientError:
        response = exc.response
        detail = "Request failed"
        try:
            payload = response.json()
            if isinstance(payload, dict):
                detail = str(payload.get("detail") or payload)
            else:
                detail = str(payload)
        except ValueError:
            detail = response.text or "Request failed"

        return ApiClientError(
            error="api_error",
            status_code=response.status_code,
            detail=detail,
        )
