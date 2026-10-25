# Future Finders email API setup

The public GitHub Pages site cannot read GitHub Actions secrets or run server-side code. This Cloudflare Worker keeps the Resend key private and sends idea submissions to the configured inbox.

## One-time setup (with a trusted adult)

In the repository Settings → Secrets and variables → Actions, add these repository secrets:

- `RESEND_API_KEY` — the replacement Resend key (the old exposed key should stay revoked).
- `CLOUDFLARE_API_TOKEN` — a Cloudflare API token permitted to deploy Workers.
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID.
- `RESEND_FROM_EMAIL` — a sender address/domain verified in Resend.
- `IDEA_RECIPIENT_EMAIL` — the inbox that should receive ideas.

Do not put secret values into code or commit them. In Resend, verify the sender domain/address before sending real messages.

Then open Actions → “Deploy Future Finders email API” → Run workflow. After it succeeds, copy the deployed Worker URL from the workflow log (it will look like `https://future-finders-api.<your-workers-subdomain>.workers.dev`) into `future-finders/config.js` as the value of `window.FUTURE_FINDERS_API_URL`, and commit that change.

## Safety and limitations

- The Worker only accepts browser requests from `https://darksword89.github.io`.
- It emails submissions; it does not create a database or public idea gallery.
- The form asks for a general location only. Do not request or submit home addresses or other sensitive personal details.
- A trusted adult should manage the receiving inbox and review privacy/safeguarding arrangements before opening submissions to the public.
- Test with a harmless sample idea and confirm it arrives before announcing the form as live.
