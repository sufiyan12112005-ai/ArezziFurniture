/* Replace business details only here. Empty logo paths retain the text placeholder. */
const BUSINESS_PHONE = "+91 821 709 6733";
const WHATSAPP_NUMBER = "918217096733";
const BUSINESS_EMAIL = "arezzifurniture@gmail.com";
const BUSINESS_ADDRESS = "Manufacturing unit: basement below KPN, LR Bande, Shampura Main Road, Kaval Bairasandra, Bengaluru, Karnataka 560032";
const GOOGLE_MAPS_URL = "https://share.google/UCZlzegY20sPpYc1K";
const ENQUIRY_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxisy1Yhuvhb7PAAfaUAYdIQ3wslsr-bCCEhQy64h_ZWJN9WBU4MGNWpP7Vwhir3yl5xQ/exec";
const SOCIAL_LINKS = {
  instagram: "PASTE_INSTAGRAM_URL_HERE", facebook: "PASTE_FACEBOOK_URL_HERE",
  youtube: "PASTE_YOUTUBE_URL_HERE", pinterest: "PASTE_PINTEREST_URL_HERE"
};
const SITE_CONFIG = Object.freeze({
  businessName: "Arezzi Furniture", phone: BUSINESS_PHONE, whatsapp: WHATSAPP_NUMBER,
  email: BUSINESS_EMAIL, address: BUSINESS_ADDRESS, googleMaps: GOOGLE_MAPS_URL,
  googleScriptUrl: ENQUIRY_SCRIPT_URL, enquiryScriptUrl: ENQUIRY_SCRIPT_URL, social: SOCIAL_LINKS,
  businessHours: "Please call before visiting the manufacturing unit",
  logos: { full: "assets/images/brand/logo-full.png", compact: "", mobile: "", dark: "", light: "" },
  uploadMaxBytes: 5 * 1024 * 1024,
  analytics: { ga4: "", searchConsole: "", metaPixel: "" }
});

// Existing sales booking endpoint retained from your supplied archive.
const STAFF_BOOKING_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwqIlYgDTw1zZeEw6C7sLWAFK3PAOx8XlKZVvTZxcbYgJ7ylbWm-SSQQw8p53oGE-DecQ/exec";
