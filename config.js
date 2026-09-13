window.DALI_CONFIG = Object.freeze({
  name: 'DALI OS', version: '0.1.0', locale: 'es-MX', timezone: 'America/Mexico_City', currency: 'MXN',
  storageKey: new URLSearchParams(location.search).has('qa') ? 'dali-os-qa-' + new URLSearchParams(location.search).get('qa').replace(/[^a-zA-Z0-9-]/g,'').slice(0,50) : 'dali-os-local-v1',
  categories: ['Ventas','Clientes','Reembolso','Inversión','Gasolina','Comida','Gimnasio','Escuela','Personal','Otro'],
  stages: ['Prospecto','Contactado','Interesado','Diagnóstico','Propuesta','Negociación','Cliente activo','Entrega','Completado','Pausado','Perdido'],
  sections: [
    ['inicio','Inicio','layout-dashboard'],['finanzas','Finanzas','wallet'],['gimnasio','Gimnasio','dumbbell'],
    ['objetivos','Objetivos','target'],['soma','SOMA','briefcase-business'],['aprendizaje','Aprendizaje','graduation-cap'],
    ['bitacora','Bitácora personal','book-open'],['perfil','Mi perfil','user-round']
  ]
});
