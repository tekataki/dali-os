'use strict';
// Schematic vector anatomy drawn for navigation, not a medical assessment.
window.BodyMap = (()=>{
  const front={
    shoulders:['M73 78Q58 78 53 94L50 119 65 116 76 95Z','M127 78Q142 78 147 94L150 119 135 116 124 95Z'],
    chest:['M78 78L97 87 97 115 72 112 66 99Z','M122 78L103 87 103 115 128 112 134 99Z'],
    biceps:['M50 124L64 120 61 152 48 159 44 150Z','M150 124L136 120 139 152 152 159 156 150Z'],
    core:['M77 117L97 122 97 168 83 179 75 151Z','M123 117L103 122 103 168 117 179 125 151Z'],
    quads:['M79 190L97 196 94 241 85 270 74 264 69 229Z','M121 190L103 196 106 241 115 270 126 264 131 229Z'],
    calves:['M74 280L86 283 87 313 79 341 70 340 68 307Z','M126 280L114 283 113 313 121 341 130 340 132 307Z']
  };
  const back={
    shoulders:['M72 78Q56 81 53 96L51 115 67 111 77 87Z','M128 78Q144 81 147 96L149 115 133 111 123 87Z'],
    back:['M81 74L97 83 97 131 82 157 72 130 68 114Z','M119 74L103 83 103 131 118 157 128 130 132 114Z','M84 152L97 141 97 179 82 181Z','M116 152L103 141 103 179 118 181Z'],
    triceps:['M51 120L66 116 62 150 48 159 44 148Z','M149 120L134 116 138 150 152 159 156 148Z'],
    glutes:['M81 185Q91 178 98 186L98 211 75 216 70 204Z','M119 185Q109 178 102 186L102 211 125 216 130 204Z'],
    hamstrings:['M75 222L97 217 94 247 85 271 74 263 69 238Z','M125 222L103 217 106 247 115 271 126 263 131 238Z'],
    calves:['M73 279L87 282 88 307 80 333 70 331 68 307Z','M127 279L113 282 112 307 120 333 130 331 132 307Z']
  };
  function render(side,selected,counts={}){
    const shape='M87 64L87 70 71 77Q56 80 51 96L42 144 42 158 33 190 35 207 42 211 48 199 52 171 62 145 66 119 72 155 78 180 68 214 67 242 71 276 66 312 67 345 64 361 80 362 88 349 88 313 92 277 100 235 108 277 112 313 112 349 120 362 136 361 133 345 134 312 129 276 133 242 132 214 122 180 128 155 134 119 138 145 148 171 152 199 158 211 165 207 167 190 158 158 158 144 149 96Q144 80 129 77L113 70 113 64Z';
    const paths=side==='back'?back:front;
    return `<svg class="anatomy-svg" viewBox="0 0 200 390" role="img" aria-label="Mapa corporal ${side==='back'?'posterior':'frontal'}. Selecciona un grupo en la lista de abajo."><defs><linearGradient id="body-fill-${side}" x1="0" x2="1"><stop stop-color="#1e3351"/><stop offset=".5" stop-color="#2d4769"/><stop offset="1" stop-color="#1e3351"/></linearGradient></defs><path d="${shape}" class="body-outline"/><path d="M82 42Q82 19 100 18Q118 19 118 42L115 58 106 68 94 68 85 58Z" class="body-outline"/><path d="M100 78V177M76 275L87 278M113 278L124 275" fill="none" stroke="#7892b9" stroke-opacity=".22"/>${Object.entries(paths).map(([key,p])=>`<g class="muscle-region ${selected===key?'selected':''} ${counts[key]?'has-data':''}" data-action="tutor-muscle" data-muscle="${key}" aria-hidden="true">${p.map(d=>`<path d="${d}"/>`).join('')}</g>`).join('')}<path d="M80 368H120M100 9V3" stroke="#617a9b" stroke-width="1"/><circle cx="100" cy="375" r="2" fill="#759aca"/></svg>`;
  }
  return {render};
})();
