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
FORMS.submit=async form=>{
  if(form._submitting||form._submitted)return;
  await Promise.all([...form.querySelectorAll('input[type=file]')].map(el=>el._validateFile?.()));
  if(form._submitting||form._submitted)return;
  if(!form._delivery&&((form._extraValidate&&!form._extraValidate())||!FORMS.validate(form)))return;
  const status=form.querySelector('.form-status'),submit=form.querySelector('[type=submit]');
  form._submitting=true;submit.disabled=true;submit.textContent='Saving enquiry…';
  status.textContent='Saving your enquiry. Please keep this page open.';
  let controls=[];
  try{
    const payload=form._delivery?.payload||await FORMS.payload(form);
    controls=[...form.querySelectorAll('input,select,textarea,button:not([type=submit])')].map(el=>[el,el.disabled]);
    controls.forEach(([el])=>el.disabled=true);
    const result=await AREZZI.saveEnquiry(form,payload);
    status.className='form-status '+(result.ok?'success':'error');
    if(result.ok){
      form._submitted=true;submit.textContent='Request received';submit.disabled=true;
      status.textContent='Thank you. Your enquiry was saved as '+result.reference+'. Our team will contact you.';
      try{sessionStorage.setItem('arezzi-receipt',JSON.stringify({success:true,type:form.dataset.requestType,reference:result.reference,at:Date.now()}));}catch{}
      AREZZI.track('enquiry_form_submit',{referenceId:result.reference});
    }else{
      status.textContent=result.attempted?'We could not confirm the save. Your details are held here. Retry uses the same enquiry ID to avoid duplicates.':result.message+'. Your details remain here; you can call or use WhatsApp.';
      submit.textContent=result.attempted?'Retry saving enquiry':'Submit request';submit.disabled=false;
      if(!result.attempted){controls.forEach(([el,disabled])=>el.disabled=disabled);form._delivery=null;}
      // After any POST attempt, values remain locked so retries send the same payload.
    }
    status.focus();
  }catch{
    status.className='form-status error';status.textContent='We could not prepare your enquiry. Your details remain here.';
    if(!form._delivery?.attempted)controls.forEach(([el,disabled])=>el.disabled=disabled);
    submit.disabled=false;submit.textContent=form._delivery?.attempted?'Retry saving enquiry':'Submit request';
  }finally{form._submitting=false;}
};
document.addEventListener('DOMContentLoaded',()=>{
 const host=document.querySelector('[data-enquiry]');if(!host)return;const f=FORMS.field;
 host.innerHTML=`<form class="form-shell" data-request-type="enquiry"><span class="eyebrow">Make it personal</span><h2>Tell us what you have in mind.</h2><p class="lead">A few details are enough to begin. You do not need to know furniture models or fabric names.</p><div class="field-grid">${f('name','Full name','text',true,null,'autocomplete="name"')}${f('phone','Phone / WhatsApp','tel',true)}${f('district','District','select',true,['Bengaluru Urban','Bengaluru Rural','Bengaluru South (Ramanagara)','Tumakuru','Kolar','Chikkaballapur'])}${f('area','Area / locality','text',true)}${f('pin','PIN code','text',true,null,'inputmode="numeric" maxlength="6" autocomplete="postal-code"')}${f('furnitureType','Furniture type','select',true,['Sofa','Bed','Table'])}</div><div class="help-choice"><label for="guidanceRequested"><input type="checkbox" name="guidanceRequested" id="guidanceRequested"><span><strong>Not sure about models, fabrics or colours?</strong><br>Request a representative home visit to explore your options together. We will call to confirm availability and arrangements.</span></label></div><details class="optional-details"><summary>I have some preferences (optional)</summary><div class="field-grid">${f('model','Preferred model','select')}${f('material','Preferred fabric / material','select')}${f('colour','Preferred colour','select',false,COLOURS.map(x=>x[0]))}${f('quantity','Quantity','number',false,null,'min="1" max="999" step="1"')}${f('customPreference','Other design, colour or finish preference')}${f('email','Email (optional)','email')}${f('requirements','Tell us about your space','textarea')}${FORMS.upload()}</div></details><div class="field-grid">${FORMS.check('consent','I agree to be contacted about this enquiry and have read the <a class="legal-link" href="privacy-policy.html">Privacy Policy</a>.')}</div><div class="review-panel" data-review hidden tabindex="-1"></div><div class="form-nav"><button class="btn" type="submit">Review enquiry →</button></div><div class="form-status" role="status" aria-live="polite" tabindex="-1"></div></form>`;
 const form=host.querySelector('form');FORMS.bind(form);FORMS.bindProductFields(form);FORMS.simpleReview(form);
 form.elements.guidanceRequested.addEventListener('change',()=>{host.querySelector('.help-choice').classList.toggle('selected',form.elements.guidanceRequested.checked);});
 if(new URLSearchParams(location.search).has('product'))form.querySelector('details').open=true;
});
