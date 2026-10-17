'use strict';
// Apps Script ContentService redirects responses across origins. A POST alone
// cannot confirm a browser-side save. The public GET below returns only the
// opaque receipt ID, never customer data; its callback name is generated here.
AREZZI.lookupEnquiryReceipt = (endpoint, requestId, timeoutMs=7000) => new Promise((resolve,reject)=>{
  const callback='__arezziReceipt_'+Math.random().toString(36).slice(2)+Date.now().toString(36);
  const url=new URL(endpoint);url.searchParams.set('receipt',requestId);url.searchParams.set('callback',callback);
  const script=document.createElement('script');let finished=false;
  const finish=(error,value)=>{if(finished)return;finished=true;clearTimeout(timer);script.remove();delete window[callback];error?reject(error):resolve(value);};
  const timer=setTimeout(()=>finish(Error('Receipt check timed out')),timeoutMs);
  window[callback]=answer=>finish(null,answer);
  script.onerror=()=>finish(Error('Receipt check failed'));
  script.src=url.href;document.head.append(script);
});
AREZZI.saveEnquiry = async (form,payload) => {
  const url=form.closest?.('[data-enquiry]')?.dataset.enquiryEndpoint||SITE_CONFIG.enquiryScriptUrl;
  if(!AREZZI.configured(url))return {ok:false,attempted:false,message:'Enquiry service not connected yet'};
  let endpoint;
  try{endpoint=new URL(url);if(endpoint.protocol!=='https:')throw Error();}
  catch{return {ok:false,attempted:false,message:'Invalid enquiry service URL'};}
  form._delivery ||= {payload,attempted:false,confirmed:''};
  const state=form._delivery;
  if(state.confirmed)return {ok:true,attempted:true,reference:state.confirmed};
  state.attempted=true;
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
  try{await fetch(endpoint.href,{method:'POST',mode:'no-cors',body:JSON.stringify(state.payload),signal:controller.signal,redirect:'follow'});}
  catch{/* A failed browser response can follow a completed write. Check the receipt. */}
  finally{clearTimeout(timer);}
  const delays=[0,1200,2500,4000,6000,8000,10000,10000];
  for(const delay of delays){
    if(delay)await new Promise(resolve=>setTimeout(resolve,delay));
    try{
      const answer=await AREZZI.lookupEnquiryReceipt(endpoint.href,state.payload.clientRequestId);
      if(answer?.success===true&&answer.referenceId){state.confirmed=String(answer.referenceId).slice(0,120);return {ok:true,attempted:true,reference:state.confirmed};}
    }catch{}
  }
  return {ok:false,attempted:true,message:'Receipt not confirmed. Retry this same enquiry ID.'};
};
// Customer acknowledgement stays in this document so navigation cannot cancel POST.
const originalEnquirySubmit = FORMS.submit;
FORMS.submit=async form=>{
  if(!form.closest('[data-enquiry]'))return originalEnquirySubmit(form);
  if(form._submitting||form._submitted)return;
  await Promise.all([...form.querySelectorAll('input[type=file]')].map(el=>el._validateFile?.()));
  if(form._submitting||form._submitted)return;
  if(!form._delivery&&((form._extraValidate&&!form._extraValidate())||!FORMS.validate(form)))return;
  const status=form.querySelector('.form-status'),submit=form.querySelector('[type=submit]');
  const host=form.closest('[data-enquiry]');
  let endpoint;
  try{endpoint=new URL(host.dataset.enquiryEndpoint||SITE_CONFIG.enquiryScriptUrl);if(endpoint.protocol!=='https:')throw Error();}
  catch{status.textContent='Please call or WhatsApp us while online enquiries are unavailable.';return;}
  form._submitting=true;submit.disabled=true;submit.textContent='Sending enquiry…';
  status.textContent='One moment while we send your details.';
  let panel,viewTimer,networkTimer,controls=[];
  const showThanks=()=>{
    if(panel)return;
    panel=document.createElement('section');panel.className='form-shell';panel.tabIndex=-1;
    panel.style.cssText='text-align:center;padding:clamp(24px,5vw,60px);scroll-margin-top:110px';
    panel.innerHTML='<span class="eyebrow">Arezzi Furniture</span><div style="font-size:42px;color:#b3834d;margin:15px">♡</div><h2>Thank you for reaching out.</h2><p style="margin:16px 0">Your ideas are the start of something beautiful.</p><p data-delivery role="status" aria-live="polite">Sending your details. Please keep this page open for a moment.</p><button class="btn" type="button" data-retry hidden style="margin-top:20px">Try sending again</button><div class="actions" style="justify-content:center;margin-top:24px" data-done hidden><a class="btn" href="sofas.html">Explore furniture</a><a class="btn secondary" data-contact="whatsapp">WhatsApp us</a></div>';
    form.hidden=true;host.append(panel);AREZZI.contactLinks(panel);
    panel.querySelector('[data-retry]').onclick=()=>{panel.remove();panel=null;form.hidden=false;FORMS.submit(form);};
    panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    panel.focus({preventScroll:true});
  };
  // Show the acknowledgement after two seconds; it does not claim a saved receipt.
  const started=Date.now();
  viewTimer=setTimeout(showThanks,2000);
  try{
    const payload=form._delivery?.payload||await FORMS.payload(form);
    form._delivery={payload,attempted:true};
    controls=[...form.querySelectorAll('input,select,textarea,button')].map(el=>[el,el.disabled]);
    controls.forEach(([el])=>el.disabled=true);
    const controller=new AbortController();networkTimer=setTimeout(()=>controller.abort(),60000);
    const response=await fetch(endpoint.href,{method:'POST',mode:'no-cors',body:JSON.stringify(payload),redirect:'follow',signal:controller.signal});
    if(response.type!=='opaque'&&!response.ok)throw Error('Delivery failed');
    clearTimeout(networkTimer);
    // An opaque response means the request finished, not proof of a spreadsheet write.
    form._submitted=true;
    await new Promise(resolve=>setTimeout(resolve,Math.max(0,2000-(Date.now()-started))));
    showThanks();
    panel.querySelector('[data-delivery]').textContent='For any additional details or urgent questions, you can contact our team on WhatsApp.';
    panel.querySelector('[data-done]').hidden=false;
    AREZZI.track('enquiry_request_sent',{requestId:payload.clientRequestId});
  }catch{
    clearTimeout(viewTimer);showThanks();
    panel.querySelector('h2').textContent='Let’s finish sending your enquiry.';
    panel.querySelector('[data-delivery]').textContent='The connection was interrupted. Your details are still here. Please try again or contact us on WhatsApp.';
    panel.querySelector('[data-retry]').hidden=false;
    panel.querySelector('[data-done]').hidden=false;
    submit.disabled=false;submit.textContent='Try sending again';
  }finally{clearTimeout(viewTimer);clearTimeout(networkTimer);form._submitting=false;}
};
document.addEventListener('DOMContentLoaded',()=>{
 const host=document.querySelector('[data-enquiry]');if(!host)return;const f=FORMS.field;
 host.innerHTML=`<form class="form-shell" data-request-type="enquiry"><span class="eyebrow">Make it personal</span><h2>Tell us what you have in mind.</h2><p class="lead">A few details are enough to begin. You do not need to know furniture models or fabric names.</p><div class="field-grid">${f('name','Full name','text',true,null,'autocomplete="name"')}${f('phone','Phone / WhatsApp','tel',true)}${f('district','District','select',true,['Bengaluru Urban','Bengaluru Rural','Bengaluru South (Ramanagara)','Tumakuru','Kolar','Chikkaballapur'])}${f('area','Area / locality','text',true)}${f('pin','PIN code','text',true,null,'inputmode="numeric" maxlength="6" autocomplete="postal-code"')}${f('furnitureType','Furniture type','select',true,['Sofa','Bed','Table'])}</div><div class="help-choice"><label for="guidanceRequested"><input type="checkbox" name="guidanceRequested" id="guidanceRequested"><span><strong>Not sure about models, fabrics or colours?</strong><br>Request a representative home visit to explore your options together. We will call to confirm availability and arrangements.</span></label></div><details class="optional-details"><summary>I have some preferences (optional)</summary><div class="field-grid">${f('model','Preferred model','select')}${f('material','Preferred fabric / material','select')}${f('colour','Preferred colour','select',false,COLOURS.map(x=>x[0]))}${f('quantity','Quantity','number',false,null,'min="1" max="999" step="1"')}${f('customPreference','Other design, colour or finish preference')}${f('email','Email (optional)','email')}${f('requirements','Tell us about your space','textarea')}${FORMS.upload()}</div></details><div class="field-grid">${FORMS.check('consent','I agree to be contacted about this enquiry and have read the <a class="legal-link" href="privacy-policy.html">Privacy Policy</a>.')}</div><div class="review-panel" data-review hidden tabindex="-1"></div><div class="form-nav"><button class="btn" type="submit">Review enquiry →</button></div><div class="form-status" role="status" aria-live="polite" tabindex="-1"></div></form>`;
 const form=host.querySelector('form');FORMS.bind(form);FORMS.bindProductFields(form);FORMS.simpleReview(form);
 form.elements.guidanceRequested.addEventListener('change',()=>{host.querySelector('.help-choice').classList.toggle('selected',form.elements.guidanceRequested.checked);});
 if(new URLSearchParams(location.search).has('product'))form.querySelector('details').open=true;
});
