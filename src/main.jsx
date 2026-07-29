import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const positiveFoods = [
  { name: "榴莲", tag: "臭", base: 13, emoji: "🟡", quip: "它笑得很大声。" },
  { name: "折耳根", tag: "怪", base: 9, emoji: "🌿", quip: "灵魂开始拐弯。" },
  { name: "螺蛳粉", tag: "臭", base: 12, emoji: "🍜", quip: "整条街都听见了。" },
  { name: "臭豆腐", tag: "臭", base: 11, emoji: "🧊", quip: "方方正正，很有意见。" },
  { name: "鲱鱼罐头", tag: "臭", base: 15, emoji: "🥫", quip: "盖子打开的一刻，锅沉默了。" },
  { name: "皮蛋", tag: "怪", base: 7, emoji: "🥚", quip: "像一枚深夜谜题。" },
  { name: "辣条", tag: "辣", base: 8, emoji: "🌶️", quip: "小卖部风味直达锅底。" },
  { name: "芥末", tag: "辣", base: 10, emoji: "🟩", quip: "鼻腔先举白旗。" },
  { name: "蓝纹奶酪", tag: "臭", base: 11, emoji: "🧀", quip: "优雅地添乱。" },
  { name: "纳豆", tag: "怪", base: 9, emoji: "🫘", quip: "丝丝入扣，黏住良心。" },
  { name: "苦瓜", tag: "怪", base: 6, emoji: "🥒", quip: "成年人专属惩罚。" },
  { name: "香菜", tag: "怪", base: 6, emoji: "☘️", quip: "有人欢呼，有人离席。" },
  { name: "板蓝根", tag: "怪", base: 12, emoji: "🧃", quip: "药柜决定参赛。" },
  { name: "藿香正气水", tag: "怪", base: 14, emoji: "🧪", quip: "锅开始反思人生。" },
  { name: "风油精", tag: "怪", base: 15, emoji: "💧", quip: "清凉，但不清白。" },
  { name: "花露水", tag: "怪", base: 15, emoji: "🧴", quip: "夏夜被端上桌。" },
  { name: "咖啡", tag: "苦", base: 7, emoji: "☕", quip: "这锅今晚不用睡了。" },
  { name: "可乐", tag: "甜", base: 7, emoji: "🥤", quip: "气泡和气泡结拜。" },
  { name: "泡面", tag: "怪", base: 6, emoji: "🍥", quip: "宿舍风云再起。" },
  { name: "一整块火锅底料", tag: "辣", base: 14, emoji: "🧱", quip: "油光闪闪的决心。" },
  { name: "月饼", tag: "甜", base: 10, emoji: "🥮", quip: "中秋提前入锅。" },
  { name: "汤圆", tag: "甜", base: 8, emoji: "⚪", quip: "软糯地制造混乱。" },
  { name: "冰淇淋", tag: "冰", base: 12, emoji: "🍦", quip: "冷热在锅里谈判失败。" },
  { name: "老干妈", tag: "辣", base: 13, emoji: "🔥", quip: "油辣子有自己的节奏。" },
  { name: "珍珠奶茶", tag: "甜", base: 10, emoji: "🧋", quip: "珍珠沉底，罪证确凿。" },
  { name: "一整只鸡", tag: "怪", base: 9, emoji: "🍗", quip: "场面突然认真。" }
];

const remedies = [
  { name: "一瓢清水", tag: "清", base: -14, emoji: "💦", quip: "锅松了一口长气。" },
  { name: "一勺盐", tag: "咸", base: -10, emoji: "🧂", quip: "秩序回来了半秒。" },
  { name: "一把理性", tag: "清", base: -18, emoji: "🧠", quip: "全场最不合群的一勺。" },
  { name: "高汤", tag: "清", base: -12, emoji: "🍲", quip: "老派厨德救场。" },
  { name: "几片姜", tag: "清", base: -9, emoji: "🫚", quip: "一片姜压住一片慌。" },
  { name: "冰水", tag: "冰", base: -16, emoji: "🧊", quip: "火气被摁回锅里。" },
  { name: "酸奶", tag: "清", base: -13, emoji: "🥛", quip: "辣味开始讲道理。" },
  { name: "灭火器", tag: "清", base: -20, emoji: "🧯", quip: "厨房秩序强制上线。" },
  { name: "解药", tag: "清", base: -18, emoji: "💊", quip: "太正经，显得可疑。" },
  { name: "柠檬", tag: "酸", base: -11, emoji: "🍋", quip: "臭味被酸醒了。" }
];

const responseCards = {
  辣: [
    { name: "冰水", tag: "冰", base: -16, emoji: "🧊", quip: "专门来灭火。" },
    { name: "酸奶", tag: "清", base: -13, emoji: "🥛", quip: "给辣味递台阶。" },
    { name: "灭火器", tag: "清", base: -20, emoji: "🧯", quip: "不讲情面地救场。" }
  ],
  甜: [{ name: "一勺盐", tag: "咸", base: -10, emoji: "🧂", quip: "甜味被当场教育。" }],
  臭: [
    { name: "香菜", tag: "怪", base: 6, emoji: "☘️", quip: "以香制胜，也可能更乱。" },
    { name: "柠檬", tag: "酸", base: -11, emoji: "🍋", quip: "酸光一闪，空气清醒。" }
  ],
  冰: [{ name: "老干妈", tag: "辣", base: 13, emoji: "🔥", quip: "冷热互相不服。" }],
  怪: [{ name: "一把理性", tag: "清", base: -18, emoji: "🧠", quip: "它试图结束这场闹剧。" }]
};

const collectiveCharges = [
  "一锅乱炖罪",
  "蓄意谋杀味蕾罪",
  "跨界食材非法同居罪",
  "集体投毒（未遂）罪",
  "深夜放毒罪",
  "味觉恐怖主义罪",
  "反人类烹饪罪",
  "食材跨界走私罪"
];

const aiNames = ["锅巴", "红油", "花椒", "漏勺", "夜宵局", "铁锅侠"];
const potLines = [
  "咕嘟……（假装什么都没发生）",
  "这锅，谁煮的？反正不是我。",
  "离谱度飙升！锅要溢了！",
  "锅沿开始说胡话。",
  "汤底短暂失去职业素养。"
];

const initialFoods = ["豆皮", "牛肉卷", "菌菇", "鱼丸", "宽粉", "青菜", "午餐肉"];
const allFoods = [...positiveFoods, ...remedies];

const pick = (items) => items[Math.floor(Math.random() * items.length)];
const clamp = (num, min, max) => Math.max(min, Math.min(max, num));
const rollDelta = (food) => {
  if (food.base < 0) return food.base - Math.floor(Math.random() * 5);
  return food.base + Math.floor(Math.random() * 4);
};
const makeId = () => Math.random().toString(36).slice(2, 10);

function foodByName(name) {
  return allFoods.find((food) => food.name === name) || null;
}

function makeEvent(text, tone = "hot") {
  return { id: makeId(), text, tone, time: new Date().toLocaleTimeString("zh-CN", { hour12: false }) };
}

function buildDeck(lastTag) {
  const deck = [];
  if (lastTag && responseCards[lastTag]) deck.push(pick(responseCards[lastTag]));
  while (deck.length < 3) {
    const source = Math.random() < 0.8 ? positiveFoods : remedies;
    const candidate = pick(source);
    if (!deck.some((item) => item.name === candidate.name)) deck.push(candidate);
  }
  return deck.sort(() => Math.random() - 0.5);
}

function potMood(score, stopped, revealed) {
  if (revealed || score >= 100) return "revealed";
  if (stopped) return "stopped";
  if (score >= 85) return "warning";
  if (score >= 60) return "angry";
  if (score >= 30) return "strange";
  return "calm";
}

function chargeFor(foods) {
  const names = foods.map((item) => item.name);
  const hasHarm = names.some((name) => ["榴莲", "鲱鱼罐头", "臭豆腐", "老干妈", "芥末", "风油精", "花露水", "板蓝根"].includes(name));
  const hasHelp = names.some((name) => ["一瓢清水", "一勺盐", "解药", "高汤", "冰水", "一把理性", "灭火器"].includes(name));
  const charges = [];
  if (hasHarm && hasHelp) charges.push("反复横跳的共犯");
  if (names.some((name) => ["榴莲", "鲱鱼罐头", "臭豆腐"].includes(name))) charges.push("生化武器携带者");
  if (hasHelp) charges.push(pick(["救锅英雄", "卧底清道夫"]));
  if (names.some((name) => ["辣条", "老干妈", "芥末", "一整块火锅底料"].includes(name))) charges.push("纵火犯");
  if (names.some((name) => ["冰淇淋", "汤圆", "月饼", "珍珠奶茶"].includes(name))) charges.push("甜品走私犯");
  if (names.some((name) => ["风油精", "花露水", "板蓝根", "藿香正气水"].includes(name))) charges.push("投毒惯犯");
  return charges.slice(0, 3).join(" / ") || "围观不报备罪";
}

function storyVerb(entry, previous) {
  if (!previous) return entry.delta < 0 ? "救场" : "起锅";
  if (entry.delta < 0) return "回拉";
  if (entry.tag === previous.tag) return "加码";
  if (previous.delta < 0 && entry.delta > 0) return "反手添乱";
  return pick(["挑衅", "火上浇油", "同归于尽", "改写汤底"]);
}

function App() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const seeded = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const mine = params.get("mine");
    const from = params.get("from") || "匿名共犯";
    return { mine, from };
  }, []);

  const mineFood = seeded.mine ? foodByName(seeded.mine) : null;
  const mineDelta = mineFood ? rollDelta(mineFood) : 0;
  const [score, setScore] = useState(() => clamp(20 + Math.floor(Math.random() * 41) + Math.max(0, mineDelta), 0, 96));
  const [online, setOnline] = useState(() => 360 + Math.floor(Math.random() * 180));
  const [events, setEvents] = useState(() => {
    const starter = [
      makeEvent(`匿名共犯 #${200 + Math.floor(Math.random() * 700)} 偷偷加了 ${pick(positiveFoods).name}`),
      makeEvent(`AI 共犯·${pick(aiNames)} 加了 ${pick(positiveFoods).name}`),
      makeEvent(pick(potLines), "pot")
    ];
    if (mineFood) {
      starter.unshift(makeEvent(`一位匿名共犯 在你来之前就加了 ${mineFood.name}`, mineFood.base < 0 ? "cool" : "hot"));
    }
    return starter;
  });
  const [history, setHistory] = useState(() => {
    const starter = initialFoods.slice(0, 4).map((name, index) => ({
      id: makeId(),
      name,
      emoji: ["🥬", "🥩", "🍄", "🍡"][index],
      tag: "底",
      delta: 0,
      actor: "锅底",
      mine: false
    }));
    return mineFood
      ? [...starter, { ...mineFood, id: makeId(), delta: mineDelta, actor: seeded.from, mine: false }]
      : starter;
  });
  const [userFoods, setUserFoods] = useState([]);
  const [drawOpen, setDrawOpen] = useState(false);
  const [drawn, setDrawn] = useState(null);
  const [deck, setDeck] = useState([]);
  const [swapped, setSwapped] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [impact, setImpact] = useState(null);
  const [shareFood, setShareFood] = useState(allFoods[0].name);
  const [copied, setCopied] = useState(false);
  const lastTag = history.filter((item) => item.tag !== "底").at(-1)?.tag || null;
  const lastThreeHeavy = useRef([]);
  const mood = potMood(score, stopped, score >= 100);
  const isRevealed = score >= 100;
  const posterCharge = useMemo(() => (isRevealed ? pick(collectiveCharges) : ""), [isRevealed]);

  const addEvent = (event) => {
    setEvents((current) => [event, ...current].slice(0, 8));
  };

  const addIngredient = (food, actor = "你", mine = false, forcedDelta, customText) => {
    const delta = forcedDelta ?? rollDelta(food);
    const nextItem = { ...food, id: makeId(), delta, actor, mine };
    setHistory((current) => [...current, nextItem]);
    setScore((current) => clamp(current + delta, 0, 100));
    if (mine) setUserFoods((current) => [...current, nextItem]);

    addEvent(
      delta < 0
        ? makeEvent("有人往回拉了一勺，锅暂时安全了。", "cool")
        : makeEvent(customText || `${actor} 加了 ${food.name}（${delta > 0 ? "+" : ""}${delta}）`, "hot")
    );

    if (delta < 0) {
      setStopped(false);
      lastThreeHeavy.current = [];
      return;
    }

    const heavy = ["辣", "臭", "怪"].includes(food.tag);
    lastThreeHeavy.current = [...lastThreeHeavy.current, heavy].slice(-3);
    if (lastThreeHeavy.current.length === 3 && lastThreeHeavy.current.every(Boolean)) {
      setStopped(true);
      addEvent(makeEvent("本锅拒绝再煮，除非来个救锅英雄。", "danger"));
    }
  };

  const openDraw = () => {
    const nextDeck = stopped ? [...remedies].sort(() => Math.random() - 0.5).slice(0, 3) : buildDeck(lastTag);
    setDeck(nextDeck);
    setDrawn(null);
    setSwapped(false);
    setDrawOpen(true);
  };

  const revealDraw = () => {
    setDrawn(pick(deck));
  };

  const swapSpoon = () => {
    const choices = buildDeck(lastTag).filter((item) => item.name !== drawn?.name);
    setDrawn(pick(choices));
    setSwapped(true);
  };

  const throwIntoPot = () => {
    if (!drawn) return;
    setImpact(drawn);
    setDrawOpen(false);
    setTimeout(() => {
      addIngredient(drawn, "你", true);
      if (Math.random() < 0.15 && score < 100) {
        const revenge = pick(positiveFoods.filter((item) => ["怪", "臭"].includes(item.tag)));
        setTimeout(() => addIngredient(revenge, "锅", false, undefined, `锅 偷偷加了 ${revenge.name}（它记仇了）`), 520);
      }
    }, reducedMotion ? 0 : 620);
    setTimeout(() => setImpact(null), 1300);
  };

  const reset = () => {
    const nextScore = 20 + Math.floor(Math.random() * 41);
    setScore(nextScore);
    setHistory(
      initialFoods.slice(0, 4).map((name, index) => ({
        id: makeId(),
        name,
        emoji: ["🥬", "🥩", "🍄", "🍡"][index],
        tag: "底",
        delta: 0,
        actor: "锅底",
        mine: false
      }))
    );
    setUserFoods([]);
    setStopped(false);
    setEvents([
      makeEvent(`匿名共犯 #${200 + Math.floor(Math.random() * 700)} 偷偷加了 ${pick(positiveFoods).name}`),
      makeEvent(`AI 共犯·${pick(aiNames)} 加了 ${pick(positiveFoods).name}`),
      makeEvent(pick(potLines), "pot")
    ]);
    lastThreeHeavy.current = [];
    setCopied(false);
  };

  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("mine", shareFood);
    url.searchParams.set("from", `共犯${100 + Math.floor(online / 3)}`);
    return url.toString();
  }, [shareFood, online]);

  const share = async () => {
    setCopied(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: "一人一勺", text: "我在锅里留了一勺，敢来吗？", url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      await navigator.clipboard?.writeText(shareUrl);
    }
    setTimeout(() => setCopied(false), 1600);
  };

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const listener = (event) => setReducedMotion(event.matches);
    motionQuery.addEventListener?.("change", listener);
    return () => motionQuery.removeEventListener?.("change", listener);
  }, []);

  useEffect(() => {
    const tick = () => {
      const delay = 2000 + Math.floor(Math.random() * 2000);
      return setTimeout(() => {
        const ai = Math.random() < 0.35;
        const food = Math.random() < 0.82 ? pick(positiveFoods) : pick(remedies);
        addEvent(
          makeEvent(
            ai
              ? `AI 共犯·${pick(aiNames)} 加了 ${food.name}`
              : `匿名共犯 #${100 + Math.floor(Math.random() * 900)} 偷偷加了 ${food.name}`,
            food.base < 0 ? "cool" : "hot"
          )
        );
        if (Math.random() < 0.32 && !isRevealed) {
          setScore((current) => clamp(current + Math.round(food.base / 3), 0, 99));
        }
      }, delay);
    };
    let timer = tick();
    return () => clearTimeout(timer);
  }, [events, isRevealed]);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnline((current) => clamp(current + Math.floor(Math.random() * 7) - 2, 280, 780));
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const story = history
    .filter((item) => item.tag !== "底")
    .map((item, index, list) => `第${index + 1}勺 ${storyVerb(item, list[index - 1])}（${item.name}） ${item.delta > 0 ? "+" : ""}${item.delta}`);

  return (
    <main className={`app mood-${mood}`}>
      <Ambient />
      <header className="topbar">
        <div>
          <p className="eyebrow">深夜共享锅</p>
          <h1>一人一勺</h1>
          <p className="subtitle">这锅，谁煮的？</p>
        </div>
        <div className="online" aria-label={`当前在线共犯 ${online} 人`}>
          <span aria-hidden="true">◎</span>
          <span>{online}</span>
        </div>
      </header>

      <section className="game-shell" aria-label="共享火锅游戏">
        <aside className="feed" aria-live="polite">
          <div className="feed-title">
            <span>共犯动态</span>
            <span aria-hidden="true">✦</span>
          </div>
          {events.map((event) => (
              <div className={`feed-item ${event.tone}`} key={event.id}>
                <span>{event.text}</span>
                <small>{event.time}</small>
              </div>
          ))}
        </aside>

        <section className="pot-stage">
          <Pressure score={score} mood={mood} />
          <Hotpot mood={mood} history={history} impact={impact} reducedMotion={reducedMotion} />
          <div className="pot-bubble" role="status">
            {stopped ? "本锅拒绝再煮，除非来个救锅英雄。" : score >= 85 ? "离谱度飙升！锅要溢了！" : pick(potLines)}
          </div>
        </section>
      </section>

      <div className="action-bar">
        <button className="draw-button" onClick={openDraw} disabled={isRevealed}>
          <span className="spoon">🥄</span>
          <span>{stopped ? "抽救锅一勺" : "盲盒抽一勺"}</span>
        </button>
      </div>

      {drawOpen && (
          <DrawModal
            drawn={drawn}
            deck={deck}
            swapped={swapped}
            revealDraw={revealDraw}
            swapSpoon={swapSpoon}
            throwIntoPot={throwIntoPot}
            close={() => setDrawOpen(false)}
          />
        )}

      {isRevealed && (
          <WantedPoster
            score={score}
            online={online}
            userFoods={userFoods}
            collective={posterCharge}
            personal={chargeFor(userFoods)}
            story={story}
            shareFood={shareFood}
            setShareFood={setShareFood}
            share={share}
            copied={copied}
            reset={reset}
          />
        )}
    </main>
  );
}

function Ambient() {
  const steam = Array.from({ length: 24 }, (_, index) => index);
  const silhouettes = ["🌶️", "🫑", "🧅", "🌿", "🧄", "🫚"];
  return (
    <div className="ambient" aria-hidden="true">
      {steam.map((item) => (
        <span className="ambient-steam" key={item} style={{ "--x": `${Math.random() * 100}%`, "--d": `${8 + Math.random() * 8}s`, "--delay": `${Math.random() * -10}s` }} />
      ))}
      {silhouettes.map((item, index) => (
        <span className="silhouette" key={item} style={{ "--x": `${12 + index * 15}%`, "--delay": `${index * -3}s` }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function Pressure({ score, mood }) {
  return (
    <div className={`pressure ${mood}`} aria-label={`离谱度 ${score}`}>
      <div className="pressure-head">
        <span>离谱度</span>
        <strong>{score}</strong>
      </div>
      <div className="gauge">
        <span style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function Hotpot({ mood, history, impact, reducedMotion }) {
  const visible = history.slice(-12);
  return (
    <div className={`hotpot ${mood}`}>
      <div className="handle left" />
      <div className="handle right" />
      <div className="lid">
        <div className="lid-eye left" />
        <div className="lid-eye right" />
        <div className="lid-brow left" />
        <div className="lid-brow right" />
      </div>
      <div className="broth">
        <div className="broth-glow" />
        {visible.map((food, index) => (
          <span className={`float-food tag-${food.tag}`} key={food.id} style={{ "--i": index, "--x": `${10 + ((index * 19) % 78)}%`, "--y": `${20 + ((index * 23) % 54)}%` }}>
            <span>{food.emoji}</span>
          </span>
        ))}
        {Array.from({ length: 18 }, (_, index) => (
          <span className="bubble" key={index} style={{ "--x": `${8 + ((index * 17) % 84)}%`, "--d": `${1.8 + (index % 5) * 0.35}s`, "--delay": `${index * -0.21}s` }} />
        ))}
        <span className="ripple" />
      </div>
      <div className="pot-body" />
      {impact && !reducedMotion && (
          <div className="flying-food">
            {impact.emoji}
          </div>
        )}
    </div>
  );
}

function DrawModal({ drawn, deck, swapped, revealDraw, swapSpoon, throwIntoPot, close }) {
  return (
    <div className="overlay">
      <section className="draw-modal" role="dialog" aria-modal="true" aria-label="盲盒抽取">
        {!drawn ? (
          <>
            <button className="close-btn" onClick={close} aria-label="关闭">×</button>
            <button className="mystery-bowl" onClick={revealDraw}>
              <span className="bowl-lid" />
              <span className="bowl-body" />
              <strong>揭开</strong>
            </button>
            <div className="deck-hint">
              {deck.map((item) => (
                <span key={item.name}>{item.tag}</span>
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="close-btn" onClick={close} aria-label="关闭">×</button>
            <article className={`food-card ${drawn.base < 0 ? "remedy" : "spicy"}`}>
              <div className="food-emoji">{drawn.emoji}</div>
              <h2>{drawn.name}</h2>
              <strong>{drawn.base > 0 ? "+" : ""}{drawn.base}</strong>
              <p>{drawn.quip}</p>
            </article>
            <div className="modal-actions">
              <button className="primary-action" onClick={throwIntoPot}>丢进锅</button>
              <button className="ghost-action" onClick={swapSpoon} disabled={swapped}>换一勺</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function WantedPoster({ score, online, userFoods, collective, personal, story, shareFood, setShareFood, share, copied, reset }) {
  return (
    <div className="overlay reveal">
      <section className="wanted">
        <div className="stamp">哐</div>
        <p className="poster-kicker">锅盖已飞</p>
        <h2>本 锅 通 缉 令</h2>
        <div className="charge">{collective}</div>
        <div className="wanted-grid">
          <div>
            <span>你的个人罪名</span>
            <strong>{personal}</strong>
          </div>
          <div>
            <span>离谱度 / 共犯</span>
            <strong>{score} / {online}</strong>
          </div>
        </div>
        <div className="story">
          <span>本锅剧情回放</span>
          {(story.length ? story : ["第1勺 围观（你没来得及动手） +0"]).slice(-7).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <label className="mine-picker">
          <span>偷偷选一勺放进链接</span>
          <select value={shareFood} onChange={(event) => setShareFood(event.target.value)}>
            {allFoods.map((food) => (
              <option key={food.name} value={food.name}>{food.name}</option>
            ))}
          </select>
        </label>
        <div className="poster-actions">
          <button className="primary-action" onClick={share}>
            <span aria-hidden="true">↗</span>
            {copied ? "链接已备好" : "分享并埋一勺雷"}
          </button>
          <button className="ghost-action" onClick={reset}>
            <span aria-hidden="true">↻</span>
            再煮一锅
          </button>
        </div>
        <div className="share-line">
          <span aria-hidden="true">⌁</span>
          <span>{shareFood} 已写进链接</span>
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
