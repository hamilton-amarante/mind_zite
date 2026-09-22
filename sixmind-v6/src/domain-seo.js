(()=>{
  const SITE_URL='https://sixmind.digital';
  const ensureLink=(rel,href)=>{let el=document.querySelector(`link[rel="${rel}"]`);if(!el){el=document.createElement('link');el.rel=rel;document.head.appendChild(el)}el.href=href;return el};
  const ensureMeta=(selector,attrs)=>{let el=document.querySelector(selector);if(!el){el=document.createElement('meta');document.head.appendChild(el)}Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el};
  ensureLink('canonical',SITE_URL+'/');
  ensureMeta('meta[property="og:url"]',{property:'og:url',content:SITE_URL+'/'});
  ensureMeta('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
  ensureMeta('meta[name="twitter:title"]',{name:'twitter:title',content:'SixMind — Inteligência que move operações'});
  ensureMeta('meta[name="twitter:description"]',{name:'twitter:description',content:'Automação e inteligência operacional para conectar atendimento, CRM, agenda, vendas e integrações.'});
  const schema=document.createElement('script');
  schema.type='application/ld+json';
  schema.textContent=JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'Organization','@id':SITE_URL+'/#organization',name:'SixMind',url:SITE_URL+'/',description:'Inteligência operacional para atendimento, vendas, CRM, agenda, integrações e automações.'},
    {'@type':'WebSite','@id':SITE_URL+'/#website',url:SITE_URL+'/',name:'SixMind',inLanguage:'pt-BR',publisher:{'@id':SITE_URL+'/#organization'}},
    {'@type':'Service','@id':SITE_URL+'/#service',name:'Automação e Inteligência Operacional',provider:{'@id':SITE_URL+'/#organization'},areaServed:'BR',url:SITE_URL+'/',description:'Soluções de automação, atendimento inteligente, automação comercial, integrações e agentes de IA para operações empresariais.'}
  ]});
  document.head.appendChild(schema);
  window.SIXMIND_SITE_URL=SITE_URL;
})();
