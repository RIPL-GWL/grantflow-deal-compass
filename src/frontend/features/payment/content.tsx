export type PaymentAccount = {
  id: string;
  country: string;
  flag: string;
  currency: string;
  method: string;
  fields: { label: string; value: string }[];
};

const holder = "Rishishwar Industry Private Limited";

export const paymentAccounts: PaymentAccount[] = [
  { id: "us-ach", country: "United States of America", flag: "🇺🇸", currency: "USD", method: "ACH", fields: [
    { label: "Account holder name", value: holder }, { label: "Account number", value: "8336709886" },
    { label: "ACH routing number", value: "026073150" }, { label: "Bank name", value: "Community Federal Savings Bank" },
    { label: "Bank address", value: "5 Penn Plaza, 14th Floor, New York, NY 10001, US" },
  ] },
  { id: "us-fedwire", country: "United States of America", flag: "🇺🇸", currency: "USD", method: "Fedwire", fields: [
    { label: "Account holder name", value: holder }, { label: "Account number", value: "8336709886" },
    { label: "Fedwire routing number", value: "026073008" }, { label: "Bank name", value: "Community Federal Savings Bank" },
    { label: "Bank address", value: "5 Penn Plaza, 14th Floor, New York, NY 10001, US" },
  ] },
  { id: "uk", country: "United Kingdom", flag: "🇬🇧", currency: "GBP", method: "FPS / CHAPS / BACS", fields: [
    { label: "Account holder name", value: holder }, { label: "Account number", value: "45627976" },
    { label: "Sort code", value: "608382" }, { label: "Bank name", value: "Banking Circle" },
    { label: "Bank address", value: "68 King William Street, London, EC4N 7HR, United Kingdom" },
  ] },
  { id: "ae", country: "United Arab Emirates", flag: "🇦🇪", currency: "AED", method: "IPP / FTS", fields: [
    { label: "Account holder name", value: holder }, { label: "IBAN (Account number)", value: "AE510960000691060025216" },
    { label: "BIC/SWIFT code", value: "ZANDAEAAXXX" }, { label: "Bank name", value: "Zand Bank PJSC" },
    { label: "Bank address", value: "1st Floor, Emaar Square, Building 6, Dubai, United Arab Emirates" },
  ] },
  { id: "eu", country: "Europe", flag: "🇪🇺", currency: "EUR", method: "SEPA / SEPA Instant", fields: [
    { label: "Account holder name", value: holder }, { label: "IBAN (Account number)", value: "DE66202208000045627976" },
    { label: "BIC/SWIFT code", value: "SXPYDEHH" }, { label: "Bank name", value: "Banking Circle" },
    { label: "Bank address", value: "Banking Circle S.A. – German Branch, Maximilianstraße 54, 80538 München" },
  ] },
  { id: "ca", country: "Canada", flag: "🇨🇦", currency: "CAD", method: "EFT", fields: [
    { label: "Account holder name", value: holder }, { label: "Account number", value: "977364231" },
    { label: "Routing number", value: "035210009" }, { label: "Institution number", value: "352" },
    { label: "Transit number", value: "10009" }, { label: "Bank name", value: "Digital Commerce Bank" },
    { label: "Bank address", value: "736 Meridian Road N.E, Calgary, Alberta, CA" },
  ] },
  { id: "au", country: "Australia", flag: "🇦🇺", currency: "AUD", method: "BECS / NPP / Osko", fields: [
    { label: "Account holder name", value: holder }, { label: "Account number", value: "045627976" },
    { label: "BSB number", value: "252000" }, { label: "Bank name", value: "BC Payments" },
    { label: "Beneficiary address", value: "Level 11/10 Carrington St, Sydney NSW 2000, Australia" },
  ] },
  { id: "sg", country: "Singapore", flag: "🇸🇬", currency: "SGD", method: "FAST / GIRO / MEPS", fields: [
    { label: "Account holder name", value: holder },
  ] },
];