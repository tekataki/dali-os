'use strict';
window.Domain = (() => {
  const tz = 'America/Mexico_City';
  function today(date = new Date()) { return new Intl.DateTimeFormat('en-CA', {timeZone: tz, year:'numeric', month:'2-digit', day:'2-digit'}).format(date); }
  function cents(value) { const s = String(value).trim(); if (!/^\d{1,10}(\.\d{1,2})?$/.test(s)) throw new Error('Ingresa un monto válido con hasta 2 decimales.'); const [a,b=''] = s.split('.'); const n = Number(a)*100+Number(b.padEnd(2,'0')); if(!Number.isSafeInteger(n)) throw new Error('El monto es demasiado grande.'); return n; }
  const money = n => new Intl.NumberFormat('es-MX', {style:'currency',currency:'MXN',minimumFractionDigits:2}).format(n/100);
  const balance = list => list.filter(x=>!x.deleted_at).reduce((sum,x)=>sum+(x.type==='income'?x.amount:-x.amount),0);
  const outstanding = item => Math.max(0,item.amount-(item.payments||[]).reduce((s,p)=>s+p.amount,0));
  function periodKey(horizon, date=today()) {
    if(horizon==='anual') return date.slice(0,4); if(horizon==='mensual') return date.slice(0,7);
    if(horizon==='semanal') { const d=new Date(date+'T12:00:00Z'); d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7)); return d.toISOString().slice(0,10); } return date;
  }
  function renewGoals(goals, date=today()) {
    let changed=false;
    const nextPeriod=(horizon,key)=>{
      if(horizon==='anual') return String(Number(key)+1);
      if(horizon==='mensual') { const d=new Date(key+'-01T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+1);return d.toISOString().slice(0,7); }
      const d=new Date(key+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+(horizon==='semanal'?7:1));return d.toISOString().slice(0,10);
    };
    for(const g of goals.filter(x=>x.recurring&&!x.deleted_at&&!x.archived)) {
      const key=periodKey(g.horizon,date);
      if(g.periodKey>=key) continue;
      g.history=g.history||[];
      const existing=new Set(g.history.map(h=>h.periodKey));
      let cursor=g.periodKey, count=0;
      while(cursor<key) {
        if(++count>10000) throw new Error('El objetivo tiene más de 10,000 periodos pendientes. Revisa su fecha antes de renovarlo.');
        if(!existing.has(cursor)) { g.history.push({periodKey:cursor,progress:cursor===g.periodKey?g.progress:0,target:g.target,recorded:cursor===g.periodKey});existing.add(cursor); }
        cursor=nextPeriod(g.horizon,cursor);
      }
      g.progress=0;g.periodKey=key;g.date=date;g.updated_at=new Date().toISOString();changed=true;
    }
    return changed;
  }
  function learningProgress(skill) { const tasks=skill.tasks||[],total=tasks.reduce((s,t)=>s+t.points,0); if(!total)return 0;const done=tasks.filter(t=>t.done).reduce((s,t)=>s+t.points,0);const hasFinal=tasks.some(t=>t.final&&t.done&&String(t.evidence||'').trim());return Math.min(hasFinal?100:99,Math.round(done/total*100)); }
  function age(birth,date=today()){let n=Number(date.slice(0,4))-Number(birth.slice(0,4));if(date.slice(5)<birth.slice(5))n--;return n;}
  function linkedPayment(state,collection,id,payment){const item=state[collection].find(x=>x.id===id);if(!item)throw new Error('Registro no encontrado.');item.payments=item.payments||[];if(item.payments.some(p=>p.id===payment.id))return false;if(!Number.isSafeInteger(payment.amount)||payment.amount<=0||payment.amount>outstanding(item))throw new Error('El abono debe ser mayor a cero y no superar el saldo pendiente.');item.payments.push(payment);if(payment.link&&!state.transactions.some(t=>t.origin===payment.id)){state.transactions.push({id:payment.id,type:collection==='bills'?'expense':'income',amount:payment.amount,title:collection==='clients'?'Cobro · '+item.title:'Abono · '+item.title,category:collection==='clients'?'Clientes':'Personal',date:payment.date,origin:payment.id,source:collection,created_at:new Date().toISOString(),updated_at:new Date().toISOString()});}item.updated_at=new Date().toISOString();return true;}
  function validateJournal(data){return !!data&&typeof data.title==='string'&&data.title.length>0&&typeof data.text==='string'&&data.text.length>0&&typeof data.summary==='string'&&Number.isInteger(data.productivity)&&data.productivity>=0&&data.productivity<=100&&typeof data.reason==='string'&&Array.isArray(data.tags)&&data.tags.every(t=>typeof t==='string');}
  const escape = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  return {today,cents,money,balance,outstanding,periodKey,renewGoals,learningProgress,age,linkedPayment,validateJournal,escape};
})();
