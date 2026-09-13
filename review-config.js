'use strict';
// Launcher only: redirects into the real index.html, never a simulated viewport.
window.REVIEW_CONFIG={id:'review-'+crypto.randomUUID(),route:'perfil',theme:'dark'};
window.DALI_CONFIG=Object.freeze({...DALI_CONFIG,storageKey:'dali-os-qa-'+REVIEW_CONFIG.id});
