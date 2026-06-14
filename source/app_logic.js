// ============ CONFIG ============
const THEMES=[
  {id:'baseball',e:'⚾',n:'野球・スポーツ'},
  {id:'nature',e:'🦖',n:'生き物・宇宙'},
  {id:'mecha',e:'🚀',n:'のりもの・メカ'},
  {id:'history',e:'⚔️',n:'歴史・冒険'},
];
function themeOf(id){return THEMES.find(t=>t.id===id)||THEMES[0];}
const QUESTS=[
  {id:'duo', icon:'🦉',name:'Duolingo',     desc:'デイリークエストをクリア', type:'check'},
  {id:'calc',icon:'🔢',name:'計算',         desc:'小4の問題に5問チャレンジ', type:'activity'},
  {id:'read',icon:'📖',name:'音読',         desc:'お話を声に出して読もう',   type:'activity'},
  {id:'write',icon:'✍️',name:'作文',        desc:'穴うめで意見文を完成',     type:'activity'},
  {id:'sci', icon:'🔬',name:'理科社会のタネ',desc:'今日のなぜ？を考える',     type:'activity'},
];
const AOZORA=[
  {title:'ごん狐',author:'新美南吉',mins:'15分',e:'🦊',url:'https://www.aozora.gr.jp/cards/000121/files/628_14895.html'},
  {title:'手袋を買いに',author:'新美南吉',mins:'10分',e:'🧤',url:'https://www.aozora.gr.jp/cards/000121/files/637_13341.html'},
  {title:'注文の多い料理店',author:'宮沢賢治',mins:'15分',e:'🍴',url:'https://www.aozora.gr.jp/cards/000081/card43754.html'},
  {title:'宮沢賢治「10分で読める」一覧',author:'ブンゴウサーチ',mins:'一覧',e:'📚',url:'https://search.bungo.app/authors/81/categories/shortshort/books'},
  {title:'青空文庫トップ（名作さがし）',author:'いろんな作家',mins:'',e:'🔎',url:'https://www.aozora.gr.jp/'},
];
const PRAISES=['すごい！さいごまで自分の言葉で書けたね！⚾','よく考えて書けたね！えらいよ！🌟','いいね！自分の考えがしっかり伝わってきたよ！👏','がんばって書けたね！その調子！🔥','自分の力で書ききったね！かっこいい！💪'];
function praise(){return PRAISES[Math.floor(Math.random()*PRAISES.length)];}

// ===== カード =====
const RARITY={
  N:{name:'ノーマル',cls:'N',color:'#5f6f85',glow:'rgba(125,141,163,.35)',bg1:'#eef1f5',bg2:'#e4e9f0',stars:1,p:0.50},
  R:{name:'レア',cls:'R',color:'#1f86b8',glow:'rgba(42,159,214,.4)',bg1:'#e3f3fb',bg2:'#d2ebf7',stars:2,p:0.28},
  SR:{name:'スーパーレア',cls:'SR',color:'#7044d4',glow:'rgba(130,89,230,.45)',bg1:'#efe9fc',bg2:'#e3d8f9',stars:3,p:0.14},
  SS:{name:'SSレア',color:'#b8800a',cls:'SS',glow:'rgba(212,154,16,.5)',bg1:'#fdf2d4',bg2:'#fbe9b8',stars:4,p:0.06},
  LEGEND:{name:'レジェンド',cls:'LG',color:'#cf463b',glow:'rgba(224,85,74,.55)',bg1:'#fde7e4',bg2:'#fbd6d1',stars:5,p:0.02},
};
const CARDS=[
  {id:'n1',name:'ルーキー内野手',pos:'内野手',e:'🧢',r:'N'},
  {id:'n2',name:'練習生ピッチャー',pos:'投手',e:'⚾',r:'N'},
  {id:'n3',name:'応援団長',pos:'ベンチ',e:'📣',r:'N'},
  {id:'n4',name:'バットボーイ',pos:'サポート',e:'🧹',r:'N'},
  {id:'n5',name:'一年生キャッチャー',pos:'捕手',e:'🥎',r:'N'},
  {id:'n6',name:'俊足の代走',pos:'外野手',e:'👟',r:'N'},
  {id:'r1',name:'努力の二塁手',pos:'内野手',e:'💪',r:'R'},
  {id:'r2',name:'ムードメーカー',pos:'外野手',e:'😆',r:'R'},
  {id:'r3',name:'堅守のショート',pos:'内野手',e:'🧤',r:'R'},
  {id:'r4',name:'制球派ピッチャー',pos:'投手',e:'🎯',r:'R'},
  {id:'r5',name:'代打の切り札',pos:'内野手',e:'🔥',r:'R'},
  {id:'r6',name:'守備の名手',pos:'外野手',e:'✨',r:'R'},
  {id:'sr1',name:'四番バッター',pos:'内野手',e:'💥',r:'SR'},
  {id:'sr2',name:'エースピッチャー',pos:'投手',e:'🌟',r:'SR'},
  {id:'sr3',name:'盗塁王',pos:'外野手',e:'⚡',r:'SR'},
  {id:'sr4',name:'鉄壁の正捕手',pos:'捕手',e:'🛡️',r:'SR'},
  {id:'sr5',name:'天才遊撃手',pos:'内野手',e:'🎯',r:'SR'},
  {id:'ss1',name:'二刀流のスター',pos:'投手/打者',e:'⚔️',r:'SS'},
  {id:'ss2',name:'三冠王スラッガー',pos:'内野手',e:'👑',r:'SS'},
  {id:'ss3',name:'剛速球エース',pos:'投手',e:'🚀',r:'SS'},
  {id:'ss4',name:'守護神クローザー',pos:'投手',e:'🔒',r:'SS'},
  {id:'lg1',name:'伝説の大打者',pos:'内野手',e:'🏆',r:'LEGEND'},
  {id:'lg2',name:'不滅の鉄腕',pos:'投手',e:'💫',r:'LEGEND'},
  {id:'lg3',name:'世界をわかせた男',pos:'二刀流',e:'🌏',r:'LEGEND'},
];
const RARITY_ORDER=['LEGEND','SS','SR','R','N'];
const MONEY_DIST=[[10,.18],[20,.18],[30,.18],[50,.21],[80,.13],[100,.09],[200,.03]];
const MONEY_FACES=[10,20,30,50,80,100,200];

const WD=['日','月','火','水','木','金','土'];
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};

// ===== ストレージ（localStorage＋メモリ予備）=====
const store={mem:{},
  get(k){try{const v=localStorage.getItem(k);return v===null?(k in this.mem?this.mem[k]:null):v;}catch(e){return k in this.mem?this.mem[k]:null;}},
  set(k,v){try{localStorage.setItem(k,v);}catch(e){this.mem[k]=v;}},
  del(k){try{localStorage.removeItem(k);}catch(e){delete this.mem[k];}}
};

let state={today:todayKey(),checks:{},history:{},calcTier:1,calcStats:{correct:0,wrong:0},sakubunDone:0,log:[],
  money:0,cards:{},gachaLog:{},seen:{read:[],write:[],sci:[]}};

function load(){
  const r=store.get('kudan-state-v5');
  if(r){try{const s=JSON.parse(r);
    state.history=s.history||{};state.calcTier=s.calcTier||1;
    state.calcStats=s.calcStats||{correct:0,wrong:0};state.sakubunDone=s.sakubunDone||0;state.log=s.log||[];
    state.money=s.money||0;state.cards=s.cards||{};state.gachaLog=s.gachaLog||{};
    state.seen=s.seen||{read:[],write:[],sci:[]};
    if(!state.seen.read)state.seen.read=[];if(!state.seen.write)state.seen.write=[];if(!state.seen.sci)state.seen.sci=[];
    if(s.today===todayKey()){state.today=s.today;state.checks=s.checks||{};}
    else{state.today=todayKey();state.checks={};}
  }catch(e){}}
}
function save(){
  const done=Object.values(state.checks).filter(Boolean).length;
  state.history[state.today]={count:done,quests:{...state.checks}};
  store.set('kudan-state-v5',JSON.stringify(state));
}
function addLog(tag,question,answer,extra){
  state.log.unshift({date:state.today,ts:Date.now(),tag,question,answer,reply:extra});
  if(state.log.length>200)state.log=state.log.slice(0,200);
  save();
}
function rubyize(t){return (t||'').replace(/([一-龠々〆ヶ]+)《([ぁ-んァ-ヴ]+)》/g,'<ruby>$1<rt>$2</rt></ruby>');}

// ===== コンテンツ・プール（テーマ横断＋くり返し防止）=====
const POOLS={read:[],write:[],sci:[]};
function buildPools(){
  ['baseball','nature','mecha','history'].forEach(tid=>{
    (READINGS[tid]||[]).forEach(x=>POOLS.read.push(Object.assign({theme:tid},x)));
    (WRITINGS[tid]||[]).forEach(x=>POOLS.write.push(Object.assign({theme:tid},x)));
    (SCIENCE[tid]||[]).forEach(x=>POOLS.sci.push(Object.assign({theme:tid},x)));
  });
}
function pickFromPool(cat){
  const pool=POOLS[cat];let seen=state.seen[cat]||[];
  if(seen.length>=pool.length)seen=[];
  const avail=[];for(let i=0;i<pool.length;i++)if(seen.indexOf(i)<0)avail.push(i);
  const idx=avail[Math.floor(Math.random()*avail.length)];
  seen.push(idx);state.seen[cat]=seen;save();
  return pool[idx];
}

// ============ RENDER TODAY ============
function renderQuests(){
  const list=document.getElementById('questList');list.innerHTML='';
  QUESTS.forEach(q=>{
    const done=!!state.checks[q.id];
    const el=document.createElement('div');
    el.className='quest'+(done?' done':'');
    const right = q.type==='activity' && !done
      ? `<div class="qgo">やる ▶</div>`
      : `<div class="check"><svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
    el.innerHTML=`<div class="qicon">${q.icon}</div><div class="qbody"><div class="qname">${q.name}</div><div class="qdesc">${q.desc}</div></div>${right}`;
    el.addEventListener('click',()=>{
      if(q.type==='check'){toggle(q.id);}
      else if(done){toggle(q.id);}
      else{openActivity(q.id);}
    });
    list.appendChild(el);
  });
}
function renderTop(){
  const done=Object.values(state.checks).filter(Boolean).length;
  document.getElementById('doneNum').textContent=done;
  document.getElementById('barFill').style.width=(done/5*100)+'%';
  document.getElementById('streakNum').textContent=calcStreak();
  document.getElementById('coinTotal').textContent=state.money;
  const d=new Date();document.getElementById('dateLabel').textContent=`${d.getMonth()+1}月${d.getDate()}日(${WD[d.getDay()]})`;
  const gb=document.getElementById('gachaBar');
  const gachaedToday=!!state.gachaLog[state.today];
  if(done===5){
    if(gachaedToday){gb.className='gachabar done';const g=state.gachaLog[state.today];
      document.getElementById('gachaT').innerHTML='🎉 今日のガチャ完了！';
      document.getElementById('gachaS').innerHTML=`「${g.cardName}」を仲間にして <b>${g.money}円</b> ゲット！ また明日！`;
    }else{gb.className='gachabar on';
      document.getElementById('gachaT').innerHTML='🎰 ガチャを回そう！ ▶';
      document.getElementById('gachaS').textContent='5つクリア達成！ タップでカードガチャ＋お金ルーレット！';}
  }else{gb.className='gachabar';
    document.getElementById('gachaT').innerHTML=`⚾ あと ${5-done} つでガチャ！`;
    document.getElementById('gachaS').textContent='5つぜんぶクリアすると、選手カードガチャ＋お金ルーレットが回せる！';}
}
let wasComplete=false;
function toggle(id){state.checks[id]=!state.checks[id];renderQuests();renderTop();save();checkComplete();}
function completeQuest(id){if(!state.checks[id]){state.checks[id]=true;renderQuests();renderTop();save();checkComplete(true);}}
function checkComplete(delay){
  const done=Object.values(state.checks).filter(Boolean).length;
  if(done===5&&!wasComplete){wasComplete=true;if(!state.gachaLog[state.today]){setTimeout(openGacha,delay?450:150);}}
  if(done<5)wasComplete=false;
}
function calcStreak(){
  let streak=0;const d=new Date();
  for(let i=0;i<400;i++){
    const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const h=state.history[k];
    const full=k===state.today?(Object.values(state.checks).filter(Boolean).length===5):(h&&h.count===5);
    if(full)streak++;else if(k===state.today){}else break;
    d.setDate(d.getDate()-1);
  }return streak;
}
function bestStreak(){
  const allFull={};Object.keys(state.history).forEach(k=>{if(state.history[k].count===5)allFull[k]=true;});
  if(Object.values(state.checks).filter(Boolean).length===5)allFull[state.today]=true;
  const sorted=Object.keys(allFull).sort();let best=0,cur=0,prev=null;
  for(const k of sorted){
    if(prev){const pd=new Date(prev);pd.setDate(pd.getDate()+1);
      const nk=`${pd.getFullYear()}-${String(pd.getMonth()+1).padStart(2,'0')}-${String(pd.getDate()).padStart(2,'0')}`;
      cur=nk===k?cur+1:1;}else cur=1;
    best=Math.max(best,cur);prev=k;
  }return best;
}

// ============ GACHA ============
function drawCard(){
  const r=Math.random();let acc=0,rarity='N';
  for(const key of RARITY_ORDER.slice().reverse()){acc+=RARITY[key].p;if(r<acc){rarity=key;break;}}
  const pool=CARDS.filter(c=>c.r===rarity);
  return pool[Math.floor(Math.random()*pool.length)];
}
function rollMoney(){const r=Math.random();let a=0;for(const [v,p] of MONEY_DIST){a+=p;if(r<a)return v;}return 200;}
let gachaPending=null;
function openGacha(){
  const card=drawCard(),money=rollMoney(),isNew=!state.cards[card.id];
  gachaPending={card,money,isNew};
  document.getElementById('gacha').classList.add('show');renderGachaPack();
}
function renderGachaPack(){
  document.getElementById('gachaInner').innerHTML=`
    <div class="gacha-step">
      <div class="gacha-h">⚾ 試合に勝った！</div>
      <div class="gacha-sub">パックをタップして、今日の選手をGET！</div>
      <div class="pack" id="packEl"><div class="pball">⚾</div><div class="ptap">タップ！</div></div>
    </div>`;
  document.getElementById('packEl').addEventListener('click',revealCard,{once:true});
}
function revealCard(){
  const {card,isNew}=gachaPending;const R=RARITY[card.r];
  beep(440,.1,'triangle');setTimeout(()=>beep(660,.1,'triangle'),80);setTimeout(()=>beep(880,.15,'triangle'),160);
  if(card.r==='SS'||card.r==='LEGEND'){[523,659,784,1047,1319].forEach((f,i)=>setTimeout(()=>beep(f,.18,'square',.12),i*90));}
  document.getElementById('gachaInner').innerHTML=`
    <div class="gacha-step">
      <div class="gacha-h" style="color:${R.color}">${R.name}！</div>
      <div class="gacha-sub">${isNew?'🆕 あたらしい選手だ！':'チームのなかまが強くなった！'}</div>
      <div class="reveal-card" style="--cardglow:${R.glow};--cardcolor:${R.color};--cardbg1:${R.bg1};--cardbg2:${R.bg2};border-color:${R.color}">
        ${isNew?'<div class="rc-new">NEW</div>':''}
        <div class="rc-rar">${R.name}</div>
        <div class="rc-stars" style="color:${R.color}">${'★'.repeat(R.stars)}</div>
        <div class="rc-e">${card.e}</div>
        <div class="rc-n">${card.name}</div>
        <div class="rc-p">${card.pos}</div>
      </div>
      <button class="gacha-btn" id="toRoulette">つぎは お金ルーレット ▶</button>
    </div>`;
  const rect=document.querySelector('.reveal-card').getBoundingClientRect();
  const colors=card.r==='LEGEND'?['#e0554a','#f5a623','#dd5049','#e07b2b']:card.r==='SS'?['#e0a012','#f5a623','#d4860a']:card.r==='SR'?['#8259e6','#7044d4','#a47ae6']:[R.color,'#7c8a9e'];
  sparks(rect.left+rect.width/2,rect.top+rect.height/2,card.r==='LEGEND'?44:card.r==='SS'?32:card.r==='SR'?22:14,colors);
  document.getElementById('toRoulette').addEventListener('click',startRoulette,{once:true});
}
function startRoulette(){
  const {money}=gachaPending;
  document.getElementById('gachaInner').innerHTML=`
    <div class="gacha-step">
      <div class="gacha-h">🎰 お金ルーレット</div>
      <div class="gacha-sub">いくら当たるかな…？</div>
      <div class="roulette"><div class="needle"></div><div class="roul-strip" id="roulStrip"></div></div>
      <div id="roulResult"></div>
    </div>`;
  const strip=document.getElementById('roulStrip');
  const ITEM=48,loops=6,seq=[];
  for(let i=0;i<loops;i++)MONEY_FACES.forEach(v=>seq.push(v));
  const targetIdx=seq.length;seq.push(money);MONEY_FACES.forEach(v=>seq.push(v));
  strip.innerHTML=seq.map(v=>`<div class="roul-item ${v>=100?'big':''}">${v}円</div>`).join('');
  const center=120/2-ITEM/2;const finalY=-(targetIdx*ITEM)+center;
  strip.style.transform=`translateY(${center}px)`;
  const tickInt=setInterval(()=>{beep(900,.03,'square',.04);},90);
  requestAnimationFrame(()=>{strip.style.transition='transform 3.1s cubic-bezier(.12,.7,.18,1)';strip.style.transform=`translateY(${finalY}px)`;});
  setTimeout(()=>{clearInterval(tickInt);finishGacha();},3250);
}
function finishGacha(){
  const {card,money}=gachaPending;
  state.money+=money;state.cards[card.id]=(state.cards[card.id]||0)+1;
  state.gachaLog[state.today]={cardId:card.id,cardName:card.name,rarity:card.r,money,ts:Date.now()};
  save();
  beep(523,.15,'square');setTimeout(()=>beep(784,.15,'square'),130);setTimeout(()=>beep(1047,.25,'square'),260);
  const big=money>=100;
  document.getElementById('roulResult').innerHTML=`
    <div class="gacha-result">${money}円！${big?' 🎉':''}</div>
    <div class="gacha-total">今日の貯金 → <b>${state.money}円</b></div>
    <button class="gacha-btn" id="gachaClose">やったー！とじる</button>`;
  sparks(window.innerWidth/2,window.innerHeight/2,big?40:20,big?['#e0a012','#f5a623','#2ea556','#dd5049']:['#f5a623','#2ea556','#dd5049']);
  if(navigator.vibrate)navigator.vibrate(big?[60,40,120,40,120]:[60,40,100]);
  document.getElementById('gachaClose').addEventListener('click',()=>{
    document.getElementById('gacha').classList.remove('show');document.getElementById('gachaInner').innerHTML='';renderTop();
  },{once:true});
}

// ===== 小4 計算プール =====
function ri(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const CALC_TIERS={
  1:{name:'小4 きほん',gens:[
    ()=>{const a=ri(23,89),b=ri(13,89);return{t:'たし算',q:`${a} + ${b}`,ans:a+b};},
    ()=>{const a=ri(35,99),b=ri(16,a-6);return{t:'ひき算',q:`${a} - ${b}`,ans:a-b};},
    ()=>{const a=ri(3,9),b=ri(3,9);return{t:'九九',q:`${a} × ${b}`,ans:a*b};},
    ()=>{const b=ri(2,9),ans=ri(2,9);return{t:'わり算',q:`${b*ans} ÷ ${b}`,ans:ans};},
    ()=>{const a=ri(20,70),b=ri(15,40);return{t:'□をもとめる',q:`□ + ${b} = ${a+b}`,ans:a};},
  ]},
  2:{name:'小4 ひょうじゅん',gens:[
    ()=>{const a=ri(125,899),b=ri(115,899);return{t:'たし算（筆算）',q:`${a} + ${b}`,ans:a+b};},
    ()=>{const a=ri(250,999),b=ri(115,a-40);return{t:'ひき算（筆算）',q:`${a} - ${b}`,ans:a-b};},
    ()=>{const a=ri(13,49),b=ri(3,9);return{t:'かけ算',q:`${a} × ${b}`,ans:a*b};},
    ()=>{const b=ri(3,9),ans=ri(3,12),r=ri(1,b-1);return{t:'わり算（あまり）',q:`${b*ans+r} ÷ ${b} の商は？`,ans:ans,divmod:true};},
    ()=>{const x=ri(6,12),b=ri(4,9);return{t:'□をもとめる',q:`${x} × □ = ${x*b}`,ans:b};},
  ]},
  3:{name:'小4 はってん',gens:[
    ()=>{const a=ri(102,499),b=ri(3,9);return{t:'かけ算（大きい数）',q:`${a} × ${b}`,ans:a*b};},
    ()=>{const a=ri(12,30),b=ri(12,30);return{t:'2けた×2けた',q:`${a} × ${b}`,ans:a*b};},
    ()=>{const ans=ri(12,30),b=ri(3,9);return{t:'わり算',q:`${ans*b} ÷ ${b}`,ans:ans};},
    ()=>{const base=ri(1,9)*20,p=[10,20,25,50][ri(0,3)];return{t:'割合（%）',q:`${base}の${p}%`,ans:base*p/100};},
    ()=>{const sp=ri(3,9)*10,t=ri(2,6);return{t:'速さ',q:`時速${sp}kmで${t}時間すすむと何km？`,ans:sp*t};},
  ]},
};
function tierName(t){return CALC_TIERS[t].name;}
function calcHint(p){
  const t=p.t;
  if(t.indexOf('たし')>=0)return 'ヒント：くらいをそろえて、一のくらいから順に足そう。くり上がりに気をつけて！';
  if(t.indexOf('ひき')>=0)return 'ヒント：一のくらいから引こう。引けないときは、上のくらいから1かりてくるよ！';
  if(t.indexOf('九九')>=0||t.indexOf('かけ')>=0||t.indexOf('×')>=0)return 'ヒント：九九を思い出そう。大きい数は、くらいごとに分けてかけて、あとで合わせよう！';
  if(t.indexOf('わり')>=0)return 'ヒント：「何回かけたら、この数になる?」と考えよう。あまりは、わったあとに残る数だよ。';
  if(t.indexOf('□')>=0)return 'ヒント：反対の計算を使おう。たし算の□はひき算で、かけ算の□はわり算で見つかるよ！';
  if(t.indexOf('割合')>=0)return 'ヒント：10%はもとの数の10分の1。25%は4分の1。まず10%を求めてから考えるとかんたん！';
  if(t.indexOf('速さ')>=0)return 'ヒント：1時間で進む数を、時間の数だけかければOK！（道のり＝速さ×時間）';
  return 'ヒント：あわてず、ていねいに計算してみよう！';
}
let calcSession=null;
function startCalc(){
  const tier=state.calcTier||1;const gens=CALC_TIERS[tier].gens;
  const order=shuffle([0,1,2,3,4]);const problems=[];
  for(let i=0;i<5;i++)problems.push(gens[order[i]]());
  calcSession={tier,problems,idx:0,results:[]};renderCalc();
}
function renderCalc(){
  const s=calcSession,p=s.problems[s.idx];
  const pips=s.problems.map((_,i)=>{let c='';if(i<s.idx)c=s.results[i]?'ok':'ng';return `<div class="pip ${c}"></div>`;}).join('');
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head">
      <div class="x" onclick="closeScreen()">✕</div>
      <div><div class="ht">🔢 計算チャレンジ</div><div class="hs">${s.idx+1}問目 / 5問</div></div>
      <div style="margin-left:auto"><span class="lvl-pill">${tierName(s.tier)}</span></div>
    </div>
    <div class="scr-body">
      <div class="calc-card">
        <div class="calc-type">${p.t}</div>
        <div class="calc-q">${p.q}</div>
        <input class="calc-input" id="calcIn" inputmode="numeric" pattern="[0-9]*" placeholder="？" autocomplete="off">
        ${p.divmod?`<div style="font-size:12px;color:#7c8a9e;margin-top:8px;font-weight:700">わりきれず「あまり」が出るよ。商（=何回われるか）を入れてね</div>`:''}
        <div class="calc-progress">${pips}</div>
        <div class="feedback" id="calcFb"></div>
        <div class="hintbox" id="calcHint"></div>
      </div>
      <button class="btn btn-ghost btn-sm" id="hintBtn" style="margin-top:14px;">🤔 ヒントをみる</button>
    </div>
    <div class="scr-foot"><button class="btn btn-gold" id="calcSubmit">こたえる</button></div>
   </div>`;
  const input=document.getElementById('calcIn');setTimeout(()=>input.focus(),100);
  input.addEventListener('keydown',e=>{if(e.key==='Enter')submitCalc();});
  document.getElementById('calcSubmit').addEventListener('click',submitCalc);
  document.getElementById('hintBtn').addEventListener('click',()=>{
    const box=document.getElementById('calcHint');box.classList.add('show');box.innerHTML=calcHint(p);
    document.getElementById('hintBtn').disabled=true;
  });
}
function submitCalc(){
  const s=calcSession,p=s.problems[s.idx];
  const input=document.getElementById('calcIn');const val=parseInt(input.value,10);
  if(isNaN(val)){input.focus();return;}
  const correct=val===p.ans;s.results[s.idx]=correct;
  const fb=document.getElementById('calcFb');
  if(correct){fb.textContent='⭕ せいかい！ナイスバッティング！';fb.className='feedback good';
    beep(680,.12,'triangle');setTimeout(()=>beep(900,.12,'triangle'),90);
    const r=input.getBoundingClientRect();sparks(r.left+r.width/2,r.top,8,['#2ea556','#f5a623','#dd5049']);}
  else{fb.textContent=`おしい！ こたえは ${p.ans} だよ`;fb.className='feedback bad';beep(200,.2,'sawtooth',.1);}
  document.getElementById('calcSubmit').disabled=true;
  setTimeout(()=>{s.idx++;if(s.idx>=5)finishCalc();else renderCalc();},correct?900:1900);
}
function finishCalc(){
  const s=calcSession;const correct=s.results.filter(Boolean).length;
  state.calcStats.correct+=correct;state.calcStats.wrong+=(5-correct);
  let levelMsg='',newTier=state.calcTier;
  if(correct>=4&&state.calcTier<3){newTier=state.calcTier+1;levelMsg=`🎉 レベルアップ！ つぎは「${tierName(newTier)}」だよ`;}
  else if(correct<=1&&state.calcTier>1){newTier=state.calcTier-1;levelMsg=`むりせず「${tierName(newTier)}」にもどして、とくいになろう！`;}
  else levelMsg='この調子！ つづければどんどん強くなるよ💪';
  state.calcTier=newTier;save();
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head"><div class="x" onclick="closeScreen()">✕</div><div><div class="ht">🔢 計算チャレンジ</div><div class="hs">けっか</div></div></div>
    <div class="scr-body">
      <div class="calc-card">
        <div style="font-size:54px">${correct>=4?'🏆':correct>=2?'👏':'💪'}</div>
        <div class="calc-q" style="font-size:30px;margin-top:6px">${correct} / 5 せいかい</div>
        <div style="margin-top:16px;font-size:14px;color:#7d5e15;font-weight:700;line-height:1.6">${levelMsg}</div>
      </div>
    </div>
    <div class="scr-foot"><button class="btn btn-green" onclick="finishActivity('calc')">クエストクリア！ ⚾</button></div>
   </div>`;
  beep(523,.15,'square');setTimeout(()=>beep(784,.2,'square'),140);
}

// ===== 音読 =====
function renderReading(item){
  const th=themeOf(item.theme);
  const story=rubyize((item.s||'').replace(/\n/g,'<br>'));
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head"><div class="x" onclick="closeScreen()">✕</div>
      <div><div class="ht">📖 音読</div><div class="hs">こえに出して読もう</div></div></div>
    <div class="scr-body">
      <div class="theme-tag">${th.e} ${th.n}</div>
      <div class="ai-card">
        <div class="ai-label">📣 ${item.t}</div>
        <div class="ai-story">${story}</div>
      </div>
      <div class="q-item" style="margin-top:16px">
        <div class="qq">📝 ${item.q}（声でも文字でもOK・答えなくてもクリアできるよ）</div>
        <textarea class="answer-area" id="readAns" placeholder="かんたんでいいよ（任意）"></textarea>
        <button class="btn btn-ghost btn-sm" id="readCheck" style="margin-top:8px">答えをたしかめる</button>
        <div id="readReply"></div>
      </div>
      <div class="sec-title" style="font-size:13px">📚 青空文庫の名作も読めるよ</div>
      <div class="sec-sub">タップすると本文サイトがひらきます（無料・著作権切れの名作）</div>
      <div class="aozora-list">
        ${AOZORA.map(a=>`<a class="aozora-item" href="${a.url}" target="_blank" rel="noopener">
          <span class="ae">${a.e}</span><span class="at"><span class="atn">${a.title}</span><span class="atm">${a.author}${a.mins?' ・ '+a.mins:''}</span></span><span class="arrow">↗</span></a>`).join('')}
      </div>
    </div>
    <div class="scr-foot"><button class="btn btn-green" id="readDone">読みおわった！ ⚾</button></div>
   </div>`;
  document.getElementById('readCheck').addEventListener('click',()=>{
    const ans=document.getElementById('readAns').value.trim();
    document.getElementById('readReply').innerHTML=`<div class="sensei-reply"><div class="sr-head">🌸 こんなふうにまとめられたら花丸！</div><div class="sr-body">${rubyize(item.a)}\n\n${ans?'じぶんの言葉で書けたね、すごい！⚾ 上の例とくらべてみよう。':'声に出して読めたかな？上の例を見て、どんな話か言ってみよう！'}</div></div>`;
    document.getElementById('readCheck').disabled=true;
    addLog('音読',item.t+'：'+item.q,ans||'(声で答えた/未記入)','花丸例：'+item.a);
  });
  document.getElementById('readDone').addEventListener('click',()=>finishActivity('read'));
}

// ===== 作文 =====
function renderWriting(item){
  const th=themeOf(item.theme);
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head"><div class="x" onclick="closeScreen()">✕</div>
      <div><div class="ht">✍️ 作文</div><div class="hs">穴うめで意見文を完成</div></div></div>
    <div class="scr-body">
      <div class="theme-tag">${th.e} ${th.n}</div>
      <div class="ai-card">
        <div class="ai-label">📝 今日のお題</div>
        <div style="font-size:16px;line-height:1.8;color:#1c2c44;font-weight:700">${rubyize(item.q)}</div>
      </div>
      <div class="sec-sub" style="margin-top:14px">下の □ をうめると、文が完成するよ。1つずつ入れてみよう！</div>
      <div class="tmpl-box" id="tmplBox"></div>
      <div id="blankInputs"></div>
      <div class="preview" id="previewBox" style="display:none"><span class="pl">✨ できあがった作文</span><span id="previewText"></span></div>
      <div id="writeReply"></div>
    </div>
    <div class="scr-foot" id="writeFoot"><button class="btn btn-gold" id="writeDone">かんせい！ 答えをみる</button></div>
   </div>`;
  const bi=document.getElementById('blankInputs');
  item.blanks.forEach(bl=>{
    const d=document.createElement('div');d.className='blank-input';
    d.innerHTML=`<label>${bl.l} のところ</label><div class="bhint">${rubyize(bl.h||'')}</div><input type="text" data-label="${bl.l}" autocomplete="off">`;
    bi.appendChild(d);
  });
  const inputs=[...bi.querySelectorAll('input')];
  const update=()=>{
    const vals={};inputs.forEach(inp=>{vals[inp.dataset.label]=inp.value.trim();});
    let filledCount=Object.values(vals).filter(Boolean).length;
    let disp=item.tmpl;
    item.blanks.forEach(bl=>{const v=vals[bl.l];const cls=v?'tmpl-blank filled':'tmpl-blank';
      disp=disp.replace(`［${bl.l}］`,`<span class="${cls}">${v||'　'+bl.l+'　'}</span>`);});
    document.getElementById('tmplBox').innerHTML=rubyize(disp);
    let asm=item.tmpl;item.blanks.forEach(bl=>{asm=asm.replace(`［${bl.l}］`,vals[bl.l]||`（${bl.l}）`);});
    const pv=document.getElementById('previewBox');
    if(filledCount>0){pv.style.display='block';document.getElementById('previewText').innerHTML=rubyize(asm);}
    else pv.style.display='none';
  };
  inputs.forEach(inp=>inp.addEventListener('input',update));update();
  document.getElementById('writeDone').addEventListener('click',()=>{
    const vals={};inputs.forEach(inp=>vals[inp.dataset.label]=inp.value.trim());
    const filled=Object.values(vals).filter(Boolean).length;
    if(filled<item.blanks.length){alert('ぜんぶの □ をうめてみよう！むずかしかったら、みじかい言葉でもOKだよ');return;}
    let asm=item.tmpl;item.blanks.forEach(bl=>{asm=asm.replace(`［${bl.l}］`,vals[bl.l]);});
    const exHtml=item.ex.map((e,i)=>`<div style="margin-top:8px;padding:10px;background:#fff;border:1px solid var(--line);border-radius:10px;font-size:13.5px;line-height:1.7;color:#1c2c44">れい${i+1}：${rubyize(e)}</div>`).join('');
    document.getElementById('writeReply').innerHTML=`<div class="sensei-reply"><div class="sr-head">🦉 ${praise()}</div><div class="sr-body">作文には、いろんな書き方があるよ。下の例も読んでみてね👇</div>${exHtml}</div>`;
    document.getElementById('writeFoot').innerHTML='<button class="btn btn-green" onclick="finishActivity(\'write\')">クエストクリア！ ⚾</button>';
    state.sakubunDone=(state.sakubunDone||0)+1;
    addLog('作文',item.q,asm,'例：'+item.ex.join(' ／ '));
  });
}

// ===== 理科社会のタネ =====
function renderScience(item){
  const th=themeOf(item.theme);
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head"><div class="x" onclick="closeScreen()">✕</div>
      <div><div class="ht">🔬 理科社会のタネ</div><div class="hs">今日のなぜ？</div></div></div>
    <div class="scr-body">
      <div class="theme-tag">${th.e} ${th.n}</div>
      <div class="ai-card">
        <div class="ai-label">❓ 今日のなぜ？</div>
        <div style="font-size:17px;line-height:1.8;color:#1c2c44;font-weight:700">${rubyize(item.q)}</div>
        <div style="margin-top:12px;font-size:12.5px;color:#7c8a9e;font-weight:700;background:#f4eede;padding:10px;border-radius:10px">💡 ${rubyize(item.think)}</div>
      </div>
      <div class="sec-sub" style="margin-top:16px">じぶんの考えを書いてみよう（正解は1つじゃないよ。考えることが大事！）</div>
      <textarea class="answer-area" id="sciArea" style="min-height:110px" placeholder="ぼくは○○だと思う。なぜなら…"></textarea>
      <div id="sciReply"></div>
    </div>
    <div class="scr-foot" id="sciFoot"><button class="btn btn-gold" id="sciDone">答えをみる</button></div>
   </div>`;
  setTimeout(()=>document.getElementById('sciArea').focus(),100);
  document.getElementById('sciDone').addEventListener('click',()=>{
    const text=document.getElementById('sciArea').value.trim();
    if(text.length<3){alert('短くていいよ。思ったことを書いてみよう！');return;}
    const viewsHtml=item.views.map(v=>`<div style="margin-top:6px;padding:9px 11px;background:#fff;border:1px solid var(--line);border-radius:10px;font-size:13px;line-height:1.6;color:#1c2c44">🔎 ${rubyize(v)}</div>`).join('');
    document.getElementById('sciReply').innerHTML=`<div class="sensei-reply"><div class="sr-head">🦉 ${praise()}</div><div class="sr-body"><b>本当のところは…</b>\n${rubyize(item.a)}</div><div style="margin-top:10px;font-size:12px;font-weight:800;color:#1e7a44">いろんな見方があるよ👇</div>${viewsHtml}</div>`;
    document.getElementById('sciFoot').innerHTML='<button class="btn btn-green" onclick="finishActivity(\'sci\')">クエストクリア！ ⚾</button>';
    addLog('理科社会',item.q,text,'答え：'+item.a);
  });
}

// ===== Activity router =====
function openActivity(id){
  document.getElementById('screen').classList.add('show');
  if(id==='calc'){startCalc();return;}
  if(id==='read'){renderReading(pickFromPool('read'));}
  else if(id==='write'){renderWriting(pickFromPool('write'));}
  else if(id==='sci'){renderScience(pickFromPool('sci'));}
}
function finishActivity(id){closeScreen();completeQuest(id);}
function closeScreen(){document.getElementById('screen').classList.remove('show');document.getElementById('screenInner').innerHTML='';}

// ===== 図鑑 =====
function renderZukan(){
  const got=Object.keys(state.cards).filter(id=>state.cards[id]>0).length;
  document.getElementById('collGot').textContent=got;
  document.getElementById('collTotal').textContent=CARDS.length;
  document.getElementById('collBar').style.width=(got/CARDS.length*100)+'%';
  const body=document.getElementById('collBody');body.innerHTML='';
  RARITY_ORDER.forEach(rk=>{
    const R=RARITY[rk];const cards=CARDS.filter(c=>c.r===rk);
    const grp=document.createElement('div');grp.className='rar-group';
    grp.innerHTML=`<div class="rar-label" style="color:${R.color}">${'★'.repeat(R.stars)} ${R.name}</div>`;
    const grid=document.createElement('div');grid.className='card-grid';
    cards.forEach(c=>{
      const cnt=state.cards[c.id]||0;const owned=cnt>0;
      const el=document.createElement('div');el.className='pcard'+(owned?'':' locked');
      if(owned){el.style.borderColor=R.color;el.style.boxShadow=`0 0 12px ${R.glow}`;
        el.innerHTML=`${cnt>1?`<span class="pcount">×${cnt}</span>`:''}<div class="pe">${c.e}</div><div class="pn">${c.name}</div><div class="pp">${c.pos}</div><div class="pstars" style="color:${R.color}">${'★'.repeat(R.stars)}</div>`;
      }else{el.innerHTML=`<div class="plock">？</div><div class="pn" style="color:#a8b2bf">？？？</div>`;}
      grid.appendChild(el);
    });
    grp.appendChild(grid);body.appendChild(grp);
  });
}

// ===== きろく =====
function renderRecord(){
  const keys=Object.keys(state.history);const live=Object.values(state.checks).filter(Boolean).length;
  const full=keys.filter(k=>state.history[k].count===5&&k!==state.today).length+(live===5?1:0);
  document.getElementById('stTotal').textContent=full;
  document.getElementById('stBest').textContent=bestStreak();
  document.getElementById('stYen').textContent=state.money;
  document.getElementById('stCalc').textContent=tierName(state.calcTier);
  const now=new Date(),y=now.getFullYear(),m=now.getMonth();
  const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
  const grid=document.getElementById('calGrid');grid.innerHTML='';
  for(let i=0;i<first;i++)grid.appendChild(document.createElement('div'));
  for(let dd=1;dd<=days;dd++){
    const k=`${y}-${String(m+1).padStart(2,'0')}-${String(dd).padStart(2,'0')}`;
    const e=document.createElement('div');e.className='cd';e.textContent=dd;
    let c=0;if(k===state.today)c=live;else if(state.history[k])c=state.history[k].count;
    if(c===5)e.classList.add('win');else if(c>0)e.classList.add('part');
    if(k===state.today)e.classList.add('today');
    grid.appendChild(e);
  }
}
function renderParent(){
  const box=document.getElementById('logList');box.innerHTML='';
  if(state.log.length===0){box.innerHTML='<div class="sec-sub" style="margin-top:20px;text-align:center">まだ記録はありません。音読・作文・理科社会をやると、ここに答えと手本が残ります。</div>';return;}
  state.log.forEach(l=>{
    const d=new Date(l.ts);const tstr=`${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    const el=document.createElement('div');el.className='log-item';
    el.innerHTML=`<div class="log-meta"><span class="log-tag">${l.tag}</span><span>${tstr}</span></div>
      <div class="log-q">📌 ${l.question}</div>
      <div class="log-a"><b style="color:#1e7a44">本人:</b> ${l.answer||'(なし)'}</div>
      <div class="log-a" style="border-color:rgba(46,165,86,.4)"><b style="color:#2c7a4c">手本:</b> ${l.reply||''}</div>`;
    box.appendChild(el);
  });
}

document.querySelectorAll('.tab').forEach(t=>{
  t.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(x=>x.classList.remove('show'));
    t.classList.add('active');
    document.getElementById('panel-'+t.dataset.tab).classList.add('show');
    if(t.dataset.tab==='zukan')renderZukan();
    if(t.dataset.tab==='record')renderRecord();
    if(t.dataset.tab==='parent')renderParent();
  });
});

let actx=null;
function beep(freq,dur,type='sine',vol=.15){
  try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=freq;
    o.connect(g);g.connect(actx.destination);g.gain.setValueAtTime(vol,actx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+dur);o.start();o.stop(actx.currentTime+dur);}catch(e){}
}
function sparks(x,y,n,colors){
  const b=document.getElementById('burst');
  for(let i=0;i<n;i++){
    const s=document.createElement('div');s.className='spark';s.style.background=colors[i%colors.length];
    s.style.left=x+'px';s.style.top=y+'px';b.appendChild(s);
    const ang=Math.random()*Math.PI*2,vel=70+Math.random()*150;
    const dx=Math.cos(ang)*vel,dy=Math.sin(ang)*vel-50;
    s.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:`translate(${dx}px,${dy+200}px) rotate(${Math.random()*620}deg)`,opacity:0}],
      {duration:1000+Math.random()*600,easing:'cubic-bezier(.2,.6,.3,1)'}).onfinish=()=>s.remove();
  }
}

document.getElementById('resetBtn').addEventListener('click',()=>{
  if(confirm('今日のチェックを全部消します。（ガチャ結果・貯金はそのまま残ります）よろしいですか？')){
    state.checks={};wasComplete=false;renderQuests();renderTop();save();}
});
document.getElementById('resetAllBtn').addEventListener('click',()=>{
  if(confirm('すべての記録（連勝・カレンダー・先生メモ・計算レベル・貯金・集めたカード）を消します。元にもどせません。よろしいですか？')){
    state={today:todayKey(),checks:{},history:{},calcTier:1,calcStats:{correct:0,wrong:0},sakubunDone:0,log:[],money:0,cards:{},gachaLog:{},seen:{read:[],write:[],sci:[]}};
    store.del('kudan-state-v5');renderQuests();renderTop();alert('初期化しました');
  }
});

// ===== INIT =====
buildPools();
load();
renderQuests();
renderTop();
wasComplete=Object.values(state.checks).filter(Boolean).length===5;
