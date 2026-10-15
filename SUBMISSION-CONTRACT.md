# Customer enquiry contract

One configured endpoint accepts JSON in a text/plain POST body. Required: clientRequestId, name, phone, district, area, pin, furnitureType (Sofa, Bed, Table), consent. Optional fields are model, material, colour, quantity, customPreference, email, requirements, guidanceRequested and referenceImage. sourcePage identifies the entry page.

The frontend uses an opaque POST only to deliver the request; it never treats that response as proof of saving. GET ?receipt=REQUEST_ID&callback=CALLBACK returns CALLBACK({success:true,referenceId:ID}) after the matching row exists. Callback names must match __arezziReceipt_ followed by 8–80 alphanumeric/underscore characters. Request IDs are 8–100 alphanumeric/underscore/hyphen characters. No customer data is returned by receipt lookups.

Apps Script deduplicates using clientRequestId under a script lock. One completed-day digest is sent around 1:20 AM IST; current-day enquiries are not emailed individually. See apps-script/DEPLOYMENT.md for the required migration and redeployment.
