'use strict';
Store.init();
Store.save(state=>{state.preferences.theme=REVIEW_CONFIG.theme;});
location.replace('index.html?qa='+REVIEW_CONFIG.id+'#'+REVIEW_CONFIG.route);
