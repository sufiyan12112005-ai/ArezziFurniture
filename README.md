# Arezzi Furniture — static website

18 HTML pages, 35 catalogue entries, original generated furniture imagery, responsive WebP assets, desktop and mobile MP4/WebM hero films, and five enquiry/booking form types. HTML5, CSS3 and vanilla JavaScript only. No framework, package installation, build step, server code or database is included.

## Open and deploy

Open `index.html`, use VS Code Live Server, or upload the **contents of this folder** to any static host. JavaScript is needed for shared navigation, catalogue filters, product details, gallery and forms. Form submission requires an HTTPS origin or an appropriately configured development origin. Configure the host to serve `404.html` for missing paths. Domain metadata uses `https://arezzifurniture.com`.

## Replace business information in one place

Edit `assets/js/config.js` for phone, WhatsApp (international number), email, address, business hours, Maps URL, social URLs, submission URL and logo file paths. No invented contact details are present. Unconfigured contact actions are visibly unavailable and never open invalid placeholder destinations.

Place your official logo files in `assets/images/logo/`. Configure `logos.full`, `compact`, `mobile`, `dark` and `light` as paths relative to the site root. Use transparent images with space around the mark; the layout reserves 160 × 56 pixels and uses `object-fit: contain`. Until then the site uses a plain text brand placeholder. Replace `assets/icons/favicon.svg` and `favicon.ico` with official favicons when available.

## Google Apps Script integration

Set `GOOGLE_SCRIPT_URL` in `assets/js/config.js` to the deployed HTTPS web-app URL. The future service must accept JSON in a `text/plain;charset=utf-8` POST body and return readable JSON, including appropriate browser access/CORS behavior. The frontend follows redirects and requires `success: true`. An opaque `no-cors` response is never treated as success.

See `SUBMISSION-CONTRACT.md` for payloads and response expectations. All five forms use the same submission function and endpoint. An unset URL shows an honest unavailable state and preserves the form. Real delivery cannot be verified until the endpoint is supplied. No `Code.gs` or backend is included.

## Catalogue and images

Edit `assets/js/products.js` to manage names, descriptions, options, model images and catalogue data. All choices are enquiry preferences and must be confirmed with the team. Prices, warranties, ratings and unsupported business claims are not fabricated.

Images are original AI-generated design references, not photographs of Arezzi furniture, staff, facilities or installations. Generic custom-design cards deliberately use category references. Material photos are illustrative selections, not verified material samples. See `ASSET-NOTES.md`.

The desktop hero is a quiet crossfade film through sofa styles, a bed and a dining table, returning to the opening sofa. It is **not a geometric furniture-morphing video**. The mobile film uses its own portrait composition and subtle motion to keep the entire sofa visible. Reduced-motion mode uses a still poster. Video is silent, optional and has a pause control.

## Internal form

`internal/order-confirmation.html` is intentionally absent from navigation and the sitemap, and contains `noindex,nofollow`. **These are not access controls.** The page has no authentication. Before using real customer/payment data, restrict it through the future backend, Google Workspace or another authentication layer. The service must independently validate the representative mapping, amounts, dates and all other fields.

Representative IDs: 101 Akmal; 102 Zabi; 103 Suhail; 104 Sufiyan. The displayed name is read-only. The form rejects invalid IDs, advance payments above the total and delivery dates before confirmation. Blank dimensions remain blank.

## Privacy and commercial terms

`privacy-policy.html` and `terms.html` are labelled templates requiring business/legal review. No tracking provider is installed. `config.js` contains empty analytics settings; `main.js` emits local `arezzi:analytics` events for an approved future integration. Google Fonts is the only default external visual dependency; system fonts provide fallbacks.

Form entries are retained in the open page, not saved as durable drafts. Do not reload before submitting. The acknowledgement page uses a short-lived session record containing only request type, timestamp and returned reference; customer details are never placed in its URL.

## Before going live on your domain

Supply and verify the contact details, official branding and endpoint; test each request type against the real service; review policy templates; and protect the internal form. The static catalogue and enquiry interface are ready to customize and host independently.
