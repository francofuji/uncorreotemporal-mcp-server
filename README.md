# uncorreotemporal-mcp

MCP server for UnCorreoTemporal — programmable temporary email for AI agents.

## Installation

```bash
uvx uncorreotemporal-mcp
```

## Configuration

Environment variables:

- `UCT_API_BASE` (default: `https://uncorreotemporal.com`)
- `UCT_API_KEY` (required)

## Claude Desktop example

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
