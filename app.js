const input = document.getElementById('query');
const type = document.getElementById('type');
const searchBtn = document.getElementById('search');
const openBtn = document.getElementById('open');
const copyBtn = document.getElementById('copy');
const preview = document.getElementById('urlPreview');

const PATHS = {
  top: 'top',
  marketplace: 'marketplace',
  groups: 'groups',
  posts: 'posts',
  pages: 'pages',
  hashtags: 'top'
};

function buildURL(q, tpe){
  const base = location.origin + '/fb-search-proxy?'; // placeholder for relative behavior
  // We'll actually open facebook.com directly since proxy isn't provided.
  const fbBase = 'https://www.facebook.com/search/';
  let qstr = q;
  if(tpe === 'hashtags'){
    if(!qstr.startsWith('#')) qstr = '#' + qstr;
    qstr = qstr.replace('#', '%23');
  }
  return fbBase + (PATHS[tpe] || 'top') + '?q=' + encodeURIComponent(qstr);
}

function updatePreview(){
  const q = input.value.trim();
  if(!q){ preview.textContent = 'Escribe algo para ver el enlace...'; return ''; }
  const url = buildURL(q, type.value);
  preview.textContent = url;
  return url;
}

searchBtn.addEventListener('click', ()=>{ const url = updatePreview(); if(url) window.open(url, '_blank'); });
openBtn.addEventListener('click', ()=>{ const url = updatePreview(); if(url) window.open(url, '_blank'); });
copyBtn.addEventListener('click', ()=>{
  const url = updatePreview();
  if(!url) return;
  navigator.clipboard.writeText(url).then(()=>{ copyBtn.textContent = 'Enlace copiado'; setTimeout(()=>copyBtn.textContent='Copiar enlace',1400); }).catch(()=>alert('No se pudo copiar'));
});

input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') { const url = updatePreview(); if(url) window.open(url, '_blank'); }});
type.addEventListener('change', updatePreview);
input.addEventListener('input', updatePreview);

// prefill from clipboard (best-effort)
if(navigator.clipboard){
  navigator.clipboard.readText().then(t=>{
    if(t && t.length<120 && !input.value) input.value = t;
    updatePreview();
  }).catch(()=>{});
}

// Register basic service worker for offline shell
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/service-worker.js').catch(()=>{/* ignore */});
}
