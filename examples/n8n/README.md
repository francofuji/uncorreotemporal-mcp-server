# n8n Workflow Example for UnCorreoTemporal

This example demonstrates how to integrate the UnCorreoTemporal REST API into an n8n automation pipeline.

## Motivation

Automate signup verification flows by dynamically creating temporary inboxes, receiving the verification email, extracting the OTP or activation link, and finalizing the signup—all within n8n.

## What this workflow does

1. **Create Mailbox:** Calls `POST /api/v1/mailboxes` to generate a temporary email address.
2. **Sign up with service:** Submits the generated email address to a mock signup endpoint (`https://example.com/signup`).
3. **Wait for Email:** Pauses execution for 5 seconds to give the email time to arrive.
4. **Poll Messages:** Calls `GET /api/v1/mailboxes/{id}/messages` to fetch the inbox contents.
5. **Extract OTP / Link:** Uses a custom Code node to parse the email body and extract a 6-digit OTP and/or a verification link using basic regular expressions.
6. **Call Verification:** Submits the extracted OTP to a mock verification endpoint (`https://example.com/verify`).

## How to use

1. Download the `n8n-workflow.json` file.
2. Open your n8n workspace.
3. In a new or existing workflow, click **Import from file...** and select `n8n-workflow.json`.
4. Replace `https://example.com/signup` and `https://example.com/verify` in the HTTP Request nodes with the actual service you are testing.
5. Click **Execute Workflow** to test the pipeline.

## Notes

- **Polling:** Depending on the speed of the service sending the email, you may need to increase the Wait node's time or implement a polling loop in n8n (using an IF node to check if the message array is empty and loop back to the Wait node).
- **Extraction Logic:** The regex in the Code node `\b\d{6}\b` matches standard 6-digit OTPs. You can adjust this to fit the format of the emails you expect.
