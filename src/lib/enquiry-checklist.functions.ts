export async function createEnquiryChecklist({ data }: { data: { requirements: string } }) {
 return `Enquiry: ${data.requirements}

1. What products or services does your business offer?
2. What is your current production capacity and sales coverage?
3. Which cities, districts or international markets do you want to reach?
4. Which relevant business licences and registrations do you hold?
5. What timeline and budget would you like to discuss?
6. Which RIPL service or commercial model interests you?
7. What is your preferred contact email?

Copy this checklist into your email to the RIPL sales team. Do not include sensitive identity documents in the first enquiry.`;
}
