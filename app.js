// まいにち九段ベースボール — アプリ本体ロジック（コンテンツは content/*.js）

// ===== 内蔵コンテンツ＋アプリ本体（オフライン・単体動作版 v5）=====
// ============ 内蔵コンテンツ：音読 ============
// 各話 {t:タイトル, s:本文(《》ふりがな), q:読みとり質問, a:模範要約例}
const THEMES=[
  {id:'baseball',e:'⚾',n:'野球・スポーツ'},
  {id:'nature',e:'🦖',n:'生き物・宇宙'},
  {id:'mecha',e:'🚀',n:'のりもの・メカ'},
  {id:'history',e:'⚔️',n:'歴史・冒険'},
  {id:'meisaku',e:'📖',n:'名作物語'},
  {id:'mukashi',e:'🏯',n:'日本の昔話'},
  {id:'guwa',e:'🦊',n:'イソップ寓話'},
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
// ポイント抽選：1〜100pt。平均≈46.9pt/回 → 毎日回すと30日で約1,400pt。
const POINT_DIST=[[1,.04],[5,.06],[10,.10],[20,.12],[30,.13],[50,.20],[70,.19],[100,.16]];
const POINT_FACES=[1,5,10,20,30,50,70,100];

const WD=['日','月','火','水','木','金','土'];
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};

// ===== ストレージ（localStorage＋メモリ予備）=====
const store={mem:{},
  get(k){try{const v=localStorage.getItem(k);return v===null?(k in this.mem?this.mem[k]:null):v;}catch(e){return k in this.mem?this.mem[k]:null;}},
  set(k,v){try{localStorage.setItem(k,v);}catch(e){this.mem[k]=v;}},
  del(k){try{localStorage.removeItem(k);}catch(e){delete this.mem[k];}}
};

let state={today:todayKey(),checks:{},history:{},calcTier:1,calcStats:{correct:0,wrong:0},sakubunDone:0,log:[],
  money:0,points:0,exchanges:[],cards:{},gachaLog:{},seen:{read:[],write:[],sci:[]},recent:{read:[],write:[],sci:[]},stats:{calc:{},sci:{},read:{},write:{}},weak:{calc:[],sci:[]}};

function load(){
  const r=store.get('kudan-state-v5');
  if(r){try{const s=JSON.parse(r);
    state.history=s.history||{};state.calcTier=s.calcTier||1;
    state.calcStats=s.calcStats||{correct:0,wrong:0};state.sakubunDone=s.sakubunDone||0;state.log=s.log||[];
    state.money=s.money||0;state.points=s.points||0;state.exchanges=Array.isArray(s.exchanges)?s.exchanges:[];state.cards=s.cards||{};state.gachaLog=s.gachaLog||{};
    state.seen=s.seen||{read:[],write:[],sci:[]};
    if(!state.seen.read)state.seen.read=[];if(!state.seen.write)state.seen.write=[];if(!state.seen.sci)state.seen.sci=[];
    state.stats=s.stats||{calc:{},sci:{},read:{},write:{}};
    if(!state.stats.calc)state.stats.calc={};if(!state.stats.sci)state.stats.sci={};
    if(!state.stats.read)state.stats.read={};if(!state.stats.write)state.stats.write={};
    state.recent=s.recent||{read:[],write:[],sci:[]};
    if(!state.recent.read)state.recent.read=[];if(!state.recent.write)state.recent.write=[];if(!state.recent.sci)state.recent.sci=[];
    state.weak=s.weak||{calc:[],sci:[]};
    if(!Array.isArray(state.weak.calc))state.weak.calc=[];if(!Array.isArray(state.weak.sci))state.weak.sci=[];
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
// ===== 成績の記録（見える化の土台）=====
function calcCategory(t){
  if(t.indexOf('たし')>=0)return 'たし算';
  if(t.indexOf('ひき')>=0)return 'ひき算';
  if(t.indexOf('九九')>=0||t.indexOf('かけ')>=0||t.indexOf('けた×')>=0)return 'かけ算';
  if(t.indexOf('わり')>=0)return 'わり算';
  if(t.indexOf('□')>=0)return '□（穴うめ）';
  if(t.indexOf('割合')>=0)return '割合(%)';
  if(t.indexOf('速さ')>=0)return '速さ';
  return 'その他';
}
function recordCalc(type,correct){
  const cat=calcCategory(type);
  if(!state.stats.calc[cat])state.stats.calc[cat]={c:0,w:0};
  if(correct)state.stats.calc[cat].c++;else state.stats.calc[cat].w++;
}
function recordSci(theme,correct){
  if(!state.stats.sci[theme])state.stats.sci[theme]={c:0,w:0,n:0};
  state.stats.sci[theme].n++;
  if(correct)state.stats.sci[theme].c++;else state.stats.sci[theme].w++;
}
function recordTheme(cat,theme){
  if(!state.stats[cat])state.stats[cat]={};
  if(!state.stats[cat][theme])state.stats[cat][theme]={n:0};
  state.stats[cat][theme].n++;
}
// ===== 弱点リスト＆復習（③）=====
const REVIEW_DELAY=3*24*60*60*1000; // 3日後に復習
function uid(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);}
function addWeakCalc(p){
  if(state.weak.calc.some(w=>w.q===p.q))return;
  state.weak.calc.push({q:p.q,ans:p.ans,t:p.t,cat:calcCategory(p.t),divmod:!!p.divmod,due:Date.now()+REVIEW_DELAY,tries:0,id:uid('c')});
  if(state.weak.calc.length>60)state.weak.calc.shift();
}
function clearWeakCalc(id){state.weak.calc=state.weak.calc.filter(w=>w.id!==id);}
function rescheduleWeakCalc(id){const w=state.weak.calc.find(w=>w.id===id);if(w){w.due=Date.now()+REVIEW_DELAY;w.tries=(w.tries||0)+1;}}
function addWeakSci(theme,qi){
  const ex=state.weak.sci.find(w=>w.theme===theme&&w.qi===qi);
  if(ex){ex.due=Date.now()+REVIEW_DELAY;ex.tries=(ex.tries||0)+1;return;}
  state.weak.sci.push({theme,qi,due:Date.now()+REVIEW_DELAY,tries:0,id:uid('s')});
  if(state.weak.sci.length>40)state.weak.sci.shift();
}
function clearWeakSci(theme,qi){state.weak.sci=state.weak.sci.filter(w=>!(w.theme===theme&&w.qi===qi));}
function dueCalc(){const t=Date.now();return state.weak.calc.filter(w=>w.due<=t);}
function dueSci(){const t=Date.now();return state.weak.sci.filter(w=>w.due<=t);}
function weakCount(){return state.weak.calc.length+state.weak.sci.length;}
function rubyize(t){return (t||'').replace(/([一-龠々〆ヶ]+)《([ぁ-んァ-ヴ]+)》/g,'<ruby>$1<rt>$2</rt></ruby>');}
function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function stripRuby(s){return (s||'').replace(/《[ぁ-んァ-ヴ]+》/g,'');}
function geminiBox(promptText){
  const id='gem'+Math.random().toString(36).slice(2,7);
  return `<div class="gemini-box">
    <div class="gb-head">🤖 Gemini先生に見せよう！</div>
    <div class="gb-sub">書けたら、Gemini先生に見せて、ほめてもらおう！下のボタンでコピーして、Geminiにはりつけて送ってね。</div>
    <div class="gemini-steps"><div class="gstep">①<br>コピー</div><div class="gstep">②<br>Geminiを開く</div><div class="gstep">③<br>はって送る</div></div>
    <textarea id="${id}" readonly class="gemini-prompt">${esc(promptText)}</textarea>
    <button class="btn btn-copy btn-sm" style="margin-top:8px" onclick="copyGemini('${id}')">📋 ぜんぶコピー</button>
    <div class="copied-note" id="${id}n"></div>
    <a class="btn btn-gemini btn-sm" style="margin-top:6px" href="https://gemini.google.com/app" target="_blank" rel="noopener">🤖 Gemini先生をひらく ↗</a>
  </div>`;
}
function copyGemini(id){
  const ta=document.getElementById(id),note=document.getElementById(id+'n');
  const ok=()=>{note.textContent='✅ コピーしたよ！Geminiにはって送ってね';};
  const ng=()=>{ta.focus();ta.select();note.textContent='👆上の文をおして「コピー」をえらんでね';};
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value).then(ok).catch(()=>{try{ta.focus();ta.select();document.execCommand('copy')?ok():ng();}catch(e){ng();}});}
    else{ta.focus();ta.select();document.execCommand('copy')?ok():ng();}
  }catch(e){ng();}
}

// ===== コンテンツ・プール（テーマ横断＋くり返し防止）=====
const POOLS={read:[],write:[],sci:[]};
function buildPools(){
  Object.keys(READINGS).forEach(tid=>(READINGS[tid]||[]).forEach((x,i)=>POOLS.read.push(Object.assign({theme:tid,idx:i},x))));
  Object.keys(WRITINGS).forEach(tid=>(WRITINGS[tid]||[]).forEach((x,i)=>POOLS.write.push(Object.assign({theme:tid,idx:i},x))));
  Object.keys(SCIENCE).forEach(tid=>(SCIENCE[tid]||[]).forEach((x,i)=>POOLS.sci.push(Object.assign({theme:tid,idx:i},x))));
}
function pickFromPool(cat){
  const pool=POOLS[cat];
  // 理科：期限の来た弱点を、ときどき（約半分）復習として出す
  if(cat==='sci'){
    const due=dueSci();
    if(due.length&&Math.random()<0.5){
      const w=due.slice().sort((a,b)=>a.due-b.due)[0];
      const q=SCIENCE[w.theme]&&SCIENCE[w.theme][w.qi];
      if(q)return Object.assign({theme:w.theme,idx:w.qi,_review:true},q);
    }
  }
  if(!state.recent)state.recent={};
  if(!state.recent[cat])state.recent[cat]=[];
  const recent=state.recent[cat];
  // このプールに実際にあるジャンルを使う（音読＝名作/昔話/寓話、作文・理科＝従来テーマ）
  const present=[...new Set(pool.map(p=>p.theme))];
  // ジャンルごとの取り組み回数
  const counts={};present.forEach(t=>counts[t]=(cat==='sci'?((state.stats.sci[t]&&state.stats.sci[t].n)||0):((state.stats[cat]&&state.stats[cat][t]&&state.stats[cat][t].n)||0)));
  const totalN=present.reduce((a,t)=>a+counts[t],0);const avgN=present.length?totalN/present.length:0;
  // ジャンルの重み（弱い正答率＋避けてるジャンルを少し重く・上限あり＝あくまで寄せ）
  const tw=present.map(t=>{
    let w=1.0;
    if(cat==='sci'){const o=state.stats.sci[t];if(o&&(o.c+o.w)>=3){const acc=o.c/(o.c+o.w);w*=(1+(1-acc)*1.2);}}
    if(avgN>0&&counts[t]<avgN*0.6)w*=1.4; // 避けてるジャンルを少し多めに
    return Math.min(w,2.0); // 上限2.0倍（偏りすぎ防止）
  });
  // 重み付きでジャンルを選ぶ
  let wsum=tw.reduce((a,b)=>a+b,0),r=Math.random()*wsum,ti=0;
  for(let k=0;k<present.length;k++){r-=tw[k];if(r<=0){ti=k;break;}}
  const theme=present[ti];
  // そのジャンルの中で、最近出していないものを優先
  const cand=[];for(let i=0;i<pool.length;i++)if(pool[i].theme===theme)cand.push(i);
  const fresh=cand.filter(i=>recent.indexOf(i)<0);
  const idx=(fresh.length?fresh:cand)[Math.floor(Math.random()*(fresh.length?fresh.length:cand.length))];
  // 近い再出題を避けるためのキュー（プールの約半分まで覚える）
  recent.push(idx);const cap=Math.max(6,Math.floor(pool.length/2));while(recent.length>cap)recent.shift();
  state.recent[cat]=recent;save();
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
  document.getElementById('coinTotal').textContent=state.points;
  const d=new Date();document.getElementById('dateLabel').textContent=`${d.getMonth()+1}月${d.getDate()}日(${WD[d.getDay()]})`;
  const gb=document.getElementById('gachaBar');
  const gachaedToday=!!state.gachaLog[state.today];
  if(done===5){
    if(gachaedToday){gb.className='gachabar done';const g=state.gachaLog[state.today];const pts=(g.points!=null)?g.points:(g.money||0);
      document.getElementById('gachaT').innerHTML='🎉 今日のガチャ完了！';
      document.getElementById('gachaS').innerHTML=`<b>${pts}pt</b> ゲット！ また明日 ⚾`;
    }else{gb.className='gachabar on';
      document.getElementById('gachaT').innerHTML='🎰 ガチャを回そう！ ▶';
      document.getElementById('gachaS').textContent='5つクリア達成！ タップでポイントガチャ！';}
  }else{gb.className='gachabar';
    document.getElementById('gachaT').innerHTML=`⚾ あと ${5-done} つでガチャ！`;
    document.getElementById('gachaS').textContent='5つぜんぶクリアすると、ポイントガチャが回せる！';}
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
function rollPoints(){const r=Math.random();let a=0;for(const [v,p] of POINT_DIST){a+=p;if(r<a)return v;}return 50;}
let gachaPending=null;
function openGacha(){
  if(state.gachaLog[state.today])return; // 1日1回まで
  gachaPending={points:rollPoints()};
  document.getElementById('gacha').classList.add('show');renderGachaPack();
}
function renderGachaPack(){
  document.getElementById('gachaInner').innerHTML=`
    <div class="gacha-step">
      <div class="gacha-h">⚾ 試合に勝った！</div>
      <div class="gacha-sub">パックをタップして、ポイントをゲット！</div>
      <div class="pack" id="packEl"><div class="pball">⚾</div><div class="ptap">タップ！</div></div>
    </div>`;
  document.getElementById('packEl').addEventListener('click',startRoulette,{once:true});
}
function startRoulette(){
  const {points}=gachaPending;
  beep(440,.1,'triangle');setTimeout(()=>beep(660,.1,'triangle'),80);
  document.getElementById('gachaInner').innerHTML=`
    <div class="gacha-step">
      <div class="gacha-h">🎰 ポイントルーレット</div>
      <div class="gacha-sub">何ポイント当たるかな…？</div>
      <div class="roulette"><div class="needle"></div><div class="roul-strip" id="roulStrip"></div></div>
      <div id="roulResult"></div>
    </div>`;
  const strip=document.getElementById('roulStrip');
  const ITEM=48,loops=6,seq=[];
  for(let i=0;i<loops;i++)POINT_FACES.forEach(v=>seq.push(v));
  const targetIdx=seq.length;seq.push(points);POINT_FACES.forEach(v=>seq.push(v));
  strip.innerHTML=seq.map(v=>`<div class="roul-item ${v>=70?'big':''}">${v}pt</div>`).join('');
  const center=120/2-ITEM/2;const finalY=-(targetIdx*ITEM)+center;
  strip.style.transform=`translateY(${center}px)`;
  const tickInt=setInterval(()=>{beep(900,.03,'square',.04);},90);
  requestAnimationFrame(()=>{strip.style.transition='transform 3.1s cubic-bezier(.12,.7,.18,1)';strip.style.transform=`translateY(${finalY}px)`;});
  setTimeout(()=>{clearInterval(tickInt);finishGacha();},3250);
}
function finishGacha(){
  const {points}=gachaPending;
  state.points+=points;
  state.gachaLog[state.today]={points,ts:Date.now()};
  save();
  beep(523,.15,'square');setTimeout(()=>beep(784,.15,'square'),130);setTimeout(()=>beep(1047,.25,'square'),260);
  const big=points>=70;const canEx=state.points>=1000;
  document.getElementById('roulResult').innerHTML=`
    <div class="gacha-result">${points} ポイント！${big?' 🎉':''}</div>
    <div class="gacha-total">いまのポイント → <b>${state.points} pt</b></div>
    ${canEx?'<div class="gacha-sub" style="margin-top:12px;color:#1e7a44">🎁 1000pt貯まった！「ポイント」タブで1,000円と交換できるよ</div>':''}
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
  3:{name:'小4＋ はってん',gens:[
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
// 各レベル・各ジェネレータが、どの計算カテゴリかを起動時に1回だけ求めておく
const GEN_CAT={};
function buildGenCat(){
  [1,2,3].forEach(tier=>{GEN_CAT[tier]=CALC_TIERS[tier].gens.map(g=>calcCategory(g().t));});
}
// 5問を選ぶ：苦手なカテゴリを多めに（ただし1種類は最大2問まで＝バランス維持）
function pickWeightedGens(tier){
  const cats=GEN_CAT[tier]||CALC_TIERS[tier].gens.map(g=>calcCategory(g().t));
  const weights=cats.map(c=>{
    const o=state.stats.calc[c];
    if(!o||(o.c+o.w)<3)return 1.5; // データ不足は少し多めに（練習機会を確保）
    const acc=o.c/(o.c+o.w);
    return Math.min(3,Math.max(1,1+(1-acc)*2)); // 正答率が低いほど重く（最大3倍）
  });
  const counts=[0,0,0,0,0],chosen=[];
  for(let n=0;n<5;n++){
    let poolIdx=[],wsum=0;
    for(let g=0;g<5;g++)if(counts[g]<2){poolIdx.push(g);wsum+=weights[g];}
    let r=Math.random()*wsum,pick=poolIdx[0];
    for(const g of poolIdx){r-=weights[g];if(r<=0){pick=g;break;}}
    counts[pick]++;chosen.push(pick);
  }
  return chosen;
}
function startCalc(){
  const tier=state.calcTier||1;const gens=CALC_TIERS[tier].gens;
  const problems=[];
  const due=dueCalc();
  if(due.length){ // 復習：期限の来た弱点を1問だけ混ぜる
    const w=due.slice().sort((a,b)=>a.due-b.due)[0];
    problems.push({t:w.t,q:w.q,ans:w.ans,divmod:w.divmod,_weakId:w.id});
  }
  const order=pickWeightedGens(tier);
  for(let i=0;i<order.length&&problems.length<5;i++)problems.push(gens[order[i]]());
  shuffle(problems); // 復習問題の位置をランダムに
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
        <div class="calc-type">${p._weakId?'🔁 ふくしゅう・':''}${p.t}</div>
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
  recordCalc(p.t,correct);
  if(p._weakId){ if(correct)clearWeakCalc(p._weakId); else rescheduleWeakCalc(p._weakId); }
  else { if(!correct)addWeakCalc(p); }
  const fb=document.getElementById('calcFb');
  if(correct){fb.textContent=(p._weakId?'🔥 ニガテこくふく！ ':'⭕ せいかい！ナイスバッティング！');fb.className='feedback good';
    beep(680,.12,'triangle');setTimeout(()=>beep(900,.12,'triangle'),90);
    const r=input.getBoundingClientRect();sparks(r.left+r.width/2,r.top,8,['#2ea556','#f5a623','#dd5049']);}
  else{fb.textContent=`おしい！ こたえは ${p.ans} だよ`;fb.className='feedback bad';beep(200,.2,'sawtooth',.1);}
  document.getElementById('calcSubmit').disabled=true;save();
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
// 模範解答(a)と本文(s)の内容語の一致から、答えがある文をさがして「うっすらマーカー」用に印をつける
function readKanaSet(t){return new Set((stripRuby(t||'').match(/[一-龠々〆ヶァ-ヴ]/g)||[]));}
function readingKeyHTML(item,hintOn){
  const aset=readKanaSet(item.a);
  const chunks=(item.s||'').split('。').filter(s=>s.trim()!=='');
  const scored=chunks.map((s,i)=>{const set=readKanaSet(s);let sc=0;set.forEach(c=>{if(aset.has(c))sc++;});return {i,sc};});
  const maxSc=Math.max(0,...scored.map(o=>o.sc));
  const markIdx=new Set();
  if(maxSc>=2){
    scored.filter(o=>o.sc===maxSc).slice(0,2).forEach(o=>markIdx.add(o.i));
    if(markIdx.size<2){const sec=Math.max(0,...scored.filter(o=>o.sc<maxSc).map(o=>o.sc));if(sec>=Math.max(2,maxSc-1))scored.filter(o=>o.sc===sec).slice(0,1).forEach(o=>markIdx.add(o.i));}
  }
  return chunks.map((s,i)=>{
    const html=rubyize((s+'。').replace(/\n/g,'<br>'));
    return (hintOn&&markIdx.has(i))?`<mark class="read-mark">${html}</mark>`:html;
  }).join('');
}
function renderReading(item){
  const th=themeOf(item.theme);
  let hintOn=false;
  const passageHTML=()=>readingKeyHTML(item,hintOn);
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head"><div class="x" onclick="closeScreen()">✕</div>
      <div><div class="ht">📖 音読</div><div class="hs">こえに出して読もう</div></div></div>
    <div class="scr-body">
      <div class="theme-tag">${th.e} ${th.n}</div>
      <div class="ai-card">
        <div class="ai-label">📣 ${item.t}</div>
        <div class="ai-story" id="readStory">${passageHTML()}</div>
      </div>
      <div class="q-item" style="margin-top:16px">
        <div class="qq">📝 ${item.q}</div>
        <div class="q-note">本文をしっかり読めば、かならず答えが見つかるよ。声に出してから、自分のことばで書こう。むずかしいときは「💡ヒント」を押すと、答えが本文のどこにあるか光るよ。</div>
        <textarea class="answer-area" id="readAns" placeholder="本文を読んで、自分のことばで答えよう（必須）"></textarea>
        <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" id="readHint" style="flex:1;min-width:120px">💡 ヒント</button>
          <button class="btn btn-green btn-sm" id="readCheck" style="flex:1;min-width:120px">こたえあわせ</button>
        </div>
        <div id="readReply"></div>
      </div>
      <div class="sec-title" style="font-size:13px">📚 青空文庫の名作も読めるよ</div>
      <div class="sec-sub">タップすると本文サイトがひらきます（無料・著作権切れの名作）</div>
      <div class="aozora-list">
        ${AOZORA.map(a=>`<a class="aozora-item" href="${a.url}" target="_blank" rel="noopener">
          <span class="ae">${a.e}</span><span class="at"><span class="atn">${a.title}</span><span class="atm">${a.author}${a.mins?' ・ '+a.mins:''}</span></span><span class="arrow">↗</span></a>`).join('')}
      </div>
    </div>
    <div class="scr-foot" style="display:flex;gap:9px;align-items:center"><button class="btn btn-ghost" id="readMore" style="flex:1;width:auto;min-width:0">📖 もう1話</button><button class="btn btn-green" id="readDone" style="flex:1.5;width:auto;min-width:0" disabled>こたえてからクリア ⚾</button></div>
   </div>`;
  const doneBtn=document.getElementById('readDone');
  document.getElementById('readHint').addEventListener('click',()=>{
    hintOn=!hintOn;
    document.getElementById('readStory').innerHTML=passageHTML();
    document.getElementById('readHint').textContent=hintOn?'🙈 ヒントをかくす':'💡 ヒント';
    if(hintOn){const m=document.querySelector('#readStory .read-mark');if(m)m.scrollIntoView({behavior:'smooth',block:'center'});}
  });
  document.getElementById('readCheck').addEventListener('click',()=>{
    const ans=document.getElementById('readAns').value.trim();
    if(ans.length<3){
      document.getElementById('readReply').innerHTML=`<div class="read-warn">まずは本文を読んで、自分のことばで答えを書いてみよう。むずかしいときは「💡ヒント」を押すと、答えがどこに書いてあるか光るよ。</div>`;
      return;
    }
    const aset=readKanaSet(item.a),gset=readKanaSet(ans);let shared=0;gset.forEach(c=>{if(aset.has(c))shared++;});
    const ok=shared>=2;
    doneBtn.disabled=false;doneBtn.textContent='読みおわった！ ⚾';
    document.getElementById('readReply').innerHTML=`
      <div class="sensei-reply"><div class="sr-head">${ok?'🌸 いいね！しっかり読めているね！':'🔍 おしい！もう一度、本文を見てみよう'}</div>
      <div class="sr-body">${ok?'本文の大事なところをつかめているよ。下の「こたえの例」ともくらべてみよう。':'答えはかならず本文の中にあるよ。光った文をもう一度ゆっくり読んでみよう。'}\n\n【こたえの例】\n${rubyize(item.a)}</div></div>`;
    if(!ok&&!hintOn){hintOn=true;document.getElementById('readStory').innerHTML=passageHTML();document.getElementById('readHint').textContent='🙈 ヒントをかくす';const m=document.querySelector('#readStory .read-mark');if(m)m.scrollIntoView({behavior:'smooth',block:'center'});}
    recordTheme('read',item.theme);
    addLog('音読',item.t+'：'+item.q,ans,'こたえ例：'+item.a);
  });
  document.getElementById('readMore').addEventListener('click',()=>{recordTheme('read',item.theme);renderReading(pickFromPool('read'));document.querySelector('.scr-body').scrollTop=0;});
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
    <div class="scr-foot" id="writeFoot"><button class="btn btn-gold" id="writeDone">できた！ 見てもらう ▶</button></div>
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
    const need=Math.min(2,item.blanks.length);
    if(filled<need){alert('まずは2つだけでもうめてみよう！むずかしい所は、みじかい言葉でもOKだよ');return;}
    let asm=item.tmpl;item.blanks.forEach(bl=>{asm=asm.replace(`［${bl.l}］`,vals[bl.l]||'…');});
    const exHtml=item.ex.map((e,i)=>`<div style="margin-top:8px;padding:10px;background:#fff;border:1px solid var(--line);border-radius:10px;font-size:13.5px;line-height:1.7;color:#1c2c44">れい${i+1}：${rubyize(e)}</div>`).join('');
    const prompt=stripRuby(`小学4年生のぼくが書いた作文です。中学受験（千代田区立九段中等教育学校）をめざしています。よいところをたくさんほめて、もっとよくなるところを1つだけ、やさしく教えてください。\n\n【お題】${item.q}\n【ぼくの作文】${asm}`);
    document.getElementById('writeReply').innerHTML=
      `<div class="sensei-reply"><div class="sr-head">🎉 ${praise()}</div><div class="sr-body">書けたね！つぎは、Gemini先生に見せて、ほめてもらおう！</div></div>`
      +geminiBox(prompt)
      +`<div class="after-gemini">― Gemini先生に見せたあと、下のお手本ともくらべてみよう ―</div>`
      +`<div class="sensei-reply" style="margin-top:8px"><div class="sr-body">作文には、いろんな書き方があるよ👇</div>${exHtml}</div>`;
    document.getElementById('writeFoot').innerHTML='<button class="btn btn-green" onclick="finishActivity(\'write\')">クエストクリア！ ⚾</button>';
    state.sakubunDone=(state.sakubunDone||0)+1;
    recordTheme('write',item.theme);
    addLog('作文',item.q,asm,'例：'+item.ex.join(' ／ '));
  });
}

// ===== 理科社会のタネ =====
let sciSelected=null;
function renderScience(item){
  const th=themeOf(item.theme);sciSelected=null;
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head"><div class="x" onclick="closeScreen()">✕</div>
      <div><div class="ht">🔬 理科社会のタネ</div><div class="hs">今日のなぜ？</div></div></div>
    <div class="scr-body">
      <div class="theme-tag">${th.e} ${th.n}</div>
      <div class="ai-card">
        <div class="ai-label">${item._review?'🔁 ふくしゅう・':''}❓ 今日のなぜ？</div>
        <div style="font-size:17px;line-height:1.8;color:#1c2c44;font-weight:700">${rubyize(item.q)}</div>
        <div style="margin-top:12px;font-size:13px;color:#3a5bb8;font-weight:700;background:#eef4ff;border:1px solid #cdd9f0;padding:11px;border-radius:10px">💡 考えるヒント：${rubyize(item.think)}</div>
      </div>
      <div class="sec-sub" style="margin-top:16px">まず、どれだと思う？ ひとつえらんでタップしてみよう（当たってなくても大丈夫！）</div>
      <div id="sciChoices"></div>
      <div id="sciReason" style="display:none">
        <div class="sec-sub" style="margin-top:18px">えらべたね！ では <b style="color:#1c2c44">なぜ、それをえらんだ？</b> 思ったことを書いてみよう。</div>
        <textarea class="answer-area" id="sciArea" style="min-height:90px" placeholder="ぼくが○○をえらんだのは、…だからです"></textarea>
      </div>
      <div id="sciReply"></div>
    </div>
    <div class="scr-foot" id="sciFoot"></div>
   </div>`;
  const cbox=document.getElementById('sciChoices');
  item.choices.forEach((c,idx)=>{
    const b=document.createElement('button');b.className='choice-btn';b.dataset.idx=idx;
    b.innerHTML=`<div class="choice-row"><span class="choice-mark">${'ABC'[idx]}</span><span class="choice-text">${rubyize(c.t)}</span></div>`;
    b.addEventListener('click',()=>selectChoice(item,idx));
    cbox.appendChild(b);
  });
}
function selectChoice(item,idx){
  if(document.querySelector('#sciChoices .choice-btn.correct'))return; // already revealed
  sciSelected=idx;
  document.querySelectorAll('#sciChoices .choice-btn').forEach((b,i)=>b.classList.toggle('selected',i===idx));
  revealScience(item); // えらんだら、書かせずに「理由の言い方」を見せる
}
function revealScience(item){
  document.querySelectorAll('#sciChoices .choice-btn').forEach((b,i)=>{
    const c=item.choices[i];b.classList.remove('selected');
    b.classList.add(c.ok?'correct':'wrong');
    if(i===sciSelected)b.classList.add('chosen-outline');
    if(!b.querySelector('.choice-comment')){const cm=document.createElement('div');cm.className='choice-comment';cm.innerHTML=(c.ok?'✓ ':'· ')+rubyize(c.c);b.appendChild(cm);}
    b.disabled=true;
  });
  const chosen=item.choices[sciSelected];
  const correct=item.choices.find(c=>c.ok)||chosen;
  recordSci(item.theme,chosen.ok);
  if(chosen.ok)clearWeakSci(item.theme,item.idx); else addWeakSci(item.theme,item.idx);
  const head=chosen.ok?`🎉 ${praise()} ${item._review?'ニガテこくふく！':'考え方もバッチリ！'}`:`🎉 ${praise()} 自分でえらべたのがえらい！`;
  const viewsHtml=item.views.map(v=>`<div style="margin-top:6px;padding:9px 11px;background:#fff;border:1px solid var(--line);border-radius:10px;font-size:13px;line-height:1.6;color:#1c2c44">🔎 ${rubyize(v)}</div>`).join('');
  const sayModel=rubyize('答《こた》えは「'+correct.t+'」。なぜなら、'+item.a);
  const prompt=stripRuby(`小学4年生のぼくが、理科や社会の「なぜ？」を三択で考えました。中学受験（千代田区立九段中等教育学校）をめざしています。ぼくはまだ、理由をうまく言葉にできません。えらんだ理由を、小4にもわかるやさしい言い方で教えてください。そのあと、考えたことをいっぱいほめてください。\n\n【質問】${item.q}\n【ぼくがえらんだ答え】${chosen.t}`);
  document.getElementById('sciReason').style.display='none';
  document.getElementById('sciReply').innerHTML=
    `<div class="sensei-reply"><div class="sr-head">${head}</div></div>`
    +`<div class="say-card"><div class="say-h">🗣️ りゆうの言い方（見本）</div><div class="say-body">「${sayModel}」</div><div class="say-note">↑ こえに出して言ってみよう！ じょうずに言えなくても大丈夫。声に出すうちに、だんだん自分の言葉になっていくよ。</div></div>`
    +`<div class="sensei-reply" style="margin-top:10px"><div class="sr-body">もっと知りたいときは、Gemini先生に「言い方」を教えてもらおう！</div></div>`
    +geminiBox(prompt)
    +`<div style="margin-top:12px;font-size:12px;font-weight:800;color:#1e7a44">いろんな見方があるよ👇</div>${viewsHtml}`;
  document.getElementById('sciFoot').innerHTML='<button class="btn btn-green" onclick="finishActivity(\'sci\')">クエストクリア！ ⚾</button>';
  addLog('理科社会',item.q,'えらんだ：'+chosen.t,'答え：'+item.a);
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

// ===== ポイント =====
function renderZukan(){
  const pts=state.points||0;
  document.getElementById('ptNow').textContent=pts;
  const prog=pts%1000;
  document.getElementById('ptBar').style.width=(prog/1000*100)+'%';
  const exBtn=document.getElementById('exchangeBtn');
  if(pts>=1000){
    document.getElementById('ptHint').innerHTML='🎁 1,000円と交換できるよ！';
    exBtn.disabled=false;
  }else{
    document.getElementById('ptHint').innerHTML=`あと <b>${1000-prog}</b> pt で1,000円と交換できるよ`;
    exBtn.disabled=true;
  }
  renderExchangeLog();
}
function renderExchangeLog(){
  const box=document.getElementById('exchangeLog');if(!box)return;
  const ex=state.exchanges||[];
  if(!ex.length){box.innerHTML='<div class="sec-sub" style="text-align:center;margin-top:8px">まだ交換のきろくはありません。1,000ptをめざそう！</div>';return;}
  box.innerHTML=ex.slice().reverse().map(e=>{const d=new Date(e.ts);return `<div class="ex-row"><span class="ex-l">🎁 1,000pt → <b>1,000円</b></span><span class="ex-date">${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}</span></div>`;}).join('');
}
function doExchange(){
  if((state.points||0)<1000)return;
  state.points-=1000;state.money=(state.money||0)+1000;
  (state.exchanges=state.exchanges||[]).push({ts:Date.now(),yen:1000,points:1000});
  save();
  beep(659,.12,'square');setTimeout(()=>beep(988,.18,'square'),120);
  sparks(window.innerWidth/2,window.innerHeight/2,28,['#2ea556','#f5a623','#dd5049']);
  alert('1,000ポイントを1,000円と交換しました！おうちの人にわたしてもらおう 🎁');
  renderZukan();renderTop();
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
  renderInsights();
  renderNigate();
}
function pct(c,w){const t=c+w;return t===0?null:Math.round(c/t*100);}
function barColor(p){return p>=80?'var(--hit)':p>=50?'#e0a012':'#dd5049';}
function renderInsights(){
  const box=document.getElementById('insights');if(!box)return;
  const TH={baseball:{e:'⚾',n:'野球・スポーツ'},nature:{e:'🦖',n:'生き物・宇宙'},mecha:{e:'🚀',n:'のりもの・メカ'},history:{e:'⚔️',n:'歴史・冒険'}};
  const CALC_ORDER=['たし算','ひき算','かけ算','わり算','□（穴うめ）','割合(%)','速さ','その他'];
  let html='';

  // --- 計算：種類別 ---
  const calc=state.stats.calc||{};const calcKeys=CALC_ORDER.filter(k=>calc[k]&&(calc[k].c+calc[k].w)>0);
  html+=`<div class="ins-card"><div class="ins-h">🔢 計算（種類べつの正答率）</div>`;
  if(calcKeys.length===0){html+=`<div class="ins-empty">まだ計算のきろくがありません。「計算」をやってみよう！</div>`;}
  else{
    calcKeys.forEach(k=>{const o=calc[k];const tot=o.c+o.w;const p=pct(o.c,o.w);
      html+=`<div class="ins-row"><div class="ins-label">${k}</div><div class="ins-track"><div class="ins-fill" style="width:${p}%;background:${barColor(p)}"></div></div><div class="ins-val">${p}%<span class="ins-n">(${tot}問)</span></div></div>`;});
  }
  html+=`</div>`;

  // --- 理科社会：ジャンル別 ---
  const sci=state.stats.sci||{};const sciThemes=Object.keys(TH).filter(t=>sci[t]&&sci[t].n>0);
  html+=`<div class="ins-card"><div class="ins-h">🔬 理科社会のタネ（ジャンルべつ）</div>`;
  if(sciThemes.length===0){html+=`<div class="ins-empty">まだ理科社会のきろくがありません。「理科社会のタネ」をやってみよう！</div>`;}
  else{
    sciThemes.forEach(t=>{const o=sci[t];const p=pct(o.c,o.w);
      html+=`<div class="ins-row"><div class="ins-label">${TH[t].e} ${TH[t].n}</div><div class="ins-track"><div class="ins-fill" style="width:${p}%;background:${barColor(p)}"></div></div><div class="ins-val">${p}%<span class="ins-n">(${o.n}回)</span></div></div>`;});
  }
  html+=`</div>`;

  // --- 作文・音読：ジャンル別の回数 ---
  const rd=state.stats.read||{},wr=state.stats.write||{};
  const anyRW=Object.keys(TH).some(t=>(rd[t]&&rd[t].n>0)||(wr[t]&&wr[t].n>0));
  html+=`<div class="ins-card"><div class="ins-h">📖✍️ 音読・作文（とりくんだ回数）</div>`;
  if(!anyRW){html+=`<div class="ins-empty">まだ音読・作文のきろくがありません。やってみよう！</div>`;}
  else{
    html+=`<div class="ins-count-grid">`;
    Object.keys(TH).forEach(t=>{const r=(rd[t]&&rd[t].n)||0,w=(wr[t]&&wr[t].n)||0;
      html+=`<div class="ins-count"><div class="ic-th">${TH[t].e} ${TH[t].n}</div><div class="ic-nums"><span>📖 ${r}</span><span>✍️ ${w}</span></div></div>`;});
    html+=`</div>`;
  }
  html+=`</div>`;

  // --- 自動コメント ---
  const comment=buildInsightComment(calc,calcKeys,sci,sciThemes,rd,wr,TH);
  if(comment)html+=`<div class="ins-comment">${comment}</div>`;
  html+=`<div class="ins-auto">⚙️ 出題は、<b>苦手なところ・あまりやっていないジャンルが少し多めに出る</b>よう自動で調整されています。続けるほど、お子さんに合った練習になります。</div>`;

  box.innerHTML=html;
}
function buildInsightComment(calc,calcKeys,sci,sciThemes,rd,wr,TH){
  const good=[],weak=[];
  calcKeys.forEach(k=>{const o=calc[k];if(o.c+o.w>=3){const p=pct(o.c,o.w);if(p>=80)good.push('計算の'+k);else if(p<50)weak.push('計算の'+k);}});
  sciThemes.forEach(t=>{const o=sci[t];if(o.n>=3){const p=pct(o.c,o.w);if(p>=80)good.push(TH[t].n);else if(p<50)weak.push(TH[t].n);}});
  // 避けているジャンル（理科で回数が極端に少ない）
  const sciCounts=Object.keys(TH).map(t=>(sci[t]&&sci[t].n)||0);const totalSci=sciCounts.reduce((a,b)=>a+b,0);
  let avoid=null;
  if(totalSci>=8){const minT=Object.keys(TH).reduce((a,b)=>(((sci[a]&&sci[a].n)||0)<=((sci[b]&&sci[b].n)||0)?a:b));if(((sci[minT]&&sci[minT].n)||0)<=totalSci*0.12)avoid=TH[minT].n;}
  let parts=[];
  if(good.length)parts.push('🌟 <b>いま伸びてる：</b>'+good.slice(0,3).join('、'));
  if(weak.length)parts.push('💪 <b>もう一歩：</b>'+weak.slice(0,3).join('、'));
  if(avoid)parts.push('👀 <b>'+avoid+'</b>が少なめ。バランスよく挑戦できるとさらにGOOD');
  if(parts.length===0)return 'もう少しデータがたまると、得意・苦手の分析がここに出ます（各3回以上が目安）。まずは毎日コツコツ！';
  return parts.join('<br>');
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

// ===== ニガテこくふくクエスト（③）=====
function renderNigate(){
  const box=document.getElementById('nigateCard');if(!box)return;
  const nc=state.weak.calc.length,ns=state.weak.sci.length,n=nc+ns;
  const dueN=dueCalc().length+dueSci().length;
  if(n===0){box.innerHTML=`<div class="nigate-box clear"><div class="nb-h">🏆 いま、ニガテはありません！</div><div class="nb-s">まちがえた問題はここに集まって、数日後に自動で復習に出ます。今は全部こくふく済み！</div></div>`;return;}
  box.innerHTML=`<div class="nigate-box"><div class="nb-h">🔥 いまのニガテ：${n}こ</div><div class="nb-s">まちがえた 計算${nc}こ・理科${ns}こ。${dueN>0?'そろそろ復習どき！':'数日後に、ふだんの練習にも自動で出てきます。'}</div><button class="btn btn-gold btn-sm" style="margin-top:11px" onclick="openNigate()">🔥 ニガテこくふくクエスト ▶</button></div>`;
}
let nigate=null;
function openNigate(){
  const items=[];
  state.weak.calc.forEach(w=>items.push({kind:'calc',w}));
  state.weak.sci.forEach(w=>items.push({kind:'sci',w}));
  document.getElementById('screen').classList.add('show');
  if(items.length===0){nigate={cleared:0,total:0};renderNigateSummary(true);return;}
  shuffle(items);nigate={queue:items,idx:0,cleared:0,total:items.length};
  renderNigateStep();
}
function closeNigate(){nigate=null;closeScreen();renderNigate();}
function nigateHead(){return `<div class="scr-head"><div class="x" onclick="closeNigate()">✕</div><div><div class="ht">🔥 ニガテこくふく</div><div class="hs">${nigate.idx+1} / ${nigate.total}もん</div></div><div style="margin-left:auto"><span class="lvl-pill">こくふく ${nigate.cleared}</span></div></div>`;}
function renderNigateStep(){
  if(!nigate||nigate.idx>=nigate.queue.length){renderNigateSummary();return;}
  const cur=nigate.queue[nigate.idx];
  if(cur.kind==='calc')renderNigateCalc(cur.w);else renderNigateSci(cur.w);
}
function renderNigateCalc(w){
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    ${nigateHead()}
    <div class="scr-body">
      <div class="calc-card">
        <div class="calc-type">🔁 ふくしゅう・${w.cat}</div>
        <div class="calc-q">${w.q}</div>
        <input class="calc-input" id="nigIn" inputmode="numeric" pattern="[0-9]*" placeholder="？" autocomplete="off">
        ${w.divmod?`<div style="font-size:12px;color:#7c8a9e;margin-top:8px;font-weight:700">商（=何回われるか）を入れてね</div>`:''}
        <div class="feedback" id="nigFb"></div>
      </div>
    </div>
    <div class="scr-foot"><button class="btn btn-gold" id="nigSub">こたえる</button></div>
   </div>`;
  const inp=document.getElementById('nigIn');setTimeout(()=>inp.focus(),80);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')submitNigateCalc(w);});
  document.getElementById('nigSub').addEventListener('click',()=>submitNigateCalc(w));
}
function submitNigateCalc(w){
  const inp=document.getElementById('nigIn');const val=parseInt(inp.value,10);if(isNaN(val)){inp.focus();return;}
  const fb=document.getElementById('nigFb');const ok=val===w.ans;
  if(ok){fb.textContent='🔥 こくふく！ せいかい！';fb.className='feedback good';beep(680,.12,'triangle');setTimeout(()=>beep(950,.13,'triangle'),90);
    clearWeakCalc(w.id);nigate.cleared++;const r=inp.getBoundingClientRect();sparks(r.left+r.width/2,r.top,8,['#2ea556','#f5a623','#dd5049']);}
  else{fb.textContent=`おしい！ こたえは ${w.ans}。また出るからこくふくしよう`;fb.className='feedback bad';beep(200,.2,'sawtooth',.1);rescheduleWeakCalc(w.id);}
  save();document.getElementById('nigSub').disabled=true;
  setTimeout(()=>{nigate.idx++;renderNigateStep();},ok?1000:1900);
}
function renderNigateSci(w){
  const q=SCIENCE[w.theme]&&SCIENCE[w.theme][w.qi];
  if(!q){clearWeakSci(w.theme,w.qi);nigate.idx++;renderNigateStep();return;}
  const th=themeOf(w.theme);
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    ${nigateHead()}
    <div class="scr-body">
      <div class="theme-tag">${th.e} ${th.n}</div>
      <div class="ai-card"><div class="ai-label">🔁 ふくしゅう・今日のなぜ？</div>
        <div style="font-size:16px;line-height:1.7;color:#1c2c44;font-weight:700">${rubyize(q.q)}</div>
        <div style="margin-top:10px;font-size:12.5px;color:#3a5bb8;font-weight:700;background:#eef4ff;border:1px solid #cdd9f0;padding:10px;border-radius:10px">💡 ${rubyize(q.think)}</div></div>
      <div class="sec-sub" style="margin-top:14px">どれだと思う？ もう一度えらんでみよう</div>
      <div id="nigChoices"></div>
      <div id="nigSciReply"></div>
    </div>
    <div class="scr-foot" id="nigSciFoot"></div>
   </div>`;
  const cbox=document.getElementById('nigChoices');
  q.choices.forEach((c,idx)=>{const b=document.createElement('button');b.className='choice-btn';
    b.innerHTML=`<div class="choice-row"><span class="choice-mark">${'ABC'[idx]}</span><span class="choice-text">${rubyize(c.t)}</span></div>`;
    b.addEventListener('click',()=>revealNigateSci(w,q,idx));cbox.appendChild(b);});
}
function revealNigateSci(w,q,sel){
  if(document.querySelector('#nigChoices .choice-btn.correct'))return;
  document.querySelectorAll('#nigChoices .choice-btn').forEach((b,i)=>{const c=q.choices[i];
    b.classList.add(c.ok?'correct':'wrong');if(i===sel)b.classList.add('chosen-outline');
    if(!b.querySelector('.choice-comment')){const cm=document.createElement('div');cm.className='choice-comment';cm.innerHTML=(c.ok?'✓ ':'· ')+rubyize(c.c);b.appendChild(cm);}
    b.disabled=true;});
  const ok=q.choices[sel].ok;
  if(ok){clearWeakSci(w.theme,w.qi);nigate.cleared++;beep(680,.12,'triangle');setTimeout(()=>beep(950,.13,'triangle'),90);}
  else{const it=state.weak.sci.find(x=>x.theme===w.theme&&x.qi===w.qi);if(it){it.due=Date.now()+REVIEW_DELAY;it.tries=(it.tries||0)+1;}beep(200,.2,'sawtooth',.1);}
  save();
  document.getElementById('nigSciReply').innerHTML=`<div class="sensei-reply"><div class="sr-head">${ok?'🔥 こくふく！ せいかい！':'おしい！また出るからこくふくしよう'}</div><div class="sr-body"><b>本当のところは…</b>\n${rubyize(q.a)}</div></div>`;
  document.getElementById('nigSciFoot').innerHTML='<button class="btn btn-gold" onclick="nigate.idx++;renderNigateStep();">つぎへ ▶</button>';
}
function renderNigateSummary(emptyStart){
  const remaining=state.weak.calc.length+state.weak.sci.length;
  const cleared=nigate?nigate.cleared:0;
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head"><div class="x" onclick="closeNigate()">✕</div><div><div class="ht">🔥 ニガテこくふく</div><div class="hs">けっか</div></div></div>
    <div class="scr-body" style="text-align:center">
      <div style="font-size:58px;margin-top:14px">${emptyStart?'🏆':(cleared>0?'🎉':'💪')}</div>
      <div class="calc-q" style="font-size:24px;margin-top:8px">${emptyStart?'ニガテはありません！':cleared+'こ こくふく！'}</div>
      <div style="margin-top:14px;font-size:14px;color:#7d5e15;font-weight:700;line-height:1.7">${emptyStart?'まちがえた問題はここに集まって、復習できます。今は全部こくふく済み。すごい！':('のこりのニガテ：'+remaining+'こ。'+(remaining>0?'また挑戦してこくふくしよう！':'ぜんぶこくふく！さいこう！🏆'))}</div>
    </div>
    <div class="scr-foot"><button class="btn btn-green" onclick="closeNigate()">とじる ⚾</button></div>
   </div>`;
  if(emptyStart||cleared>0){beep(523,.15,'square');setTimeout(()=>beep(784,.2,'square'),140);sparks(window.innerWidth/2,window.innerHeight/2,26,['#f5a623','#2ea556','#dd5049']);}
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

document.getElementById('gachaBar').addEventListener('click',()=>{
  const done=Object.values(state.checks).filter(Boolean).length;
  if(done>=5 && !state.gachaLog[state.today]) openGacha();
});
document.getElementById('resetBtn').addEventListener('click',()=>{
  if(confirm('今日のチェックを全部消します。（ガチャの結果・ポイントはそのまま残ります）よろしいですか？')){
    state.checks={};wasComplete=false;renderQuests();renderTop();save();}
});
document.getElementById('resetAllBtn').addEventListener('click',()=>{
  if(confirm('すべての記録（連勝・カレンダー・先生メモ・計算レベル・ポイント・交換のきろく）を消します。元にもどせません。よろしいですか？')){
    state={today:todayKey(),checks:{},history:{},calcTier:1,calcStats:{correct:0,wrong:0},sakubunDone:0,log:[],money:0,points:0,exchanges:[],cards:{},gachaLog:{},seen:{read:[],write:[],sci:[]},recent:{read:[],write:[],sci:[]},stats:{calc:{},sci:{},read:{},write:{}},weak:{calc:[],sci:[]}};
    store.del('kudan-state-v5');renderQuests();renderTop();alert('初期化しました');
  }
});

// ===== INIT =====
buildPools();
buildGenCat();
load();
renderQuests();
renderTop();
document.getElementById('exchangeBtn').addEventListener('click',doExchange);
wasComplete=Object.values(state.checks).filter(Boolean).length===5;

