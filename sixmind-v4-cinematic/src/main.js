const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t*t*(3-2*t);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// -----------------------------------------------------------------------------
// V4.4 — Conversa interativa + ações operacionais
// -----------------------------------------------------------------------------
const scenarios={
  b2b:{
    messages:[
      ['user','Olá, vi vocês no Instagram e queria entender melhor como funciona.'],
      ['ai','Claro. Posso começar entendendo qual é a sua empresa e qual processo hoje mais toma tempo da sua equipe?'],
      ['user','Somos uma empresa de serviços. Perdemos muitos leads porque o retorno demora.'],
      ['ai','Entendi. Esse é um gargalo de atendimento e qualificação. Posso organizar o fluxo para responder, classificar o lead e encaminhar o próximo passo automaticamente.']
    ],
    logic:[['INTENÇÃO','Nova oportunidade comercial'],['ORIGEM','Instagram'],['GARGALO','Tempo de resposta'],['AÇÃO','Qualificar e registrar lead'],['PRÓXIMO PASSO','Encaminhar para comercial']]
  },
  saude:{
    messages:[
      ['user','Vocês têm horário amanhã depois das 17h?'],
      ['ai','Tenho sim. Vou verificar os horários disponíveis após as 17h. Você prefere início da noite ou o mais cedo possível?'],
      ['user','O mais cedo possível.'],
      ['ai','Perfeito. Vou priorizar o primeiro horário disponível e deixar o agendamento encaminhado.']
    ],
    logic:[['INTENÇÃO','Agendamento'],['DATA','Amanhã'],['RESTRIÇÃO','Após 17h'],['AÇÃO','Consultar agenda'],['PRÓXIMO PASSO','Confirmar horário']]
  },
  telecom:{
    messages:[
      ['user','Minha internet caiu e eu já reiniciei o modem.'],
      ['ai','Entendi. Como o modem já foi reiniciado, não vou repetir esse passo. As luzes de internet e fibra estão acesas?'],
      ['user','A de internet está apagada.'],
      ['ai','Perfeito, isso ajuda a isolar a causa. Vou registrar o atendimento e seguir com a rota técnica adequada.']
    ],
    logic:[['INTENÇÃO','Suporte técnico'],['PROBLEMA','Sem conexão'],['AÇÃO JÁ FEITA','Reinício do modem'],['CONTEXTO','Luz de internet apagada'],['ROTA','Diagnóstico técnico']]
  },
  imob:{
    messages:[
      ['user','Tenho interesse no imóvel do anúncio. Ainda está disponível?'],
      ['ai','Sim. Posso te ajudar. Você busca para morar ou investir?'],
      ['user','Para morar, de preferência ainda este mês.'],
      ['ai','Ótimo. Vou registrar sua prioridade e organizar as informações para o corretor seguir com você.']
    ],
    logic:[['INTENÇÃO','Interesse em imóvel'],['OBJETIVO','Moradia'],['PRAZO','Ainda este mês'],['AÇÃO','Qualificar interesse'],['PRÓXIMO PASSO','Encaminhar ao corretor']]
  },
  varejo:{
    messages:[
      ['user','Vocês têm esse produto disponível em estoque?'],
      ['ai','Posso verificar. Me envie o nome ou código do produto.'],
      ['user','Modelo X200, preto.'],
      ['ai','Perfeito. Vou consultar a disponibilidade e organizar a resposta com a melhor opção de compra.']
    ],
    logic:[['INTENÇÃO','Consulta de estoque'],['PRODUTO','X200'],['VARIANTE','Preto'],['AÇÃO','Consultar disponibilidade'],['PRÓXIMO PASSO','Responder opção de compra']]
  }
};
const chat=document.querySelector('#chat');
const logicFeed=document.querySelector('#logicFeed');
const scenarioButtons=[...document.querySelectorAll('.scenario-tabs button')];
let scenarioToken=0;
let activeScenario='b2b';

function addBubble(type,text){
  const el=document.createElement('div');
  el.className=`bubble ${type}`;
  el.textContent=text;
  chat.appendChild(el);
  requestAnimationFrame(()=>chat.scrollTop=chat.scrollHeight);
  return el;
}
function addTyping(){
  const el=document.createElement('div');
  el.className='bubble typing';
  el.innerHTML='<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  chat.appendChild(el);
  requestAnimationFrame(()=>chat.scrollTop=chat.scrollHeight);
  return el;
}
function buildLogic(items){
  logicFeed.innerHTML='';
  items.forEach(([k,v])=>{
    const el=document.createElement('div');
    el.className='logic-item';
    el.innerHTML=`<span>${k}</span><strong>${v}</strong>`;
    logicFeed.appendChild(el);
  });
}

const bursts=[];
function queueBurst(fromEl,toEl,color='gold'){
  if(!fromEl||!toEl)return;
  const a=fromEl.getBoundingClientRect(),b=toEl.getBoundingClientRect();
  bursts.push({
    start:performance.now(),duration:850,
    x0:a.left+a.width*.5,y0:a.top+a.height*.48,
    x1:b.left+b.width*.5,y1:b.top+b.height*.5,
    color
  });
}
async function playScenario(key){
  activeScenario=key;
  const token=++scenarioToken;
  chat.innerHTML='';
  scenarioButtons.forEach(b=>b.classList.toggle('active',b.dataset.scenario===key));
  const data=scenarios[key];
  buildLogic(data.logic);
  let logicIndex=0;

  for(let i=0;i<data.messages.length;i++){
    if(token!==scenarioToken)return;
    const [who,text]=data.messages[i];
    if(who==='ai'){
      const typing=addTyping();
      await sleep(620);
      if(token!==scenarioToken)return;
      typing.remove();
    }
    const bubble=addBubble(who,text);
    await sleep(280);
    if(logicIndex<data.logic.length){
      const logicEl=logicFeed.children[logicIndex];
      logicEl.classList.add('visible');
      queueBurst(bubble,logicEl,who==='ai'?'gold':'soft');
      logicIndex++;
    }
    await sleep(700);
  }
  while(logicIndex<data.logic.length){
    if(token!==scenarioToken)return;
    const logicEl=logicFeed.children[logicIndex];
    logicEl.classList.add('visible');
    const last=chat.lastElementChild;
    queueBurst(last,logicEl,'gold');
    logicIndex++;
    await sleep(170);
  }
}
scenarioButtons.forEach(btn=>btn.addEventListener('click',()=>playScenario(btn.dataset.scenario)));
playScenario('b2b');

// -----------------------------------------------------------------------------
// V4.1 — Celular premium + tilt físico
// -----------------------------------------------------------------------------
const demoPhone=document.querySelector('#demoPhone');
if(matchMedia('(pointer:fine)').matches){
  const zone=document.querySelector('.phone-zone');
  zone.addEventListener('pointermove',e=>{
    const r=zone.getBoundingClientRect();
    const nx=(e.clientX-r.left)/r.width-.5;
    const ny=(e.clientY-r.top)/r.height-.5;
    demoPhone.style.transform=`rotateY(${-10+nx*13}deg) rotateX(${4-ny*10}deg) translateY(${ny*4}px)`;
  });
  zone.addEventListener('pointerleave',()=>demoPhone.style.transform='rotateY(-10deg) rotateX(4deg)');
}

// -----------------------------------------------------------------------------
// V4.2 — WebGL real: túnel de dados em profundidade
// -----------------------------------------------------------------------------
const webgl=document.querySelector('#webgl');
let gl,program,pointCount=0,uniformTime,uniformScroll,uniformIntensity,uniformAspect;
let webglReady=false,webglPaused=false;
const lowPower=matchMedia('(max-width:720px)').matches || (navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);

function createShader(gl,type,src){
  const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);
  if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh)||'shader error');
  return sh;
}
function initWebGL(){
  try{
    gl=webgl.getContext('webgl',{alpha:true,antialias:false,powerPreference:'high-performance'});
    if(!gl)return;
    const vs=`
      attribute vec3 aPos;
      attribute float aSeed;
      uniform float uTime;
      uniform float uScroll;
      uniform float uIntensity;
      uniform float uAspect;
      varying float vAlpha;
      varying float vSeed;
      void main(){
        float z=mod(aPos.z + uTime*(0.16+uIntensity*.42) + uScroll*8.0, 10.0)-5.0;
        float spin=uTime*.025 + uScroll*.28;
        float cs=cos(spin),sn=sin(spin);
        vec2 p=vec2(aPos.x*cs-aPos.y*sn,aPos.x*sn+aPos.y*cs);
        float perspective=1.0/(z+6.4);
        p*=perspective*(2.15+uIntensity*.9);
        p.y*=uAspect;
        gl_Position=vec4(p,0.0,1.0);
        gl_PointSize=(1.2+aSeed*2.5)*(0.55+perspective*4.8)*(1.0+uIntensity*.55);
        vAlpha=clamp((perspective-.08)*2.5,0.04,.72)*(0.45+uIntensity*.55);
        vSeed=aSeed;
      }
    `;
    const fs=`
      precision mediump float;
      varying float vAlpha;
      varying float vSeed;
      void main(){
        vec2 uv=gl_PointCoord-.5;
        float d=length(uv);
        float mask=smoothstep(.5,.04,d);
        vec3 gold=mix(vec3(.54,.34,.06),vec3(.98,.83,.42),vSeed);
        gl_FragColor=vec4(gold,mask*vAlpha);
      }
    `;
    program=gl.createProgram();
    gl.attachShader(program,createShader(gl,gl.VERTEX_SHADER,vs));
    gl.attachShader(program,createShader(gl,gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'program error');
    gl.useProgram(program);

    pointCount=lowPower?650:1500;
    const positions=new Float32Array(pointCount*3),seeds=new Float32Array(pointCount);
    for(let i=0;i<pointCount;i++){
      const r=1.0+Math.pow(Math.random(),.62)*5.6;
      const a=Math.random()*Math.PI*2;
      positions[i*3]=Math.cos(a)*r;
      positions[i*3+1]=Math.sin(a)*r*.62;
      positions[i*3+2]=Math.random()*10-5;
      seeds[i]=Math.random();
    }
    const posBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,posBuf);gl.bufferData(gl.ARRAY_BUFFER,positions,gl.STATIC_DRAW);
    const aPos=gl.getAttribLocation(program,'aPos');gl.enableVertexAttribArray(aPos);gl.vertexAttribPointer(aPos,3,gl.FLOAT,false,0,0);
    const seedBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,seedBuf);gl.bufferData(gl.ARRAY_BUFFER,seeds,gl.STATIC_DRAW);
    const aSeed=gl.getAttribLocation(program,'aSeed');gl.enableVertexAttribArray(aSeed);gl.vertexAttribPointer(aSeed,1,gl.FLOAT,false,0,0);
    uniformTime=gl.getUniformLocation(program,'uTime');uniformScroll=gl.getUniformLocation(program,'uScroll');uniformIntensity=gl.getUniformLocation(program,'uIntensity');uniformAspect=gl.getUniformLocation(program,'uAspect');
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
    webglReady=true;resizeCanvases();
  }catch(err){console.warn('WebGL fallback:',err);webgl.style.display='none'}
}

// -----------------------------------------------------------------------------
// V4.3 — Canvas 2D: dados viajando entre módulos
// -----------------------------------------------------------------------------
const flowCanvas=document.querySelector('#dataFlow');
const fctx=flowCanvas.getContext('2d');
let cw=innerWidth,ch=innerHeight,dpr=1;
let journeyProgress=0,sceneIndex=0,sceneLocal=0;
function resizeCanvases(){
  dpr=Math.min(devicePixelRatio||1,lowPower?1.2:1.5);
  cw=innerWidth;ch=innerHeight;
  flowCanvas.width=cw*dpr;flowCanvas.height=ch*dpr;flowCanvas.style.width=cw+'px';flowCanvas.style.height=ch+'px';fctx.setTransform(dpr,0,0,dpr,0,0);
  if(webglReady){webgl.width=cw*dpr;webgl.height=ch*dpr;webgl.style.width=cw+'px';webgl.style.height=ch+'px';gl.viewport(0,0,webgl.width,webgl.height);gl.uniform1f(uniformAspect,cw/ch)}
}
function qBezier(a,b,c,t){const u=1-t;return {x:u*u*a.x+2*u*t*b.x+t*t*c.x,y:u*u*a.y+2*u*t*b.y+t*t*c.y}}
function drawGlowDot(x,y,r=3,alpha=1){
  const g=fctx.createRadialGradient(x,y,0,x,y,r*4);g.addColorStop(0,`rgba(246,213,113,${.8*alpha})`);g.addColorStop(.2,`rgba(215,164,43,${.72*alpha})`);g.addColorStop(1,'rgba(215,164,43,0)');fctx.fillStyle=g;fctx.beginPath();fctx.arc(x,y,r*4,0,Math.PI*2);fctx.fill();fctx.fillStyle=`rgba(249,225,153,${alpha})`;fctx.beginPath();fctx.arc(x,y,r,0,Math.PI*2);fctx.fill();
}
function drawBursts(now){
  for(let i=bursts.length-1;i>=0;i--){
    const b=bursts[i],t=(now-b.start)/b.duration;
    if(t>=1){bursts.splice(i,1);continue}
    const a={x:b.x0,y:b.y0},c={x:b.x1,y:b.y1},mid={x:(a.x+c.x)/2,y:Math.min(a.y,c.y)-80};
    fctx.strokeStyle=`rgba(215,164,43,${.16*(1-t)})`;fctx.lineWidth=1;fctx.beginPath();fctx.moveTo(a.x,a.y);fctx.quadraticCurveTo(mid.x,mid.y,c.x,c.y);fctx.stroke();
    const p=qBezier(a,mid,c,ease(t));drawGlowDot(p.x,p.y,2.6,1-t*.25);
  }
}
function drawJourneyPackets(now){
  if(journeyProgress<.27)return;
  const nodes=[...document.querySelectorAll('.flow-nodes span')].filter(el=>el.offsetParent!==null);
  if(nodes.length<2)return;
  const centers=nodes.map(n=>{const r=n.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}});
  fctx.strokeStyle='rgba(215,164,43,.12)';fctx.lineWidth=1;
  fctx.beginPath();centers.forEach((p,i)=>i?fctx.lineTo(p.x,p.y):fctx.moveTo(p.x,p.y));fctx.stroke();
  const overall=clamp((journeyProgress-.27)/.73);
  const seg=Math.min(centers.length-2,Math.floor(overall*(centers.length-1)));
  const local=(overall*(centers.length-1))-seg;
  for(let k=0;k<3;k++){
    const t=(local+k*.27)%1;
    const a=centers[seg],c=centers[Math.min(seg+1,centers.length-1)],m={x:(a.x+c.x)/2,y:a.y-22};
    const p=qBezier(a,m,c,t);drawGlowDot(p.x,p.y,2.2,.88);
  }
  // pacote saindo da tela ativa em direção ao trilho
  const stage=document.querySelector('.platform-stage');
  const sr=stage.getBoundingClientRect();
  const target=centers[Math.min(sceneIndex,centers.length-1)];
  if(sr.width>0){
    const a={x:sr.left+sr.width*.72,y:sr.top+sr.height*.48},m={x:(a.x+target.x)/2,y:a.y-55};
    fctx.strokeStyle='rgba(215,164,43,.075)';fctx.beginPath();fctx.moveTo(a.x,a.y);fctx.quadraticCurveTo(m.x,m.y,target.x,target.y);fctx.stroke();
    const t=(now*.00045)%1;const p=qBezier(a,m,target,t);drawGlowDot(p.x,p.y,2.4,.8);
  }
}

// -----------------------------------------------------------------------------
// V4.1/4.2/4.3/4.4 — Timeline cinematográfica controlada pelo scroll
// -----------------------------------------------------------------------------
const journey=document.querySelector('#journey');
const journeyStage=document.querySelector('#journeyStage');
const journeyCopy=document.querySelector('#journeyCopy');
const portalPhone=document.querySelector('#portalPhone');
const tunnel=document.querySelector('#screenTunnel');
const platformStage=document.querySelector('#platformStage');
const scenes=[...document.querySelectorAll('.platform-scene')];
const navButtons=[...document.querySelectorAll('.journey-nav button')];
const flowNodes=[...document.querySelectorAll('.flow-nodes span')];
const flowNodesWrap=document.querySelector('#flowNodes');
const progressEl=document.querySelector('#journeyProgress');
const sceneStatus=document.querySelector('#sceneStatus');
const topNav=document.querySelector('#nav');
const sceneNames=['Conversa → atendimento centralizado','Pipeline → lead e etapa atualizados','Agenda → compromisso criado por IA','Canais → contexto unificado','Integrações → ação externa conectada'];
const transforms=[
  t=>`scale(${1.025+t*.075}) translate(${lerp(0,-2.1,t)}%,${lerp(0,-1.2,t)}%)`,
  t=>`scale(${1.03+t*.09}) translate(${lerp(0,-1.7,t)}%,${lerp(0,-1.9,t)}%)`,
  t=>`scale(${1.02+t*.08}) translate(${lerp(0,-1.2,t)}%,${lerp(0,-2.1,t)}%)`,
  t=>`scale(${1.025+t*.065}) translate(${lerp(0,-1.0,t)}%,${lerp(0,-1.4,t)}%)`,
  t=>`scale(${1+t*.025}) translateY(${lerp(0,-.7,t)}%)`
];
let ticking=false;
function updateScroll(){
  ticking=false;
  const rect=journey.getBoundingClientRect();
  const total=Math.max(1,journey.offsetHeight-innerHeight);
  const p=clamp(-rect.top/total);
  journeyProgress=p;document.documentElement.style.setProperty('--journey-progress',p.toFixed(4));

  const inJourney=rect.top<innerHeight*.2 && rect.bottom>innerHeight*.6;
  topNav.classList.toggle('hidden',inJourney&&p>.08&&p<.95);

  // V4.1 Entrada cinematográfica
  const zoomStart=.035,zoomEnd=.205,portalEnd=.285;
  if(p<portalEnd){
    portalPhone.style.display='block';
    const z=clamp((p-zoomStart)/(zoomEnd-zoomStart));
    const e=ease(z);
    const scale=lerp(.72,4.05,e);
    const y=lerp(57,50,e);
    const rotate=lerp(-1.5,0,e);
    portalPhone.style.opacity=String(p<zoomEnd?1:1-clamp((p-zoomEnd)/(portalEnd-zoomEnd)));
    portalPhone.style.transform=`translate(-50%,-${y}%) scale(${scale}) rotateY(${rotate}deg)`;
    portalPhone.style.filter=`drop-shadow(0 45px 90px rgba(0,0,0,.55)) blur(${lerp(0,.5,e)}px)`;
    tunnel.style.opacity=String(clamp((p-.145)/.09)*(1-clamp((p-.255)/.04)));
    journeyStage.classList.add('portal-active');
    journeyStage.style.setProperty('--portal-darken',String(clamp((p-.08)/.16)*.72));
  }else{
    portalPhone.style.display='none';tunnel.style.opacity='0';journeyStage.classList.remove('portal-active');
  }

  // V4.2 saída do portal para plataforma
  const platformIn=clamp((p-.205)/.105);
  platformStage.style.opacity=String(ease(platformIn));
  platformStage.style.transform=`scale(${lerp(.48,1,ease(platformIn))}) translateZ(${lerp(-320,0,ease(platformIn))}px)`;
  platformStage.style.filter=`blur(${lerp(2.2,0,ease(platformIn))}px)`;
  journeyCopy.style.opacity=String(1-clamp((p-.075)/.13));
  journeyCopy.style.transform=`translateY(${lerp(0,-20,clamp((p-.075)/.13))}px)`;

  // V4.4 cenas em sequência
  if(p>=.275){
    const s=clamp((p-.275)/.725);
    const scaled=s*scenes.length;
    sceneIndex=Math.min(scenes.length-1,Math.floor(scaled));
    sceneLocal=clamp(scaled-sceneIndex);
  }else{sceneIndex=0;sceneLocal=0}
  scenes.forEach((scene,i)=>{
    scene.classList.toggle('active',i===sceneIndex);
    const wrap=scene.querySelector('.screen-wrap');if(wrap)wrap.style.transform=i===sceneIndex?transforms[i](ease(sceneLocal)):'scale(1.02)';
  });
  navButtons.forEach((b,i)=>b.classList.toggle('active',i===sceneIndex));
  flowNodes.forEach((n,i)=>n.classList.toggle('active',i===sceneIndex));
  flowNodesWrap.style.opacity=String(clamp((p-.29)/.08));
  sceneStatus.textContent=sceneNames[sceneIndex];
  progressEl.style.height=`${p*100}%`;
}
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(updateScroll)}}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',()=>{resizeCanvases();updateScroll()},{passive:true});
updateScroll();

navButtons.forEach((btn,i)=>btn.addEventListener('click',()=>{
  const start=scrollY+journey.getBoundingClientRect().top;
  const total=journey.offsetHeight-innerHeight;
  const targetP=.29+(i+.12)/5*.69;
  scrollTo({top:start+total*targetP,behavior:'smooth'});
}));

// Hero motion
let heroAngle=0;
function animateHero(t){
  const o1=document.querySelector('.orbit-1'),o2=document.querySelector('.orbit-2'),o3=document.querySelector('.orbit-3');
  heroAngle=t*.0007;
  if(o1)o1.style.transform=`rotateX(68deg) rotateZ(${8+heroAngle*18}deg)`;
  if(o2)o2.style.transform=`rotateY(68deg) rotateZ(${-22-heroAngle*14}deg)`;
  if(o3)o3.style.transform=`rotateX(22deg) rotateY(58deg) rotateZ(${heroAngle*24}deg)`;
}

// -----------------------------------------------------------------------------
// V4.5 — render loop unificado + performance
// -----------------------------------------------------------------------------
initWebGL();resizeCanvases();
document.addEventListener('visibilitychange',()=>webglPaused=document.hidden);
let last=performance.now();
function frame(now){
  const dt=Math.min(40,now-last);last=now;
  animateHero(now);
  fctx.clearRect(0,0,cw,ch);drawBursts(now);drawJourneyPackets(now);
  if(webglReady&&!webglPaused){
    const journeyBoost=journeyProgress>0&&journeyProgress<1?1:0;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(uniformTime,now*.001);
    gl.uniform1f(uniformScroll,journeyProgress);
    gl.uniform1f(uniformIntensity,journeyBoost?clamp((journeyProgress-.04)/.25)*.85+.15:.12);
    gl.drawArrays(gl.POINTS,0,pointCount);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// reduced motion: keep content usable, remove aggressive portal zoom
if(matchMedia('(prefers-reduced-motion: reduce)').matches){
  portalPhone.style.display='none';platformStage.style.opacity='1';platformStage.style.transform='none';
}
