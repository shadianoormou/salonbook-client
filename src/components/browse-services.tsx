'use client';
import { useSearchParams,useRouter } from 'next/navigation';
import { Search,SlidersHorizontal } from 'lucide-react';
import { useLoad } from '@/lib/use-load';
import { categories,List,Service } from '@/lib/types';
import { ServiceCard } from './service-card';
import { Loading,Empty,Pagination } from './loading';
import { ErrorState } from './error-state';
export function BrowseServices(){
  const params=useSearchParams(),router=useRouter();
  const search=params.get('search')||'',category=params.get('category')||'',sort=params.get('sort')||'',page=Number(params.get('page'))||1;
  const query=new URLSearchParams({search,category,sort,page:String(page),limit:'9'});
  const {data,error,loading,reload}=useLoad<List<Service>>(`/services?${query}`,false);
  function update(key:string,value:string){const next=new URLSearchParams(params.toString());if(value)next.set(key,value);else next.delete(key);if(key!=='page')next.delete('page');router.replace(`/services?${next}`,{scroll:false});}
  return <><section className="page-banner"><div className="container"><span className="eyebrow">The SalonBook menu</span><h1>A little care, your way.</h1><p>Good hair days, softer shoulders, and a fresh perspective. Find a service you love, then choose a moment that’s yours.</p></div></section><section className="container browse-section"><div className="filter-bar"><div className="search-field"><Search size={18}/><input aria-label="Search services by name" placeholder="Find your next favourite service…" value={search} onChange={e=>update('search',e.target.value)}/></div><select aria-label="Filter by category" value={category} onChange={e=>update('category',e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select><select aria-label="Sort services" value={sort} onChange={e=>update('sort',e.target.value)}><option value="">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div><div className="results-row"><span><SlidersHorizontal size={14} style={{verticalAlign:'middle',marginRight:6}}/>{data?`${data.total} ${data.total===1?'service':'services'} to make your day`:'Discover our services'}</span>{(search||category||sort)&&<button className="clear-filters" onClick={()=>router.replace('/services',{scroll:false})}>Clear filters</button>}</div>{loading?<Loading label="Finding your kind of care…"/>:error?<ErrorState message={error} retry={reload}/>:data?.data.length?<><div className="service-grid">{data.data.map(s=><ServiceCard service={s} key={s._id}/>)}</div><Pagination page={data.page} pages={data.pages} onChange={p=>update('page',String(p))}/></>:<Empty title="No services found" description="Try a different name or category. Your next favourite might be just around the corner."><button className="button secondary" onClick={()=>router.replace('/services',{scroll:false})}>Explore all services</button></Empty>}</section></>;
}
