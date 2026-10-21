# Validation and release gates

## Current status

- Local scheduling, request validation, mocked Google persistence/mail/idempotency and relay tests: run using README command. All are synthetic and do not send data externally.
- Google OAuth, Calendar FreeBusy, actual Sheets writes, MailApp delivery and deployed CORS: NOT verified until owner deploys and explicitly starts live testing.
- WeChat Developer Tools, registered AppID, service-category eligibility, request-domain approval and mainland devices: NOT verified. Scaffold is a handoff, not a published mini-program.
- Production Calendly and main branch are unchanged. No DNS, email settings or production integration has been modified.

## Local meaningful checks

Tests cover weekday and weekend hours, dated evening overrides, 24-hour lead time, 30-day horizon, both Toronto DST changes, busy overlap including buffer, duplicate windows, invalid config, consent and contact validation, sheet formula escaping, repeated request IDs, changed payload conflicts, email failure after save, Calendar errors failing closed, 50-request cap, manifest scopes, CORS rejection and stripping unexpected relay fields.

Client visual checks must include desktop and narrow mobile width, readable bilingual labels, keyboard form use, no horizontal overflow, disabled unconfigured submission, empty openings, stale availability responses after date changes, and saved-request wording. Browser mock data is not proof of deployed service operation.

## Owner-controlled Google integration test (requires explicit start)

1. Use a private test sheet, owned script, configured notification address and deployment. Confirm no real client data is involved.
2. Authorize only listed scopes. Verify Calendar API enabled and script executes as owner, not visitor. Call GET health, then POST availability; health alone is insufficient.
3. Create a temporary busy event manually in the owner's Calendar if authorized; verify its interval is excluded. The program must not create the event. Also check an event marked free does not block.
4. Add dated evening override and verify slots remain inside that window including buffer. Remove row and query again.
5. Submit one explicitly marked test request. Verify exactly one Requests row and one notification email with matching ID. Check inbox/spam; MailApp accepted does not prove delivery.
6. Resubmit same payload+ID; expect same receipt, no duplicate row/mail. Change fields under same ID; expect ID_CONFLICT.
7. Simulate Calendar error in test deployment; no slots must be exposed as free. Simulate MailApp failure; request remains saved with notification failed.
8. Inspect response and network log locally: no OAuth token, calendar ID, raw busy intervals or sheet ID. Do not share private logs with WorkBuddy.
9. Remove synthetic data and any temporary manually created event when owner approves. No automated deletion is supplied.

## Mainland availability matrix

Record each test using a real mainland device, date/time, WeChat/base-library version, network type/carrier, deployed code version, public hostname and result. Do not infer results from VPN, Canada tests or developer tools with domain validation disabled.

| Route | Wi-Fi | Mobile data | Required observations |
| --- | --- | --- | --- |
| Browser → Apps Script direct | Pending | Pending | Google reachability, redirect, readable JSON/CORS |
| WeChat → Apps Script direct | Pending | Pending | Domain eligibility, HTTPS, redirect target approval and request result |
| Browser → Worker → Apps Script | Pending | Pending | CORS preflight/POST and readable JSON |
| WeChat → Worker → Apps Script | Pending | Pending | Approved request domain, TLS, no unexpected redirects, real response |

For every viable route: query at least two dates, choose a known available slot, and (only after owner authorizes) submit one synthetic request and reconcile Sheets row + email + receipt. Repeat at a second time of day. Verify declared date/time means the same instant in Toronto and mainland China. Ensure error responses never display a saved receipt. A preferred-time form does not solve an unreachable submission endpoint.

Pass only when required domains meet actual WeChat backend checks and both mainland networks complete the full request path. If only one route works, document exactly which. If no free route passes, keep production unchanged and report the limitation. Do not silently introduce paid hosting, unapproved DNS changes or a different service category.

## Official references checked 2026-10-21

- [Google FreeBusy query and accepted scopes](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query): calendar.freebusy is accepted; no event read/write scope required for this API.
- [Google Content Service](https://developers.google.com/apps-script/guides/content): responses redirect to script.googleusercontent.com; clients must follow redirects.
- [Apps Script Web Apps](https://developers.google.com/apps-script/guides/web): deployment identity/access settings and token handling.
- [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas): quotas can stop execution; confirm personal-account send quota at deployment. The application's 50-new-requests/day cap is its own limit, not Google's quota.
- [Cloudflare Workers Free pricing](https://developers.cloudflare.com/workers/platform/pricing/): free plan currently lists 100,000 daily requests; does not establish mainland reachability or WeChat domain eligibility.
- [WeChat network documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html): official URL could not be retrieved in this environment. Current domain, filing, category and personal-subject eligibility must be checked in official backend; no affirmative eligibility conclusion is made.

Free infrastructure is a target, not a promise that mini-program registration, verification or domain requirements carry zero cost. No paid resource has been created.
