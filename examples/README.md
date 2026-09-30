# n8n workflow example

`n8n-workflow.json` creates a temporary inbox, polls it for a verification
message, extracts an OTP or verification link, and optionally opens an allowed
verification URL.

## Import and configure

1. In n8n, choose **Import from File** and select `n8n-workflow.json`.
2. Open `Config` and replace `uct_replace_me` with your UnCorreoTemporal API key.
3. Add the hostname used by your target service to
   `allowed_verification_hosts`. Subdomains are accepted.
4. Run the workflow and use the address returned by `Create Temporary Inbox` in
   the signup flow you are testing.

The default configuration polls every five seconds for up to 18 attempts and
fails explicitly if no message arrives.

## Safety notes

- The API key is sent only to `base_url`; never commit a real key.
- `Open Verification Link` runs only for a URL matching
  `allowed_verification_hosts`. Keep this list narrow.
- If a message contains only an OTP, the workflow returns `otp_code` without
  making a verification request.

## Optional signup request

Signup APIs differ by service. For a fully automated signup, insert an HTTP
Request node between `Create Temporary Inbox` and `Wait Before Poll`, then use
the returned `email`, `address`, or `inbox_id` field in that service's request.
