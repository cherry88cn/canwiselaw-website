# CanWise CloudBase booking

Current backend, superseding the Cloudflare + Apps Script architecture. No Google or Apple credentials, calendar connections or email APIs. Muse supplies Busy intervals and reads appointment details through a revocable business token.

## Status

Implemented locally, 16 focused core/transport tests pass. Real CloudBase database/auth/HTTP gateway, browser admin login and mainland WeChat access are **not yet verified**. Do not enable real bookings before the deployment checks below pass.

## Layout

- `functions/booking/core.cjs`: pure scheduling, privacy validation, business authorization, audit/history.
- `functions/booking/index.js`: CloudBase event-function transport; HTTP gateway for public/Muse and SDK invocation for the admin allowlist.
- `database.rules.json`: deny direct client reads/writes for the `canwise_private` collection.
- `../admin/`: owner login, appointments, Busy intervals, settings, token creation/revocation, audit and schedule restore.
- `../web/` and `../miniprogram/`: public frontends; API addresses intentionally remain blank until verified.

## Local checks

`node --test tests/*.test.cjs`

Build admin from this folder with the pinned esbuild dependency:

`esbuild ./../admin/app.js --bundle --minify --outfile=../admin/app.bundle.js --alias:@cloudbase/js-sdk=./node_modules/@cloudbase/js-sdk`

Legacy Cloudflare `../tests/runtime-smoke.mjs` requires a running old Worker and is not a CloudBase test. It must not be included in the new local test command.

## Deployment checklist (not yet executed)

1. Verify correct Tencent account, real-name verification and zero-price free plan. Confirm renewal date, resource limits and behavior at exhaustion. Do not enable paid overage/automatic upgrade.
2. User approves required TCB service role and official CLI authorization. Never request master cloud secrets in chat.
3. Create document collection `canwise_private`, apply the explicit deny-all client rules. No public/anonymous collection access. Service-side code is privileged and must retain its own authorization checks.
4. Create an owner-only CloudBase Auth user. Owner chooses/submits password privately. Configure password retry limit/temporary lock and disable unnecessary login/registration methods. Record UID only in server `ADMIN_UIDS`; the frontend cannot grant itself authority.
5. Generate RATE_SECRET privately. Copy example deployment config to a secret-excluded local file; never publish it with credentials. Deploy event-function code under `canwise-booking`, with verified runtime and dependency install support. Function folder is `functions/booking`; explicit CLI `--dir` or staging copy is required because folder and function names differ.
6. Verify ordinary event function HTTP gateway support in this environment; bind `/booking` and subpaths with path passthrough. If the provider requires a different HTTP runtime, adapt and retest rather than deploying this handler unmodified. Public/Muse HTTP requests must never be treated as admin SDK invocations.
7. Configure allowed website origin(s) and CloudBase SDK safe domains. Public GET/POST must work without cloud account credentials; protected Muse routes use business Bearer token. Apply gateway rate/size limits to protect free quota. CORS is not authentication and does not stop non-browser abuse.
8. Set admin config with verified envId/region/functionName. Publish static admin assets with self-hosted Chinese font. Validate login, logout, failed-login lock, UID allowlist and expired session. Do not launch until these checks pass.
9. Set public frontend API base. Mini-program needs verified request domain or tested native cloud invocation adapter, appropriate subject/service category and privacy declarations. Do not bypass WeChat domain checks for release.
10. Execute synthetic cloud smoke: paused default, enable, slots, pending submission, repeat same idempotency key, overlap refusal, admin/Muse read isolation, status version, revoke401, failed database writes, stale sync503, schedule restore, final pause. No real client data in tests.
11. Owner puts newly generated Muse token in its secure credential store; real Muse connectivity/scheduler/notification test required. Guide contains no token.
12. Mainland WeChat real-device Wi-Fi + mobile network checks across times/operators; record results and latency. Only then activate real bookings with a valid privacy/retention policy.

## Low-volume design and limits

A single private state document is updated transactionally. This avoids query-in-transaction restrictions and keeps low-volume booking straightforward. It contains PII and is never returned wholesale. Public response fields are explicitly selected. The design supports up to400 stored appointments,500 Busy intervals,300 Muse blocks/request. Recent audit is bounded to200 entries; schedule restore points are bounded to30 and approximately180KB. At600KB total, new writes fail closed and require archiving. This is not an unbounded database or durable backup system.

Manual mode ignores Muse freshness. Muse mode requires a successful full snapshot with `validUntil` within48hours, or new bookings return503. Restore clears freshness. Neither mode writes back to Google. The owner accepts ordinary low-volume synchronization delays and manually confirms appointments.

Rate counters store hashed server-derived IP only (salt in RATE_SECRET) and are pruned by hour on writes. No request body, headers, token, client name/contact or Google details are logged by our code. Verify platform logging settings independently before live traffic; cloud infrastructure can have its own logs.

Customer retention is not silently assumed to be90days. No automatic PII deletion or customer export endpoint exists yet. Owner must select a retention policy and operational deletion/archiving process before launch; do not advertise an implemented deletion schedule. Schedule rollback retains bookings, not a rollback of client status or PII.

## Release gates still open

Free-account entitlement; service/CLI permissions; cloud deployment; HTTP gateway/runtime compatibility; auth lock settings; database rules enforcement; actual admin browser flows; custom-domain/default-domain restrictions; Muse integration; mainland WeChat networking and review eligibility. Local tests do not close these gates.
