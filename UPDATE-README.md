# Arezzi production update — 17 October 2026

Upload the website files and assets to your existing arezzifurniture.com hosting. This local package has not been uploaded to your host.

Completed: mobile contact layout and compact checkboxes; one shared endpoint for contact, quotation and consultation; circular logo favicons; production-domain canonicals, metadata and image sitemap; useful collection copy; 35 crawlable model pages; 350 new distinct landscape design images with mobile derivatives; staff draft no longer reappears after a confirmed save.

FIRST: apps-script/DEPLOYMENT.md explains the live spreadsheet column mismatch and its safe fix. Replace Code.gs with apps-script/arezzi-enquiries.gs, run setupArezzi, and update the existing deployment to New version. Your /exec URL stays unchanged. Existing rows are preserved in a backup tab; they are not migrated into the new digest format automatically.

Images: all 350 requested designs are complete — ten distinct images for each of 35 furniture models. Every full-size WebP has a 640px mobile derivative. IMAGE-BATCH-STATUS.json records the counts. Generated visuals are labelled design inspiration. Original generated PNGs are retained locally; the upload ZIP contains the optimized WebP assets used by the website.

Validation: 1,548 local HTML references checked before final packaging; no missing references. New full-size images are unique and have 640px derivatives and landscape 3:2 dimensions. JSON-LD and sitemap parse successfully. Local integration tests pass for sheet writes, deduplication, receipt privacy, daily grouping, sender alias and safe legacy-sheet preservation. Mobile contact review and desktop gallery thumbnail switching were checked in the browser. Live save/email delivery remains unverified until the Apps Script fix is deployed.

Search: the favicon and page images are crawlable and metadata is supplied. Google decides whether and when to display favicons and image thumbnails; metadata cannot guarantee placement or organic ranking. After upload, submit sitemap.xml in your Search Console property and request recrawling of key pages.
