import asyncio
import os

import httpx
from mcp import types
from mcp.server import Server
from mcp.server.stdio import stdio_server

API_BASE = os.getenv("UCT_API_BASE", "https://uncorreotemporal.com")
API_KEY = os.getenv("UCT_API_KEY", "")

server = Server("uncorreotemporal")


def _headers() -> dict:
    return {"Authorization": f"Bearer {API_KEY}"}


@server.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="create_mailbox",
            description="Create a temporary email inbox. Returns address, expiry, and session token.",
            inputSchema={
                "type": "object",
                "properties": {
                    "ttl_minutes": {
                        "type": "integer",
                        "description": "Inbox lifetime in minutes (optional)",
                    }
                },
            },
        ),
        types.Tool(
            name="list_mailboxes",
            description="List all active inboxes for this API key.",
            inputSchema={"type": "object", "properties": {}},
        ),
        types.Tool(
            name="get_messages",
            description="List messages in an inbox.",
            inputSchema={
                "type": "object",
                "properties": {
                    "address": {"type": "string", "description": "Inbox email address"}
                },
                "required": ["address"],
            },
        ),
        types.Tool(
            name="read_message",
            description="Get full content of a message (body_text, body_html, attachments). Marks as read.",
            inputSchema={
                "type": "object",
                "properties": {
                    "address": {"type": "string"},
                    "message_id": {"type": "string"},
                },
                "required": ["address", "message_id"],
            },
        ),
        types.Tool(
            name="delete_mailbox",
            description="Delete (deactivate) an inbox.",
            inputSchema={
                "type": "object",
                "properties": {"address": {"type": "string"}},
                "required": ["address"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    async with httpx.AsyncClient(base_url=API_BASE, headers=_headers()) as client:
        if name == "create_mailbox":
            params = {}
            if "ttl_minutes" in arguments:
                params["ttl_minutes"] = arguments["ttl_minutes"]
            r = await client.post("/api/v1/mailboxes", params=params)
            r.raise_for_status()
            return [types.TextContent(type="text", text=str(r.json()))]

        if name == "list_mailboxes":
            r = await client.get("/api/v1/mailboxes")
            r.raise_for_status()
            return [types.TextContent(type="text", text=str(r.json()))]

        if name == "get_messages":
            address = arguments["address"]
            r = await client.get(f"/api/v1/mailboxes/{address}/messages")
            r.raise_for_status()
            return [types.TextContent(type="text", text=str(r.json()))]

        if name == "read_message":
            address = arguments["address"]
            message_id = arguments["message_id"]
            r = await client.get(f"/api/v1/mailboxes/{address}/messages/{message_id}")
            r.raise_for_status()
            return [types.TextContent(type="text", text=str(r.json()))]

        if name == "delete_mailbox":
            address = arguments["address"]
            r = await client.delete(f"/api/v1/mailboxes/{address}")
            r.raise_for_status()
            return [types.TextContent(type="text", text="Deleted")]

        raise ValueError(f"Unknown tool: {name}")


async def _run_stdio() -> None:
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options(),
        )


def main() -> None:
    asyncio.run(_run_stdio())
