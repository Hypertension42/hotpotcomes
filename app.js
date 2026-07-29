const STORAGE_KEY = 'one_spoon';

const AI_PERSONAS = [
  { name: '小王', role: '杠精室友', tags: ['灵魂', '炸弹'], lines: ['这锅太淡了，我来救场', '别急，真正的火候来了', '你们先别懂，懂了就晚了'] },
  { name: '李阿姨', role: '养生奶奶', tags: ['灭火', '养生', '调味'], lines: ['年轻人，要吃点清淡的', '我放一点点，不碍事的', '这锅需要一点体面'] },
  { name: '甜甜', role: '甜品狂魔', tags: ['甜品'], lines: ['火锅为什么不能是甜的？', '我宣布这锅进入下午茶时间', '一点甜，会让锅更勇敢'] },
  { name: '黑哥', role: '黑暗料理界', tags: ['汤底', '炸弹', '灵魂'], lines: ['这才叫真正的火锅...', '边界就是用来加汤底的', '放心，我很有分寸地没分寸'] }
];

const INGREDIENTS = [
  { name: '清水', emoji: '💧', chaos: -10, flavor: 5, dark: 0, tag: '灭火' },
  { name: '盐', emoji: '🧂', chaos: -5, flavor: 10, dark: 0, tag: '调味' },
  { name: '枸杞', emoji: '🔴', chaos: -5, flavor: 15, dark: 5, tag: '养生' },
  { name: '白菜', emoji: '🥬', chaos: 2, flavor: 14, dark: 0, tag: '经典' },
  { name: '豆腐', emoji: '⬜', chaos: 3, flavor: 18, dark: 2, tag: '经典' },
  { name: '土豆片', emoji: '🥔', chaos: 5, flavor: 20, dark: 0, tag: '经典' },
  { name: '毛肚', emoji: '🥩', chaos: 10, flavor: 25, dark: 10, tag: '经典' },
  { name: '鸭血', emoji: '🟥', chaos: 15, flavor: 20, dark: 20, tag: '经典' },
  { name: '虾滑', emoji: '🍤', chaos: 8, flavor: 28, dark: 5, tag: '经典' },
  { name: '肥牛', emoji: '🥓', chaos: 12, flavor: 30, dark: 8, tag: '经典' },
  { name: '午餐肉', emoji: '🥫', chaos: 14, flavor: 22, dark: 12, tag: '经典' },
  { name: 'SSR和牛', emoji: '🥩', chaos: 30, flavor: 40, dark: 15, tag: '豪华' },
  { name: '龙虾', emoji: '🦞', chaos: 25, flavor: 35, dark: 10, tag: '豪华' },
  { name: '松露片', emoji: '🍄', chaos: 24, flavor: 32, dark: 12, tag: '豪华' },
  { name: '金箔', emoji: '✨', chaos: 38, flavor: 2, dark: 22, tag: '豪华' },
  { name: '折耳根', emoji: '🌿', chaos: 50, flavor: -20, dark: 60, tag: '灵魂' },
  { name: '香菜', emoji: '☘️', chaos: 40, flavor: -10, dark: 50, tag: '灵魂' },
  { name: '榴莲', emoji: '🟡', chaos: 60, flavor: -30, dark: 70, tag: '炸弹' },
  { name: '臭豆腐', emoji: '🧊', chaos: 52, flavor: -12, dark: 66, tag: '灵魂' },
  { name: '蓝纹奶酪', emoji: '🧀', chaos: 48, flavor: -15, dark: 58, tag: '灵魂' },
  { name: '冰淇淋', emoji: '🍦', chaos: 45, flavor: -25, dark: 55, tag: '甜品' },
  { name: '珍珠奶茶', emoji: '🧋', chaos: 40, flavor: -20, dark: 50, tag: '甜品' },
  { name: '蛋糕', emoji: '🍰', chaos: 35, flavor: -15, dark: 45, tag: '甜品' },
  { name: '棉花糖', emoji: '☁️', chaos: 37, flavor: -13, dark: 38, tag: '甜品' },
  { name: '巧克力', emoji: '🍫', chaos: 34, flavor: -8, dark: 35, tag: '甜品' },
  { name: '牛奶汤底', emoji: '🥛', chaos: 30, flavor: -10, dark: 40, tag: '汤底' },
  { name: '番茄汤底', emoji: '🍅', chaos: 10, flavor: 20, dark: 5, tag: '汤底' },
  { name: '牛油锅底', emoji: '🌶️', chaos: 20, flavor: 25, dark: 15, tag: '汤底' },
  { name: '椰子汤底', emoji: '🥥', chaos: 26, flavor: 10, dark: 20, tag: '汤底' },
  { name: '咖啡汤底', emoji: '☕', chaos: 44, flavor: -18, dark: 52, tag: '汤底' },
  { name: '薄荷叶', emoji: '🍃', chaos: 28, flavor: -5, dark: 24, tag: '灵魂' },
  { name: '山楂片', emoji: '🍒', chaos: 18, flavor: 10, dark: 8, tag: '调味' }
];

const COMMENTS = {
  '全员放飞': [
    '你们这桌人，嘴上说着“随便吃点”，实际每个人都在挑战火锅底线。',
    '这锅已经不是晚饭，是一次集体信任实验。',
    '建议把这锅申遗，人类不应该忘记这一天。',
    '锅底在沸腾，理智在蒸发。你们配合得像一支临时成立的荒诞乐队。'
  ],
  '一人救锅': [
    '有人试图拯救这锅，但历史证明：一个人的努力，挡不住三个人的野心。',
    '这锅告诉我们：团队中总有一个清醒的人，和一个被清醒的人拖累的团队。',
    '清水进锅那一刻很伟大，可惜旁边已经有人端着榴莲起跑。',
    '救锅者留下了功德，添乱者留下了传说。'
  ],
  '贵族折磨': [
    '高端食材，离谱操作。这锅的价值在于：证明了钱不能买品味。',
    'SSR和牛遇到了折耳根，这是美食界的《罗密欧与朱丽叶》——悲剧。',
    '这锅每一口都很贵，但没有一口像是经过同意。',
    '它看起来像消费升级，闻起来像价值观分歧。'
  ],
  '极限': [
    '这锅已经超越了“能不能吃”的范畴，进入了“应不应该存在”的哲学领域。',
    '如果这锅有灵魂，它一定在哭泣。如果它有胃，它一定在反刍。',
    '锅开了，大家也都想开了。',
    '这不是火锅，这是咕嘟作响的群体即兴剧。'
  ],
  '奶茶火锅宇宙': [
    '有人把饭局开成了甜品站，锅底本人还没来得及发表意见。',
    '这锅不能配蘸料，只能配吸管和沉默。',
    '冰与热达成协议：谁也不放过谁。'
  ],
  '灵魂出窍': [
    '它的味道不在锅里，在所有人的记忆深处徘徊。',
    '这锅一开，隔壁桌的灵魂都坐直了。',
    '有些食材不是为了吃，是为了证明存在感。'
  ],
  '普通': [
    '这锅暂时还能解释，但已经有了不解释的潜力。',
    '表面风平浪静，锅底暗潮咕嘟。',
    '普通只是暂时的，下一勺才是命运。'
  ]
};

const SHARE_COPIES = [
  '这锅不能吃，但很适合发给那个总是和你唱反调的人。',
  '来看看我们这桌到底谁最不做人。',
  '我和小王又搞砸了一锅，来看。',
  '这锅离谱到 XX% 了，来加最后一勺！',
  '你不来加一勺，这锅就要被 AI 说了算。'
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const choice = (items) => items[Math.floor(Math.random() * items.length)];

let selectedIngredient = null;
let selectedPreset = '甜品';
let aiTimer = null;
let currentDeck = [];

function createPot() {
  const persona = choice(AI_PERSONAS);
  return {
    id: `pot_${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'cooking',
    ingredients: [],
    chaosLevel: Math.floor(42 + Math.random() * 22),
    flavorLevel: Math.floor(18 + Math.random() * 22),
    darkLevel: Math.floor(12 + Math.random() * 18),
    age: Math.floor(1 + Math.random() * 8),
    contributorCount: Math.floor(5 + Math.random() * 11),
    maxIngredients: 10,
    aiPersonality: persona.name,
    feed: [`${persona.name}正在锅边观察：${choice(persona.lines)}`],
    createdAt: Date.now()
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.currentPot) return saved;
  } catch (error) {
    console.warn('Failed to read saved state', error);
  }
  const initial = {
    currentPot: createPot(),
    myIngredients: [],
    myTitles: [],
    visitedPots: [],
    aiInteractions: []
  };
  saveState(initial);
  return initial;
}

let state = loadState();

function saveState(next = state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function showScreen(id) {
  $$('.screen').forEach((screen) => screen.classList.toggle('screen-active', screen.id === id));
  if (id === 'add') setupAddPage();
  if (id === 'wait') setupWaitPage();
  if (id === 'report') renderReport();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderLanding() {
  const pot = state.currentPot;
  $('#landingStats').textContent = `已有 ${1247 + pot.contributorCount * 3} 人偷偷加过料 · 当前离谱指数 ${pot.chaosLevel}%`;
  const persona = AI_PERSONAS.find((ai) => ai.name === pot.aiPersonality) || AI_PERSONAS[0];
  const item = choice(INGREDIENTS.filter((ingredient) => persona.tags.includes(ingredient.tag)));
  $('#landingBubble').textContent = `${persona.name}刚刚加了${item.name}`;
}

function updateStatus(prefix = '') {
  const pot = state.currentPot;
  const left = Math.max(0, pot.maxIngredients - pot.ingredients.length);
  const chaosText = $(`#${prefix}chaosText`);
  const chaosBar = $(`#${prefix}chaosBar`);
  if (chaosText) chaosText.textContent = `${pot.chaosLevel}%`;
  if (chaosBar) chaosBar.style.width = `${pot.chaosLevel}%`;
  if (!prefix) {
    $('#potIdLabel').textContent = pot.id;
    $('#potAge').textContent = `${pot.age}h`;
    $('#contributors').textContent = pot.contributorCount;
    $('#spoonsLeft').textContent = `${left}勺`;
  }
}

function weightedDeck() {
  const urlPreset = new URLSearchParams(location.search).get('preset');
  const pool = [...INGREDIENTS];
  const presetTag = urlPreset || selectedPreset;
  INGREDIENTS.filter((item) => item.tag === presetTag).forEach((item) => pool.push(item, item));
  const deck = [];
  while (deck.length < 3) {
    const item = choice(pool);
    if (!deck.some((existing) => existing.name === item.name)) deck.push(item);
  }
  return deck;
}

function setupAddPage() {
  selectedIngredient = null;
  currentDeck = weightedDeck();
  updateStatus();
  $('#dropBtn').classList.add('hidden');
  $('#ingredientDetail').classList.add('hidden');
  $('#cardDeck').innerHTML = currentDeck.map((ingredient, index) => `
    <button class="blind-card" data-index="${index}" aria-label="盲盒卡片 ${index + 1}">
      <span class="card-inner">
        <span class="card-face card-back"><span class="ingredient-emoji">🍲</span><span class="question">?</span><span>盲盒食材</span></span>
        <span class="card-face card-front">
          <span class="ingredient-emoji">${ingredient.emoji}</span>
          <span class="ingredient-name">${ingredient.name}</span>
          <span class="tags">
            <span class="tag">${ingredient.tag}</span>
            <span class="tag">破坏力 ${Math.max(0, ingredient.chaos)}</span>
            <span class="tag">美味 ${ingredient.flavor}</span>
          </span>
        </span>
      </span>
    </button>
  `).join('');
}

function pickCard(card) {
  $$('.blind-card').forEach((node) => node.disabled = true);
  card.classList.add('flipped');
  selectedIngredient = currentDeck[Number(card.dataset.index)];
  setTimeout(() => {
    $('#ingredientDetail').innerHTML = `
      <h3>${selectedIngredient.emoji} ${selectedIngredient.name}</h3>
      <p>${selectedIngredient.name} · ${labelForTag(selectedIngredient.tag)} · 破坏力 ${Math.max(0, selectedIngredient.chaos)} · 救锅值 ${Math.max(0, -selectedIngredient.chaos)}</p>
      <div class="tags">
        <span class="tag">风味：${selectedIngredient.tag}</span>
        <span class="tag">离谱 ${selectedIngredient.chaos > 0 ? '+' : ''}${selectedIngredient.chaos}</span>
        <span class="tag">美味 ${selectedIngredient.flavor > 0 ? '+' : ''}${selectedIngredient.flavor}</span>
        <span class="tag">黑暗 ${selectedIngredient.dark > 0 ? '+' : ''}${selectedIngredient.dark}</span>
      </div>
    `;
    $('#ingredientDetail').classList.remove('hidden');
    $('#dropBtn').classList.remove('hidden');
  }, 330);
}

function labelForTag(tag) {
  return ({ 灭火: '灭火神器', 调味: '体面修补', 养生: '温柔劝架', 经典: '稳住锅底', 豪华: '豪华赞助', 灵魂: '灵魂出窍', 炸弹: '全桌沉默', 甜品: '甜品刺客', 汤底: '重写命运' })[tag] || '气氛担当';
}

function calculateTitle(ingredient, potState) {
  if (ingredient.tag === '甜品' && potState.chaosLevel > 50) return '甜品刺客';
  if (ingredient.tag === '灭火' && potState.chaosLevel > 70) return '救锅英雄';
  if (ingredient.tag === '灵魂' && potState.chaosLevel > 60) return '香菜教主';
  if (ingredient.tag === '豪华' && potState.darkLevel > 50) return '贵族折磨家';
  if (ingredient.tag === '炸弹') return '锅底破坏者';
  if (ingredient.chaos > 40 && ingredient.flavor < 0) return '暗黑发明家';
  return '气氛组主厨';
}

function addIngredient(ingredient, contributor = '你', source = 'human') {
  const pot = state.currentPot;
  const title = calculateTitle(ingredient, pot);
  pot.ingredients.push({ ...ingredient, contributor, title, source, at: new Date().toISOString() });
  pot.chaosLevel = clamp(pot.chaosLevel + ingredient.chaos);
  pot.flavorLevel = clamp(pot.flavorLevel + ingredient.flavor);
  pot.darkLevel = clamp(pot.darkLevel + ingredient.dark);
  pot.contributorCount += 1;
  pot.feed.unshift(`${contributor}刚刚加了${ingredient.name} · 离谱度${ingredient.chaos >= 0 ? '+' : ''}${ingredient.chaos}`);
  pot.feed = pot.feed.slice(0, 8);
  if (source === 'human') {
    state.myIngredients.push(ingredient.name);
    state.myTitles.push(title);
    if (!state.visitedPots.includes(pot.id)) state.visitedPots.push(pot.id);
  }
  if (pot.chaosLevel >= 100 || pot.ingredients.length >= pot.maxIngredients) pot.status = 'full';
  saveState();
  return title;
}

function dropSelectedIngredient() {
  if (!selectedIngredient) return;
  const layer = $('#dropAnimationLayer');
  layer.innerHTML = `<div class="flying-spoon">${selectedIngredient.emoji}</div>`;
  const title = addIngredient(selectedIngredient);
  const crime = document.createElement('div');
  crime.className = 'crime-pop';
  crime.textContent = `罪名：${title}`;
  document.body.appendChild(crime);
  setTimeout(() => crime.remove(), 1350);
  setTimeout(() => {
    layer.innerHTML = '';
    if (state.currentPot.status === 'full') startReveal();
    else showScreen('wait');
  }, 920);
}

function setupWaitPage() {
  const latest = [...state.currentPot.ingredients].reverse().find((item) => item.source === 'human');
  $('#myTitle').textContent = latest?.title || '气氛组主厨';
  updateStatus('wait');
  $('#waitHint').textContent = `锅还差 ${100 - state.currentPot.chaosLevel}% 就满了，你可以现在离开，等满了回来看结果。`;
  renderFeed();
  renderPresetOptions();
  startAiSim();
}

function renderFeed() {
  $('#activityFeed').innerHTML = state.currentPot.feed.map((line) => `<li>${line}</li>`).join('');
}

function renderPresetOptions() {
  const tags = ['甜品', '灵魂', '豪华', '灭火', '汤底'];
  $('#presetOptions').innerHTML = tags.map((tag) => `<button class="preset-chip ${tag === selectedPreset ? 'active' : ''}" data-preset="${tag}">${tag}</button>`).join('');
}

function startAiSim() {
  clearInterval(aiTimer);
  aiTimer = setInterval(() => {
    const pot = state.currentPot;
    if (pot.status !== 'cooking') {
      clearInterval(aiTimer);
      return;
    }
    const persona = AI_PERSONAS.find((ai) => ai.name === pot.aiPersonality) || choice(AI_PERSONAS);
    let pool = INGREDIENTS.filter((item) => persona.tags.includes(item.tag));
    if (pot.chaosLevel > 78) pool = INGREDIENTS.filter((item) => item.chaos <= 10);
    if (pot.chaosLevel < 45) pool = INGREDIENTS.filter((item) => item.chaos >= 30);
    const ingredient = choice(pool.length ? pool : INGREDIENTS);
    addIngredient(ingredient, persona.name, 'ai');
    state.aiInteractions.push({ persona: persona.name, line: choice(persona.lines), ingredient: ingredient.name });
    saveState();
    renderFeed();
    updateStatus('wait');
    $('#waitHint').textContent = state.currentPot.status === 'full' ? '锅满了，准备揭锅！' : `还差 ${Math.max(0, state.currentPot.maxIngredients - state.currentPot.ingredients.length)} 勺就揭锅`;
    if (state.currentPot.status === 'full') setTimeout(startReveal, 600);
  }, 5200);
}

async function sharePot() {
  const pot = state.currentPot;
  const url = `${location.origin}${location.pathname}?preset=${encodeURIComponent(selectedPreset)}&pot=${pot.id}`;
  const text = `这锅离谱到 ${pot.chaosLevel}% 了，来加最后一勺！`;
  try {
    if (navigator.share) await navigator.share({ title: '一人一勺', text, url });
    else await navigator.clipboard.writeText(`${text} ${url}`);
    toast('分享链接已准备好，朋友来就会被你的预设影响。');
  } catch (error) {
    toast('分享暂时没发出，但锅还在咕嘟。');
  }
}

function startReveal() {
  clearInterval(aiTimer);
  state.currentPot.status = 'revealed';
  saveState();
  showScreen('reveal');
  const lid = $('.lid');
  const countdown = $('#countdown');
  const caption = $('#revealCaption');
  const flying = $('#flyingIngredients');
  lid.className = 'lid shaking';
  caption.textContent = '锅盖开始震动...';
  [3, 2, 1].forEach((number, index) => {
    setTimeout(() => {
      countdown.textContent = number;
      countdown.classList.remove('show');
      void countdown.offsetWidth;
      countdown.classList.add('show');
      caption.textContent = `${number}...`;
    }, 700 + index * 850);
  });
  setTimeout(() => {
    lid.className = 'lid fly';
    caption.textContent = '揭锅！食材正在自首。';
    flying.innerHTML = state.currentPot.ingredients.map((item, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(1, state.currentPot.ingredients.length);
      const radius = 80 + (index % 3) * 24;
      return `<span style="--dx:${Math.cos(angle) * radius}px;--dy:${Math.sin(angle) * radius - 90}px;animation-delay:${index * .16}s">${item.emoji}</span>`;
    }).join('');
  }, 3450);
  setTimeout(() => {
    caption.textContent = `本锅锅型：${calculatePotType(state.currentPot).name}`;
  }, 5700);
  setTimeout(() => showScreen('report'), 7600);
}

function hasCombo(ingredients, names) {
  const set = new Set(ingredients.map((item) => item.name));
  return names.every((name) => set.has(name));
}
function hasRescue(ingredients) {
  return ingredients.some((item) => item.chaos < 0 || item.tag === '灭火' || item.tag === '养生');
}
function calculatePotType(pot) {
  const chaos = pot.chaosLevel;
  const flavor = pot.flavorLevel;
  const dark = pot.darkLevel;
  const ingredients = pot.ingredients;
  if (hasCombo(ingredients, ['牛奶汤底', '冰淇淋', '珍珠奶茶'])) return { name: '奶茶火锅宇宙', type: '跨界融合', key: '奶茶火锅宇宙' };
  if (hasCombo(ingredients, ['SSR和牛', '折耳根'])) return { name: '贵族折磨锅', type: '反差暴击', key: '贵族折磨' };
  if (hasCombo(ingredients, ['榴莲', '香菜', '折耳根'])) return { name: '灵魂出窍锅', type: '嗅觉挑战', key: '灵魂出窍' };
  if (chaos > 90) return { name: '人类不该尝试型', type: '极限', key: '极限' };
  if (chaos > 70 && flavor < 20) return { name: '全员放飞型', type: '混乱', key: '全员放飞' };
  if (hasRescue(ingredients) && chaos > 60) return { name: '一人救锅三人添乱型', type: '对抗', key: '一人救锅' };
  if (flavor > 50 && chaos > 40) return { name: '意外能吃锅', type: '惊喜', key: '普通' };
  if (dark > 70) return { name: '黑暗料理王', type: '深渊', key: '极限' };
  return { name: '平平无奇锅', type: '普通', key: '普通' };
}

function potName(pot) {
  const names = ['冰火两重天', '咕嘟审判日', '周末不解释', '折中失败现场', '锅边罗生门', '汤底自由落体'];
  return names[pot.id.charCodeAt(pot.id.length - 1) % names.length];
}

function renderReport() {
  const pot = state.currentPot;
  if (!pot.ingredients.length) {
    addIngredient(choice(INGREDIENTS), '你', 'human');
    addIngredient(choice(INGREDIENTS), pot.aiPersonality, 'ai');
  }
  const potType = calculatePotType(pot);
  $('#report-title').textContent = `【锅名】${potName(pot)}`;
  $('#potTypeLine').textContent = `【锅型】${potType.name}`;
  const scores = [
    ['离谱指数', pot.chaosLevel],
    ['美味指数', pot.flavorLevel],
    ['黑暗指数', pot.darkLevel],
    ['和谐指数', clamp(100 - Math.abs(pot.chaosLevel - pot.flavorLevel))]
  ];
  $('#scoreList').innerHTML = scores.map(([label, value]) => `
    <div class="score-row"><span>${label}</span><strong>${value}</strong><span class="score-meter"><div style="width:${value}%"></div></span></div>
  `).join('');
  $('#culpritList').innerHTML = pot.ingredients.map((item, index) => {
    const who = item.source === 'human' ? '共犯#1（你）' : item.contributor || `共犯#${index + 1}`;
    return `<li>${who}：${item.name} · ${item.title}</li>`;
  }).join('');
  const commentPool = COMMENTS[potType.key] || COMMENTS['普通'];
  $('#systemComment').textContent = `“${choice(commentPool)}”`;
  $('#identityList').innerHTML = buildIdentities(pot).map((line) => `<li>${line}</li>`).join('');
  $('#shareCopy').textContent = `“${choice(SHARE_COPIES).replace('XX', pot.chaosLevel)}”`;
}

function buildIdentities(pot) {
  const list = pot.ingredients;
  const findByTitle = (title) => list.find((item) => item.title === title);
  const rescue = findByTitle('救锅英雄') || list.find((item) => item.chaos < 0) || list[0];
  const sweet = findByTitle('甜品刺客') || list.find((item) => item.tag === '甜品') || list[0];
  const breaker = findByTitle('锅底破坏者') || [...list].sort((a, b) => b.chaos - a.chaos)[0];
  const soul = findByTitle('香菜教主') || list.find((item) => item.tag === '灵魂') || list[0];
  const owner = (item) => item.source === 'human' ? '你' : item.contributor;
  return [
    `🏆 救锅英雄：${owner(rescue)}（${rescue.name}）`,
    `🗡️ 甜品刺客：${owner(sweet)}（${sweet.name}）`,
    `🔥 锅底破坏者：${owner(breaker)}（${breaker.name}）`,
    `👑 香菜教主：${owner(soul)}（${soul.name}）`
  ];
}

async function captureReport() {
  const text = $('#wantedCard').innerText;
  try {
    await navigator.clipboard.writeText(text);
    toast('通缉令文字已复制。手机可直接截图这张竖版卡片。');
  } catch (error) {
    toast('请直接截图这张竖版通缉令。');
  }
}

function newPot() {
  state.currentPot = createPot();
  saveState();
  renderLanding();
  showScreen('landing');
}

function toast(message) {
  const node = $('#toast');
  node.textContent = message;
  node.classList.add('show');
  setTimeout(() => node.classList.remove('show'), 2400);
}

function bindEvents() {
  $('#startBtn').addEventListener('click', () => showScreen('add'));
  $('#cardDeck').addEventListener('click', (event) => {
    const card = event.target.closest('.blind-card');
    if (card) pickCard(card);
  });
  $('#dropBtn').addEventListener('click', dropSelectedIngredient);
  $('#presetOptions').addEventListener('click', (event) => {
    const chip = event.target.closest('.preset-chip');
    if (!chip) return;
    selectedPreset = chip.dataset.preset;
    renderPresetOptions();
  });
  $('#shareBtn').addEventListener('click', sharePot);
  $('#trapFriendBtn').addEventListener('click', sharePot);
  $('#notifyBtn').addEventListener('click', async () => {
    if (!('Notification' in window)) return toast('当前浏览器不支持通知，但锅会记在本地。');
    const result = await Notification.requestPermission();
    toast(result === 'granted' ? '揭锅时会尽量提醒你。' : '没关系，回来刷新也能看。');
  });
  $('#revealNowBtn').addEventListener('click', startReveal);
  $('#skipRevealBtn').addEventListener('click', () => showScreen('report'));
  $('#screenshotBtn').addEventListener('click', captureReport);
  $('#newPotBtn').addEventListener('click', newPot);
  $$('[data-go]').forEach((button) => button.addEventListener('click', () => showScreen(button.dataset.go)));
}

bindEvents();
renderLanding();
updateStatus();
setInterval(renderLanding, 4300);
