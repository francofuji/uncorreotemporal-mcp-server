# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-03-09

### Added
- `create_signup_inbox` — creates a temporary inbox for a given service
- `wait_for_verification_email` — polls until a verification email arrives
- `get_latest_email` — retrieves the most recent message in an inbox
- `extract_otp_code` — parses a one-time password from an email body
- `extract_verification_link` — extracts the verification URL from an email
- `complete_signup_flow` — high-level orchestration of the full signup + verification cycle
- HTTP transport support (`streamable-http`, `sse`) in addition to `stdio`
- Docker image for self-hosted public MCP endpoint deployment
