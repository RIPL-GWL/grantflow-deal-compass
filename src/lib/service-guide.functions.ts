export async function getServiceRecommendation({ data }: { data: { idea: string } }) {
 const s = data.idea.toLowerCase();
 const fit = /export|usa|canada|global|international|विदेश/.test(s) ? "Global Market Support" : /fund|loan|capital|machin|फंड/.test(s) ? "Business Funding Guidance" : /advert|sign|video|विज्ञापन/.test(s) ? "Shop Advertising" : /retailer|my shop|my store|दुकान/.test(s) ? "Retailer Partnership" : /distributor|dealer/.test(s) ? "Distributor Partnerships" : "Retail Network Access & Domestic Expansion";
 return `Best fit: ${fit}

Why it fits: This is the closest match in RIPL’s published services for your stated requirement. Final suitability needs a team consultation.

What to prepare:
• Product/category and current market
• Production capacity and target locations
• Relevant licences and business details

Next step: Email sales@rishishwarindustry.in for a written proposal. Sales, funding approval and results are not guaranteed.`;
}
