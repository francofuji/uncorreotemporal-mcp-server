# uncorreotemporal-mcp

[![MCP Badge](https://lobehub.com/badge/mcp/francofuji-uncorreotemporal-mcp-server)](https://lobehub.com/mcp/francofuji-uncorreotemporal-mcp-server)

MCP server for [UnCorreoTemporal](https://uncorreotemporal.com), focused on autonomous signup and email verification workflows.

[![Glama](https://glama.ai/mcp/servers/francofuji/un-correo-temporal/badge)](https://glama.ai/mcp/servers/francofuji/un-correo-temporal)

## Architecture Demo

```text
AI Agent
   |
   | MCP
   v
Temporary Email MCP Server
   |
   v
UnCorreoTemporal API
```

## Remote Connection (No Installation)

Connect directly to the public endpoint — no local install needed:

```json
{
  "mcpServers": {
    "uncorreotemporal-mcp": {
      "url": "https://uncorreotemporal.com/mcp"
    }
  }
}
```

The public endpoint is free to use for testing. For production workloads, set your own `UCT_API_KEY` via local install.

## Quickstart (30 seconds)

```bash
uvx uncorreotemporal-mcp
```

Or run local project version:

```bash
UCT_API_KEY=uct_your_key_here \
uv run uncorreotemporal-mcp
```

## Minimal Workflow Example

```python
inbox = await create_signup_inbox("github")
email = await wait_for_verification_email(inbox["inbox_id"])
link = await extract_verification_link(
    inbox_id=inbox["inbox_id"],
    message_id=email["message_id"],
)
```

## Public Tools

- `create_signup_inbox`
- `wait_for_verification_email`
- `get_latest_email`
- `extract_otp_code`
- `extract_verification_link`
- `complete_signup_flow`

### New v1 tool: `complete_signup_flow`

Runs:

1. create inbox
2. wait verification email
3. extract verification link + OTP

Input:

```json
{
  "service_name": "github",
  "timeout_seconds": 90,
  "poll_interval_seconds": 3,
  "subject_contains": "verify",
  "from_contains": "noreply",
  "preferred_domains": ["github.com"],
  "ttl_minutes": 30
}
```

Output:

```json
{
  "status": "success",
  "inbox_id": "agent42@uncorreotemporal.com",
  "email": "agent42@uncorreotemporal.com",
  "verification_message": {
    "message_id": "msg-1",
    "subject": "Verify your email",
    "from_address": "noreply@example.com",
    "received_at": "2026-03-08T11:30:00Z"
  },
  "verification_link": "https://example.com/confirm?t=abc",
  "otp_code": "483920",
  "link_candidates": ["https://example.com/confirm?t=abc"],
  "otp_candidates": ["483920"]
}
```

`status` can be `success`, `partial_success`, or `timeout`.

## Tool I/O summary

### `create_signup_inbox(service_name, ttl_minutes?)`

Returns:

```json
{
  "inbox_id": "agent42@uncorreotemporal.com",
  "email": "agent42@uncorreotemporal.com",
  "expires_at": "2026-03-08T12:00:00Z",
  "service_name": "github"
}
```

### `wait_for_verification_email(inbox_id, timeout_seconds?, poll_interval_seconds?, subject_contains?, from_contains?)`

Returns:

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

### `get_latest_email(inbox_id, mark_as_read?)`

Returns full message body and metadata.

### `extract_otp_code(message_text? | inbox_id+message_id, otp_length_min?, otp_length_max?)`

Returns:

```json
{
  "otp_code": "483920",
  "candidates": ["483920"]
}
```

### `extract_verification_link(message_text? | inbox_id+message_id, preferred_domains?)`

Returns:

```json
{
  "verification_link": "https://example.com/confirm?t=abc",
  "candidates": ["https://example.com/confirm?t=abc"]
}
```

## Configuration

Environment variables:

- `UCT_API_KEY` (required)
- `UCT_API_BASE` (optional, default: `https://uncorreotemporal.com`)
- `UCT_HTTP_TIMEOUT_SECONDS` (optional, default: `20`)
- `UCT_MCP_TRANSPORT` (optional, `stdio` by default; also supports `streamable-http` and `sse`)
- `UCT_MCP_HOST` (optional, default: `0.0.0.0`)
- `UCT_MCP_PORT` (optional, default: `8000`)
- `UCT_MCP_PATH` (optional, default: `/mcp`)

Important: `inbox_id == email address`.

## Examples

See `/examples`:

- `simple_workflow.py`
- `openai_agent_signup.py`
- `langchain_agent_signup.py`
- `agent_creates_account.py`

Run dry-run:

```bash
uv run python examples/simple_workflow.py --dry-run
```

## Docker

Build:

```bash
docker build -t uncorreotemporal-mcp .
```

Run stdio mode:

```bash
docker run --rm -i \
  -e UCT_API_KEY=uct_your_key_here \
  uncorreotemporal-mcp
```

Run streamable-http mode:

```bash
docker run --rm -p 8000:8000 \
  -e UCT_API_KEY=uct_your_key_here \
  -e UCT_MCP_TRANSPORT=streamable-http \
  -e UCT_MCP_PATH=/mcp \
  uncorreotemporal-mcp
```

## Breaking Changes

Removed legacy low-level tools:

- `create_mailbox`
- `list_mailboxes`
- `get_messages`
- `read_message`
- `delete_mailbox`

Migration map:

- `create_mailbox` -> `create_signup_inbox`
- `get_messages` + `read_message` -> `wait_for_verification_email` + `get_latest_email`
- multi-step signup orchestration -> `complete_signup_flow`

## Directory listing assets

Prepared listing payloads are in `/directory-listings` for:

- modelcontextprotocol/servers
- mcp.so
- awesome-mcp

## Public endpoint deployment

Deployment templates for `https://uncorreotemporal.com/mcp` are in `/deploy`.

## Development

```bash
uv run pytest
uv run uncorreotemporal-mcp
```
