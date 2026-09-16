# Validation summary

Validated locally in the browser on 15 September 2026.

## Passed

- All 18 pages checked at 320, 360, 370, 375, 390, 412, 480, 768, 1024, 1280, 1440 and 1920 pixels: 216 page/viewport combinations, no horizontal overflow, duplicate IDs, missing primary headings or missing title/description/canonical metadata.
- Cross-file validation found no missing HTML/CSS/JavaScript/image references. 66 optimized WebP files and four video files are included.
- Catalogue contains 35 unique products. Filters, conflicting-filter empty state, clear controls, A–Z sorting and product details were exercised.
- Mobile navigation opens and closes, Escape works, and focus returns to its trigger. Product and gallery dialogs restore focus; gallery arrow navigation updates captions.
- Quote steps reject missing required fields and custom colours, carry a product from its quote link, and retain data when the endpoint is unset.
- 47 isolated frontend assertions passed: required fields, phone validation, dynamic models/materials, blank dimensions, conditional measurement units, file types, 5 MB limit, signature validation, valid preview/base64 payload, all four representative mappings, invalid IDs, read-only names, payment arithmetic, excessive advances and delivery-date relationships.
- Mocked response checks covered false success, network failure, non-JSON responses, explicit success with returned reference, disabled controls while sending, duplicate concurrent requests and stable retry identifiers. No real enquiry was transmitted.
- Desktop video plays at 1280 × 720; mobile video uses a separate 540 × 960 composition. The pause control works. Reduced-motion handling is implemented in both CSS and JavaScript.
- Catalogue WebMCP filtering was exercised with valid and invalid inputs and visible result read-back.
- No browser console errors were observed during the complete page sweep.

## Limits and remaining business setup

The actual Google Apps Script service has not been supplied, so real submission delivery, persistence, uploads, CORS and server-side validation cannot yet be verified. All business-specific configuration remains intentionally unset. The internal page has no authentication and requires protection before real use. Privacy and commercial terms remain review templates.

The hero uses crossfades and gentle motion rather than geometric furniture morphing. Material selection photography is illustrative, not a verified image of every individual material sample. This validation is not a formal accessibility certification or a live-backend security audit.
