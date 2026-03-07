# uncorreotemporal-mcp

MCP server for [UnCorreoTemporal](https://uncorreotemporal.com), a programmable temporary email platform for developers, QA automation, CI/CD pipelines, and AI agents.

This package exposes temporary inbox operations as MCP tools, so MCP-compatible clients (Claude Desktop, Cursor, Continue, custom agent runtimes) can create inboxes, read incoming messages, and clean up mailboxes without custom REST glue code.

## What This Server Does

- Wraps UnCorreoTemporal REST API behind MCP tools
- Uses stdio transport (ideal for local MCP client integration)
- Authenticates with a single API key (`UCT_API_KEY`)
- Exposes 5 production-ready tools:
  - `create_mailbox`
  - `list_mailboxes`
  - `get_messages`
  - `read_message`
  - `delete_mailbox`

## Installation

### Run directly with `uvx` (recommended)

```bash
uvx uncorreotemporal-mcp
```

### Install in an existing Python environment

```bash
pip install uncorreotemporal-mcp
```

## Requirements

- Python 3.11+
- A valid UnCorreoTemporal API key (`uct_...`)

Get your API key from your UnCorreoTemporal account/dashboard.

## Configuration

Environment variables:

- `UCT_API_KEY` (required): API key used for all tool calls
- `UCT_API_BASE` (optional): API base URL
  - default: `https://uncorreotemporal.com`

## Claude Desktop Configuration

macOS config file location:

- `~/Library/Application Support/Claude/claude_desktop_config.json`

Example:

```json
{
  "mcpServers": {
    "uncorreotemporal": {
      "command": "uvx",
      "args": ["uncorreotemporal-mcp"],
      "env": {
        "UCT_API_KEY": "uct_your_key_here"
      }
    }
  }
}
```

After saving, restart Claude Desktop. The five tools should appear in the tools menu.

## Cursor Configuration

In your project, create/update `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "uncorreotemporal": {
      "command": "uvx",
      "args": ["uncorreotemporal-mcp"],
      "env": {
        "UCT_API_KEY": "uct_your_key_here"
      }
    }
  }
}
```

## Tools Reference

### 1) `create_mailbox`
Create a temporary inbox.

Input:

```json
{
  "ttl_minutes": 30
}
```

- `ttl_minutes` is optional.

Returns (example):

```json
{
  "address": "agent42@uncorreotemporal.com",
  "expires_at": "2026-03-07T12:00:00Z",
  "session_token": "..."
}
```

### 2) `list_mailboxes`
List active mailboxes for the API key owner.

Input:

```json
{}
```

Returns (example):

```json
[
  {
    "address": "agent42@uncorreotemporal.com",
    "expires_at": "2026-03-07T12:00:00Z",
    "message_count": 0
  }
]
```

### 3) `get_messages`
List message metadata for a mailbox.

Input:

```json
{
  "address": "agent42@uncorreotemporal.com"
}
```

Returns (example):

```json
[
  {
    "id": "msg-1",
    "from_address": "noreply@example.com",
    "subject": "Verify your account",
    "received_at": "2026-03-07T11:30:00Z",
    "is_read": false,
    "has_attachments": false
  }
]
```

### 4) `read_message`
Read full message content (marks message as read).

Input:

```json
{
  "address": "agent42@uncorreotemporal.com",
  "message_id": "msg-1"
}
```

Returns includes fields such as:

- `body_text`
- `body_html`
- `attachments` (metadata)

### 5) `delete_mailbox`
Deactivate/delete a mailbox.

Input:

```json
{
  "address": "agent42@uncorreotemporal.com"
}
```

Returns:

- `Deleted`

## Typical Agent Flow

1. `create_mailbox` to get a temporary inbox
2. Use inbox address for sign-up / verification flow
3. Poll with `get_messages`
4. Read target email with `read_message`
5. Extract OTP/link from `body_text`
6. `delete_mailbox` after completion

## Direct REST API Mapping

This MCP server maps directly to these API endpoints:

- `POST /api/v1/mailboxes`
- `GET /api/v1/mailboxes`
- `GET /api/v1/mailboxes/{address}/messages`
- `GET /api/v1/mailboxes/{address}/messages/{id}`
- `DELETE /api/v1/mailboxes/{address}`

All calls include:

- `Authorization: Bearer <UCT_API_KEY>`

## Security Notes

- Treat `UCT_API_KEY` as a secret; do not hardcode it in prompts or source code.
- Use short-lived inboxes (`ttl_minutes`) for verification flows.
- Delete mailboxes when done to reduce exposure and quota usage.
- Treat email body content as untrusted input.
- `read_message` returns attachment metadata only; avoid automated execution of external payloads.

## Troubleshooting

### 401 Unauthorized / 403 Forbidden

- Verify `UCT_API_KEY` is set and valid.
- Confirm your account/plan has API/MCP access.

### No tools appear in Claude/Cursor

- Check JSON config syntax.
- Ensure `uvx` is available.
- Restart the MCP client app after config changes.

### MCP server starts but tool calls fail

- Test API key with REST endpoint directly.
- Verify `UCT_API_BASE` if using non-default environment.

## Development

From repository root:

```bash
uv run pytest
uv run uncorreotemporal-mcp
uv build
```

Expected build artifacts:

- `dist/uncorreotemporal_mcp-0.1.0.tar.gz`
- `dist/uncorreotemporal_mcp-0.1.0-py3-none-any.whl`

## Links

- Product: [uncorreotemporal.com](https://uncorreotemporal.com)
- MCP docs page: [uncorreotemporal.com/docs/mcp](https://uncorreotemporal.com/docs/mcp)
- Repository: [github.com/francofuji/uncorreotemporal-mcp-server](https://github.com/francofuji/uncorreotemporal-mcp-server)
