# Fix the enquiry spreadsheet mismatch

1. Replace Code.gs in your existing Apps Script project with arezzi-enquiries.gs.
2. Save, select setupArezzi, and click Run. Authorize as the spreadsheet owner. If the old tab has different columns, it is renamed to an Enquiry backup tab with all its data intact. A fresh enquiry sheet is created. Do not delete the backup.
3. Deploy → Manage deployments → Edit → Version: New version → Deploy. Keep Execute as Me and access Anyone. Editing the existing deployment keeps the same /exec URL already configured on the website.
4. Upload the updated website files to arezzifurniture.com.
5. Submit one clearly labelled test enquiry. Confirm its reference ID appears in the sheet. Do not interpret a network POST alone as success; the website checks the saved receipt.

The daily digest runs approximately 1:20 AM IST for the previous completed day, to sufiayn45666@gmail.com, from the verified arezzifurniture@gmail.com alias. Legacy rows in the backup are preserved, but are not automatically included in new daily digests. setupArezzi does not send a test email.

Live diagnostic on 15 October 2026: deployment is publicly reachable; a valid receipt lookup reports incompatible existing sheet columns. The corrected script must be saved, setup run, and the deployment updated before live submissions can succeed.
