# Validation — 14 October 2026

## Completed checks

- Static validation: 20 HTML pages; local HTML asset/link targets present; no removed customization links or detected encoding corruption.
- JavaScript syntax and isolated tests for independent Sheets/email delivery, partial-success retry isolation, stable request IDs and missing endpoint behavior.
- Billing arithmetic: split GST, IGST, discounts, previous balance, advances, decimal rounding and Indian amount-in-words.
- Browser: 390px mobile checks on home, sofas, beds, tables, projects, gallery, enquiry, contact, home-visit request, about, billing and supplied staff booking. No horizontal overflow, broken loaded images or oversized category/product/material cards.
- Desktop homepage and material gallery visually checked at 1440px. Distinct hard-material images loaded. Mobile hero checked with separate portrait composition.
- Catalogue filtering, product dialog, product-specific WhatsApp message, enquiry preselection and mobile navigation checked.
- Enquiry review and missing-configuration states checked without sending real enquiries. Inputs remain available when neither destination confirms delivery.
- Actual PDFs downloaded and rendered: one-page quotation using bundled jsPDF 4.2.1, and multi-page final bill during layout development. Wrapped descriptions, bank information, totals, page numbering and signatures inspected. Sample quotation: Rs. 59,000 total, Rs. 10,000 advance, Rs. 49,000 balance.

## Remaining setup and limits

- Two customer enquiry Apps Script URLs are placeholders. Live Sheets persistence, notification email, uploads, permissions and backend deduplication remain unverified until configured.
- Original staff booking endpoint preserved. No real booking sent during testing.
- GSTIN is the requested placeholder; generated documents remain drafts until replaced.
- A true hero video remains outstanding. Generated still heroes are displayed; rejected pan/zoom and crossfade videos are not delivered.
- Generated imagery is illustrative, not certified material samples or actual Arezzi installations.
- Staff pages need access control if moved to a public host. Noindex and hidden navigation are not authentication. Hosting remains owner-private.

This is functional and visual QA, not a formal accessibility certification or security audit.
