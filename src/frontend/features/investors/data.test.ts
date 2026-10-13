import { describe, expect, it } from 'vitest';
import { emptyFilters,filterInvestors } from './data';
describe('Investor directory filtering',()=>{
 it('finds a named sample investor',()=>{expect(filterInvestors({...emptyFilters,query:'neha'},'featured').map(i=>i.slug)).toEqual(['neha-kapoor']);});
 it('combines geography and sector filters',()=>{expect(filterInvestors({...emptyFilters,region:'India',sector:'FMCG'},'featured').map(i=>i.slug)).toEqual(['amit-verma']);});
 it('returns no matches for conflicting filters',()=>{expect(filterInvestors({...emptyFilters,type:'Family Office Investor',region:'USA'},'featured')).toEqual([]);});
 it('sorts names alphabetically',()=>{expect(filterInvestors(emptyFilters,'name').map(i=>i.name)).toEqual(['Amit Verma','Karan Malhotra','Neha Kapoor','Priya Singh','Rohan Mehta','Vikram Rao']);});
});
