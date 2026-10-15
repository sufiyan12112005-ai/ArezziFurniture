# Arezzi website — October 2026 update

## Customer site

Open `index.html` through a static web server. The project is HTML, CSS and browser JavaScript, with no application server or build step. Supplied branding and contact details are installed. The uncertain plot number is intentionally omitted; the location says basement below KPN, LR Bande / Shampura.

All customer enquiry entry points use the same form. A product link preselects the model. Customers can leave preferences blank and request help at home. Visit availability is confirmed by the team.

### One enquiry endpoint

All three customer forms use ENQUIRY_SCRIPT_URL in assets/js/config.js. The supplied /exec URL is configured. POST saves the enquiry; a separate public receipt lookup confirms the saved ID without disclosing customer details. Retrying uses the same clientRequestId to prevent duplicates. The daily digest is sent by the same Apps Script, once per completed day.

**Required server update:** follow apps-script/DEPLOYMENT.md. The live script is reachable but its existing sheet has incompatible column headings. The replacement script preserves that tab as a backup and creates the expected enquiry sheet when setupArezzi is run. Update the existing deployment to a new version after setup.

The website cannot repair spreadsheet columns by changing frontend JavaScript. No live test enquiry was submitted while this error persisted.

## Staff tools

- `bookfrom.html`: your supplied `bookform.html` sales system, with its original model/material codes, receipt handling, representative mapping, payload contract, and existing Apps Script endpoint preserved. The endpoint is configured as `STAFF_BOOKING_SCRIPT_URL`.
- `bookform.html` and `internal/order-confirmation.html`: compatibility links to the sales page.
- `bill-generator.html`: quotation and final-bill generator. Add products/services, quantities, rates and project groups; enter customer and invoice details; select GST treatment; record discounts, previous balance and advance. Review the PDF, then download it.

Billing runs on the device using bundled jsPDF 4.2.1 (MIT; license in `assets/vendor/`). No bill data is uploaded. Bank account and UPI information are retained from your reference PDFs. GSTIN `xxxxxxxxxx3243` is a placeholder: documents carry a draft notice until it is replaced. Terms and business verticals are editable because the supplied reference covers more than furniture. Review them for each order.

Staff pages are absent from customer navigation and marked `noindex`. These do not provide authentication. Keep staff files on an access-controlled staff host or private local deployment when making the customer site public. Do not use a JavaScript password as security.

## Media and metadata

The repeated generic fabric images have been replaced with distinct generated illustrative textures. They are not supplier-certified samples. Custom/mixed finish choices use an honest sample-request panel where an exact visual is unavailable.

The rejected pan/zoom films are no longer used. A still hero is retained while a suitable true video is unavailable. Runway was suggested as a generation option; connection is required. To install a finished clip, set `data-source="assets/video/your-film.mp4"` on `#hero-video`, remove `hidden` from `#motion-toggle`, and use a matching poster. The player supports reduced motion and playback failure fallback.

Phone and WhatsApp use +91 821 709 6733. Email is arezzifurniture@gmail.com. District choices use Bengaluru Urban, Bengaluru Rural, Bengaluru South (Ramanagara), Tumakuru, Kolar and Chikkaballapur. References: https://bengalurusouth.nic.in/en/about-district/ and https://bangalorerural.nic.in/en/about-disttrict/.

Before moving to another domain, update canonical links, Open Graph URLs, structured-data URLs and `sitemap.xml` together. Private previews are not publicly indexable. SEO metadata cannot guarantee rankings. No invented reviews, product prices or delivery promises have been added.
