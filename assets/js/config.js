/* Replace business details only here. Empty logo paths retain the text placeholder. */
const BUSINESS_PHONE = "PASTE_BUSINESS_PHONE_HERE";
const WHATSAPP_NUMBER = "PASTE_WHATSAPP_NUMBER_HERE";
const BUSINESS_EMAIL = "PASTE_BUSINESS_EMAIL_HERE";
const BUSINESS_ADDRESS = "PASTE_BUSINESS_ADDRESS_HERE";
const GOOGLE_MAPS_URL = "PASTE_GOOGLE_MAPS_URL_HERE";
const GOOGLE_SCRIPT_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const SOCIAL_LINKS = {
  instagram: "PASTE_INSTAGRAM_URL_HERE", facebook: "PASTE_FACEBOOK_URL_HERE",
  youtube: "PASTE_YOUTUBE_URL_HERE", pinterest: "PASTE_PINTEREST_URL_HERE"
};
const SITE_CONFIG = Object.freeze({
  businessName: "Arezzi Furniture", phone: BUSINESS_PHONE, whatsapp: WHATSAPP_NUMBER,
  email: BUSINESS_EMAIL, address: BUSINESS_ADDRESS, googleMaps: GOOGLE_MAPS_URL,
  googleScriptUrl: GOOGLE_SCRIPT_URL, social: SOCIAL_LINKS,
  businessHours: "Business hours to be confirmed",
  logos: { full: "", compact: "", mobile: "", dark: "", light: "" },
  uploadMaxBytes: 5 * 1024 * 1024,
  analytics: { ga4: "", searchConsole: "", metaPixel: "" }
});
