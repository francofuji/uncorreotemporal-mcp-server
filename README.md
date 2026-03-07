# uncorreotemporal-mcp

MCP server for [UnCorreoTemporal](https://uncorreotemporal.com), a programmable temporary email platform for developers, QA automation, CI/CD pipelines, and AI agents.

This version is workflow-oriented and exposes high-level tools for signup automation.

## What This Server Does

- Wraps UnCorreoTemporal REST API behind MCP tools
- Uses `FastMCP` runtime with stdio transport
- Authenticates with `UCT_API_KEY`
- Exposes 5 high-level tools:
  - `create_signup_inbox`
  - `wait_for_verification_email`
  - `get_latest_email`
  - `extract_otp_code`
  - `extract_verification_link`

## Breaking Change

Legacy low-level tools were removed:

- `create_mailbox`
- `list_mailboxes`
- `get_messages`
- `read_message`
- `delete_mailbox`

### Migration map

- `create_mailbox` -> `create_signup_inbox`
- `get_messages` + `read_message` -> `wait_for_verification_email` + `get_latest_email`
- post-processing in agent prompt -> `extract_otp_code` / `extract_verification_link`

## Installation

### Run directly with `uvx`

```bash
uvx uncorreotemporal-mcp
```

### Install in an existing environment

```bash
pip install uncorreotemporal-mcp
```

## Requirements

- Python 3.11+
- A valid UnCorreoTemporal API key (`uct_...`)

## Configuration

Environment variables:

- `UCT_API_KEY` (required)
- `UCT_API_BASE` (optional, default: `https://uncorreotemporal.com`)
- `UCT_HTTP_TIMEOUT_SECONDS` (optional, default: `20`)

## Important Identifier Rule

`inbox_id` is exactly the inbox email address returned by the API.

Example:

- `inbox_id = "agent42@uncorreotemporal.com"`

## Claude Desktop Configuration

macOS config file location:

- `~/Library/Application Support/Claude/claude_desktop_config.json`

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

## Cursor Configuration

Create/update `.cursor/mcp.json`:

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

### 1) `create_signup_inbox`

Create a temporary signup inbox.

Input:

```json
{
  "service_name": "github",
  "ttl_minutes": 30
}
```

Returns:

```json
{
  "inbox_id": "agent42@uncorreotemporal.com",
  "email": "agent42@uncorreotemporal.com",
  "expires_at": "2026-03-08T12:00:00Z",
  "service_name": "github"
}
```

### 2) `wait_for_verification_email`

Poll until a matching email is received or timeout is reached.

Input:

```json
{
  "inbox_id": "agent42@uncorreotemporal.com",
  "timeout_seconds": 90,
  "poll_interval_seconds": 3,
  "subject_contains": "verify",
  "from_contains": "noreply"
}
```

Returns (received):

```json
{
  "status": "received",
  "message_id": "msg-1",
  "received_at": "2026-03-08T11:30:00Z",
  "subject": "Verify your account",
  "from_address": "noreply@example.com",
  "timeout_seconds": 90
}
```

Returns (timeout):

```json
{
  "status": "timeout",
  "timeout_seconds": 90
}
```

### 3) `get_latest_email`

Fetch full content for the most recent email in an inbox.

Input:

```json
{
  "inbox_id": "agent42@uncorreotemporal.com",
  "mark_as_read": false
}
```

Returns:

```json
{
  "message_id": "msg-1",
  "subject": "Verify your account",
  "from_address": "noreply@example.com",
  "received_at": "2026-03-08T11:30:00Z",
  "body_text": "Your code is 483920",
  "body_html": null,
  "has_attachments": false,
  "marked_as_read": true
}
```

If inbox has no emails:

```json
{
  "error": "no_messages",
  "status_code": 404,
  "detail": "No messages found for inbox"
}
```

### 4) `extract_otp_code`

Extract OTP code from:

- `message_text`, or
- `inbox_id + message_id`

Input:

```json
{
  "message_text": "Your verification code is 483920",
  "otp_length_min": 4,
  "otp_length_max": 8
}
```

Returns:

```json
{
  "otp_code": "483920",
  "candidates": ["483920"]
}
```

### 5) `extract_verification_link`

Extract likely verification URL from:

- `message_text`, or
- `inbox_id + message_id`

Input:

```json
{
  "message_text": "Verify at https://example.com/confirm?token=abc",
  "preferred_domains": ["example.com"]
}
```

Returns:

```json
{
  "verification_link": "https://example.com/confirm?token=abc",
  "candidates": ["https://example.com/confirm?token=abc"]
}
```

## Validation Errors

For `extract_otp_code` and `extract_verification_link`, either:

- provide `message_text`, or
- provide both `inbox_id` and `message_id`

Otherwise:

```json
{
  "error": "validation_error",
  "status_code": 400,
  "detail": "Provide message_text or both inbox_id and message_id"
}
```

## Security Notes

- Treat `UCT_API_KEY` as a secret
- Use short-lived inboxes for verification flows
- Treat email body content as untrusted input

## Troubleshooting

### 401/403 from API

- Verify `UCT_API_KEY` is valid
- Confirm your account plan has API/MCP access

### MCP tools do not appear

- Validate JSON config syntax
- Ensure `uvx` is available
- Restart Claude/Cursor after config changes

### Tool calls fail

- Test API key against REST endpoints
- Verify `UCT_API_BASE` for custom environments

## Development

From repository root:

```bash
uv run pytest
uv run uncorreotemporal-mcp
uv build
```

## Links

- Product: [uncorreotemporal.com](https://uncorreotemporal.com)
- MCP docs page: [uncorreotemporal.com/docs/mcp](https://uncorreotemporal.com/docs/mcp)
- Repository: [github.com/francofuji/uncorreotemporal-mcp-server](https://github.com/francofuji/uncorreotemporal-mcp-server)
