// Smooth anchor navigation
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id && id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if(hamburger && mobileMenu){
  hamburger.addEventListener('click', ()=>{
    const open = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = open ? 'none' : 'flex';
    mobileMenu.setAttribute('aria-hidden', open ? 'true' : 'false');
  });
  mobileMenu.querySelectorAll('a').forEach(link=>{
    link.addEventListener('click', ()=>{
      mobileMenu.style.display = 'none';
      mobileMenu.setAttribute('aria-hidden','true');
    });
  });
}

// Copy contract
const copyBtn = document.getElementById('copyBtn');
const contractEl = document.getElementById('contract');
const copyStatus = document.getElementById('copyStatus');
if(copyBtn && contractEl){
  copyBtn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(contractEl.textContent.trim());
      if(copyStatus){
        copyStatus.textContent = 'Contract copied to clipboard!';
        setTimeout(()=>copyStatus.textContent='', 2000);
      }
    }catch(err){
      if(copyStatus){
        copyStatus.textContent = 'Copy failed. Please copy manually.';
        setTimeout(()=>copyStatus.textContent='', 2000);
      }
    }
  });
}

// Mock stats pulsing for demo
function tweenNumber(el, target){
  if(!el) return;
  const from = Number(el.textContent.replace(/[^0-9.]/g,''));
  const to = target;
  const prefix = el.textContent.trim().startsWith('$') ? '$' : '';
  const duration = 600;
  const start = performance.now();
  function tick(now){
    const p = Math.min(1, (now - start)/duration);
    const val = from + (to - from)*p;
    el.textContent = prefix + (prefix? val.toLocaleString(undefined,{maximumFractionDigits:0}) : Math.round(val).toLocaleString());
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function randomDelta(val, pct=0.01){
  const d = val * pct;
  return Math.max(0, val + (Math.random()*2-1)*d);
}

const capEl = document.getElementById('cap');
const holdersEl = document.getElementById('holders');
const liqEl = document.getElementById('liq');
let cap = 12345678, holders = 42069, liq = 1234567;

setInterval(()=>{
  cap = randomDelta(cap, 0.02);
  holders = randomDelta(holders, 0.004);
  liq = randomDelta(liq, 0.01);
  tweenNumber(capEl, cap);
  tweenNumber(holdersEl, holders);
  tweenNumber(liqEl, liq);
}, 2500);

// Reveal on scroll
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
document.querySelectorAll('[data-animate]').forEach(el=>observer.observe(el));

// Chart.js demo sparkline
const ctx = document.getElementById('priceChart');
if(ctx && window.Chart){
  const labels = Array.from({length:50}, (_,i)=>i);
  const data = labels.map(()=>100 + (Math.random()*6-3));
  const chart = new Chart(ctx, {
    type:'line',
    data:{
      labels,
      datasets:[{
        label:'$PEPPY Mock Price',
        data,
        tension:0.35,
        fill:true,
        borderColor:'#00d1b2',
        backgroundColor:'rgba(0,209,178,0.15)',
        pointRadius:0,
        borderWidth:2
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      scales:{
        x:{display:false},
        y:{display:false}
      },
      plugins:{
        legend:{display:false},
        tooltip:{enabled:true, mode:'index', intersect:false}
      }
    }
  });

  // Real-time demo ticker
  setInterval(()=>{
    const last = chart.data.datasets[0].data.at(-1) ?? 100;
    const next = Number((last + (Math.random()*2 - 1)).toFixed(2));
    chart.data.labels.push(chart.data.labels.length);
    chart.data.datasets[0].data.push(next);
    if(chart.data.labels.length>80){
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
    chart.update('none');
  }, 1500);
}

// Newsletter mock
const form = document.getElementById('newsletterForm');
const nStatus = document.getElementById('newsletterStatus');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if(!email || !/^\S+@\S+\.\S+$/.test(email)){
      nStatus.textContent = 'Please enter a valid email.';
      return;
    }
    nStatus.textContent = 'Subscribed! Welcome to the frog fam.';
    form.reset();
    setTimeout(()=>nStatus.textContent='', 3000);
  });
}