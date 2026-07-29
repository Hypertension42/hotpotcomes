import React, { Component, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const RELAY_TARGET = 5;
const RELAY_PARAM = "pot";
const PLAYER_KEY = "one_spoon_player";
const PLAYED_KEY = "one_spoon_played_pots";

const GOALS = [
  {
    id: "survive",
    title: "活过5个人",
    desc: "别让这口锅提前失控。",
    success: "目标达成：这锅真的撑过了5位共犯。",
    fail: "目标失败：这锅没撑到第5位共犯。"
  },
  {
    id: "pure",
    title: "保持清汤",
    desc: "谁添乱，谁就会被报告记住。",
    success: "目标达成：清汤守住了最后一刻。",
    fail: "目标失败：清汤已经被改写。"
  },
  {
    id: "heat",
    title: "烧到100度",
    desc: "大家一起把火候推上去。",
    success: "目标达成：火候突破100度。",
    fail: "目标失败：火候没有冲上去。"
  },
  {
    id: "free",
    title: "随便搞",
    desc: "锅主只想看这口锅会变成什么样。",
    success: "目标达成：这锅贡献了足够多的热闹。",
    fail: "目标达成：看戏的人已经满意。"
  }
];

const HELP_FOODS = [
  { name: "清汤", tag: "清", emoji: "🍲", integrity: 18, heat: -4, quip: "锅松了一口气。" },
  { name: "冰块", tag: "冰", emoji: "🧊", integrity: 12, heat: -18, quip: "火气被压住了。" },
  { name: "一勺盐", tag: "咸", emoji: "🧂", integrity: 10, heat: 4, quip: "秩序短暂回来了。" },
  { name: "雪梨汤", tag: "清", emoji: "🥛", integrity: 22, heat: -8, quip: "温柔地救了一下场。" }
];

const MESS_FOODS = [
  { name: "辣椒", tag: "辣", emoji: "🌶️", integrity: -28, heat: 30, quip: "火候突然上头。" },
  { name: "榴莲", tag: "怪", emoji: "🟡", integrity: -34, heat: 8, quip: "空气开始有意见。" },
  { name: "折耳根", tag: "怪", emoji: "🌿", integrity: -24, heat: 12, quip: "灵魂拐了个弯。" },
  { name: "爆辣包", tag: "辣", emoji: "🔥", integrity: -65, heat: 45, quip: "这一下，全锅都记住了。" }
];

const ALL_FOODS = [...HELP_FOODS, ...MESS_FOODS];
const INITIAL_FOODS = [
  { name: "豆皮", tag: "底", emoji: "🥬" },
  { name: "牛肉卷", tag: "底", emoji: "🥩" },
  { name: "菌菇", tag: "底", emoji: "🍄" },
  { name: "鱼丸", tag: "底", emoji: "🍡" }
];

const pick = (items) => items[Math.floor(Math.random() * items.length)];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const makeId = () => Math.random().toString(36).slice(2, 10);

function getPlayerId() {
  try {
    let id = localStorage.getItem(PLAYER_KEY);
    if (!id) {
      id = `p_${makeId()}_${Date.now().toString(36)}`;
      localStorage.setItem(PLAYER_KEY, id);
    }
    return id;
  } catch {
    return `p_${makeId()}`;
  }
}

function playedPots() {
  try {
    return JSON.parse(localStorage.getItem(PLAYED_KEY)) || {};
  } catch {
    return {};
  }
}

function markPlayed(seed) {
  try {
    const played = playedPots();
    played[seed] = true;
    localStorage.setItem(PLAYED_KEY, JSON.stringify(played));
  } catch {
    return null;
  }
}

function foodByName(name) {
  return ALL_FOODS.find((food) => food.name === name) || null;
}

function goalById(id) {
  return GOALS.find((goal) => goal.id === id) || GOALS[0];
}

function encodePot(pot) {
  return JSON.stringify({
    v: 3,
    s: pot.seed,
    g: pot.goal,
    h: pot.history.map((item) => ({
      n: item.name,
      side: item.side,
      i: item.integrity,
      h: item.heat,
      a: item.actor
    }))
  });
}

function decodePot(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const history = Array.isArray(parsed.h) ? parsed.h : [];
    return {
      seed: typeof parsed.s === "string" ? parsed.s : makeId(),
      goal: goalById(parsed.g).id,
      history: history
        .map((entry, index) => {
          const food = foodByName(entry.n);
          if (!food) return null;
          return {
            ...food,
            id: makeId(),
            side: entry.side === "help" ? "help" : "mess",
            integrity: clamp(Number(entry.i) || food.integrity, -80, 30),
            heat: clamp(Number(entry.h) || food.heat, -30, 60),
            actor: typeof entry.a === "string" ? entry.a : `共犯#${index + 1}`
          };
        })
        .filter(Boolean)
        .slice(0, RELAY_TARGET)
    };
  } catch {
    return null;
  }
}

function summarizePot(pot) {
  const integrity = clamp(100 + pot.history.reduce((total, item) => total + item.integrity, 0), 0, 130);
  const heat = clamp(20 + pot.history.reduce((total, item) => total + item.heat, 0), 0, 130);
  const count = pot.history.length;
  const helpers = pot.history.filter((item) => item.side === "help").length;
  const messers = pot.history.filter((item) => item.side === "mess").length;
  const polluted = pot.goal === "pure" && pot.history.some((item) => item.side === "mess");
  const complete =
    pot.goal === "survive" ? count >= RELAY_TARGET && integrity > 0 :
    pot.goal === "pure" ? count >= RELAY_TARGET && !polluted && integrity > 0 :
    pot.goal === "heat" ? heat >= 100 && integrity > 0 :
    pot.goal === "free" ? count >= RELAY_TARGET || integrity <= 0 :
    false;
  const failed =
    pot.goal === "survive" ? integrity <= 0 :
    pot.goal === "pure" ? polluted || integrity <= 0 :
    pot.goal === "heat" ? integrity <= 0 || count >= RELAY_TARGET :
    false;
  const ended = complete || failed || count >= RELAY_TARGET || integrity <= 0;
  const crucial = [...pot.history].sort((a, b) => a.integrity - b.integrity)[0] || null;
  return { integrity, heat, count, helpers, messers, polluted, complete, failed, ended, crucial };
}

function potMood(summary) {
  if (summary.ended && summary.integrity <= 0) return "revealed";
  if (summary.ended) return "stopped";
  if (summary.integrity <= 30 || summary.heat >= 100) return "warning";
  if (summary.integrity <= 55 || summary.heat >= 75) return "angry";
  if (summary.count > 0) return "strange";
  return "calm";
}

function makeShareUrl(pot) {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set(RELAY_PARAM, encodePot(pot));
  return url.toString();
}

function ErrorFallback() {
  return (
    <main className="app error-app">
      <section className="error-panel" role="alert">
        <h1>一人一勺</h1>
        <p>哎呀，出错了，请重启试试吧~</p>
      </section>
    </main>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Render error", error);
  }

  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}

function App() {
  const initialPot = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return decodePot(params.get(RELAY_PARAM));
  }, []);

  const [fatalError, setFatalError] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0].id);
  const [pot, setPot] = useState(initialPot);
  const [justCreated, setJustCreated] = useState(false);
  const [playerId] = useState(getPlayerId);
  const [copied, setCopied] = useState(false);
  const [impact, setImpact] = useState(null);
  const [flash, setFlash] = useState(false);
  const summary = pot ? summarizePot(pot) : null;
  const goal = pot ? goalById(pot.goal) : goalById(selectedGoal);
  const hasPlayed = pot ? Boolean(playedPots()[pot.seed]) : false;
  const canAct = pot && !summary.ended && !hasPlayed && !justCreated;
  const shareUrl = pot ? makeShareUrl(pot) : "";

  useEffect(() => {
    const showFallback = () => setFatalError(true);
    window.addEventListener("error", showFallback);
    window.addEventListener("unhandledrejection", showFallback);
    return () => {
      window.removeEventListener("error", showFallback);
      window.removeEventListener("unhandledrejection", showFallback);
    };
  }, []);

  if (fatalError) return <ErrorFallback />;

  const startPot = () => {
    const nextPot = { seed: makeId(), goal: selectedGoal, history: [] };
    setPot(nextPot);
    setJustCreated(true);
    window.history.replaceState(null, "", `?${RELAY_PARAM}=${encodeURIComponent(encodePot(nextPot))}`);
  };

  const addAction = (side) => {
    if (!canAct) return;
    const food = side === "help" ? pick(HELP_FOODS) : pick(MESS_FOODS);
    const nextEntry = {
      ...food,
      id: makeId(),
      side,
      actor: `共犯#${summary.count + 1}`
    };
    const nextPot = { ...pot, history: [...pot.history, nextEntry] };
    setImpact(nextEntry);
    setPot(nextPot);
    markPlayed(pot.seed, playerId);
    window.history.replaceState(null, "", `?${RELAY_PARAM}=${encodeURIComponent(encodePot(nextPot))}`);
    if (nextEntry.integrity <= -60 || summarizePot(nextPot).integrity <= 0) {
      setFlash(true);
      setTimeout(() => setFlash(false), 1300);
    }
    setTimeout(() => setImpact(null), 1100);
  };

  const share = async () => {
    setCopied(true);
    const text = summary?.ended
      ? `这口锅出结局了：${goal.title}。`
      : `这口锅传到第 ${summary.count} 勺了，轮到你选帮还是添乱。`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "一人一勺", text, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      await navigator.clipboard?.writeText(shareUrl);
    }
    setTimeout(() => setCopied(false), 1600);
  };

  const reset = () => {
    setPot(null);
    setJustCreated(false);
    setCopied(false);
    setImpact(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  if (!pot) {
    return (
      <main className="app">
        <Ambient />
        <section className="create-screen">
          <p className="eyebrow">击鼓传锅</p>
          <h1>一人一勺</h1>
          <p className="subtitle">一个人立目标，一群人决定它成不成。</p>
          <div className="goal-list">
            {GOALS.map((item) => (
              <button className={`goal-card ${selectedGoal === item.id ? "active" : ""}`} key={item.id} onClick={() => setSelectedGoal(item.id)}>
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </button>
            ))}
          </div>
          <button className="primary-action start-action" onClick={startPot}>开锅</button>
        </section>
      </main>
    );
  }

  return (
    <main className={`app mood-${potMood(summary)} ${flash ? "fatal-flash" : ""}`}>
      <Ambient />
      <header className="topbar">
        <div>
          <p className="eyebrow">锅主的目标</p>
          <h1>一人一勺</h1>
          <p className="subtitle">{goal.title}</p>
        </div>
        <div className="online" aria-label={`当前进度 ${summary.count}/${RELAY_TARGET}`}>
          <span aria-hidden="true">◎</span>
          <span>{summary.count}/{RELAY_TARGET}</span>
        </div>
      </header>

      <section className="goal-banner">
        <strong>{goal.title}</strong>
        <span>{goal.desc}</span>
      </section>

      <section className="game-shell" aria-label="一口锅接力">
        <Timeline pot={pot} />
        <section className="pot-stage">
          <Pressure summary={summary} />
          <Hotpot mood={potMood(summary)} history={pot.history} impact={impact} />
          <div className="pot-bubble" role="status">
            {summary.ended ? endLine(goal, summary) : justCreated ? "锅已经开好，把目标传给第1位共犯。" : canAct ? "轮到你了：帮一把，还是添点乱？" : "你已经接过这一锅，把它传给下一位。"}
          </div>
        </section>
      </section>

      {!summary.ended && (
        <div className={`choice-panel ${justCreated ? "creator-choice" : ""}`}>
          {justCreated ? (
            <>
              <button className="draw-button" onClick={share}>
                <span className="spoon">🥄</span>
                <span>{copied ? "链接已备好" : "传给第1位"}</span>
              </button>
              <button className="ghost-action creator-skip" onClick={() => setJustCreated(false)}>我先接第一勺</button>
            </>
          ) : canAct ? (
            <>
              <button className="side-btn help" onClick={() => addAction("help")}>
                <span>🤝</span>
                <strong>帮一把</strong>
              </button>
              <button className="side-btn mess" onClick={() => addAction("mess")}>
                <span>😈</span>
                <strong>添点乱</strong>
              </button>
            </>
          ) : (
            <button className="draw-button" onClick={share}>
              <span className="spoon">🥄</span>
              <span>{copied ? "链接已备好" : "传给下一位"}</span>
            </button>
          )}
        </div>
      )}

      {summary.ended && (
        <EndReport pot={pot} goal={goal} summary={summary} copied={copied} share={share} reset={reset} />
      )}
    </main>
  );
}

function endLine(goal, summary) {
  if (goal.id === "free") return "这锅已经够热闹了。";
  return summary.complete ? "目标达成，开锅看结果。" : "目标没保住，开锅看结果。";
}

function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      {Array.from({ length: 20 }, (_, index) => (
        <span className="ambient-steam" key={index} style={{ "--x": `${6 + ((index * 23) % 88)}%`, "--d": `${8 + (index % 6)}s`, "--delay": `${index * -0.55}s` }} />
      ))}
      {["🌶️", "🫑", "🧅", "🌿", "🧄"].map((item, index) => (
        <span className="silhouette" key={item} style={{ "--x": `${14 + index * 17}%`, "--delay": `${index * -3}s` }}>{item}</span>
      ))}
    </div>
  );
}

function Pressure({ summary }) {
  return (
    <div className={`pressure ${summary.integrity <= 35 ? "warning" : ""}`} aria-label={`承受值 ${summary.integrity} 火候 ${summary.heat}`}>
      <div className="pressure-head">
        <span>承受值</span>
        <strong>{summary.integrity}</strong>
      </div>
      <div className="gauge">
        <span style={{ width: `${clamp(summary.integrity, 0, 100)}%` }} />
      </div>
      <div className="meter-row">
        <span>火候 {summary.heat}</span>
        <span>好人 {summary.helpers} / 添乱 {summary.messers}</span>
      </div>
    </div>
  );
}

function Hotpot({ mood, history, impact }) {
  const visible = [...INITIAL_FOODS, ...history].slice(-12);
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
          <span className={`float-food tag-${food.tag}`} key={`${food.name}-${index}`} style={{ "--i": index, "--x": `${10 + ((index * 19) % 78)}%`, "--y": `${20 + ((index * 23) % 54)}%` }}>
            <span>{food.emoji}</span>
          </span>
        ))}
        {Array.from({ length: 18 }, (_, index) => (
          <span className="bubble" key={index} style={{ "--x": `${8 + ((index * 17) % 84)}%`, "--d": `${1.8 + (index % 5) * 0.35}s`, "--delay": `${index * -0.21}s` }} />
        ))}
        <span className="ripple" />
      </div>
      <div className="pot-body" />
      {impact && <div className="flying-food">{impact.emoji}</div>}
    </div>
  );
}

function Timeline({ pot }) {
  return (
    <aside className="feed" aria-live="polite">
      <div className="feed-title">
        <span>前人记录</span>
        <span>{pot.history.length ? `${pot.history.length} 勺` : "未开动"}</span>
      </div>
      {pot.history.length ? pot.history.map((item, index) => (
        <div className={`feed-item ${item.side === "help" ? "cool" : "danger"}`} key={item.id}>
          <span>第{index + 1}位 {item.actor} 加了 {item.name}</span>
          <small>{item.side === "help" ? "帮忙" : "添乱"}</small>
        </div>
      )).reverse() : (
        <div className="feed-item pot">
          <span>还没人接锅。第一勺会决定气氛。</span>
          <small>开局</small>
        </div>
      )}
    </aside>
  );
}

function EndReport({ pot, goal, summary, copied, share, reset }) {
  const success = goal.id === "free" || summary.complete;
  const crucial = summary.crucial;
  const last = pot.history.at(-1);
  return (
    <div className="overlay reveal">
      <section className={`wanted ${success ? "success" : "failed"}`}>
        <div className="stamp">{success ? "成" : "裂"}</div>
        <p className="poster-kicker">这口锅的一生</p>
        <h2>{success ? "目标达成" : "目标没保住"}</h2>
        <div className="charge">{success ? goal.success : goal.fail}</div>
        <div className="wanted-grid">
          <div>
            <span>锅主目标</span>
            <strong>{goal.title}</strong>
          </div>
          <div>
            <span>接力结果</span>
            <strong>{summary.count}人 / 承受值{summary.integrity}</strong>
          </div>
        </div>
        <div className="story">
          <span>关键回放</span>
          {pot.history.map((item, index) => (
            <p key={item.id}>第{index + 1}勺：{item.actor} {item.side === "help" ? "帮了一把" : "添了点乱"}，放入{item.name}，承受值{item.integrity > 0 ? "+" : ""}{item.integrity}</p>
          ))}
        </div>
        <div className="divider" />
        <p className="comment-text">
          {crucial ? `关键一勺：${crucial.actor} 的 ${crucial.name}。` : "这锅安静得不像话。"}
          {"\n"}
          {last ? `锅的遗言：“${last.quip}”` : "锅的遗言：“还没人真正下手。”"}
        </p>
        <div className="poster-actions">
          <button className="primary-action" onClick={share}>
            <span aria-hidden="true">↗</span>
            {copied ? "链接已备好" : "传阅结局"}
          </button>
          <button className="ghost-action" onClick={reset}>
            <span aria-hidden="true">↻</span>
            再开一锅
          </button>
        </div>
        <div className="share-line">
          <span aria-hidden="true">⌁</span>
          <span>锅是载体，目标才是赌注。</span>
        </div>
      </section>
    </div>
  );
}

try {
  createRoot(document.getElementById("root")).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (error) {
  console.error("Startup error", error);
  document.body.innerHTML = '<main class="app error-app"><section class="error-panel" role="alert"><h1>一人一勺</h1><p>哎呀，出错了，请重启试试吧~</p></section></main>';
}
