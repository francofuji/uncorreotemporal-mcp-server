FROM python:3.12-slim AS builder

WORKDIR /app

COPY pyproject.toml uv.lock README.md ./
COPY src ./src

RUN pip install --no-cache-dir uv \
    && uv pip install --system .

FROM python:3.12-slim AS runtime

WORKDIR /app

COPY --from=builder /usr/local /usr/local

ENV UCT_API_BASE="https://uncorreotemporal.com"
ENV UCT_HTTP_TIMEOUT_SECONDS="20"
ENV UCT_MCP_TRANSPORT="stdio"

ENTRYPOINT ["uncorreotemporal-mcp"]
