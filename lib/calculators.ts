import type { Calculator, Lang } from './types';
import { fShort, fYr, PALETTE } from './format';

// LANG mirrors the original module-level language used by chart labels and a few
// compute() branches (e.g. Invest-vs-Repay recommendation words). Call setCalcLang(lang)
// once before reading compute()/chart() in a render pass.
let LANG: Lang = 'en';
export function setCalcLang(l: Lang) { LANG = l; }
function L(en: string, hi: string) { return LANG === 'hi' ? hi : en; }
function fShortRaw(n: number) { return fShort(n).replace('\u20b9', ''); }
function fPctRaw(n: number) { return (Math.round(n * 100) / 100) + '%'; }

export const CALCS: Calculator[] = [
  { id:'emi', cat:'loan', icon:'🏦', cta:'prepay',
    inputs:[ {k:'amount',def:3000000,min:50000,max:50000000,step:50000,kind:'inr'},
             {k:'rate',def:8.5,min:1,max:24,step:0.1,kind:'pct'},
             {k:'years',def:20,min:1,max:30,step:1,kind:'yr'} ],
    results:[ {k:'emi',kind:'inr',big:true}, {k:'interest',kind:'inr'}, {k:'total',kind:'inr'} ],
    compute(v){ const r=v.rate/1200, n=v.years*12; const emi = r===0? v.amount/n : v.amount*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1); const total=emi*n; return {emi, total, interest: total-v.amount}; },
    chart(v,r){ return { type:'doughnut', data:{ labels:[L('Principal','मूल राशि'),L('Interest','ब्याज')], datasets:[{ data:[v.amount, r.interest], backgroundColor:[PALETTE.brand, PALETTE.amber], borderWidth:0 }] }, options:{ cutout:'62%', plugins:{ legend:{position:'bottom', labels:{font:{size:14}}} } } }; },
    insight(v,r,lang){ const ratio=(r.interest/v.amount*100); return lang==='hi'
      ? `आप ₹${fShortRaw(v.amount)} उधार ले रहे हैं, पर कुल ${fShort(r.interest)} ब्याज देंगे — यानी मूल राशि का करीब <b>${Math.round(ratio)}%</b> सिर्फ़ ब्याज में। अवधि छोटी करें या थोड़ा prepay करें तो यह काफ़ी घट सकता है।`
      : `You are borrowing ₹${fShortRaw(v.amount)} but will pay ${fShort(r.interest)} in interest — about <b>${Math.round(ratio)}%</b> of the loan, just in interest. A shorter tenure or small prepayments can cut this a lot.`; } },

  { id:'prepay', cat:'loan', icon:'⏩', cta:'whichfirst',
    inputs:[ {k:'outstanding',def:2500000,min:50000,max:50000000,step:50000,kind:'inr'},
             {k:'rate',def:9,min:1,max:24,step:0.1,kind:'pct'},
             {k:'years',def:15,min:1,max:30,step:1,kind:'yr'},
             {k:'extra',def:5000,min:0,max:200000,step:1000,kind:'inr'} ],
    results:[ {k:'saved',kind:'inr',big:true}, {k:'yrsSaved',kind:'yr'}, {k:'newterm',kind:'yr'} ],
    compute(v){ const r=v.rate/1200, n=v.years*12; const emi = r===0? v.outstanding/n : v.outstanding*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1); const baseInt = emi*n - v.outstanding;
      let bal=v.outstanding, m=0, intPaid=0; const pay=emi+v.extra;
      while(bal>0 && m<1200){ const i=bal*r; let pr=pay-i; if(pr<=0){ m=1200; break; } if(pr>bal) pr=bal; intPaid+=i; bal-=pr; m++; }
      const newYears=m/12; return { saved: Math.max(0, baseInt-intPaid), yrsSaved: Math.max(0, v.years-newYears), newterm:newYears, _emi:emi, _baseInt:baseInt }; },
    chart(v,r){ return { type:'bar', data:{ labels:[L('Without prepay','बिना prepay'), L('With prepay','prepay के साथ')], datasets:[{ label:L('Interest paid','दिया गया ब्याज'), data:[r._baseInt, r._baseInt-r.saved], backgroundColor:[PALETTE.slate, PALETTE.brand], borderRadius:8 }] }, options:{ plugins:{legend:{display:false}}, scales:{ y:{ ticks:{ callback:val=>fShort(val) } } } } }; },
    insight(v,r,lang){ if(v.extra<=0) return lang==='hi'?'ऊपर "हर महीने अतिरिक्त भुगतान" बढ़ाकर देखें कि कितनी बचत होती है।':'Increase the "extra payment each month" above to see your savings.'; return lang==='hi'
      ? `हर महीने सिर्फ़ ${fShort(v.extra)} अतिरिक्त देकर आप <b>${fShort(r.saved)} ब्याज</b> बचाते हैं और लोन <b>${fYr(r.yrsSaved,'hi')}</b> जल्दी ख़त्म करते हैं। यह आपकी सबसे आसान "गारंटीड बचत" में से एक है।`
      : `By paying just ${fShort(v.extra)} extra each month, you save <b>${fShort(r.saved)} in interest</b> and finish <b>${fYr(r.yrsSaved,'en')}</b> earlier. This is one of the easiest guaranteed savings you can make.`; } },

  { id:'whichfirst', cat:'loan', icon:'🧮', cta:'prepay', special:true },

  { id:'fdvsloan', cat:'loan', icon:'⚖️', cta:'investvsrepay',
    inputs:[ {k:'amount',def:500000,min:10000,max:10000000,step:10000,kind:'inr'},
             {k:'fd',def:7,min:1,max:12,step:0.1,kind:'pct'},
             {k:'loan',def:9,min:1,max:24,step:0.1,kind:'pct'},
             {k:'tax',def:30,min:0,max:30,step:5,kind:'pct'} ],
    results:[ {k:'efffd',kind:'pct'}, {k:'effloan',kind:'pct'}, {k:'diff',kind:'inr',big:true} ],
    compute(v){ const efffd=v.fd*(1-v.tax/100); const effloan=v.loan; const better=Math.max(effloan,efffd); const worse=Math.min(effloan,efffd); const diff=(better-worse)/100*v.amount; return {efffd, effloan, diff, _repay: effloan>efffd}; },
    insight(v,r,lang){ const gap=Math.abs(r.effloan-r.efffd); const neutral=gap<0.4;
      if(lang==='hi'){ if(neutral) return `दोनों लगभग बराबर हैं (FD टैक्स के बाद ${fPctRaw(r.efffd)} बनाम लोन ${fPctRaw(r.effloan)})। ऐसे में अपनी सुविधा देखें — थोड़ी नकदी भी पास रखना ठीक है।`;
        return r._repay ? `आपके लोन की लागत (${fPctRaw(r.effloan)}) टैक्स के बाद FD रिटर्न (${fPctRaw(r.efffd)}) से ज़्यादा है। इन आँकड़ों के आधार पर <b>लोन चुकाना</b> बेहतर लगता है — इससे आप करीब ${fShort(r.diff)} सालाना बचाते हैं।`
                       : `टैक्स के बाद आपकी FD (${fPctRaw(r.efffd)}) लोन की लागत (${fPctRaw(r.effloan)}) से ज़्यादा देती है। ऐसे में <b>FD रखना</b> थोड़ा बेहतर है (करीब ${fShort(r.diff)} सालाना)।`; }
      if(neutral) return `Both are almost equal (FD after tax ${fPctRaw(r.efffd)} vs loan ${fPctRaw(r.effloan)}). Either is fine — keeping some cash handy is also reasonable.`;
      return r._repay ? `Your loan costs ${fPctRaw(r.effloan)}, more than your after-tax FD return of ${fPctRaw(r.efffd)}. Based on these numbers, <b>repaying the loan</b> is better — it saves you about ${fShort(r.diff)} a year.`
                      : `Your after-tax FD (${fPctRaw(r.efffd)}) earns more than the loan costs (${fPctRaw(r.effloan)}). Here, <b>keeping the FD</b> is slightly better (about ${fShort(r.diff)} a year).`; } },

  { id:'investvsrepay', cat:'loan', icon:'🔀', cta:'sip',
    inputs:[ {k:'loan',def:9,min:1,max:24,step:0.1,kind:'pct'},
             {k:'ret',def:12,min:1,max:20,step:0.1,kind:'pct'},
             {k:'horizon',def:10,min:1,max:30,step:1,kind:'yr'} ],
    results:[ {k:'conservative',kind:'txt'}, {k:'balanced',kind:'txt'}, {k:'aggressive',kind:'txt'} ],
    compute(v){ const gap=v.ret-v.loan; const longish=v.horizon>=7;
      const REPAY=L('Repay loan','लोन चुकाएँ'), INVEST=L('Invest','निवेश करें'), EITHER=L('Either is fine','दोनों ठीक हैं');
      const conservative = gap>2 && longish ? INVEST : REPAY;
      const balanced = gap>0.5 ? (longish?INVEST:(gap>2?INVEST:EITHER)) : (gap< -0.5? REPAY : EITHER);
      const aggressive = gap>-1 && longish ? INVEST : REPAY;
      return {conservative, balanced, aggressive, _gap:gap, _long:longish}; },
    insight(v,r,lang){ if(lang==='hi') return `आपका लोन ${fPctRaw(v.loan)} का है और अपेक्षित रिटर्न ${fPctRaw(v.ret)}${r._gap>0?` — यानी निवेश करीब ${fPctRaw(r._gap)} ज़्यादा दे सकता है`:''}. याद रखें: लोन चुकाना <b>पक्की</b> बचत है, जबकि निवेश का रिटर्न <b>पक्का नहीं</b>। ${r._long?'आपकी लंबी अवधि equity के पक्ष में है।':'आपकी अवधि छोटी है, इसलिए सतर्क रहना ठीक है।'} ${v.loan>=12?'इतने ऊँचे ब्याज वाले लोन पहले चुकाना आमतौर पर समझदारी है।':''}`;
      return `Your loan is ${fPctRaw(v.loan)} and expected return is ${fPctRaw(v.ret)}${r._gap>0?` — investing may earn about ${fPctRaw(r._gap)} more`:''}. Remember: repaying is a <b>guaranteed</b> saving, while investment returns are <b>not guaranteed</b>. ${r._long?'Your long horizon favours equity.':'Your horizon is short, so being cautious is reasonable.'} ${v.loan>=12?'For high-interest loans like this, repaying first is usually wise.':''}`; } },

  { id:'sip', cat:'invest', icon:'📈', cta:'goal',
    inputs:[ {k:'monthly',def:10000,min:500,max:500000,step:500,kind:'inr'},
             {k:'ret',def:12,min:1,max:20,step:0.1,kind:'pct'},
             {k:'years',def:15,min:1,max:40,step:1,kind:'yr'} ],
    results:[ {k:'fv',kind:'inr',big:true}, {k:'invested',kind:'inr'}, {k:'gain',kind:'inr'} ],
    compute(v){ const i=v.ret/1200, n=v.years*12; const fv = i===0? v.monthly*n : v.monthly*((Math.pow(1+i,n)-1)/i)*(1+i); const invested=v.monthly*n; return {fv, invested, gain:fv-invested}; },
    chart(v,r){ const i=v.ret/1200; const yrs=[], inv=[], val=[]; for(let y=1;y<=v.years;y++){ const n=y*12; yrs.push(y); inv.push(v.monthly*n); val.push(i===0? v.monthly*n : v.monthly*((Math.pow(1+i,n)-1)/i)*(1+i)); }
      return { type:'line', data:{ labels:yrs, datasets:[ {label:L('Value','मूल्य'),data:val,borderColor:PALETTE.brand,backgroundColor:'rgba(15,157,110,.12)',fill:true,tension:.3,pointRadius:0,borderWidth:3}, {label:L('Invested','निवेश'),data:inv,borderColor:PALETTE.slate,borderDash:[5,4],fill:false,tension:.3,pointRadius:0,borderWidth:2} ] }, options:{ plugins:{legend:{position:'bottom'}}, scales:{ y:{ticks:{callback:val=>fShort(val)}}, x:{title:{display:true,text:L('Years','साल')}} } } }; },
    insight(v,r,lang){ const mult=r.fv/r.invested; return lang==='hi'
      ? `${v.years} साल में आप ${fShort(r.invested)} निवेश करते हैं, जो बढ़कर <b>${fShort(r.fv)}</b> बन जाता है — यानी आपका पैसा करीब <b>${mult.toFixed(1)} गुना</b>। बड़ा फ़र्क़ compounding लाता है, इसलिए जल्दी शुरू करना सबसे बड़ा फ़ायदा है।`
      : `Over ${v.years} years you invest ${fShort(r.invested)}, which grows to <b>${fShort(r.fv)}</b> — about <b>${mult.toFixed(1)}×</b> your money. Compounding does the heavy lifting, so starting early is your biggest advantage.`; } },

  { id:'lumpsum', cat:'invest', icon:'💰', cta:'goal',
    inputs:[ {k:'amount',def:500000,min:5000,max:50000000,step:5000,kind:'inr'},
             {k:'ret',def:12,min:1,max:20,step:0.1,kind:'pct'},
             {k:'years',def:10,min:1,max:40,step:1,kind:'yr'} ],
    results:[ {k:'fv',kind:'inr',big:true}, {k:'gain',kind:'inr'} ],
    compute(v){ const fv=v.amount*Math.pow(1+v.ret/100, v.years); return {fv, gain:fv-v.amount}; },
    chart(v,r){ const yrs=[],val=[]; for(let y=0;y<=v.years;y++){ yrs.push(y); val.push(v.amount*Math.pow(1+v.ret/100,y)); } return { type:'line', data:{ labels:yrs, datasets:[{label:L('Value','मूल्य'),data:val,borderColor:PALETTE.indigo,backgroundColor:'rgba(79,70,229,.12)',fill:true,tension:.3,pointRadius:0,borderWidth:3}] }, options:{ plugins:{legend:{display:false}}, scales:{ y:{ticks:{callback:val=>fShort(val)}}, x:{title:{display:true,text:L('Years','साल')}} } } }; },
    insight(v,r,lang){ const mult=r.fv/v.amount; return lang==='hi'
      ? `${fShort(v.amount)} का एकमुश्त निवेश ${v.years} साल में बढ़कर <b>${fShort(r.fv)}</b> हो जाता है — करीब <b>${mult.toFixed(1)} गुना</b>। इसे बीच में न छेड़ें; समय ही इसका जादू है।`
      : `A one-time ${fShort(v.amount)} grows to <b>${fShort(r.fv)}</b> in ${v.years} years — about <b>${mult.toFixed(1)}×</b>. Leave it untouched; time is what does the magic.`; } },

  { id:'goal', cat:'invest', icon:'🎯', cta:'sip',
    goals:true,
    inputs:[ {k:'target',def:5000000,min:100000,max:100000000,step:100000,kind:'inr'},
             {k:'years',def:15,min:1,max:40,step:1,kind:'yr'},
             {k:'ret',def:12,min:1,max:20,step:0.1,kind:'pct'} ],
    results:[ {k:'sip',kind:'inr',big:true}, {k:'invested',kind:'inr'}, {k:'gain',kind:'inr'} ],
    compute(v){ const i=v.ret/1200, n=v.years*12; const sip = i===0? v.target/n : v.target*i/((Math.pow(1+i,n)-1)*(1+i)); const invested=sip*n; return {sip, invested, gain:v.target-invested}; },
    insight(v,r,lang){ return lang==='hi'
      ? `${fShort(v.target)} का लक्ष्य ${v.years} साल में पाने के लिए आपको हर महीने करीब <b>${fShort(r.sip)}</b> निवेश करना होगा। इसमें से आप ${fShort(r.invested)} लगाते हैं और बाकी ${fShort(r.gain)} बढ़ोतरी से आता है। आज एक SIP शुरू करना ही सबसे ज़रूरी कदम है।`
      : `To reach ${fShort(v.target)} in ${v.years} years, invest about <b>${fShort(r.sip)}</b> every month. You contribute ${fShort(r.invested)} and the rest, ${fShort(r.gain)}, comes from growth. Starting one SIP today is the most important step.`; } },

  { id:'retirecorpus', cat:'retire', icon:'🌅', cta:'canretire',
    inputs:[ {k:'age',def:40,min:18,max:65,step:1,kind:'num'},
             {k:'retage',def:60,min:40,max:75,step:1,kind:'num'},
             {k:'expense',def:40000,min:5000,max:1000000,step:5000,kind:'inr'},
             {k:'infl',def:6,min:2,max:12,step:0.5,kind:'pct'} ],
    results:[ {k:'futexp',kind:'inr'}, {k:'corpus',kind:'inr',big:true} ],
    compute(v){ const yrs=Math.max(0,v.retage-v.age); const futexp=v.expense*Math.pow(1+v.infl/100, yrs); const corpus=futexp*12*25; return {futexp, corpus, _yrs:yrs}; },
    insight(v,r,lang){ return lang==='hi'
      ? `महँगाई के कारण आज का ${fShort(v.expense)} मासिक खर्च, रिटायरमेंट के समय (${r._yrs} साल बाद) करीब <b>${fShort(r.futexp)}</b> हो जाएगा। बिना वेतन के यह जीवनभर चलाने के लिए आपको लगभग <b>${fShort(r.corpus)}</b> का corpus चाहिए। यह बड़ा दिखता है, पर SIP से धीरे-धीरे बन जाता है।`
      : `Because of inflation, today’s ${fShort(v.expense)} monthly expense becomes about <b>${fShort(r.futexp)}</b> by retirement (${r._yrs} years away). To fund that for life without a salary, you need a corpus of roughly <b>${fShort(r.corpus)}</b>. It looks big, but a steady SIP builds it over time.`; } },

  { id:'swp', cat:'retire', icon:'🧾', cta:'willlast',
    inputs:[ {k:'corpus',def:10000000,min:100000,max:200000000,step:500000,kind:'inr'},
             {k:'withdraw',def:75000,min:5000,max:2000000,step:5000,kind:'inr'},
             {k:'ret',def:8,min:1,max:15,step:0.1,kind:'pct'} ],
    results:[ {k:'years',kind:'yr',big:true} ],
    compute(v){ const i=v.ret/1200; let bal=v.corpus, m=0; const series=[bal]; const labels=[0];
      if(v.withdraw <= bal*i){ return {years:99, _forever:true, _series:[], _labels:[]}; }
      while(bal>0 && m<1200){ bal=bal*(1+i)-v.withdraw; m++; if(m%12===0){ series.push(Math.max(0,bal)); labels.push(m/12); } }
      return {years:m/12, _forever:false, _series:series, _labels:labels}; },
    chart(v,r){ if(r._forever) return null; return { type:'line', data:{ labels:r._labels, datasets:[{label:L('Balance','बैलेंस'),data:r._series,borderColor:PALETTE.indigo,backgroundColor:'rgba(79,70,229,.12)',fill:true,tension:.25,pointRadius:0,borderWidth:3}] }, options:{ plugins:{legend:{display:false}}, scales:{ y:{ticks:{callback:val=>fShort(val)}}, x:{title:{display:true,text:L('Years','साल')}} } } }; },
    insight(v,r,lang){ if(r._forever) return lang==='hi'?`आपकी मासिक निकासी (${fShort(v.withdraw)}) corpus की कमाई से कम है, इसलिए बैलेंस घटने के बजाय बढ़ता रहता है — यह पैसा <b>अनिश्चित काल तक</b> चल सकता है।`:`Your monthly withdrawal (${fShort(v.withdraw)}) is less than what the corpus earns, so the balance keeps growing instead of shrinking — this money can last <b>indefinitely</b>.`;
      return lang==='hi'?`${fShort(v.corpus)} के corpus से ${fShort(v.withdraw)} मासिक निकालने पर पैसा करीब <b>${fYr(r.years,'hi')}</b> चलेगा। निकासी थोड़ी घटाने या रिटर्न बढ़ने से यह समय काफ़ी बढ़ जाता है।`:`Withdrawing ${fShort(v.withdraw)} a month from a ${fShort(v.corpus)} corpus, the money lasts about <b>${fYr(r.years,'en')}</b>. Withdrawing a little less, or earning a bit more, extends this significantly.`; } },

  { id:'canretire', cat:'retire', icon:'✅', cta:'retirecorpus',
    inputs:[ {k:'age',def:40,min:18,max:64,step:1,kind:'num'},
             {k:'retage',def:60,min:40,max:75,step:1,kind:'num'},
             {k:'savings',def:2500000,min:0,max:200000000,step:100000,kind:'inr'},
             {k:'expense',def:40000,min:5000,max:1000000,step:5000,kind:'inr'} ],
    results:[ {k:'score',kind:'num',big:true}, {k:'gap',kind:'inr'}, {k:'sip',kind:'inr'} ],
    compute(v){ const yrs=Math.max(1,v.retage-v.age); const infl=0.06, pre=0.12;
      const futexp=v.expense*Math.pow(1+infl, yrs); const required=futexp*12*25;
      const projected=v.savings*Math.pow(1+pre, yrs);
      const gap=Math.max(0, required-projected);
      const score=Math.min(100, Math.round(projected/required*100));
      const i=pre/12, n=yrs*12; const sip = gap<=0?0: gap*i/((Math.pow(1+i,n)-1)*(1+i));
      return {score, gap, sip, _required:required, _projected:projected}; },
    chart(v,r){ return { type:'bar', data:{ labels:[L('On track for','आप ट्रैक पर'), L('You need','आपको चाहिए')], datasets:[{ data:[r._projected, r._required], backgroundColor:[PALETTE.brand, PALETTE.slate], borderRadius:8 }] }, options:{ plugins:{legend:{display:false}}, scales:{ y:{ticks:{callback:val=>fShort(val)}} } } }; },
    insight(v,r,lang){ const ok=r.score>=100; if(lang==='hi') return ok?`बहुत बढ़िया! आपका readiness स्कोर <b>${r.score}/100</b> है — मौजूदा बचत के दम पर आप रिटायरमेंट के लिए ट्रैक पर दिखते हैं। इसे यूँ ही जारी रखें।`:`आपका readiness स्कोर <b>${r.score}/100</b> है और करीब ${fShort(r.gap)} की कमी है। चिंता न करें — हर महीने करीब <b>${fShort(r.sip)}</b> निवेश शुरू करने से यह कमी पूरी हो सकती है।`;
      return ok?`Great! Your readiness score is <b>${r.score}/100</b> — based on current savings you look on track for retirement. Keep it up.`:`Your readiness score is <b>${r.score}/100</b>, with a gap of about ${fShort(r.gap)}. Don’t worry — investing about <b>${fShort(r.sip)}</b> a month can close this gap.`; } },

  { id:'willlast', cat:'retire', icon:'⏳', cta:'swp',
    inputs:[ {k:'age',def:60,min:40,max:80,step:1,kind:'num'},
             {k:'corpus',def:30000000,min:100000,max:300000000,step:500000,kind:'inr'},
             {k:'expense',def:80000,min:5000,max:2000000,step:5000,kind:'inr'},
             {k:'infl',def:6,min:2,max:12,step:0.5,kind:'pct'},
             {k:'ret',def:8,min:1,max:15,step:0.1,kind:'pct'} ],
    results:[ {k:'lastage',kind:'num',big:true} ],
    compute(v){ let bal=v.corpus, age=v.age, annual=v.expense*12; const series=[bal], labels=[age];
      while(bal>0 && age<121){ bal=bal*(1+v.ret/100)-annual; annual*=(1+v.infl/100); age++; series.push(Math.max(0,bal)); labels.push(age); }
      const forever = age>=121; return {lastage:age, _forever:forever, _series:series, _labels:labels}; },
    chart(v,r){ return { type:'line', data:{ labels:r._labels, datasets:[{label:L('Balance','बैलेंस'),data:r._series,borderColor:PALETTE.red,backgroundColor:'rgba(220,38,38,.10)',fill:true,tension:.2,pointRadius:0,borderWidth:3}] }, options:{ plugins:{legend:{display:false}}, scales:{ y:{ticks:{callback:val=>fShort(val)}}, x:{title:{display:true,text:L('Age','उम्र')}} } } }; },
    insight(v,r,lang){ if(r._forever) return lang==='hi'?`अच्छी ख़बर — इन आँकड़ों पर आपका corpus 100+ की उम्र से भी आगे चल सकता है। आपकी निकासी, रिटर्न और महँगाई का संतुलन अच्छा है।`:`Good news — on these numbers your corpus can last beyond age 100. Your balance of withdrawals, return and inflation is healthy.`;
      const tone = r.lastage>=85? (lang==='hi'?'यह आरामदायक स्थिति है।':'That is a comfortable position.') : (lang==='hi'?'इसे बढ़ाने के लिए खर्च थोड़ा घटाएँ या corpus बढ़ाएँ।':'To extend it, trim expenses slightly or grow the corpus.');
      return lang==='hi'?`इन आँकड़ों के आधार पर आपका पैसा करीब <b>${r.lastage} साल</b> की उम्र तक चल सकता है। ${tone}`:`Based on these numbers, your money may last until about age <b>${r.lastage}</b>. ${tone}`; } }
];
