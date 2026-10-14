'use strict';
// Two independent destinations share a stable idempotency key and immutable payload.
AREZZI.sendDestinations = async (form, payload) => {
  form._delivery ||= {payload, confirmed:{}};
  const state=form._delivery, results=[];
  for(const [key,label,url] of [['sheet','Enquiry record',SITE_CONFIG.sheetsScriptUrl],['email','Team notification',SITE_CONFIG.gmailScriptUrl]]){
    if(state.confirmed[key]){results.push({key,label,ok:true,reference:state.confirmed[key]});continue;}
    if(!AREZZI.configured(url)){results.push({key,label,ok:false,message:'Not connected yet'});continue;}
    let timer;
    try{
      const endpoint=new URL(url);if(endpoint.protocol!=='https:')throw Error();
      const controller=new AbortController();timer=setTimeout(()=>controller.abort(),30000);
      const response=await fetch(endpoint.href,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({...state.payload,destination:key}),signal:controller.signal,redirect:'follow'});
      if(!response.ok)throw Error();const answer=await response.json();if(answer.success!==true)throw Error();
      const reference=String(answer.referenceId||answer.enquiryId||answer.bookingId||'Received').slice(0,120);
      state.confirmed[key]=reference;results.push({key,label,ok:true,reference});
    }catch{results.push({key,label,ok:false,message:'Receipt not confirmed — retry available'});}finally{clearTimeout(timer);}
  }
  return results;
};
// Shared by customer enquiries and staff bookings; success is never inferred from an opaque response.
FORMS.submit=async form=>{
  if(form._submitting||form._submitted)return;
  await Promise.all([...form.querySelectorAll('input[type=file]')].map(el=>el._validateFile?.()));
  if(form._submitting||form._submitted)return;
  if(!form._delivery && ((form._extraValidate&&!form._extraValidate())||!FORMS.validate(form)))return;
  const status=form.querySelector('.form-status'),submit=form.querySelector('[type=submit]');
  form._submitting=true;submit.disabled=true;submit.textContent='Sending…';status.textContent='Sending your request. Please keep this page open.';
  let controls=[];
  try{
    const payload=form._delivery?.payload||await FORMS.payload(form);
    controls=[...form.querySelectorAll('input,select,textarea,button:not([type=submit])')].map(el=>[el,el.disabled]);controls.forEach(([el])=>el.disabled=true);
    const results=await AREZZI.sendDestinations(form,payload),all=results.every(x=>x.ok),some=results.some(x=>x.ok);
    status.className='form-status '+(all?'success':'error');status.replaceChildren();
    const title=document.createElement('p');title.textContent=all?'Thank you. Your request has been received. We will contact you to discuss the next step.':some?'Your request was partly delivered. Retry will only contact the remaining destination.':'Online receipt has not been confirmed. Your details are kept on this page. You can retry, call, or use WhatsApp.';status.append(title);
    const list=document.createElement('ul');list.className='destination-status';results.forEach(r=>{const li=document.createElement('li');li.textContent=r.label+': '+(r.ok?r.reference:r.message);list.append(li);});status.append(list);
    form._submitted=all;submit.textContent=all?'Request received':'Retry remaining delivery';submit.disabled=all;
    if(all){try{sessionStorage.setItem('arezzi-receipt',JSON.stringify({success:true,type:form.dataset.requestType,reference:results[0].reference,at:Date.now()}));}catch{}}
    if(!some){controls.forEach(([el,disabled])=>el.disabled=disabled);form._delivery=null;}
    // Once one destination accepts a payload, inputs stay locked to keep retries identical.
    status.focus();
  }catch{status.className='form-status error';status.textContent='Unable to prepare the request. Your details remain here. Please retry.';controls.forEach(([el,disabled])=>el.disabled=disabled);submit.disabled=false;submit.textContent='Retry request';}
  finally{form._submitting=false;}
};
document.addEventListener('DOMContentLoaded',()=>{
 const host=document.querySelector('[data-enquiry]');if(!host)return;const f=FORMS.field;
 host.innerHTML=`<form class="form-shell" data-request-type="enquiry"><span class="eyebrow">Make it personal</span><h2>Tell us what you have in mind.</h2><p class="lead">A few details are enough to begin. You do not need to know furniture models or fabric names.</p><div class="field-grid">${f('name','Full name','text',true,null,'autocomplete="name"')}${f('phone','Phone / WhatsApp','tel',true)}${f('district','District','select',true,['Bengaluru Urban','Bengaluru Rural','Bengaluru South (Ramanagara)','Tumakuru','Kolar','Chikkaballapur'])}${f('area','Area / locality','text',true)}${f('pin','PIN code','text',true,null,'inputmode="numeric" maxlength="6" autocomplete="postal-code"')}${f('furnitureType','Furniture type','select',true,['Sofa','Bed','Table'])}</div><div class="help-choice"><label for="guidanceRequested"><input type="checkbox" name="guidanceRequested" id="guidanceRequested"><span><strong>Not sure about models, fabrics or colours?</strong><br>Request a representative home visit to explore your options together. We will call to confirm availability and arrangements.</span></label></div><details class="optional-details"><summary>I have some preferences (optional)</summary><div class="field-grid">${f('model','Preferred model','select')}${f('material','Preferred fabric / material','select')}${f('colour','Preferred colour','select',false,COLOURS.map(x=>x[0]))}${f('quantity','Quantity','number',false,null,'min="1" max="999" step="1"')}${f('customPreference','Other design, colour or finish preference')}${f('email','Email (optional)','email')}${f('requirements','Tell us about your space','textarea')}${FORMS.upload()}</div></details><div class="field-grid">${FORMS.check('consent','I agree to be contacted about this enquiry and have read the <a class="legal-link" href="privacy-policy.html">Privacy Policy</a>.')}</div><div class="review-panel" data-review hidden tabindex="-1"></div><div class="form-nav"><button class="btn" type="submit">Review enquiry →</button></div><div class="form-status" role="status" aria-live="polite" tabindex="-1"></div></form>`;
 const form=host.querySelector('form');FORMS.bind(form);FORMS.bindProductFields(form);FORMS.simpleReview(form);
 form.elements.guidanceRequested.addEventListener('change',()=>{host.querySelector('.help-choice').classList.toggle('selected',form.elements.guidanceRequested.checked);});
 if(new URLSearchParams(location.search).has('product'))form.querySelector('details').open=true;
});
