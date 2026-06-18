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
  {id:'kurashi',e:'💡',n:'くらしの理科'},
];
function themeOf(id){return THEMES.find(t=>t.id===id)||THEMES[0];}
const QUEST_DEFS={
  duo:{icon:'🦉',name:'Duolingo',desc:'デイリークエストをクリア',type:'check'},
  calc:{icon:'🔢',name:'計算',desc:'小4の問題に5問チャレンジ',type:'activity'},
  read:{icon:'📖',name:'音読',desc:'お話を声に出して読もう',type:'activity'},
  write:{icon:'✍️',name:'作文',desc:'穴うめで意見文を完成',type:'activity'},
  sci:{icon:'🔬',name:'理科社会のタネ',desc:'今日のなぜ？を考える',type:'activity'},
  q_kanji:{icon:'🈶',name:'漢字クイズ',desc:'漢字の読み・意味',type:'activity'},
  q_kenmin:{icon:'🗾',name:'都道府県クイズ',desc:'日本の都道府県',type:'activity'},
  q_news:{icon:'📰',name:'ニュースの言葉',desc:'時事・社会のことば',type:'activity'},
  q_units:{icon:'📏',name:'たんいクイズ',desc:'量・単位のかんかく',type:'activity'},
  q_kotowaza:{icon:'💬',name:'ことわざ・慣用句',desc:'ことばの意味',type:'activity'},
  q_graph:{icon:'📊',name:'資料・グラフ',desc:'グラフを読みとろう',type:'activity'},
  kokugo:{icon:'📕',name:'国語（読む・書く）',desc:'読んで、考えて、書く',type:'activity'},
  shiryo:{icon:'📊',name:'資料・社会（読みとり）',desc:'資料を読んで考える',type:'activity'},
  sansu:{icon:'🧮',name:'考える算数',desc:'きまり・割合・単位を考える',type:'activity'},
  rika:{icon:'🔬',name:'理科の観察・実験',desc:'観察して「なぜ？」を考える',type:'activity'},
};
// 毎日固定（Duolingo・計算・音読）＋日替わり2枠＝合計5。1週間で全分野に触れる。
const FIXED_QUESTS=['kokugo','shiryo','sansu','rika','duo'];
const ROTATING_QUESTS=[];
function dayIndex(){const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);}
function todaysQuestIds(){
  return FIXED_QUESTS.slice();
}
const QUIZZES={
  q_kanji:{title:'🈶 漢字クイズ',sub:'漢字の読み・意味',pool:(typeof KANJI!=='undefined'?KANJI:[])},
  q_kenmin:{title:'🗾 都道府県クイズ',sub:'日本の都道府県',pool:(typeof KENMIN!=='undefined'?KENMIN:[])},
  q_news:{title:'📰 ニュースの言葉',sub:'時事・社会のことば',pool:(typeof NEWS!=='undefined'?NEWS:[])},
  q_units:{title:'📏 たんいクイズ',sub:'量・単位のかんかく',pool:(typeof UNITS!=='undefined'?UNITS:[])},
  q_kotowaza:{title:'💬 ことわざ・慣用句',sub:'ことばの意味',pool:(typeof KOTOWAZA!=='undefined'?KOTOWAZA:[])},
  q_graph:{title:'📊 資料・グラフ',sub:'グラフを読みとろう',pool:(typeof GRAPH!=='undefined'?GRAPH:[])},
};
const MILESTONES=[
  {id:'m100',pt:100,e:'🌱',t:'はじめの一歩'},
  {id:'m300',pt:300,e:'⭐',t:'コツコツ名人'},
  {id:'m700',pt:700,e:'🔥',t:'がんばり屋'},
  {id:'m1500',pt:1500,e:'🎓',t:'もの知りはかせ'},
  {id:'m3000',pt:3000,e:'👑',t:'九段マスター'},
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
const POINT_DIST=[[20,.20],[30,.22],[50,.25],[70,.18],[100,.15]];
const POINT_FACES=[20,30,50,70,100];

const WD=['日','月','火','水','木','金','土'];
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};

// ===== ストレージ（localStorage＋メモリ予備）=====
const store={mem:{},
  get(k){try{const v=localStorage.getItem(k);return v===null?(k in this.mem?this.mem[k]:null):v;}catch(e){return k in this.mem?this.mem[k]:null;}},
  set(k,v){try{localStorage.setItem(k,v);}catch(e){this.mem[k]=v;}},
  del(k){try{localStorage.removeItem(k);}catch(e){delete this.mem[k];}}
};

let state={today:todayKey(),checks:{},history:{},calcTier:1,calcStats:{correct:0,wrong:0},sakubunDone:0,log:[],
  money:0,points:0,totalEarned:0,badges:[],weakQuiz:{},settings:{sound:true,bigText:false},exchanges:[],cards:{},gachaLog:{},review:{},seen:{read:[],write:[],sci:[]},recent:{read:[],write:[],sci:[]},stats:{calc:{},sci:{},read:{},write:{},quiz:{}},weak:{calc:[],sci:[]}};

function load(){
  const r=store.get('kudan-state-v5');
  if(r){try{const s=JSON.parse(r);
    state.history=s.history||{};state.calcTier=s.calcTier||1;
    state.calcStats=s.calcStats||{correct:0,wrong:0};state.sakubunDone=s.sakubunDone||0;state.log=s.log||[];
    state.money=s.money||0;state.points=s.points||0;state.exchanges=Array.isArray(s.exchanges)?s.exchanges:[];state.cards=s.cards||{};state.gachaLog=s.gachaLog||{};state.review=(s.review&&typeof s.review==='object')?s.review:{};
    state.totalEarned=s.totalEarned||0;state.badges=Array.isArray(s.badges)?s.badges:[];state.weakQuiz=(s.weakQuiz&&typeof s.weakQuiz==='object')?s.weakQuiz:{};
    state.settings=(s.settings&&typeof s.settings==='object')?{sound:s.settings.sound!==false,bigText:!!s.settings.bigText}:{sound:true,bigText:false};
    state.seen=s.seen||{read:[],write:[],sci:[]};
    if(!state.seen.read)state.seen.read=[];if(!state.seen.write)state.seen.write=[];if(!state.seen.sci)state.seen.sci=[];
    state.stats=s.stats||{calc:{},sci:{},read:{},write:{}};
    if(!state.stats.calc)state.stats.calc={};if(!state.stats.sci)state.stats.sci={};
    if(!state.stats.read)state.stats.read={};if(!state.stats.write)state.stats.write={};if(!state.stats.quiz)state.stats.quiz={};
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
  todaysQuestIds().forEach(id=>{
    const q=Object.assign({id:id},QUEST_DEFS[id]);
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
function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dayFull(k){const h=state.history[k];return k===state.today?(Object.values(state.checks).filter(Boolean).length===5):!!(h&&h.count===5);}
function calcStreak(){ // 1日休みはセーフ、2日続けて休むとリセット（やさしい連勝）
  let streak=0,miss=0;const d=new Date();
  for(let i=0;i<400;i++){
    const k=ymd(d);
    if(dayFull(k)){streak++;miss=0;}
    else if(k===state.today){/* 今日まだ未達成は数えない・切らない */}
    else{miss++;if(miss>=2)break;}
    d.setDate(d.getDate()-1);
  }
  return streak;
}
function bestStreak(){ // calcStreakと同じ「1日休みセーフ」で最高連勝を計算
  const full={};Object.keys(state.history).forEach(k=>{if(state.history[k].count===5)full[k]=true;});
  if(Object.values(state.checks).filter(Boolean).length===5)full[state.today]=true;
  const days=Object.keys(full).sort();if(!days.length)return 0;
  let best=0,cur=0,miss=0;const end=new Date(state.today);
  for(let d=new Date(days[0]);d<=end;d.setDate(d.getDate()+1)){
    if(full[ymd(d)]){cur++;miss=0;if(cur>best)best=cur;}
    else{miss++;if(miss>=2){cur=0;miss=0;}}
  }
  return best;
}

// ============ GACHA ============
function rollPoints(){const r=Math.random();let a=0;for(const [v,p] of POINT_DIST){a+=p;if(r<a)return v;}return 50;}
let gachaPending=null;
function celebrate(){try{sparks(window.innerWidth/2,Math.round(window.innerHeight/3),12,['#2ea556','#f5a623','#3d7be0']);}catch(e){}try{beep(660,.08,'triangle');setTimeout(function(){beep(880,.08,'triangle');},90);}catch(e){}}
function openGacha(){
  if(state.gachaLog[state.today])return; // 1日1回まで
  gachaPending={points:rollPoints()};
  document.getElementById('gacha').classList.add('show');renderCapsule();
}
function renderCapsule(){
  document.getElementById('gachaInner').innerHTML=`
    <div class="gacha-step">
      <div class="gacha-h">⚾ 試合に勝った！</div>
      <div class="gacha-sub">カプセルをタップして開けよう！</div>
      <div class="capsule" id="capEl"><div class="cap-band"></div><div class="cap-q">？</div></div>
      <div class="cap-tap">タップ！</div>
    </div>`;
  document.getElementById('capEl').addEventListener('click',openCapsule,{once:true});
}
function openCapsule(){
  const cap=document.getElementById('capEl');
  if(cap)cap.className='capsule shake';
  beep(440,.1,'triangle');setTimeout(()=>beep(660,.1,'triangle'),120);setTimeout(()=>beep(880,.12,'triangle'),240);
  setTimeout(revealGacha,650);
}
function revealGacha(){
  const base=gachaPending.points;
  const streak=(typeof calcStreak==='function')?calcStreak():0;
  const bonus=Math.min(streak,20)*2;
  const points=base+bonus;
  state.points+=points;state.totalEarned=(state.totalEarned||0)+points;
  state.badges=state.badges||[];var newBadge=null;
  MILESTONES.forEach(function(m){if(state.totalEarned>=m.pt&&state.badges.indexOf(m.id)<0){state.badges.push(m.id);newBadge=m;}});
  state.gachaLog[state.today]={points,ts:Date.now()};
  save();
  beep(523,.15,'square');setTimeout(()=>beep(784,.15,'square'),130);setTimeout(()=>beep(1047,.25,'square'),260);
  const big=base>=70,canEx=state.points>=1000;
  document.getElementById('gachaInner').innerHTML=`
    <div class="gacha-step">
      <div class="gacha-h">🎉 カプセル、ぱかっ！</div>
      <div class="cap-open">🪙</div>
      <div class="gacha-result">${points} ポイント！${big?' 🎉':''}</div>
      ${bonus>0?'<div class="gacha-sub" style="color:#c9760a;font-weight:800;margin-top:4px">🔥 れんしょうボーナス +'+bonus+'pt（'+streak+'日れんしょう）</div>':''}
      <div class="gacha-total">いまのポイント → <b>${state.points} pt</b></div>
      ${newBadge?'<div class="gacha-sub" style="margin-top:10px;color:#bb750a;font-weight:800">'+newBadge.e+' 新しい称号「'+newBadge.t+'」ゲット！</div>':''}
      ${canEx?'<div class="gacha-sub" style="margin-top:12px;color:#1e7a44">🎁 1000pt貯まった！「ポイント」タブで1,000円と交換できるよ</div>':''}
      <button class="gacha-btn" id="gachaClose">やったー！とじる</button>
    </div>`;
  sparks(window.innerWidth/2,window.innerHeight/2,big?34:18,big?['#e0a012','#f5a623','#2ea556','#dd5049']:['#f5a623','#2ea556','#dd5049']);
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

// ===== 選択式セット共通エンジン（資料・社会／考える算数） =====
let csState=null;
function recordStat(key,ok){state.stats=state.stats||{};state.stats[key]=state.stats[key]||{c:0,w:0};if(ok)state.stats[key].c++;else state.stats[key].w++;save();}
function markReview(key,idx){if(idx==null)return;state.review=state.review||{};const m=(state.review[key]=state.review[key]||{});if(m[idx]==null){m[idx]=Date.now()+3*24*60*60*1000;save();}}
function pickIdx(key,len){
  state.recent=state.recent||{};if(!Array.isArray(state.recent[key]))state.recent[key]=[];
  const rec=state.recent[key];
  // 復習：3日以上前にまちがえたセットがあれば優先的に再出題
  const rv=(state.review&&state.review[key])||{};
  const due=Object.keys(rv).map(Number).filter(i=>i<len&&rv[i]<=Date.now()&&rec.indexOf(i)<0);
  let idx;
  if(due.length){idx=due[Math.floor(Math.random()*due.length)];delete state.review[key][idx];}
  else{
    let cand=[];for(let i=0;i<len;i++)if(rec.indexOf(i)<0)cand.push(i);
    if(!cand.length){cand=[];for(let i=0;i<len;i++)cand.push(i);}
    idx=cand[Math.floor(Math.random()*cand.length)];
  }
  rec.push(idx);const cap=Math.max(3,Math.floor(len/2));while(rec.length>cap)rec.shift();
  state.recent[key]=rec;save();return idx;
}
function csGate(){
  if(!csState)return;
  const need=csState.cfg.qs.length+1,got=Object.keys(csState.answered).length+(csState.fin?1:0);
  const ok=got>=need,btn=document.getElementById('csDone');
  if(btn){btn.disabled=!ok;btn.textContent=ok?csState.cfg.doneOK:csState.cfg.doneWait;}
}
function csAnswerQ(qi,ci){
  if(!csState||csState.answered[qi])return;
  const box=document.querySelector('.cs-choices[data-qi="'+qi+'"]');if(!box)return;
  const q=csState.cfg.qs[qi],c=q.choices[ci],btns=box.querySelectorAll('.choice-btn');
  csState.tries[qi]=(csState.tries[qi]||0)+1;const first=csState.tries[qi]===1;
  if(c.ok){
    if(first)recordStat(csState.cfg.statKey,true);
    btns.forEach((b,i)=>{if(q.choices[i].ok){b.classList.add('correct');if(!b.querySelector('.choice-comment')){const cm=document.createElement('div');cm.className='choice-comment';cm.textContent='✓ せいかい！';b.appendChild(cm);}}b.disabled=true;});
    btns[ci].classList.add('chosen-outline');
    document.querySelector('.cs-reply[data-qi="'+qi+'"]').innerHTML='<div class="sensei-reply" style="margin-top:8px"><div class="sr-body">🎉 '+rubyize(q.a)+'</div></div>';
    csState.answered[qi]=true;celebrate();
  }else{
    if(first){recordStat(csState.cfg.statKey,false);markReview(csState.cfg.statKey,csState.cfg.setIdx);}
    btns[ci].classList.add('wrong');btns[ci].disabled=true;
    if(csState.tries[qi]>=2){
      btns.forEach((b,i)=>{if(q.choices[i].ok){b.classList.add('correct');if(!b.querySelector('.choice-comment')){const cm=document.createElement('div');cm.className='choice-comment';cm.textContent='✓ こたえはこれ';b.appendChild(cm);}}b.disabled=true;});
      document.querySelector('.cs-reply[data-qi="'+qi+'"]').innerHTML='<div class="sensei-reply" style="margin-top:8px"><div class="sr-body">'+rubyize(q.a)+'</div></div>';
      csState.answered[qi]=true;
    }else{
      document.querySelector('.cs-reply[data-qi="'+qi+'"]').innerHTML='<div class="cs-retry">うーん、もう一度考えてみよう！</div>';
    }
  }
  csGate();
}
function csAnswerFinal(ci){
  if(!csState||csState.fin)return;
  const box=document.getElementById('csFinChoices');if(!box)return;
  const fin=csState.cfg.fin,c=fin.choices[ci],btns=box.querySelectorAll('.choice-btn');
  csState.finTries=(csState.finTries||0)+1;const first=csState.finTries===1;
  const reveal=function(){btns.forEach((b,i)=>{if(fin.choices[i].ok){b.classList.add('correct');if(!b.querySelector('.choice-comment')){const cm=document.createElement('div');cm.className='choice-comment';cm.textContent='✓ なるほど！';b.appendChild(cm);}}b.disabled=true;});document.getElementById('csFinReply').innerHTML='<div class="sensei-reply"><div class="sr-head">'+fin.head+'</div><div class="sr-body">'+rubyize(fin.a)+'</div></div>';csState.fin=true;};
  if(c.ok){if(first)recordStat(csState.cfg.statKey,true);btns[ci].classList.add('chosen-outline');reveal();celebrate();}
  else{if(first){recordStat(csState.cfg.statKey,false);markReview(csState.cfg.statKey,csState.cfg.setIdx);}btns[ci].classList.add('wrong');btns[ci].disabled=true;
    if(csState.finTries>=2){reveal();}else{document.getElementById('csFinReply').innerHTML='<div class="cs-retry">もう一度、いちばん近いものを考えてみよう！</div>';}}
  csGate();
}
function renderChoiceSet(cfg){
  csState={cfg:cfg,answered:{},fin:false,tries:{},finTries:0};
  const qsHtml=cfg.qs.map((q,qi)=>'<div class="q-item" style="margin-top:14px"><div class="qq">'+cfg.qIcon+'（'+(qi+1)+'）'+rubyize(q.q)+'</div><div class="cs-choices" data-qi="'+qi+'"></div><div class="cs-reply" data-qi="'+qi+'"></div></div>').join('');
  document.getElementById('screenInner').innerHTML=
   '<div class="screen show" style="position:static;display:flex;">'+
    '<div class="scr-head"><div class="x" onclick="closeScreen()">✕</div><div><div class="ht">'+cfg.label+'</div><div class="hs">'+cfg.hs+'</div></div></div>'+
    '<div class="scr-body">'+
      '<div class="ai-card"><div class="ai-label">'+cfg.topLabel+'</div>'+cfg.topHTML+'</div>'+
      qsHtml+
      '<div class="q-item" style="margin-top:18px"><div class="qq">🤔 '+rubyize(cfg.fin.q)+'</div><div class="q-note">'+cfg.fin.note+'</div><div id="csFinChoices"></div><div id="csFinReply"></div></div>'+
    '</div>'+
    '<div class="scr-foot"><button class="btn btn-green" id="csDone" disabled>'+cfg.doneWait+'</button></div>'+
   '</div>';
  cfg.qs.forEach((q,qi)=>{const box=document.querySelector('.cs-choices[data-qi="'+qi+'"]');q.choices.forEach((c,ci)=>{const b=document.createElement('button');b.className='choice-btn';b.innerHTML='<div class="choice-row"><span class="choice-mark">'+'ABC'[ci]+'</span><span class="choice-text">'+rubyize(c.t)+'</span></div>';b.addEventListener('click',()=>csAnswerQ(qi,ci));box.appendChild(b);});});
  const fb=document.getElementById('csFinChoices');cfg.fin.choices.forEach((c,ci)=>{const b=document.createElement('button');b.className='choice-btn';b.innerHTML='<div class="choice-row"><span class="choice-mark">'+'ABC'[ci]+'</span><span class="choice-text">'+rubyize(c.t)+'</span></div>';b.addEventListener('click',()=>csAnswerFinal(ci));fb.appendChild(b);});
  document.getElementById('csDone').addEventListener('click',()=>{finishActivity(cfg.id);});
}
function srTable(rows){return '<table class="sr-table"><tbody>'+rows.map(r=>'<tr><th>'+rubyize(r.l)+'</th><td>'+rubyize(r.v)+'</td></tr>').join('')+'</tbody></table>';}
function renderShiryo(){
  const pool=(typeof SHIRYO!=='undefined')?SHIRYO:[];if(!pool.length){closeScreen();return;}
  const _i=pickIdx('shiryo',pool.length),item=pool[_i];
  renderChoiceSet({id:'shiryo',statKey:'shiryo',setIdx:_i,label:'📊 資料・社会（読みとり）',hs:item.title,topLabel:'📋 資料を読もう',
    topHTML:'<div style="font-size:13px;color:#33414f;margin-bottom:8px">'+rubyize(item.intro||'')+'</div>'+srTable(item.rows),
    qIcon:'📊',qs:item.qs,
    fin:{q:item.why.q,note:'「いちばん近い考え」をえらぼう。えらぶと、理由の言い方の見本が出るよ。',choices:item.why.choices,a:item.why.a,head:'💡 理由の言い方（見本）'},
    doneWait:'えらんでからクリア ⚾',doneOK:'読みとれた！クリア ⚾'});
}
function renderSansu(){
  const pool=(typeof SANSU!=='undefined')?SANSU:[];if(!pool.length){closeScreen();return;}
  const _i=pickIdx('sansu',pool.length),item=pool[_i];
  let top='<div style="font-size:13.5px;color:#33414f;line-height:1.85">'+rubyize(item.intro||'')+'</div>';
  if(item.rows&&item.rows.length)top+='<div style="margin-top:8px">'+srTable(item.rows)+'</div>';
  renderChoiceSet({id:'sansu',statKey:'sansu',setIdx:_i,label:'🧮 考える算数',hs:item.title,topLabel:'🧩 もんだい',
    topHTML:top,qIcon:'🧮',qs:item.qs,
    fin:{q:item.how.q,note:'「考え方」としていちばん正しいものをえらぼう。えらぶと、式や手順の見本が出るよ。',choices:item.how.choices,a:item.how.a,head:'💡 考え方（見本）'},
    doneWait:'えらんでからクリア ⚾',doneOK:'考えぬいた！クリア ⚾'});
}
function renderRika(){
  const pool=(typeof RIKA!=='undefined')?RIKA:[];if(!pool.length){closeScreen();return;}
  const _i=pickIdx('rika',pool.length),item=pool[_i];
  let top='<div style="font-size:13.5px;color:#33414f;line-height:1.85">'+rubyize(item.intro||'')+'</div>';
  if(item.rows&&item.rows.length)top+='<div style="margin-top:8px">'+srTable(item.rows)+'</div>';
  renderChoiceSet({id:'rika',statKey:'rika',setIdx:_i,label:'🔬 理科の観察・実験',hs:item.title,topLabel:'🔍 観察・実験',
    topHTML:top,qIcon:'🔬',qs:item.qs,
    fin:{q:item.how.q,note:'「なぜ？」にいちばん近い説明をえらぼう。えらぶと、説明の見本が出るよ。',choices:item.how.choices,a:item.how.a,head:'💡 なぜ？の説明（見本）'},
    doneWait:'えらんでからクリア ⚾',doneOK:'わかった！クリア ⚾'});
}
// ===== 国語（読む・書く）セット =====
let kokuState=null;
function pickKokugo(){
  const pool=(typeof KOKUGO!=='undefined')?KOKUGO:[];if(!pool.length)return null;
  const idx=pickIdx('kokugo',pool.length);
  return {item:pool[idx],idx:idx};
}
function recordKokugo(ok){state.stats=state.stats||{};state.stats.kokugo=state.stats.kokugo||{c:0,w:0};if(ok)state.stats.kokugo.c++;else state.stats.kokugo.w++;save();}
function kokuGate(){
  if(!kokuState)return;
  const need=kokuState.item.qs.length,got=Object.keys(kokuState.answered).length;
  const ok=(got>=need)&&kokuState.wrote;
  const btn=document.getElementById('kokuDone');if(btn){btn.disabled=!ok;btn.textContent=ok?'読んで・考えた！クリア ⚾':'こたえてからクリア ⚾';}
}
function kokuAnswer(qi,ci){
  if(!kokuState||kokuState.answered[qi])return;
  const box=document.querySelector('.kq-choices[data-qi="'+qi+'"]');if(!box)return;
  const q=kokuState.item.qs[qi],c=q.choices[ci],btns=box.querySelectorAll('.choice-btn');
  kokuState.tries[qi]=(kokuState.tries[qi]||0)+1;const first=kokuState.tries[qi]===1;
  if(c.ok){
    if(first)recordKokugo(true);
    btns.forEach((b,i)=>{if(q.choices[i].ok){b.classList.add('correct');if(!b.querySelector('.choice-comment')){const cm=document.createElement('div');cm.className='choice-comment';cm.textContent='✓ せいかい！';b.appendChild(cm);}}b.disabled=true;});
    btns[ci].classList.add('chosen-outline');
    document.querySelector('.kq-reply[data-qi="'+qi+'"]').innerHTML='<div class="sensei-reply" style="margin-top:8px"><div class="sr-body">🎉 '+rubyize(q.a)+'</div></div>';
    kokuState.answered[qi]=true;celebrate();
  }else{
    if(first){recordKokugo(false);markReview('kokugo',kokuState.setIdx);}
    btns[ci].classList.add('wrong');btns[ci].disabled=true;
    if(kokuState.tries[qi]>=2){
      btns.forEach((b,i)=>{if(q.choices[i].ok){b.classList.add('correct');if(!b.querySelector('.choice-comment')){const cm=document.createElement('div');cm.className='choice-comment';cm.textContent='✓ こたえはこれ';b.appendChild(cm);}}b.disabled=true;});
      document.querySelector('.kq-reply[data-qi="'+qi+'"]').innerHTML='<div class="sensei-reply" style="margin-top:8px"><div class="sr-body">'+rubyize(q.a)+'</div></div>';
      kokuState.answered[qi]=true;
    }else{
      document.querySelector('.kq-reply[data-qi="'+qi+'"]').innerHTML='<div class="cs-retry">うーん、もう一度考えてみよう！</div>';
    }
  }
  kokuGate();
}
function renderKokugo(picked){
  if(!picked){closeScreen();return;}
  const item=picked.item;kokuState={item:item,answered:{},wrote:false,tries:{},setIdx:picked.idx};
  const qsHtml=item.qs.map((q,qi)=>'<div class="q-item" style="margin-top:14px"><div class="qq">📝（'+(qi+1)+'）'+rubyize(q.q)+'</div><div class="kq-choices" data-qi="'+qi+'"></div><div class="kq-reply" data-qi="'+qi+'"></div></div>').join('');
  const tmplH=item.write.tmpl?('<div class="tmpl-box">'+rubyize(item.write.tmpl)+'</div>'):'';
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head"><div class="x" onclick="closeScreen()">✕</div><div><div class="ht">📕 国語（読む・書く）</div><div class="hs">${item.title}</div></div></div>
    <div class="scr-body">
      <div class="ai-card"><div class="ai-label">📖 文章を読もう（声に出してもOK）</div><div class="ai-story">${rubyize((item.passage||'').replace(/\n/g,'<br>'))}</div></div>
      ${qsHtml}
      <div class="q-item" style="margin-top:16px">
        <div class="qq">✍️ ${rubyize(item.write.q)}</div>
        <div class="q-note">下の「型」を使って、自分のことばで書こう（40〜60字を目あすに。長く書けたら花丸！）。むずかしければ「見本」を見てね。</div>
        ${tmplH}
        <textarea class="answer-area" id="kokuWrite" placeholder="自分のことばで書こう（必須）"></textarea>
        <div id="kokuCount" class="char-count">いま 0字</div>
        <button class="btn btn-ghost btn-sm" id="kokuEx" style="margin-top:8px">📑 見本を見る</button>
        <div id="kokuExBox"></div>
      </div>
    </div>
    <div class="scr-foot"><button class="btn btn-green" id="kokuDone" disabled>こたえてからクリア ⚾</button></div>
   </div>`;
  item.qs.forEach((q,qi)=>{
    const box=document.querySelector('.kq-choices[data-qi="'+qi+'"]');
    q.choices.forEach((c,ci)=>{const b=document.createElement('button');b.className='choice-btn';b.innerHTML='<div class="choice-row"><span class="choice-mark">'+'ABC'[ci]+'</span><span class="choice-text">'+rubyize(c.t)+'</span></div>';b.addEventListener('click',()=>kokuAnswer(qi,ci));box.appendChild(b);});
  });
  const wt=document.getElementById('kokuWrite');
  wt.addEventListener('input',()=>{const v=wt.value.trim();const uniq=new Set(v.replace(/\s/g,'')).size;kokuState.wrote=(v.length>=6&&uniq>=3);const cc=document.getElementById('kokuCount');if(cc)cc.textContent='いま '+v.length+'字';kokuGate();});
  document.getElementById('kokuEx').addEventListener('click',()=>{document.getElementById('kokuExBox').innerHTML='<div class="sensei-reply"><div class="sr-head">📑 こんなふうに書けたら花丸！</div><div class="sr-body">'+(item.write.ex||[]).map(e=>rubyize(e)).join('\n\n')+'</div></div>';});
  document.getElementById('kokuDone').addEventListener('click',()=>{
    const ans=document.getElementById('kokuWrite').value.trim();
    addLog('国語（読む・書く）',item.title+'：'+stripRuby(item.write.q),ans,'見本：'+(item.write.ex&&item.write.ex[0]?stripRuby(item.write.ex[0]):''));
    finishActivity('kokugo');
  });
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
  else if(id==='kokugo'){renderKokugo(pickKokugo());}
  else if(id==='shiryo'){renderShiryo();}
  else if(id==='sansu'){renderSansu();}
  else if(id==='rika'){renderRika();}
  else if(QUIZZES[id]){openQuiz(id);}
}
function finishActivity(id){closeScreen();completeQuest(id);}
function closeScreen(){document.getElementById('screen').classList.remove('show');document.getElementById('screenInner').innerHTML='';}

// ===== ことば・教養クイズ（漢字/都道府県/ニュース/単位/ことわざ 共通） =====
let quizState=null;
function graphHTML(item){
  const vals=item.data.map(d=>d.v);const max=Math.max.apply(null,vals)||1;
  const bars=item.data.map(d=>{const h=Math.round(d.v/max*120)+6;return `<div class="gbar-col"><div class="gbar-val">${d.v}</div><div class="gbar" style="height:${h}px"></div><div class="gbar-lbl">${d.l}</div></div>`;}).join('');
  return `<div class="gtitle">${item.title}${item.unit?'（'+item.unit+'）':''}</div><div class="gchart">${bars}</div>`;
}
function openQuiz(id){
  const def=QUIZZES[id];const pool=(def&&def.pool)||[];
  if(!pool.length){closeScreen();return;}
  const rk='quiz_'+id;state.recent=state.recent||{};if(!Array.isArray(state.recent[rk]))state.recent[rk]=[];
  const recent=state.recent[rk];
  state.weakQuiz=state.weakQuiz||{};const weak=(state.weakQuiz[id]||[]).filter(i=>i<pool.length);
  let idx;
  if(weak.length&&Math.random()<0.45){idx=weak[Math.floor(Math.random()*weak.length)];}
  else{let cand=[];for(let i=0;i<pool.length;i++)if(recent.indexOf(i)<0)cand.push(i);if(!cand.length)cand=pool.map((_,i)=>i);idx=cand[Math.floor(Math.random()*cand.length)];}
  recent.push(idx);const cap=Math.max(4,Math.floor(pool.length/2));while(recent.length>cap)recent.shift();
  state.recent[rk]=recent;save();
  quizState={id,def,item:pool[idx],idx:idx};renderQuiz();
}
function renderQuiz(){
  const def=quizState.def,item=quizState.item;
  document.getElementById('screenInner').innerHTML=`
   <div class="screen show" style="position:static;display:flex;">
    <div class="scr-head"><div class="x" onclick="closeScreen()">✕</div>
      <div><div class="ht">${def.title}</div><div class="hs">${def.sub}</div></div></div>
    <div class="scr-body">
      <div class="ai-card">${item.data?graphHTML(item):''}<div class="ai-label"${item.data?' style="margin-top:12px"':''}>❓ もんだい</div>
        <div style="font-size:17px;line-height:1.85;font-weight:700;color:#1c2c44">${rubyize(item.q)}</div></div>
      <div class="sec-sub" style="margin-top:14px">どれだと思う？ タップしてえらぼう（まちがえても大丈夫！）</div>
      <div id="quizChoices"></div>
      <div id="quizReply"></div>
    </div>
    <div class="scr-foot" id="quizFoot"></div>
   </div>`;
  const cbox=document.getElementById('quizChoices');
  item.choices.forEach((c,idx)=>{
    const b=document.createElement('button');b.className='choice-btn';b.dataset.idx=idx;
    b.innerHTML=`<div class="choice-row"><span class="choice-mark">${'ABC'[idx]}</span><span class="choice-text">${rubyize(c.t)}</span></div>`;
    b.addEventListener('click',()=>revealQuiz(idx));
    cbox.appendChild(b);
  });
}
function revealQuiz(sel){
  if(document.querySelector('#quizChoices .choice-btn.correct'))return;
  const id=quizState.id,def=quizState.def,item=quizState.item;
  document.querySelectorAll('#quizChoices .choice-btn').forEach((b,i)=>{
    const c=item.choices[i];b.classList.add(c.ok?'correct':'wrong');
    if(i===sel)b.classList.add('chosen-outline');
    if(c.ok&&!b.querySelector('.choice-comment')){const cm=document.createElement('div');cm.className='choice-comment';cm.textContent='✓ せいかい！';b.appendChild(cm);}
    b.disabled=true;
  });
  const ok=!!item.choices[sel].ok;
  recordQuiz(id,ok);
  const head=ok?`🎉 ${praise()} せいかい！`:`🎉 ${praise()} おしい！ おぼえておこう`;
  document.getElementById('quizReply').innerHTML=`<div class="sensei-reply"><div class="sr-head">${head}</div><div class="sr-body">${rubyize(item.a)}</div></div>`;
  document.getElementById('quizFoot').innerHTML=`<button class="btn btn-green" onclick="finishActivity('${id}')">クエストクリア！ ⚾</button>`;
  addLog(def.title,item.q,'えらんだ：'+item.choices[sel].t,'答え：'+stripRuby(item.a));
}
function recordQuiz(id,ok){
  state.stats=state.stats||{};state.stats.quiz=state.stats.quiz||{};
  const o=state.stats.quiz[id]||(state.stats.quiz[id]={c:0,w:0});
  if(ok)o.c++;else o.w++;
  state.weakQuiz=state.weakQuiz||{};const w=state.weakQuiz[id]||(state.weakQuiz[id]=[]);
  const qi=(quizState&&typeof quizState.idx==='number')?quizState.idx:-1;
  if(qi>=0){if(ok){const p=w.indexOf(qi);if(p>=0)w.splice(p,1);}else if(w.indexOf(qi)<0)w.push(qi);}
  save();
}

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
  const bb=document.getElementById('badgeBox');
  if(bb){
    const tot=state.totalEarned||0,earned=state.badges||[];
    const got=MILESTONES.filter(m=>earned.indexOf(m.id)>=0);
    const next=MILESTONES.find(m=>tot<m.pt);
    let bh='<div class="badge-h">🏅 あつめた称号（合計 '+tot+'pt）</div>';
    bh+=got.length?('<div class="badge-row">'+got.map(m=>'<span class="badge-chip">'+m.e+' '+m.t+'</span>').join('')+'</div>'):'<div class="sec-sub">ガチャをまわすと、合計ポイントに応じて称号がもらえるよ。</div>';
    if(next)bh+='<div class="sec-sub" style="margin-top:6px">つぎの称号：'+next.e+' '+next.t+'（あと '+(next.pt-tot)+'pt）</div>';
    bb.innerHTML=bh;
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

function renderBackup(){
  const a=document.getElementById('backupArea');if(!a)return;
  if(a.dataset.mode!=='restore'){a.value=store.get('kudan-state-v5')||JSON.stringify(state);}
}
function applyTextSize(){document.body.classList.toggle('big-ui',!!(state.settings&&state.settings.bigText));}
function renderSettings(){
  const sb=document.getElementById('setSound'),tb=document.getElementById('setText');
  if(sb)sb.textContent=(state.settings&&state.settings.sound!==false)?'🔊 音：オン':'🔇 音：オフ';
  if(tb)tb.textContent=(state.settings&&state.settings.bigText)?'🔤 文字：大きめ':'🔤 文字：標準';
}
// ===== きろく =====
function renderRecord(){
  const keys=Object.keys(state.history);const live=Object.values(state.checks).filter(Boolean).length;
  const full=keys.filter(k=>state.history[k].count===5&&k!==state.today).length+(live===5?1:0);
  document.getElementById('stTotal').textContent=full;
  document.getElementById('stBest').textContent=bestStreak();
  document.getElementById('stYen').textContent=(state.money||0)+(state.points||0);
  {let sc=0,sn=0;['kokugo','shiryo','sansu','rika'].forEach(function(k){const st=state.stats&&state.stats[k];if(st){sc+=(st.c||0);sn+=(st.c||0)+(st.w||0);}});const el=document.getElementById('stAcc');if(el)el.textContent=sn?Math.round(sc/sn*100)+'%':'--';}
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
  renderWeekly();
  renderSubjectStats();
  renderInsights();
  renderNigate();
}
function pct(c,w){const t=c+w;return t===0?null:Math.round(c/t*100);}
function barColor(p){return p>=80?'var(--hit)':p>=50?'#e0a012':'#dd5049';}
function renderSubjectStats(){
  const box=document.getElementById('subjectStats');if(!box)return;
  const defs=[['kokugo','📕 国語'],['shiryo','📊 資料社会'],['sansu','🧮 算数'],['rika','🔬 理科']];
  const cards=defs.map(function(d){
    const k=d[0],label=d[1];const st=state.stats&&state.stats[k];const n=st?((st.c||0)+(st.w||0)):0;
    if(!n)return '<div class="subj-card subj-none"><div class="subj-l">'+label+'</div><div class="subj-p">--</div><div class="subj-n">まだ</div></div>';
    const acc=Math.round(st.c/n*100);const cls=acc>=80?'good':(acc>=50?'mid':'low');
    return '<div class="subj-card subj-'+cls+'"><div class="subj-l">'+label+'</div><div class="subj-p">'+acc+'%</div><div class="subj-n">'+n+'問</div></div>';
  }).join('');
  box.innerHTML='<div class="sec-title" style="margin-top:22px">教科べつ せいとう率</div><div class="sec-sub">「最初の1回」の正答率（保護者むけ）。低い教科のまちがえた問題は、数日後に自動で再出題されます。</div><div class="subj-grid">'+cards+'</div>';
}
function renderWeekly(){
  const box=document.getElementById('weeklyBox');if(!box)return;
  let daysActive=0,daysFull=0,weekPts=0;
  for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);const k=ymd(d);
    let c=0;if(k===state.today)c=Object.values(state.checks).filter(Boolean).length;else if(state.history[k])c=state.history[k].count;
    if(c>0)daysActive++;if(c===5)daysFull++;
    const g=state.gachaLog[k];if(g)weekPts+=(g.points!=null?g.points:(g.money||0));}
  const streak=calcStreak();
  let weak=null;
  function consider(label,c,w){const n=c+w;if(n>=3){const acc=Math.round(c/n*100);if(!weak||acc<weak.acc)weak={label:label,acc:acc,n:n};}}
  const calc=state.stats.calc||{};Object.keys(calc).forEach(k=>consider('計算の「'+k+'」',calc[k].c,calc[k].w));
  const TH={baseball:'野球・スポーツ',nature:'生き物・宇宙',mecha:'のりもの・メカ',history:'歴史・冒険',kurashi:'くらしの理科'};
  const sci=state.stats.sci||{};Object.keys(sci).forEach(k=>consider('理科社会の「'+(TH[k]||k)+'」',sci[k].c,sci[k].w));
  const QL={q_kanji:'漢字',q_kenmin:'都道府県',q_news:'ニュースの言葉',q_units:'たんい',q_kotowaza:'ことわざ',q_graph:'資料・グラフ'};
  const qz=state.stats.quiz||{};Object.keys(qz).forEach(k=>consider((QL[k]||k)+'クイズ',qz[k].c,qz[k].w));
  if(state.stats.kokugo)consider('国語の読み取り',state.stats.kokugo.c,state.stats.kokugo.w);
  if(state.stats.shiryo)consider('資料の読みとり',state.stats.shiryo.c,state.stats.shiryo.w);
  if(state.stats.sansu)consider('考える算数',state.stats.sansu.c,state.stats.sansu.w);
  if(state.stats.rika)consider('理科の観察',state.stats.rika.c,state.stats.rika.w);
  let comment;
  if(daysActive===0)comment='今週はまだ取り組みがありません。まずは1つのクエストから、いっしょに始めてみましょう。';
  else if(daysFull>=5)comment='今週はすばらしいペース！毎日の習慣がしっかり身についています。';
  else if(daysFull>=3)comment='いいペースで続いています。あと少しで「毎日クリア」も見えてきました。';
  else comment='少しずつ進んでいます。短い時間でも、毎日つづけることが力になります。';
  let html='<div class="weekly"><div class="wk-h">📅 今週のまとめ（保護者用）</div><div class="wk-grid">'
    +'<div class="wk-cell"><div class="wk-n">'+daysActive+'<span>日</span></div><div class="wk-l">取り組んだ日</div></div>'
    +'<div class="wk-cell"><div class="wk-n">'+daysFull+'<span>日</span></div><div class="wk-l">5つ全クリア</div></div>'
    +'<div class="wk-cell"><div class="wk-n">'+streak+'<span></span></div><div class="wk-l">いまの連勝🔥</div></div>'
    +'<div class="wk-cell"><div class="wk-n">'+weekPts+'<span>pt</span></div><div class="wk-l">今週のpt</div></div></div>';
  if(weak)html+='<div class="wk-weak">いま、もう一歩 → <b>'+weak.label+'</b>（正答率 '+weak.acc+'％・'+weak.n+'回）</div>';
  html+='<div class="wk-comment">'+comment+'</div></div>';
  box.innerHTML=html;
}
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

  // --- ことば・教養クイズ：正答率 ---
  const qz=state.stats.quiz||{};const QL={q_kanji:'🈶 漢字',q_kenmin:'🗾 都道府県',q_news:'📰 ニュースの言葉',q_units:'📏 たんい',q_kotowaza:'💬 ことわざ・慣用句',q_graph:'📊 資料・グラフ'};
  const qzKeys=Object.keys(QL).filter(k=>qz[k]&&(qz[k].c+qz[k].w)>0);
  html+=`<div class="ins-card"><div class="ins-h">🧠 ことば・教養クイズ（正答率）</div>`;
  if(!qzKeys.length){html+=`<div class="ins-empty">まだクイズのきろくがありません。日替わりで出るクイズをやってみよう！</div>`;}
  else{qzKeys.forEach(k=>{const o=qz[k];const tot=o.c+o.w;const p=pct(o.c,o.w);html+=`<div class="ins-row"><div class="ins-label">${QL[k]}</div><div class="ins-track"><div class="ins-fill" style="width:${p}%;background:${barColor(p)}"></div></div><div class="ins-val">${p}%<span class="ins-n">(${tot}問)</span></div></div>`;});}
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
    if(t.dataset.tab==='plan'){renderBackup();renderSettings();}
  });
});

let actx=null;
function beep(freq,dur,type='sine',vol=.15){
  if(state.settings&&state.settings.sound===false)return;
  try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=freq;
    o.connect(g);g.connect(actx.destination);g.gain.setValueAtTime(vol,actx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+dur);o.start();o.stop(actx.currentTime+dur);}catch(e){}
}
function sparks(x,y,n,colors){
  const b=document.getElementById('burst');if(!b)return;
  for(let i=0;i<n;i++){
    const s=document.createElement('div');s.className='spark';s.style.background=colors[i%colors.length];
    s.style.left=x+'px';s.style.top=y+'px';
    const ang=Math.random()*Math.PI*2,vel=70+Math.random()*150;
    const dx=Math.cos(ang)*vel,dy=Math.sin(ang)*vel-50;
    s.style.setProperty('--dx',dx.toFixed(0)+'px');
    s.style.setProperty('--dy',(dy+200).toFixed(0)+'px');
    s.style.setProperty('--rot',(Math.random()*620).toFixed(0)+'deg');
    s.style.animationDuration=(1+Math.random()*0.6).toFixed(2)+'s';
    b.appendChild(s);
    setTimeout(()=>{if(s.parentNode)s.parentNode.removeChild(s);},1800);
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
    state={today:todayKey(),checks:{},history:{},calcTier:1,calcStats:{correct:0,wrong:0},sakubunDone:0,log:[],money:0,points:0,totalEarned:0,badges:[],weakQuiz:{},settings:{sound:true,bigText:false},exchanges:[],cards:{},gachaLog:{},review:{},seen:{read:[],write:[],sci:[]},recent:{read:[],write:[],sci:[]},stats:{calc:{},sci:{},read:{},write:{},quiz:{}},weak:{calc:[],sci:[]}};
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
(function(){
  var area=document.getElementById('backupArea'),copyBtn=document.getElementById('backupCopy'),restBtn=document.getElementById('restoreBtn'),msg=document.getElementById('backupMsg');
  if(!area||!copyBtn||!restBtn)return;
  copyBtn.addEventListener('click',function(){
    area.dataset.mode='';area.value=store.get('kudan-state-v5')||JSON.stringify(state);restBtn.textContent='⏪ 貼り付けて復元';
    area.removeAttribute('readonly');area.focus();area.select();try{area.setSelectionRange(0,999999);}catch(e){}
    var ok=false;try{ok=document.execCommand('copy');}catch(e){}
    if(!ok&&navigator.clipboard){try{navigator.clipboard.writeText(area.value);ok=true;}catch(e){}}
    area.setAttribute('readonly','');if(msg)msg.textContent=ok?'📋 コピーしました！メモやメールに貼って保存してね。':'コピーできないときは、わくを長押しして「すべて選択→コピー」してね。';
  });
  restBtn.addEventListener('click',function(){
    if(area.dataset.mode!=='restore'){
      area.dataset.mode='restore';area.removeAttribute('readonly');area.value='';area.setAttribute('placeholder','ここにバックアップの文字を貼り付けてね');area.focus();
      restBtn.textContent='✅ 貼り付けたら、これで復元';if(msg)msg.textContent='上のわくに、保存しておいたバックアップを貼り付けてから、もう一度このボタンを押してください。';
    }else{
      var txt=(area.value||'').trim();
      try{
        var obj=JSON.parse(txt);
        if(!obj||typeof obj!=='object'||(!('history'in obj)&&!('checks'in obj)&&!('points'in obj)))throw new Error('bad');
        if(confirm('今の記録を、貼り付けた内容で上書きします。よろしいですか？（元にはもどせません）')){
          store.set('kudan-state-v5',JSON.stringify(obj));alert('復元しました。画面を読み込み直します。');location.reload();
        }
      }catch(e){if(msg)msg.textContent='⚠️ 文字が正しくないようです。バックアップ全体をもう一度貼り付けてください。';}
    }
  });
  renderBackup();
})();
(function(){
  var sb=document.getElementById('setSound'),tb=document.getElementById('setText');
  if(sb)sb.addEventListener('click',function(){state.settings=state.settings||{sound:true,bigText:false};state.settings.sound=!(state.settings.sound!==false);save();renderSettings();if(state.settings.sound)beep(880,.08,'triangle');});
  if(tb)tb.addEventListener('click',function(){state.settings=state.settings||{sound:true,bigText:false};state.settings.bigText=!state.settings.bigText;save();applyTextSize();renderSettings();});
})();
applyTextSize();renderSettings();
wasComplete=Object.values(state.checks).filter(Boolean).length===5;

