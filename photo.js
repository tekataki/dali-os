'use strict';
// Local binary storage. No base64, remote upload, signed URL or authentication is simulated.
window.ProfilePhoto = (() => {
  let cachedUrl = null, loaded = false, currentBlob = null;
  const databaseName = DALI_CONFIG.storageKey + '-media';
  function database() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('Este navegador no permite guardar fotografías locales.'));
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('assets');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('No se pudo abrir el almacenamiento de fotografías.'));
    });
  }
  async function read() {
    const db = await database();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('assets', 'readonly');
      const request = tx.objectStore('assets').get('profile');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('No se pudo leer la fotografía.'));
      tx.oncomplete = () => db.close();
      tx.onabort = () => db.close();
    });
  }
  async function write(blob) {
    const db = await database();
    await new Promise((resolve, reject) => {
      const tx = db.transaction('assets', 'readwrite');
      if (blob) tx.objectStore('assets').put(blob, 'profile');
      else tx.objectStore('assets').delete('profile');
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onabort = tx.onerror = () => { db.close(); reject(new Error('No se pudo guardar la fotografía. Puede faltar espacio.')); };
    });
    currentBlob = blob;
    if (cachedUrl) URL.revokeObjectURL(cachedUrl);
    cachedUrl = blob ? URL.createObjectURL(blob) : null;
    loaded = true;
  }
  async function hydrate() {
    try {
      if (!loaded) { currentBlob = await read(); cachedUrl = currentBlob ? URL.createObjectURL(currentBlob) : null; loaded = true; }
      document.querySelectorAll('[data-profile-photo]').forEach(el => {
        el.replaceChildren();
        if (cachedUrl) { const img = new Image(); img.src = cachedUrl; img.alt = 'Fotografía de perfil'; el.append(img); }
        else el.textContent = Store.get().profile.preferred.slice(0, 1).toUpperCase();
      });
    } catch { /* Photo storage must never prevent using the text-based profile. */ }
  }
  async function editor() {
    await hydrate();
    App.openDialog('Tu fotografía de perfil', `<p class="dialog-subtitle">Recorta, reposiciona y comprime en tu navegador. La foto no se envía a ningún servidor. Se guarda separada del respaldo JSON.</p><div class="photo-editor"><canvas id="photo-preview" width="512" height="512" aria-label="Vista previa del recorte"></canvas><label class="button full-width" for="photo-file">${Views.icon('image-plus')}Elegir fotografía</label><input id="photo-file" type="file" accept="image/jpeg,image/png,image/webp" hidden><p class="muted">JPG, PNG o WebP · Máximo 8 MB · Salida: 512 × 512 px</p><label>Acercar<input id="photo-zoom" type="range" min="1" max="3" step="0.01" value="1" disabled></label><label>Posición horizontal<input id="photo-x" type="range" min="-100" max="100" value="0" disabled></label><label>Posición vertical<input id="photo-y" type="range" min="-100" max="100" value="0" disabled></label><p id="photo-error" class="form-error" role="alert"></p><div class="photo-actions"><button id="photo-delete" type="button" class="button danger" ${currentBlob?'':'disabled'}>Eliminar foto</button><button id="photo-export" type="button" class="button" ${currentBlob?'':'disabled'}>Descargar foto</button><button id="photo-save" type="button" class="button primary" disabled>Guardar recorte</button></div></div>`);
    const canvas = document.getElementById('photo-preview'), ctx = canvas.getContext('2d');
    const zoom = document.getElementById('photo-zoom'), x = document.getElementById('photo-x'), y = document.getElementById('photo-y');
    const save = document.getElementById('photo-save'), error = document.getElementById('photo-error');
    let image = null, temporaryUrl = null;
    const draw = () => {
      ctx.fillStyle = '#eaf0fc'; ctx.fillRect(0, 0, 512, 512);
      if (!image) { ctx.fillStyle = '#46658f'; ctx.font = 'bold 180px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(Store.get().profile.preferred.slice(0, 1).toUpperCase(), 256, 268); return; }
      const scale = Math.max(512 / image.naturalWidth, 512 / image.naturalHeight) * Number(zoom.value);
      const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
      ctx.drawImage(image, (512-width)/2 * (1+Number(x.value)/100), (512-height)/2 * (1+Number(y.value)/100), width, height);
    };
    const load = blob => new Promise((resolve, reject) => {
      if (temporaryUrl) URL.revokeObjectURL(temporaryUrl);
      temporaryUrl = URL.createObjectURL(blob);
      const next = new Image();
      next.onload = () => { image = next; zoom.value=1; x.value=0; y.value=0; [zoom,x,y,save].forEach(el=>el.disabled=false); draw(); resolve(); };
      next.onerror = () => reject(new Error('No se pudo leer esta imagen. Elige otro archivo.'));
      next.src = temporaryUrl;
    });
    draw(); if (currentBlob) await load(currentBlob);
    document.getElementById('photo-file').onchange = async event => {
      const file = event.target.files[0]; if (!file) return;
      try { error.textContent=''; if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Elige una imagen JPG, PNG o WebP.'); if (file.size>8*1024*1024) throw new Error('La imagen debe pesar menos de 8 MB.'); await load(file); }
      catch (err) { error.textContent=err.message; }
    };
    [zoom,x,y].forEach(el=>el.oninput=draw);
    save.onclick = async () => {
      save.disabled=true;
      try { const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',0.85)); if(!blob)throw new Error('El navegador no pudo comprimir la fotografía.'); await write(blob); App.closeDialog(); App.render(); App.toast('Fotografía guardada en este navegador.'); }
      catch(err) { error.textContent=err.message; save.disabled=false; }
    };
    document.getElementById('photo-export').onclick = () => {
      if(!currentBlob)return; const a=document.createElement('a');a.href=cachedUrl;a.download='dali-perfil.'+(currentBlob.type==='image/png'?'png':'webp');a.click();
    };
    document.getElementById('photo-delete').onclick = () => App.confirmAction('¿Eliminar tu foto?','La fotografía local se eliminará. Puedes descargar una copia antes de continuar.',()=>{
      write(null).then(()=>{hydrate();App.toast('Fotografía eliminada.');}).catch(err=>App.toast(err.message,'error'));
    },'Eliminar fotografía');
    document.getElementById('app-dialog').addEventListener('close',()=>{if(temporaryUrl)URL.revokeObjectURL(temporaryUrl);},{once:true});
  }
  return {hydrate, editor, read, write};
})();
