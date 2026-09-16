'use strict';
/* Optional browser agent support. Uses the same visible catalogue filters. */
document.addEventListener('DOMContentLoaded',()=>{
 const context=document.modelContext,host=document.querySelector('[data-catalog]');
 if(!context?.registerTool||!host)return;
 const lifecycle=new AbortController();
 const tool={name:'filter_furniture_catalogue',title:'Filter furniture catalogue',description:'Set the visible catalogue filters and return the displayed furniture model names. Does not submit an enquiry or contact the business.',inputSchema:{type:'object',properties:{filters:{type:'object',additionalProperties:{type:'string'}},sort:{type:'string',enum:['featured','name','seating']}},required:['filters'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){
  if(!input||typeof input!=='object'||!input.filters||Array.isArray(input.filters)||typeof input.filters!=='object')throw new Error('Supply a filters object.');
  const selections=[...host.querySelectorAll('[data-filter]')],sort=host.querySelector('#sort-products');
  for(const [key,value] of Object.entries(input.filters)){const select=selections.find(s=>s.dataset.filter===key);if(!select||typeof value!=='string'||![...select.options].some(o=>o.value===value))throw new Error('Unsupported filter or value: '+key);}
  if(input.sort&&![...sort.options].some(o=>o.value===input.sort))throw new Error('Unsupported sort option.');
  selections.forEach(s=>s.value=input.filters[s.dataset.filter]||'');sort.value=input.sort||'featured';sort.dispatchEvent(new Event('change',{bubbles:true}));
  return {category:host.dataset.catalog,count:host.querySelectorAll('.product-card').length,models:[...host.querySelectorAll('.product-card h3')].map(el=>el.textContent)};
 }};
 try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
});
