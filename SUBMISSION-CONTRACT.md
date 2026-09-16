# Submission contract

All forms send one JSON object via an HTTP POST to `GOOGLE_SCRIPT_URL`, with `Content-Type: text/plain;charset=utf-8`. The Apps Script service must parse the body and validate it. No backend implementation is included.

## Common fields

- `requestType`: `quote`, `consultation`, `contact`, `customization`, or `booking`.
- `clientRequestId`: stable identifier retained across retries of the same form. The service must implement idempotency using this key to prevent duplicate records after timeouts.
- `submittedAt`: client timestamp in ISO format; server timestamps remain authoritative.
- `sourcePage`: page path, with no query-string customer information.
- Named form fields: trimmed strings; checkboxes are booleans; missing optional dimensions remain empty strings. The service must parse and validate numeric values.

Quote and customization requests include furniture type, model, material, colour, optional custom colour/finish, quantity, seating, dimensions and unit, requirements, name, phone, optional alternate phone/email, district, area, optional PIN/address, preferred contact and consent. Email is required when Email is the selected contact preference. The quote flow includes an optional reference image.

Consultation requests include name, phone, optional email, furniture type, consultation type, preferred date/time, district, area, requirements, optional reference image and consent. Dates and times are intended as local Bengaluru business time and require availability confirmation.

Contact requests include name, phone, optional email, preferred contact, subject, message and consent.

Booking requests additionally include booking/customer IDs if known, deal status, confirmation date, representative ID/name, complete address/PIN, profession/landmark, total/advance/balance, payment method/reference/notes, delivery date/priority/instructions, installation requirement, floor/lift details, optional receipt, customer requirements, internal notes and confirmations.

## Images

`referenceImage` or `receiptImage`, when present, is an object with:

```json
{"name":"reference.png","mimeType":"image/png","size":12345,"base64":"..."}
```

The client accepts JPEG, PNG and WebP up to 5 MiB and checks the MIME type, extension, file signature and image readability. The service must repeat checks, limit payload sizes, sanitize file names and restrict file access. Base64 increases transfer size. No Drive IDs are exposed by the frontend.

## Confirmed response

```json
{"success":true,"referenceId":"YOUR-SERVER-ASSIGNED-REFERENCE"}
```

The frontend also accepts `enquiryId`, `bookingId` or `reference` as the returned reference field. Only a JSON boolean `success: true` confirms receipt. The response must be readable by the browser. Do not return success before required persistence/upload work is confirmed.

## Failure response

```json
{"success":false}
```

HTTP failures, non-JSON responses, false/missing success, network errors and 30-second timeouts show a non-confirmation message and keep entries. The client never claims an order or appointment is confirmed. Retry handling must use `clientRequestId` on the server because a timed-out request might have been processed.

## Server responsibilities

Authenticate and authorize internal booking operations, validate every field and file, revalidate representative mapping, prevent formula injection in spreadsheet cells, enforce idempotency, calculate monetary balances authoritatively, check dates, implement data retention and access permissions, and return an authoritative reference. These are requirements for the separately supplied service, not features of this static project.
