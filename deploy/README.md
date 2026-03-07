# Public MCP Endpoint Deployment

Target public endpoint:

- `https://uncorreotemporal.com/mcp`

## 1) Start service

```bash
docker compose -f deploy/docker-compose.public-mcp.yml up -d --build
```

## 2) Configure reverse proxy

Use `deploy/nginx.mcp.conf` on edge proxy and route `/mcp` to MCP service.

## 3) Observability and safeguards

- Enable request logging with tool name and status.
- Add upstream timeouts and request body limits.
- Apply rate limits at edge by IP/token.
- Track p95 latency and 4xx/5xx rates.

## 4) Rollout

- Deploy first to staging domain.
- Run MCP client compatibility tests.
- Promote to production when stable.
