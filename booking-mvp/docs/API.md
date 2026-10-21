# Booking API v1

Same POST JSON envelope for browser and WeChat. Transport Content-Type: `text/plain;charset=utf-8`; body is JSON text. No OAuth token, calendar ID, email destination or admin setting accepted from the client. Maximum 4096 characters. GAS `/exec` redirects responses; follow redirects. GAS application errors normally use HTTP 200: always check `ok`. Relay may return 400/403/405/502 in addition. Never infer success from HTTP status alone.

## Availability

```json
{"action":"availability","date":"2026-10-28"}
```

```json
{"ok":true,"data":{"date":"2026-10-28","timeZone":"America/Toronto","slots":[{"start":"2026-10-28T14:00:00.000Z","end":"2026-10-28T15:00:00.000Z"}]}}
```

Example only, not live availability. Date is Toronto calendar date, not client's date. Starts and ends are UTC ISO instants. Client must not convert by subtracting a fixed offset; Toronto observes DST. Website displays both local and Toronto time; mini-program labels Toronto explicitly. Slots describe a 60-minute session; server additionally checks 15-minute post-buffer. No cache is configured. Empty array is a valid no-openings response; API failure is not an empty array.

## Submit request

```json
{
  "action":"request","requestId":"example_request_000001",
  "name":"Example","contactType":"wechat","contact":"example-only",
  "category":"immigration","meeting":"video","mode":"slot",
  "start":"2026-10-28T14:00:00.000Z",
  "source":"wechat","language":"zh","consent":true,"website":""
}
```

| Field | Constraint |
| --- | --- |
| requestId | 16–80 ASCII letters/digits/underscore/hyphen. Generate once per payload; reuse on uncertain-result resubmission. Not an authentication secret. |
| name | 1–80 chars, no control chars |
| contactType | email / wechat / phone |
| contact | 1–160 chars; email format checked only for email type |
| category | immigration / business / family / other; no narrative legal facts |
| meeting | phone / video / wechat; preference, no meeting creation |
| mode | slot / preference |
| start | For slot: exact UTC start returned by availability; server checks again on submission |
| preference | For preference: 1–240 chars including date/time/timezone, no control chars; manually interpreted, not validated availability |
| source | website / wechat; informational, not trusted authentication |
| language | en / zh |
| consent | literal boolean true |
| website | empty honeypot field |

Preferred-time mode replaces `start` with e.g. `"preference":"Oct 28 or 29, after 7 pm Toronto time"`. Used for manual discussion if WeChat availability lookup fails; it does not guarantee Google submission is reachable. If the entire endpoint is unreachable, display failure, never fake a saved request. No offline queue or automatic retry is implemented.

```json
{"ok":true,"data":{"requestId":"example_request_000001","status":"pending","notification":"sent"}}
```

Success means the request was saved, NOT confirmed or reserved. `notification` is sent/failed/pending. Even failed notification is a successful save. Same requestId + same normalized payload returns existing receipt without a second email; changed payload using the same ID gives ID_CONFLICT. A brief script lock serializes save/idempotency checks; no appointment hold or complex concurrency system.

## Error envelope

```json
{"ok":false,"error":{"code":"SLOT_UNAVAILABLE"}}
```

| Code | Client action |
| --- | --- |
| INVALID_REQUEST / INVALID_DATE | Correct fields; never show success |
| OUTSIDE_WINDOW | Select Toronto date in next 30 days |
| SLOT_UNAVAILABLE | Re-query; original selection may have become busy |
| CALENDAR_UNAVAILABLE | Do not treat calendar as free; WeChat may offer preference mode |
| CONFIG_ERROR / SERVICE_UNAVAILABLE | Generic service error; owner checks deployment privately |
| DAILY_LIMIT / BUSY | Submission not confirmed; manual later retry using same ID |
| FORBIDDEN | Owner checks relay configuration; no client secret workaround |
| ID_CONFLICT | Payload changed under an existing ID; create a new ID for the new payload |

Timeout or malformed response after POST has ambiguous outcome. Keep the same requestId and payload if the user manually retries. A page reload/new device may lose the ID and produce another request; no cross-device deduplication claim.

## Trust boundary

Google → relay/client output is limited to derived slots and receipts/errors. No event summaries, raw busy intervals, calendar ID, spreadsheet ID or OAuth token. Optional relayToken is server-side only and stripped/overwritten by Worker. GET GAS returns a minimal service health object; it does not test Calendar, Sheets, authorization or mail delivery.

No public read/list/delete/admin endpoint. Sheet overrides are edited manually by its owner. CORS is a browser policy, not client authorization; the API remains anonymous. Do not implement public override arguments.
