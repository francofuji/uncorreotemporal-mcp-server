# Listing Draft: modelcontextprotocol/servers

- Name: `uncorreotemporal-mcp`
- Description: Temporary email MCP server for autonomous signup and verification workflows.
- Install:
  - `uvx uncorreotemporal-mcp`
  - `docker run --rm -i -e UCT_API_KEY=... uncorreotemporal-mcp`
- Auth: `UCT_API_KEY` env var
- Transport:
  - `stdio` (default)
  - `streamable-http` (`UCT_MCP_TRANSPORT=streamable-http`, path `/mcp`)
- Tools:
  - `create_signup_inbox`
  - `wait_for_verification_email`
  - `get_latest_email`
  - `extract_otp_code`
  - `extract_verification_link`
  - `complete_signup_flow`
- Repo: `https://github.com/francofuji/uncorreotemporal-mcp-server`
- Docs: `https://uncorreotemporal.com/docs/mcp`
