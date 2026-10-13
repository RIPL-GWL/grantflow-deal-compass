export type Investor = { slug: string; name: string; type: string; sectors: string[]; regions: string[]; stages: string[]; portrait: number; };
export const investors: Investor[] = [
 {slug:'amit-verma',name:'Amit Verma',type:'Angel Investor',sectors:['Consumer','Retail','D2C','FMCG'],regions:['India','Singapore'],stages:['Seed','Series A'],portrait:0},
 {slug:'neha-kapoor',name:'Neha Kapoor',type:'Venture Capital Investor',sectors:['Technology','SaaS','AI'],regions:['India','USA'],stages:['Seed','Series B'],portrait:1},
 {slug:'rohan-mehta',name:'Rohan Mehta',type:'Private Equity Investor',sectors:['Manufacturing','Industrial','Clean Energy'],regions:['India','UAE'],stages:['Growth Stage'],portrait:2},
 {slug:'priya-singh',name:'Priya Singh',type:'Family Office Investor',sectors:['Healthcare','Education','Impact'],regions:['India','Europe'],stages:['Seed','Growth Stage'],portrait:3},
 {slug:'karan-malhotra',name:'Karan Malhotra',type:'Strategic Investor',sectors:['Fintech','B2B','Enterprise Solutions'],regions:['India','USA','Europe'],stages:['Series A','Series C'],portrait:4},
 {slug:'vikram-rao',name:'Vikram Rao',type:'Global Investor',sectors:['Global Expansion','Cross-border Opportunities'],regions:['Singapore','UAE','Europe'],stages:['Growth Stage'],portrait:5},
];
export type Filters = {query:string; type:string; sector:string; region:string; stage:string};
export const emptyFilters: Filters = {query:'',type:'',sector:'',region:'',stage:''};
export function filterInvestors(filters:Filters, sort:string, list:Investor[]=investors) {
 const q=filters.query.trim().toLowerCase();
 const result=list.filter(i=>(!q || [i.name,i.type,...i.sectors,...i.regions,...i.stages].join(' ').toLowerCase().includes(q)) && (!filters.type || i.type===filters.type) && (!filters.sector || i.sectors.includes(filters.sector)) && (!filters.region || i.regions.includes(filters.region)) && (!filters.stage || i.stages.includes(filters.stage)));
 return sort==='name' ? [...result].sort((a,b)=>a.name.localeCompare(b.name)) : result;
}
