import React, { useCallback, useEffect, useMemo, useState } from 'react';
import course from './data/course.json';
import mascotReady from './assets/mascot/guia-py-ready.webp';
import mascotFocus from './assets/mascot/guia-py-focus.webp';
import mascotCelebrate from './assets/mascot/guia-py-celebrate.webp';
import '../style.css';
import './rounded-theme.css';

const STORAGE_KEY = 'black-buster-progress-v5';
const SETTINGS_KEY = 'black-buster-settings-v2';
const FONT_ID = 'black-buster-fonts';
const MAX_HEARTS = 5;
const HEART_REFILL_COST = 50;
const DAILY_GOAL_XP = 20;

function localDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function yesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return localDayKey(date);
}

function emptyProgress() {
  return {
    completed: {},
    attempts: {},
    correct: 0,
    wrong: 0,
    lastStage: null,
    questionStats: {},
    reviewSessions: 0,
    unitReviews: {},
    projects: {},
    entitlements: {
      allProjects: false,
      infiniteHearts: false,
    },
    hearts: MAX_HEARTS,
    xp: 0,
    gems: 100,
    streak: 0,
    lastStudyDate: null,
    dailyXp: 0,
    dailyXpDate: null,
  };
}

function withStudyReward(progress, { xp = 0, gems = 0, hearts = 0 }) {
  const today = localDayKey();
  const alreadyStudiedToday = progress.lastStudyDate === today;
  const continuedStreak = progress.lastStudyDate === yesterdayKey();
  const streak = alreadyStudiedToday
    ? progress.streak || 1
    : continuedStreak
      ? Math.max(1, progress.streak || 0) + 1
      : 1;
  const currentDailyXp = progress.dailyXpDate === today ? progress.dailyXp || 0 : 0;

  return {
    ...progress,
    hearts: progress.entitlements?.infiniteHearts
      ? MAX_HEARTS
      : Math.min(MAX_HEARTS, Math.max(0, (progress.hearts ?? MAX_HEARTS) + hearts)),
    xp: (progress.xp || 0) + xp,
    gems: (progress.gems || 0) + gems,
    streak,
    lastStudyDate: today,
    dailyXp: currentDailyXp + xp,
    dailyXpDate: today,
  };
}

const UNIT_META = [
  {
    title: 'Primeiros passos',
    goal: 'Entenda dados, entradas, cálculos e textos.',
    color: '#58cc02'
  },
  {
    title: 'Decisões e repetições',
    goal: 'Controle caminhos e repita ações com clareza.',
    color: '#46a302'
  },
  {
    title: 'Coleções',
    goal: 'Organize sequências, conjuntos e registros.',
    color: '#1cb0f6'
  },
  {
    title: 'Funções e organização',
    goal: 'Crie blocos reutilizáveis e módulos confiáveis.',
    color: '#168dc4'
  },
  {
    title: 'Arquivos e dados',
    goal: 'Leia, transforme e persista informações.',
    color: '#ce82ff'
  },
  {
    title: 'Objetos e modelagem',
    goal: 'Modele entidades e comportamentos reutilizáveis.',
    color: '#9b55db'
  },
  {
    title: 'Qualidade profissional',
    goal: 'Teste, registre e documente o comportamento.',
    color: '#ff9600'
  },
  {
    title: 'Aplicações reais',
    goal: 'Prepare ambientes, integrações e automações.',
    color: '#ff4b4b'
  },
  {
    title: 'Dados aprofundados',
    goal: 'Trate formatos, caminhos e persistência com segurança.',
    color: '#20b486'
  },
  {
    title: 'Engenharia de dados',
    goal: 'Valide, consulte e transforme conjuntos reais.',
    color: '#0d9488'
  },
  {
    title: 'Orientação a objetos II',
    goal: 'Aprofunde estado, propriedades e composição.',
    color: '#6366f1'
  },
  {
    title: 'Modelagem avançada',
    goal: 'Crie objetos expressivos, iteráveis e testáveis.',
    color: '#4f46e5'
  },
  {
    title: 'Python profissional II',
    goal: 'Depure, teste e configure aplicações.',
    color: '#f59e0b'
  },
  {
    title: 'Projetos sustentáveis',
    goal: 'Organize dependências, qualidade e manutenção.',
    color: '#d97706'
  },
  {
    title: 'Aplicações conectadas',
    goal: 'Crie interfaces, APIs e persistência local.',
    color: '#ef4444'
  },
  {
    title: 'Entrega final',
    goal: 'Automatize, empacote e conclua um produto completo.',
    color: '#dc2626'
  },
  {
    title: 'Fundamentos aprofundados',
    goal: 'Execute scripts, entenda referências e compare algoritmos.',
    color: '#22c55e'
  },
  {
    title: 'Biblioteca padrão',
    goal: 'Use contêineres, iteradores, cache e recursos com segurança.',
    color: '#06b6d4'
  },
  {
    title: 'Concorrência e desempenho',
    goal: 'Coordene tarefas externas, processos e otimizações mensuráveis.',
    color: '#8b5cf6'
  }
];

const JOURNEY_X = [50, 68, 76, 64, 43, 27, 22, 36];

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_ID;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Press+Start+2P&family=JetBrains+Mono:wght@400;600;700;800&display=swap';
    document.head.appendChild(link);
  }, []);
}

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const lastStudyDate = saved.lastStudyDate || null;
    const streakIsActive = lastStudyDate === localDayKey() || lastStudyDate === yesterdayKey();
    return {
      completed: saved.completed || {},
      attempts: saved.attempts || {},
      correct: saved.correct || 0,
      wrong: saved.wrong || 0,
      lastStage: saved.lastStage || null,
      questionStats: saved.questionStats || {},
      reviewSessions: saved.reviewSessions || 0,
      unitReviews: saved.unitReviews || {},
      projects: saved.projects || {},
      entitlements: {
        allProjects: Boolean(saved.entitlements?.allProjects),
        infiniteHearts: Boolean(saved.entitlements?.infiniteHearts),
      },
      hearts: Number.isFinite(saved.hearts) ? Math.min(MAX_HEARTS, Math.max(0, saved.hearts)) : MAX_HEARTS,
      xp: Number.isFinite(saved.xp) ? Math.max(0, saved.xp) : 0,
      gems: Number.isFinite(saved.gems) ? Math.max(0, saved.gems) : 100,
      streak: streakIsActive && Number.isFinite(saved.streak) ? Math.max(0, saved.streak) : 0,
      lastStudyDate,
      dailyXp: Number.isFinite(saved.dailyXp) ? Math.max(0, saved.dailyXp) : 0,
      dailyXpDate: saved.dailyXpDate || null,
    };
  } catch {
    return emptyProgress();
  }
}

function readSettings() {
  try {
    return {
      sound: true,
      scanlines: false,
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'),
    };
  } catch {
    return { sound: true, scanlines: false };
  }
}

function persistProgress(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function persistSettings(value) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
}

function useSfx(enabled) {
  return useCallback((type = 'click') => {
    if (!enabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      const tones = {
        click: [310, 390, 0.045],
        ok: [540, 820, 0.09],
        bad: [190, 120, 0.10],
        win: [430, 910, 0.16],
      };
      const [from, to, duration] = tones[type] || tones.click;
      osc.type = 'square';
      osc.frequency.setValueAtTime(from, now);
      osc.frequency.exponentialRampToValueAtTime(to, now + duration);
      gain.gain.setValueAtTime(0.016, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
      setTimeout(() => ctx.close(), 260);
    } catch {}
  }, [enabled]);
}

function courseUnits(stages) {
  const units = [];
  for (let index = 0; index < stages.length; index += 4) {
    const meta = UNIT_META[units.length] || {
      title: `Unidade ${units.length + 1}`,
      goal: 'Continue avançando pela trilha.',
      color: '#1cb0f6',
    };
    units.push({
      ...meta,
      number: units.length + 1,
      stages: stages.slice(index, index + 4),
      startIndex: index,
    });
  }
  return units;
}

function questionKey(stageId, questionIndex) {
  return `${stageId}:${questionIndex}`;
}

function stageLearningSummary(progress, stage) {
  const stats = progress.questionStats || {};
  const total = stage.questions.length;
  let mastered = progress.completed[stage.id] ? total : 0;
  let pending = 0;

  stage.questions.forEach((_, questionIndex) => {
    const question = stats[questionKey(stage.id, questionIndex)];
    if (!progress.completed[stage.id] && question?.correct > 0) mastered += 1;
    if (question?.needsReview) pending += 1;
  });

  return {
    mastered,
    pending,
    total,
    percent: total ? Math.round((mastered / total) * 100) : 0,
  };
}

function courseLearningSummary(stages, progress) {
  return stages.reduce((summary, stage) => {
    const stageSummary = stageLearningSummary(progress, stage);
    return {
      mastered: summary.mastered + stageSummary.mastered,
      pending: summary.pending + stageSummary.pending,
      total: summary.total + stageSummary.total,
    };
  }, { mastered: 0, pending: 0, total: 0 });
}

function questionPool(stages) {
  return stages.flatMap((stage) => stage.questions.map((question, questionIndex) => ({
    ...question,
    stageId: stage.id,
    questionIndex,
    stageName: stage.name,
    color: stage.color,
  })));
}

function stageState(stage, stageIndex, currentIndex, progress) {
  if (progress.completed[stage.id]) return 'done';
  if (stageIndex === currentIndex) return 'current';
  return 'open';
}

function PixelButton({ children, onClick, color = '#58cc02', variant = 'solid', disabled = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`pixel-button ${variant} ${className}`}
      style={{ '--button-color': color }}
    >
      {children}
    </button>
  );
}

const MASCOT_IMAGES = {
  ready: mascotReady,
  focus: mascotFocus,
  celebrate: mascotCelebrate,
};

function PinscherMascot({ mood = 'ready', size = 'medium' }) {
  const image = MASCOT_IMAGES[mood] || mascotReady;

  return (
    <span className={`python-avatar avatar-${size} mood-${mood}`} aria-hidden="true">
      <img className="mascot-sprite" src={image} alt="" draggable="false" />
    </span>
  );
}

const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
  'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
  'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass',
  'raise', 'return', 'try', 'while', 'with', 'yield',
]);

const PYTHON_BUILTINS = new Set([
  'bool', 'dict', 'enumerate', 'float', 'input', 'int', 'len', 'list', 'max', 'min',
  'open', 'print', 'range', 'set', 'str', 'sum', 'super', 'tuple', 'type', 'zip',
]);

const PYTHON_TOKEN_PATTERN = /(#.*$|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|\b(?:bool|dict|enumerate|float|input|int|len|list|max|min|open|print|range|set|str|sum|super|tuple|type|zip)\b|\b\d+(?:\.\d+)?\b|==|!=|<=|>=|:=|\*\*|\/\/|[+\-*/%=<>])/g;

function pythonTokenClass(token) {
  if (token.startsWith('#')) return 'syntax-comment';
  if (token.startsWith("'") || token.startsWith('"')) return 'syntax-string';
  if (PYTHON_KEYWORDS.has(token)) return 'syntax-keyword';
  if (PYTHON_BUILTINS.has(token)) return 'syntax-builtin';
  if (/^\d/.test(token)) return 'syntax-number';
  return 'syntax-operator';
}

function HighlightedPythonLine({ line }) {
  const fragments = [];
  let cursor = 0;

  for (const match of line.matchAll(PYTHON_TOKEN_PATTERN)) {
    const start = match.index ?? 0;
    if (start > cursor) fragments.push(line.slice(cursor, start));
    fragments.push(<span className={pythonTokenClass(match[0])} key={`${start}-${match[0]}`}>{match[0]}</span>);
    cursor = start + match[0].length;
  }

  if (cursor < line.length) fragments.push(line.slice(cursor));
  return fragments.length ? fragments : ' ';
}

function CodeBlock({ text, filename = 'python.py', label = 'EXEMPLO GUIADO', compact = false }) {
  const lines = String(text || '').split('\n');
  return (
    <div className={`code-window ${compact ? 'compact' : ''}`} aria-label={`${label}: ${filename}`}>
      <div className="code-titlebar">
        <span><i /><i /><i /></span>
        <b>{filename}</b>
        <em>PY</em>
      </div>
      <div className="code-modebar"><span>{label}</span><small>SOMENTE LEITURA</small></div>
      <pre><code>{lines.map((line, index) => (
        <span className="code-line" key={`${index}-${line}`}>
          <b>{String(index + 1).padStart(2, '0')}</b>
          <span><HighlightedPythonLine line={line} /></span>
        </span>
      ))}</code></pre>
    </div>
  );
}

function LinearProgress({ value, color = '#58cc02', label }) {
  return (
    <div className="linear-progress" aria-label={label}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%`, '--progress-color': color }} />
    </div>
  );
}

function FlameIcon() {
  return (
    <svg className="flame-icon" viewBox="0 0 24 28" aria-hidden="true" focusable="false">
      <path d="M13.7 1.5c.9 4.5-2.8 5.9-2.8 9.1 0 1.2.7 2.2 1.8 2.7-.1-2.4 1.4-4.2 3.1-5.5 3.1 2.9 5.1 6 5.1 10.2 0 5.2-3.8 8.5-8.9 8.5S3.1 23.2 3.1 18c0-4 2.1-7.2 5.4-10.1.1 2.2.9 3.6 2 4.5-.9-4.7.2-8.3 3.2-10.9Z" />
      <path className="flame-core" d="M12.1 15.3c2 1.8 3.2 3.4 3.2 5.4 0 2-1.4 3.3-3.3 3.3s-3.3-1.3-3.3-3.3c0-1.7.9-3.4 2.4-4.9 0 1 .4 1.8 1 2.3.3-.9.3-1.8 0-2.8Z" />
    </svg>
  );
}

function AppHeader({ stats, settings, active = 'map', onHome, onReview, onHearts, onToggleSound, onToggleScanlines }) {
  return (
    <header className="app-header">
      <button type="button" className="brand" onClick={onHome} aria-label="Voltar para a trilha">
        <span className="brand-cube"><PinscherMascot size="small" /></span>
        <span><b>BLACK BUSTER</b><small>TRILHA COMPLETA DE PYTHON</small></span>
      </button>

      <nav className="desktop-nav" aria-label="Navegação principal">
        <button type="button" className={active === 'map' ? 'active' : ''} onClick={onHome}><span>⌁</span> TRILHA</button>
        <button type="button" className={active === 'practice' ? 'active' : ''} onClick={onReview}><span>◎</span> PRATICAR</button>
      </nav>

      <div className="header-stats">
        <div className="stat-streak" title="Ofensiva diária"><span><FlameIcon /></span><b>{stats.streak}</b></div>
        <div className="stat-xp" title="Experiência total"><span>⚡</span><b>{stats.xp}</b></div>
        <div className="stat-gems" title="Gemas"><span>◆</span><b>{stats.gems}</b></div>
        <button
          type="button"
          className={`stat-hearts ${stats.infiniteHearts ? 'infinite' : ''}`}
          onClick={onHearts}
          title={stats.infiniteHearts ? 'Vidas infinitas ativas' : 'Vidas disponíveis'}
          aria-label={stats.infiniteHearts ? 'Vidas infinitas ativas' : `${stats.hearts} de ${MAX_HEARTS} vidas`}
        >
          <span>♥</span><b>{stats.infiniteHearts ? '∞' : stats.hearts}</b>
        </button>
        <button type="button" className="header-utility" onClick={onToggleSound} title="Ativar ou desativar som" aria-label="Som">
          {settings.sound ? '♪' : '×'}
        </button>
        <button type="button" className="header-utility" onClick={onToggleScanlines} title="Ativar ou desativar efeito retrô" aria-label="Efeito retrô">▤</button>
      </div>
    </header>
  );
}

function MobileNav({ active = 'map', onHome, onReview, onHearts, hearts, infiniteHearts = false }) {
  return (
    <nav className="mobile-nav" aria-label="Navegação para celular">
      <button type="button" className={active === 'map' ? 'active' : ''} onClick={onHome}><span>⌁</span><small>TRILHA</small></button>
      <button type="button" className={active === 'practice' ? 'active' : ''} onClick={onReview}><span>◎</span><small>PRATICAR</small></button>
      <button type="button" className={`mobile-hearts ${infiniteHearts ? 'infinite' : ''}`} onClick={onHearts}><span>♥</span><small>{infiniteHearts ? '∞ VIDAS' : `${hearts}/${MAX_HEARTS} VIDAS`}</small></button>
    </nav>
  );
}

function PremiumOfferBar({ onPurchase }) {
  return (
    <section className="premium-offer-shell" aria-label="Oferta do pacote completo">
      <div className="premium-offer-copy">
        <span className="premium-offer-icon">★</span>
        <div><small>PACOTE COMPLETO</small><b>Todos os projetos + vidas infinitas</b></div>
      </div>
      <div className="premium-offer-price"><strong>R$ 25</strong><small>PAGAMENTO ÚNICO</small></div>
      <button type="button" className="premium-offer-button" onClick={onPurchase}>VER OFERTA</button>
    </section>
  );
}

function NextLessonCard({ stage, stageIndex, started, onContinue, onReview }) {
  return (
    <aside className="next-lesson-card" style={{ '--stage-color': stage.color }}>
      <div className="next-card-titlebar">
        <span><i /><i /><i /></span>
        <b>next_lesson.py</b>
        <em>PY</em>
      </div>
      <div className="next-card-body">
        <div className="next-card-status">
          <span className="next-stage-icon">{stage.icon}</span>
          <div>
            <small>{started ? 'CONTINUE DE ONDE PAROU' : 'SEU PRIMEIRO PASSO'}</small>
            <b>FASE {String(stageIndex + 1).padStart(2, '0')}</b>
          </div>
        </div>
        <h2>{stage.name}</h2>
        <p>{stage.summary}</p>
        <div className="next-card-facts">
          <span><b>{stage.lesson.length}</b> aulas curtas</span>
          <span><b>{stage.questions.length}</b> questões</span>
        </div>
        <PixelButton onClick={onContinue} color={stage.color}>
          {started ? 'CONTINUAR AGORA' : 'COMEÇAR AGORA'}
        </PixelButton>
        <button type="button" className="hero-practice-link" onClick={onReview}>Treinar antes desta fase</button>
      </div>
    </aside>
  );
}

function CourseHero({ stages, progress, currentStage, currentIndex, onContinue, onReview }) {
  const completed = Object.keys(progress.completed).length;
  const percent = Math.round((completed / stages.length) * 100);
  const lessonCount = stages.reduce((total, stage) => total + stage.lesson.length, 0);
  const challengeCount = stages.reduce((total, stage) => total + stage.questions.length, 0);

  return (
    <section className="course-hero route-hero">
      <div className="hero-content">
        <span className="hero-kicker">TRILHA GUIADA · DO ZERO AO PROJETO</span>
        <h1>{completed ? <>CONTINUE SUA<br /><strong>TRILHA.</strong></> : <>PYTHON, PASSO<br /><strong>A PASSO.</strong></>}</h1>
        <div className="hero-guide">
          <PinscherMascot size="medium" mood={completed ? 'focus' : 'ready'} />
          <div>
            <small>GUIA PY · SUA PARCEIRA DE CÓDIGO</small>
            <p>{completed
              ? <>Próxima fase: <b className="hero-next-stage">{currentStage.name}</b>. Continue exatamente de onde parou.</>
              : 'Eu acompanho cada conceito, exemplo e tentativa até você entender.'}</p>
          </div>
        </div>

        <div className="hero-progress">
          <div><span>PROGRESSO GERAL</span><b>{percent}%</b></div>
          <LinearProgress value={percent} color="#58cc02" label={`${percent}% do curso concluído`} />
        </div>

        <div className="course-totals">
          <span><b>{stages.length}</b> FASES</span>
          <span><b>{lessonCount}</b> AULAS</span>
          <span><b>{challengeCount}</b> QUESTÕES</span>
        </div>
      </div>
      <NextLessonCard
        stage={currentStage}
        stageIndex={currentIndex}
        started={completed > 0}
        onContinue={onContinue}
        onReview={onReview}
      />
    </section>
  );
}

function UnitPath({ unit, progress, currentIndex, selectedId, onSelect, onUnitReview }) {
  const points = unit.stages.map((_, localIndex) => ({
    x: JOURNEY_X[(unit.startIndex + localIndex) % JOURNEY_X.length],
    y: 74 + localIndex * 136,
  }));
  const height = Math.max(240, 154 + (unit.stages.length - 1) * 136);

  const curve = (from, to) => {
    const middle = (from.y + to.y) / 2;
    return `M ${from.x} ${from.y} C ${from.x} ${middle}, ${to.x} ${middle}, ${to.x} ${to.y}`;
  };

  const completedInUnit = unit.stages.filter((stage) => progress.completed[stage.id]).length;
  const unitPercent = Math.round((completedInUnit / unit.stages.length) * 100);

  return (
    <section className={`unit-section unit-${unit.number} ${completedInUnit === unit.stages.length ? 'unit-complete' : ''}`} style={{ '--unit-color': unit.color }}>
      <header className="unit-banner">
        <div>
          <span>UNIDADE {unit.number}</span>
          <h2>{unit.title}</h2>
          <p>{unit.goal}</p>
          <div className="unit-meter" aria-label={`${unitPercent}% da unidade concluída`}>
            <span style={{ width: `${unitPercent}%` }} />
          </div>
        </div>
        <span className="unit-progress">
          {completedInUnit}/{unit.stages.length}
        </span>
      </header>

      <div className="journey-canvas" style={{ height }}>
        <div className="unit-pixel-scenery" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <svg className="journey-lines" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
          {points.slice(0, -1).map((point, index) => {
            const traveled = Boolean(progress.completed[unit.stages[index].id]);
            return (
              <g key={`${unit.number}-${index}`}>
                <path className="journey-line-shadow" d={curve(point, points[index + 1])} vectorEffect="non-scaling-stroke" />
                <path className={`journey-line ${traveled ? 'traveled' : ''}`} d={curve(point, points[index + 1])} vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
        </svg>

        {unit.stages.map((stage, localIndex) => {
          const stageIndex = unit.startIndex + localIndex;
          const state = stageState(stage, stageIndex, currentIndex, progress);
          const selected = selectedId === stage.id;
          const point = points[localIndex];
          const attemptCount = progress.attempts[stage.id] || 0;
          const learning = stageLearningSummary(progress, stage);

          return (
            <div
              className={`journey-step ${state} ${selected ? 'selected' : ''}`}
              style={{ left: `${point.x}%`, top: point.y, '--stage-color': stage.color }}
              key={stage.id}
              data-recommended={state === 'current' ? 'true' : undefined}
            >
              {state === 'current' && <span className="continue-flag">CONTINUAR</span>}
              <button
                type="button"
                className="level-node"
                onClick={() => onSelect(stage)}
                aria-label={`Fase ${stageIndex + 1}: ${stage.name}. ${state === 'done' ? 'Concluída' : 'Disponível'}`}
                aria-pressed={selected}
              >
                <span className="node-face">{state === 'done' ? '✓' : stage.icon}</span>
                {(state === 'done' || learning.mastered > 0) && (
                  <span className={`node-mastery ${learning.pending ? 'needs-review' : ''}`}>
                    {learning.pending ? `${learning.pending} REV` : `${learning.percent}%`}
                  </span>
                )}
              </button>
              <span className="level-number">FASE {String(stageIndex + 1).padStart(2, '0')}</span>
              <strong>{stage.name}</strong>
              {attemptCount > 1 && <small>{attemptCount} tentativas</small>}
            </div>
          );
        })}
      </div>

      <div className={`unit-review-gate ${completedInUnit === unit.stages.length ? 'unlocked' : 'locked'} ${progress.unitReviews?.[unit.number] ? 'completed' : ''}`}>
        <span className="unit-review-icon">{progress.unitReviews?.[unit.number] ? '✓' : '◎'}</span>
        <div>
          <small>REVISÃO DA UNIDADE {unit.number}</small>
          <h3>{progress.unitReviews?.[unit.number] ? 'Revisão concluída' : completedInUnit === unit.stages.length ? 'Misture o que aprendeu' : 'Conclua as quatro fases'}</h3>
          <p>8 questões das fases desta unidade · prática segura, sem perder vidas.</p>
        </div>
        <PixelButton
          color={unit.color}
          variant={progress.unitReviews?.[unit.number] ? 'outline' : 'solid'}
          disabled={completedInUnit !== unit.stages.length}
          onClick={() => onUnitReview(unit)}
        >
          {progress.unitReviews?.[unit.number] ? 'REVISAR NOVAMENTE' : completedInUnit === unit.stages.length ? 'COMEÇAR REVISÃO' : `${completedInUnit}/${unit.stages.length} FASES`}
        </PixelButton>
      </div>
    </section>
  );
}

function StageInspector({ stage, stageIndex, state, picked, progress, onClose, onEnter }) {
  if (!stage) return null;
  const statusLabel = state === 'done' ? 'FASE CONCLUÍDA' : state === 'current' ? 'PRÓXIMA FASE' : 'FASE DISPONÍVEL';
  const learning = stageLearningSummary(progress, stage);
  const learningNote = learning.pending
    ? `${learning.pending} ${learning.pending === 1 ? 'questão precisa' : 'questões precisam'} de uma revisão focada.`
    : learning.mastered === learning.total
      ? 'Todas as questões desta fase já foram dominadas.'
      : `${learning.mastered} de ${learning.total} questões dominadas até agora.`;
  return (
    <section className={`stage-inspector ${picked ? 'picked' : 'suggested'}`} style={{ '--stage-color': stage.color }}>
      <button className="inspector-close" type="button" onClick={onClose} aria-label="Fechar detalhes">×</button>
      <div className="inspector-head">
        <span className="inspector-icon">{state === 'done' ? '✓' : stage.icon}</span>
        <div><small>{statusLabel}</small><b>FASE {String(stageIndex + 1).padStart(2, '0')}</b></div>
      </div>
      <h2>{stage.name}</h2>
      <p>{stage.summary}</p>
      <div className="inspector-guide">
        <PinscherMascot size="tiny" mood="focus" />
        <div><small>GUIA PY</small><p>{state === 'done'
          ? learning.pending ? 'Há pontos desta fase na sua revisão personalizada.' : 'Fase dominada. Treine novamente quando quiser.'
          : state === 'current'
            ? 'Este é o próximo passo recomendado da sua trilha.'
            : 'Pode estudar fora de ordem: esta fase está liberada.'}</p></div>
      </div>
      <div className="stage-mastery">
        <div><span>DOMÍNIO DA FASE</span><b>{learning.percent}%</b></div>
        <LinearProgress value={learning.percent} color={learning.pending ? '#ff9600' : stage.color} label={`${learning.percent}% de domínio em ${stage.name}`} />
        <small className={learning.pending ? 'needs-review' : ''}>{learningNote}</small>
      </div>
      <div className="stage-facts">
        <span><b>{stage.lesson.length}</b>AULAS</span>
        <span><b>{stage.questions.length}</b>QUESTÕES</span>
        <span><b>∞</b>TENTATIVAS</span>
      </div>
      <PixelButton color={stage.color} onClick={() => onEnter(stage)}>
        {state === 'done' ? 'REVISAR FASE' : state === 'current' ? 'CONTINUAR' : 'COMEÇAR AGORA'}
      </PixelButton>
      <small className="unlocked-note">Todas as fases permanecem livres para estudo.</small>
    </section>
  );
}

function ProgressCard({ stages, progress }) {
  const completed = Object.keys(progress.completed).length;
  const percent = Math.round((completed / stages.length) * 100);
  const answered = progress.correct + progress.wrong;
  const accuracy = answered ? Math.round((progress.correct / answered) * 100) : 0;
  const learning = courseLearningSummary(stages, progress);
  return (
    <section className="rail-card progress-card">
      <div className="rail-title"><span>SEU PROGRESSO</span><b>{percent}%</b></div>
      <div className="progress-orbit" style={{ '--course-progress': `${percent * 3.6}deg` }}>
        <div><b>{completed}</b><small>DE {stages.length}</small></div>
      </div>
      <div className="rail-learning">
        <div><span>QUESTÕES DOMINADAS</span><b>{learning.mastered}/{learning.total}</b></div>
        <LinearProgress value={learning.total ? (learning.mastered / learning.total) * 100 : 0} color="#58cc02" label={`${learning.mastered} de ${learning.total} questões dominadas`} />
        <span className={`review-pending ${learning.pending ? 'has-pending' : ''}`}>
          <b>{learning.pending}</b> {learning.pending === 1 ? 'QUESTÃO PARA REVISAR' : 'QUESTÕES PARA REVISAR'}
        </span>
      </div>
      <div className="rail-stats">
        <span><b>{progress.correct}</b> ACERTOS</span>
        <span><b>{accuracy}%</b> PRECISÃO</span>
      </div>
    </section>
  );
}

function DailyGoalCard({ progress }) {
  const todayXp = progress.dailyXpDate === localDayKey() ? progress.dailyXp || 0 : 0;
  const percent = Math.min(100, (todayXp / DAILY_GOAL_XP) * 100);
  return (
    <section className="rail-card daily-goal-card">
      <span className="daily-flame"><FlameIcon /></span>
      <div className="daily-goal-copy">
        <small>OFENSIVA DE {progress.streak || 0} {progress.streak === 1 ? 'DIA' : 'DIAS'}</small>
        <h3>Meta diária</h3>
        <div><span>{todayXp}/{DAILY_GOAL_XP} XP</span><b>{Math.round(percent)}%</b></div>
        <LinearProgress value={percent} color="#ff9600" label={`${todayXp} de ${DAILY_GOAL_XP} XP na meta diária`} />
      </div>
    </section>
  );
}

function CourseMap({ stages, projects = [], tracks = [], progress, onEnter, onReview, onUnitReview, onOpenProject, onPurchase, onReset }) {
  const units = useMemo(() => courseUnits(stages), [stages]);
  const learning = courseLearningSummary(stages, progress);
  const currentIndex = Math.max(0, stages.findIndex((stage) => !progress.completed[stage.id]));
  const fallbackIndex = currentIndex === -1 ? stages.length - 1 : currentIndex;
  const recommendedIndex = stages.every((stage) => progress.completed[stage.id]) ? stages.length - 1 : fallbackIndex;
  const recommended = stages[recommendedIndex];
  const [selected, setSelected] = useState(recommended);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    setSelected(recommended);
    setPicked(false);
  }, [recommended]);

  useEffect(() => {
    if (Object.keys(progress.completed).length === 0) return undefined;
    const frame = requestAnimationFrame(() => {
      document.querySelector('[data-recommended="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const selectedIndex = Math.max(0, stages.findIndex((stage) => stage.id === selected.id));
  const selectedState = stageState(selected, selectedIndex, recommendedIndex, progress);

  return (
    <main className="course-map">
      <CourseHero
        stages={stages}
        progress={progress}
        currentStage={recommended}
        currentIndex={recommendedIndex}
        onContinue={() => onEnter(recommended)}
        onReview={onReview}
      />

      <div className="course-layout">
        <div className="path-column">
          <div className="path-intro">
            <div><span>TRILHA DE PYTHON</span><h2>Aprenda e aplique no mesmo caminho</h2></div>
            <p>Fases, revisões, projetos práticos e especializações agora fazem parte de uma única trilha.</p>
          </div>

          {units.map((unit) => {
            const stageIds = new Set(unit.stages.map((stage) => stage.id));
            const unitProjects = projects.filter((project) => stageIds.has(project.unlockStage));
            return (
              <React.Fragment key={unit.number}>
                <UnitPath
                  unit={unit}
                  progress={progress}
                  currentIndex={recommendedIndex}
                  selectedId={selected.id}
                  onSelect={(stage) => { setSelected(stage); setPicked(true); }}
                  onUnitReview={onUnitReview}
                />
                <TrailProjectMilestones
                  projects={unitProjects}
                  stages={stages}
                  progress={progress}
                  onOpen={onOpenProject}
                />
              </React.Fragment>
            );
          })}

          <section className="premium-store trail-premium-store">
            <div className="premium-store-title">
              <div><span className="project-kicker">PACOTE COMPLETO · COMPRA ILUSTRATIVA</span><h2>Projetos livres + vidas infinitas</h2></div>
              <small>Pagamento único de R$ 25,00 · nenhuma cobrança real nesta versão.</small>
            </div>
            <div className="premium-products">
              <article className={progress.entitlements?.allProjects && progress.entitlements?.infiniteHearts ? 'active premium-bundle' : 'premium-bundle'}>
                <span className="premium-product-icon">★</span>
                <div><small>ACESSO TOTAL À TRILHA</small><h3>Libere toda a prática Python</h3><p>Abre projetos e missões sem pré-requisitos e remove a perda de vidas.</p></div>
                <strong>R$ 25,00<small>PAGAMENTO ÚNICO</small></strong>
                <PixelButton className="premium-buy-button" color="#8b5cf6" disabled={progress.entitlements?.allProjects && progress.entitlements?.infiniteHearts} onClick={onPurchase}>
                  {progress.entitlements?.allProjects && progress.entitlements?.infiniteHearts ? 'PACOTE ATIVO ✓' : 'COMPRAR PACOTE · ILUSTRATIVO'}
                </PixelButton>
              </article>
            </div>
          </section>

          <TrailSpecializations tracks={tracks} progress={progress} onOpen={onOpenProject} />

          <div className="finish-marker"><span>Ω</span><div><b>TRILHA PYTHON COMPLETA</b><small>64 fases, projetos e especializações no mesmo caminho.</small></div></div>
          <button className="reset-progress" type="button" onClick={onReset}>ZERAR PROGRESSO SALVO</button>
        </div>

        <aside className="course-rail">
          <StageInspector
            stage={selected}
            stageIndex={selectedIndex}
            state={selectedState}
            picked={picked}
            progress={progress}
            onClose={() => setPicked(false)}
            onEnter={onEnter}
          />
          <DailyGoalCard progress={progress} />
          <ProgressCard stages={stages} progress={progress} />
          <section className="rail-card practice-card">
            <span className="practice-symbol">◎</span>
            <div><small>REVISÃO INTELIGENTE</small><h3>{learning.pending ? `${learning.pending} ${learning.pending === 1 ? 'ponto pede' : 'pontos pedem'} atenção` : 'Pratique sem alterar a trilha'}</h3><p>{learning.pending ? 'Treine primeiro as questões em que você errou.' : 'Misture questões de todas as fases quando quiser.'}</p></div>
            <PixelButton color={learning.pending ? '#ff9600' : '#1cb0f6'} variant="outline" onClick={onReview}>
              {learning.pending ? `REVISAR ${learning.pending} ${learning.pending === 1 ? 'ERRO' : 'ERROS'}` : 'ABRIR PRÁTICA'}
            </PixelButton>
          </section>
        </aside>
      </div>
    </main>
  );
}

function FocusHeader({ stage, step, total, onExit, hearts = MAX_HEARTS, safePractice = false, heartReward = false, infiniteHearts = false }) {
  const percent = total ? (step / total) * 100 : 0;
  return (
    <div className="focus-header" style={{ '--stage-color': stage.color }}>
      <button type="button" onClick={onExit} aria-label="Sair e voltar para a trilha">×</button>
      <LinearProgress value={percent} color={stage.color} label={`${Math.round(percent)}% da fase`} />
      <span className={`focus-heart-count ${safePractice || infiniteHearts ? 'safe' : ''}`} title={safePractice ? 'Prática sem perda de vidas' : infiniteHearts ? 'Vidas infinitas ativas' : `${hearts} vidas restantes`}>
        <i>♥</i><b>{heartReward ? '+1' : safePractice || infiniteHearts ? '∞' : hearts}</b>
      </span>
    </div>
  );
}

function LessonScreen({ stage, stageIndex, hearts, infiniteHearts = false, onExit, onBattle, sfx }) {
  const [index, setIndex] = useState(0);
  const card = stage.lesson[index];
  const last = index === stage.lesson.length - 1;
  const move = (nextIndex) => { setIndex(nextIndex); sfx('click'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <main className="focus-screen lesson-screen" style={{ '--stage-color': stage.color }}>
      <FocusHeader stage={stage} step={index + 1} total={stage.lesson.length + 1} hearts={hearts} infiniteHearts={infiniteHearts} onExit={onExit} />
      <div className="focus-shell">
        <div className="lesson-heading">
          <span className="lesson-stage-icon">{stage.icon}</span>
          <div><small>FASE {String(stageIndex + 1).padStart(2, '0')} · {stage.difficulty}</small><h1>{stage.name}</h1></div>
          <em><small>CONCEITO</small><b>{String(index + 1).padStart(2, '0')} / {String(stage.lesson.length).padStart(2, '0')}</b></em>
        </div>

        <nav className="lesson-concepts" aria-label="Conceitos desta fase">
          {stage.lesson.map((lesson, lessonIndex) => {
            const state = lessonIndex < index ? 'done' : lessonIndex === index ? 'current' : 'upcoming';
            return (
              <button
                type="button"
                className={state}
                key={lesson.title}
                disabled={lessonIndex === index}
                aria-current={lessonIndex === index ? 'step' : undefined}
                onClick={() => move(lessonIndex)}
              >
                <span>{lessonIndex < index ? '✓' : lessonIndex + 1}</span>
                <b>{lesson.title}</b>
              </button>
            );
          })}
        </nav>

        <section className="learning-card">
          <div className="lesson-copy">
            <div className="lesson-card-topline">
              <span className="card-kicker">CONCEITO {String(index + 1).padStart(2, '0')}</span>
              <span className="lesson-mode">AULA GUIADA</span>
            </div>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
            <div className="lesson-read-tip">
              <span>→</span>
              <p><b>Agora observe o exemplo</b>Leia de cima para baixo e procure o conceito destacado. Você não precisa digitar código nesta etapa.</p>
            </div>
          </div>
          <CodeBlock
            text={card.code}
            filename={`${stage.id}_conceito_${index + 1}.py`}
            label="LEITURA DE CÓDIGO"
          />
        </section>

        <div className="focus-actions">
          <PixelButton variant="ghost" color="#8190a5" disabled={index === 0} onClick={() => move(index - 1)}>VOLTAR</PixelButton>
          {last ? (
            <PixelButton color={stage.color} onClick={() => { sfx('click'); onBattle(); }}>IR PARA AS QUESTÕES</PixelButton>
          ) : (
            <PixelButton color={stage.color} onClick={() => move(index + 1)}>ENTENDI, CONTINUAR</PixelButton>
          )}
        </div>
      </div>
    </main>
  );
}

const QUESTION_FORMAT_LABELS = {
  'CONCEITO': 'ENTENDA O CONCEITO',
  'LEITURA DE CÓDIGO': 'LEIA O CÓDIGO',
  'PREVISÃO DE RESULTADO': 'PREVEJA O RESULTADO',
  'ENCONTRE O ERRO': 'ENCONTRE O PROBLEMA',
  'CORRIJA O ERRO': 'ESCOLHA A CORREÇÃO',
  'DECISÃO DE CÓDIGO': 'ESCOLHA A MELHOR SOLUÇÃO',
  'APLICAÇÃO PRÁTICA': 'APLIQUE O QUE APRENDEU',
};

function QuestionCard({ question, stageColor, selected, wrong, correct, onSelect, hearts, safePractice = false }) {
  return (
    <section className="question-card">
      <div className="question-card-header">
        <span className="card-kicker">{QUESTION_FORMAT_LABELS[question.format] || 'ESCOLHA A RESPOSTA CORRETA'}</span>
        <span className={`question-attempts ${safePractice ? 'safe' : ''} ${wrong.length ? 'has-errors' : ''}`}>
          {safePractice
            ? 'PRÁTICA SEM CUSTO'
            : `♥ ${hearts} ${hearts === 1 ? 'VIDA' : 'VIDAS'}`}
        </span>
      </div>
      {question.type === 'code' ? <CodeBlock text={question.q} filename="desafio.py" label="ANALISE O CÓDIGO" compact /> : <h2>{question.q}</h2>}
      <div className="answers">
        {question.opts.map((option, index) => {
          const state = correct && index === question.a
            ? 'correct'
            : wrong.includes(index)
              ? 'wrong'
              : selected === index
                ? 'selected'
                : '';
          return (
            <button
              type="button"
              className={`answer ${state}`}
              key={`${option}-${index}`}
              disabled={correct || wrong.includes(index)}
              aria-pressed={selected === index}
              onClick={() => onSelect(index)}
              style={{ '--stage-color': stageColor }}
            >
              <span>{index + 1}</span>
              <b>{option}</b>
              <em>{state === 'correct' ? '✓' : state === 'wrong' ? '×' : state === 'selected' ? '●' : ''}</em>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function QuestionFeedback({ question, selected, wrong, correct, color, nextLabel, onCheck, onNext, usesHearts = false, hearts = MAX_HEARTS }) {
  const state = correct ? 'success' : wrong.length ? 'error' : 'neutral';
  const title = correct ? 'MANDOU BEM!' : wrong.length ? usesHearts ? 'VOCÊ PERDEU UMA VIDA' : 'QUASE LÁ' : 'CONFIRME SUA ESCOLHA';
  const message = correct
    ? question.ex
    : wrong.length
      ? usesHearts ? `${question.hint} Restam ${hearts} ${hearts === 1 ? 'vida' : 'vidas'}.` : question.hint
      : 'Selecione uma das opções acima. Você pode tentar novamente quantas vezes precisar.';
  const checkLabel = wrong.length
    ? selected === null ? 'ESCOLHA OUTRA OPÇÃO' : 'VERIFICAR NOVAMENTE'
    : 'VERIFICAR';

  return (
    <div className={`answer-feedback ${state}`} role="status" aria-live="polite">
      <span>{correct ? '✓' : wrong.length ? '!' : '?'}</span>
      <div><b>{title}</b><p>{message}</p></div>
      <PixelButton
        color={correct ? '#58cc02' : color}
        disabled={!correct && selected === null}
        onClick={correct ? onNext : onCheck}
      >
        {correct ? nextLabel : checkLabel}
      </PixelButton>
    </div>
  );
}

function BattleScreen({ stage, hearts, infiniteHearts = false, progress, onExit, onWin, onStat, onHeartPractice, onRefillHearts, onPurchasePremium, sfx }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [heartGate, setHeartGate] = useState(false);
  const question = stage.questions[index];
  const last = index === stage.questions.length - 1;

  const select = useCallback((answerIndex) => {
    if (correct || wrong.includes(answerIndex)) return;
    setSelected(answerIndex);
    sfx('click');
  }, [correct, sfx, wrong]);

  const check = useCallback(() => {
    if (correct || selected === null) return;
    if (selected === question.a) {
      setCorrect(true);
      onStat('correct', { stageId: stage.id, questionIndex: index, mode: 'battle', firstTry: wrong.length === 0 });
      sfx('ok');
    } else {
      setWrong((items) => [...items, selected]);
      setSelected(null);
      onStat('wrong', { stageId: stage.id, questionIndex: index, mode: 'battle', firstTry: false });
      sfx('bad');
      if (!infiniteHearts && hearts <= 1) setHeartGate(true);
    }
  }, [correct, hearts, index, infiniteHearts, onStat, question.a, selected, sfx, stage.id, wrong.length]);

  const next = useCallback(() => {
    if (last) {
      sfx('win');
      onWin();
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setWrong([]);
    setCorrect(false);
    sfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [last, onWin, sfx]);

  useEffect(() => {
    const keyboard = (event) => {
      if (['1', '2', '3', '4'].includes(event.key) && !correct) select(Number(event.key) - 1);
      if (event.key === 'Enter') correct ? next() : check();
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, [check, correct, next, select]);

  if (heartGate) {
    return (
      <HeartsScreen
        progress={progress}
        onExit={onExit}
        onPractice={onHeartPractice}
        onRefill={() => { onRefillHearts(); setHeartGate(false); }}
        onPurchasePremium={() => {
          if (onPurchasePremium?.()) setHeartGate(false);
        }}
      />
    );
  }

  return (
    <main className="focus-screen battle-screen" style={{ '--stage-color': stage.color }}>
      <FocusHeader stage={stage} step={index + 1} total={stage.questions.length} hearts={hearts} infiniteHearts={infiniteHearts} onExit={onExit} />
      <div className="focus-shell challenge-shell">
        <div className="challenge-heading">
          <div><small>DESAFIO · {stage.name}</small><h1>Questão {index + 1} de {stage.questions.length}</h1></div>
          <span>{stage.icon}</span>
        </div>

        <QuestionCard
          question={question}
          stageColor={stage.color}
          selected={selected}
          wrong={wrong}
          correct={correct}
          onSelect={select}
          hearts={hearts}
          safePractice={infiniteHearts}
        />
        <QuestionFeedback
          question={question}
          selected={selected}
          wrong={wrong}
          correct={correct}
          color={stage.color}
          nextLabel={last ? 'CONCLUIR FASE' : 'CONTINUAR'}
          onCheck={check}
          onNext={next}
          usesHearts={!infiniteHearts}
          hearts={hearts}
        />
        <p className="keyboard-help">ATALHOS: 1–4 SELECIONA · ENTER VERIFICA OU CONTINUA</p>
      </div>
    </main>
  );
}

function WinScreen({ stage, nextStage, reward, streak, onMap, onReplay, onContinue }) {
  return (
    <main className="win-screen" style={{ '--stage-color': stage.color }}>
      <div className="pixel-confetti" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <section className="win-card">
        <div className="win-avatar"><PinscherMascot size="large" mood="celebrate" /><span>✓</span></div>
        <small>FASE CONCLUÍDA · GUIA PY</small>
        <h1>{stage.name}</h1>
        <p>Conteúdo estudado e desafio finalizado. A fase continua aberta para revisão quando quiser.</p>
        <div className="win-summary">
          <span className="reward-xp"><b>+{reward.xp}</b>XP</span>
          <span className="reward-gems"><b>+{reward.gems}</b>GEMAS</span>
          <span className="reward-streak"><b><FlameIcon /> {streak}</b>OFENSIVA</span>
        </div>
        <div className="win-actions">
          {nextStage && <PixelButton color="#58cc02" onClick={onContinue}>PRÓXIMA FASE →</PixelButton>}
          <PixelButton color="#1cb0f6" variant="outline" onClick={onMap}>VER TRILHA</PixelButton>
          <button type="button" className="text-action" onClick={onReplay}>REPETIR ESTA FASE</button>
        </div>
      </section>
    </main>
  );
}

function HeartsScreen({ progress, onExit, onPractice, onRefill, onPurchasePremium }) {
  const infinite = Boolean(progress.entitlements?.infiniteHearts);
  const full = infinite || progress.hearts >= MAX_HEARTS;
  const canBuy = !infinite && !full && progress.gems >= HEART_REFILL_COST;
  return (
    <main className="hearts-screen">
      <section className="hearts-card">
        <button type="button" className="hearts-close" onClick={onExit} aria-label="Voltar para a trilha">×</button>
        <div className="hearts-avatar"><PinscherMascot size="large" mood={full ? 'celebrate' : 'focus'} /><span>{infinite ? '∞' : '♥'}</span></div>
        <small>CENTRAL DE VIDAS</small>
        <h1>{infinite ? 'Vidas infinitas ativas!' : full ? 'Suas vidas estão cheias!' : progress.hearts ? 'Recupere suas vidas' : 'Suas vidas acabaram'}</h1>
        <p>{infinite ? 'Você pode errar e continuar estudando sem perder vidas.' : 'Erros nas fases custam uma vida. Faça uma prática curta para recuperar uma ou use gemas para completar todas.'}</p>
        <div className={`heart-meter ${infinite ? 'infinite' : ''}`} aria-label={infinite ? 'Vidas infinitas ativas' : `${progress.hearts} de ${MAX_HEARTS} vidas`}>
          {infinite ? <strong>∞</strong> : Array.from({ length: MAX_HEARTS }, (_, index) => <span className={index < progress.hearts ? 'full' : ''} key={index}>♥</span>)}
        </div>
        <div className="hearts-actions">
          <PixelButton color="#58cc02" disabled={full} onClick={onPractice}>
            {infinite ? 'VIDAS INFINITAS ✓' : full ? 'VIDAS CHEIAS ✓' : 'PRATICAR PARA GANHAR 1 VIDA'}
          </PixelButton>
          <PixelButton color="#1cb0f6" variant="outline" disabled={!canBuy} onClick={onRefill}>
            {infinite ? 'RECURSO PREMIUM ATIVO' : full ? 'NÃO PRECISA RECARREGAR' : `COMPLETAR VIDAS · ◆ ${HEART_REFILL_COST}`}
          </PixelButton>
          {!infinite && (
            <PixelButton color="#ce82ff" variant="outline" onClick={onPurchasePremium}>
              PROJETOS + VIDAS INFINITAS · R$ 25,00
            </PixelButton>
          )}
          {!infinite && !full && !canBuy && <small className="not-enough-gems">Você tem ◆ {progress.gems}. São necessárias {HEART_REFILL_COST} gemas.</small>}
          <button type="button" className="text-action" onClick={onExit}>VOLTAR À TRILHA</button>
        </div>
      </section>
    </main>
  );
}


function projectUnlocked(project, progress) {
  return Boolean(progress.entitlements?.allProjects)
    || (Boolean(progress.completed?.[project.unlockStage])
      && (!project.prerequisite || Boolean(progress.projects?.[project.prerequisite])));
}

function TrailProjectMilestones({ projects, stages, progress, onOpen }) {
  if (!projects.length) return null;
  const stageNumber = (stageId) => stages.findIndex((stage) => stage.id === stageId) + 1;

  return (
    <section className="trail-project-milestones">
      <div className="trail-project-title">
        <div><small>PRÁTICA DA TRILHA</small><h3>{projects.length === 1 ? 'Projeto liberado nesta etapa' : 'Projetos liberados nesta etapa'}</h3></div>
        <span>▣</span>
      </div>
      <div className="trail-project-list">
        {projects.map((project) => {
          const unlocked = projectUnlocked(project, progress);
          const completed = Boolean(progress.projects?.[project.id]);
          return (
            <article className={`trail-project-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`} key={project.id} style={{ '--project-color': project.color }}>
              <span className="trail-project-icon">{project.icon}</span>
              <div>
                <small>PROJETO · APÓS A FASE {String(stageNumber(project.unlockStage)).padStart(2, '0')}</small>
                <h4>{project.title}</h4>
                <p>{project.brief}</p>
                <em>{project.outcome}</em>
              </div>
              <PixelButton
                color={project.color}
                variant={completed ? 'outline' : 'solid'}
                disabled={!unlocked}
                onClick={() => onOpen(project)}
              >
                {completed ? 'REFAZER' : unlocked ? 'COMEÇAR PROJETO' : 'BLOQUEADO'}
              </PixelButton>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TrailSpecializations({ tracks, progress, onOpen }) {
  if (!tracks.length) return null;
  const allProjects = Boolean(progress.entitlements?.allProjects);

  return (
    <section className="trail-specializations">
      <div className="trail-specializations-title">
        <span className="project-kicker">DEPOIS DAS 64 FASES</span>
        <h2>Especializações da trilha Python</h2>
        <p>Escolha Automação ou Aplicações. Cada missão abre a próxima e continua usando desafios guiados.</p>
      </div>

      {tracks.map((track) => {
        const completed = track.missions.filter((mission) => progress.projects?.[mission.id]).length;
        const unlocked = allProjects || Boolean(progress.completed?.[track.unlockStage]);
        return (
          <article className={`track-panel ${unlocked ? 'unlocked' : 'locked'}`} key={track.id} style={{ '--track-color': track.color }}>
            <header>
              <span className="track-icon">{track.icon}</span>
              <div><small>ESPECIALIZAÇÃO</small><h3>{track.title}</h3><p>{track.subtitle}</p></div>
              <strong>{completed}/{track.missions.length}<small>MISSÕES</small></strong>
            </header>
            <div className="track-progress"><span style={{ width: `${(completed / track.missions.length) * 100}%` }} /></div>
            <div className="track-missions">
              {track.missions.map((mission, index) => {
                const missionUnlocked = projectUnlocked(mission, progress);
                const missionCompleted = Boolean(progress.projects?.[mission.id]);
                return (
                  <div className={`track-mission ${missionUnlocked ? 'unlocked' : 'locked'} ${missionCompleted ? 'completed' : ''}`} key={mission.id}>
                    <span>{mission.icon}</span>
                    <div><small>MISSÃO {index + 1}</small><b>{mission.title}</b><p>{mission.brief}</p></div>
                    <PixelButton
                      color={mission.color}
                      variant={missionCompleted ? 'outline' : 'solid'}
                      disabled={!missionUnlocked}
                      onClick={() => onOpen(mission)}
                    >
                      {missionCompleted ? 'REFAZER' : missionUnlocked ? 'INICIAR' : mission.prerequisite ? 'EM SEQUÊNCIA' : 'FASE 64'}
                    </PixelButton>
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </section>
  );
}

function ProjectScreen({ project, alreadyCompleted, onExit, onComplete, sfx }) {
  const [firstCompletion] = useState(() => !alreadyCompleted);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const current = project.steps[step];
  const correct = selected === current?.a;

  const choose = (index) => {
    if (selected !== null) return;
    setSelected(index);
    sfx(index === current.a ? 'ok' : 'bad');
  };

  const advance = () => {
    if (selected === null) return;
    if (step === project.steps.length - 1) {
      onComplete(project);
      setFinished(true);
      sfx('win');
      return;
    }
    setStep((value) => value + 1);
    setSelected(null);
  };

  if (finished) {
    return (
      <main className="project-finish" style={{ '--project-color': project.color }}>
        <section>
          <div className="project-finish-mascot"><PinscherMascot size="large" mood="celebrate" /><span>✓</span></div>
          <small>DESAFIO CONCLUÍDO</small>
          <h1>{project.title}</h1>
          <p>Você fechou as decisões centrais do projeto e já tem uma arquitetura pronta para implementar.</p>
          <div className="project-reward">
            <span><b>+{firstCompletion ? 15 : 5}</b> XP</span>
            <span><b>+{firstCompletion ? 15 : 0}</b> GEMAS</span>
          </div>
          <PixelButton color={project.color} onClick={onExit}>VOLTAR AO LABORATÓRIO</PixelButton>
        </section>
      </main>
    );
  }

  return (
    <main className="project-player" style={{ '--project-color': project.color }}>
      <header className="project-player-header">
        <button type="button" onClick={onExit} aria-label="Fechar projeto">×</button>
        <LinearProgress value={((step + 1) / project.steps.length) * 100} color={project.color} label={`Decisão ${step + 1} de ${project.steps.length}`} />
        <span>{step + 1}/{project.steps.length}</span>
      </header>

      <div className="project-player-shell">
        <section className="project-brief">
          <span className="project-kicker">{project.category} · PROJETO GUIADO</span>
          <h1>{project.title}</h1>
          <p>{project.brief}</p>
          <div><b>RESULTADO</b><span>{project.outcome}</span></div>
        </section>

        <CodeBlock text={project.starter} filename={`${project.id}_starter.py`} label="CÓDIGO-BASE" />

        <section className="project-decision">
          <small>DECISÃO {step + 1} DE {project.steps.length}</small>
          <h2>{current.q}</h2>
          <div className="project-options">
            {current.opts.map((option, index) => (
              <button
                type="button"
                key={option}
                className={selected === null ? '' : index === current.a ? 'correct' : index === selected ? 'wrong' : 'muted'}
                onClick={() => choose(index)}
                disabled={selected !== null}
              >
                <span>{String.fromCharCode(65 + index)}</span>{option}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div className={`project-feedback ${correct ? 'correct' : 'wrong'}`}>
              <b>{correct ? 'BOA DECISÃO' : 'VEJA A MELHOR ESCOLHA'}</b>
              <p>{current.explanation}</p>
            </div>
          )}
          <PixelButton color={project.color} disabled={selected === null} onClick={advance}>
            {step === project.steps.length - 1 ? 'CONCLUIR PROJETO' : 'PRÓXIMA DECISÃO'}
          </PixelButton>
        </section>
      </div>
    </main>
  );
}

function PracticeHub({ stages, progress, onExit, onStart }) {
  const infiniteHearts = Boolean(progress.entitlements?.infiniteHearts);
  const learning = courseLearningSummary(stages, progress);
  const completed = Object.keys(progress.completed).length;
  const weakStages = stages
    .map((stage, stageIndex) => ({ stage, stageIndex, ...stageLearningSummary(progress, stage) }))
    .filter((item) => item.pending > 0)
    .sort((a, b) => b.pending - a.pending);

  return (
    <main className="practice-hub">
      <header className="practice-hub-header">
        <button type="button" onClick={onExit} aria-label="Fechar a central de revisão">×</button>
        <div><small>CENTRAL DE REVISÃO</small><b>Pratique com propósito</b></div>
        <span><PinscherMascot size="tiny" mood="focus" /></span>
      </header>

      <div className="practice-hub-shell">
        <section className="practice-intro">
          <div>
            <span className="practice-kicker">SEU PLANO DE ESTUDO</span>
            <h1>Fortaleça o que ainda precisa de atenção.</h1>
            <p>A Guia Py separa seus erros para você revisar primeiro. A prática é segura e não consome vidas.</p>
          </div>
          <div className="practice-overview" aria-label="Resumo do aprendizado">
            <span><b>{learning.mastered}</b><small>DE {learning.total}<br />DOMINADAS</small></span>
            <span className={learning.pending ? 'attention' : ''}><b>{learning.pending}</b><small>PARA<br />REVISAR</small></span>
            <span><b>{progress.reviewSessions || 0}</b><small>SESSÕES<br />FEITAS</small></span>
          </div>
        </section>

        <section className={`practice-heart-banner ${!infiniteHearts && progress.hearts < MAX_HEARTS ? 'needs-heart' : ''} ${infiniteHearts ? 'infinite' : ''}`}>
          <span className="practice-heart-icon">{infiniteHearts ? '∞' : '♥'}</span>
          <div>
            <small>VIDAS</small>
            <h2>{infiniteHearts ? '∞ disponíveis' : `${progress.hearts}/${MAX_HEARTS} disponíveis`}</h2>
            <p>{infiniteHearts ? 'Vidas infinitas ativas: erros não interrompem seu estudo.' : 'Complete uma prática de 5 questões para recuperar uma vida.'}</p>
          </div>
          <PixelButton color="#ff4b4b" variant="outline" disabled={infiniteHearts || progress.hearts >= MAX_HEARTS} onClick={() => onStart('hearts')}>
            {infiniteHearts ? 'VIDAS INFINITAS ✓' : progress.hearts >= MAX_HEARTS ? 'VIDAS CHEIAS ✓' : 'RECUPERAR 1 VIDA'}
          </PixelButton>
        </section>

        <div className="practice-modes">
          <article className={`practice-mode focused ${learning.pending ? '' : 'is-clear'}`}>
            <div className="practice-mode-top"><span>↺</span><small>RECOMENDADO</small></div>
            <div className="practice-mode-count"><b>{learning.pending}</b><span>{learning.pending === 1 ? 'QUESTÃO' : 'QUESTÕES'}</span></div>
            <h2>{learning.pending ? 'Revisar meus erros' : 'Nenhum erro pendente'}</h2>
            <p>{learning.pending
              ? 'Um treino curto só com os pontos que você errou. A pendência some quando você acertar de primeira.'
              : 'Ótimo trabalho. Quando surgir um novo erro, ele aparecerá automaticamente aqui.'}</p>
            <PixelButton color={learning.pending ? '#ff9600' : '#58cc02'} disabled={!learning.pending} onClick={() => onStart('mistakes')}>
              {learning.pending ? 'COMEÇAR REVISÃO' : 'TUDO EM DIA ✓'}
            </PixelButton>
          </article>

          <article className="practice-mode mixed">
            <div className="practice-mode-top"><span>⌘</span><small>TREINO LIVRE</small></div>
            <div className="practice-mode-count"><b>10</b><span>QUESTÕES</span></div>
            <h2>Treino misto</h2>
            <p>Dez questões aleatórias de toda a trilha para manter os conceitos frescos, sem mudar a conclusão das fases.</p>
            <PixelButton color="#1cb0f6" onClick={() => onStart('mixed')}>MISTURAR QUESTÕES</PixelButton>
          </article>
        </div>

        <section className="review-map">
          <div className="review-map-title">
            <div><small>MAPA DE REVISÃO</small><h2>{weakStages.length ? 'Fases que pedem atenção' : 'Seu mapa está limpo'}</h2></div>
            <span>{completed}/{stages.length} FASES CONCLUÍDAS</span>
          </div>
          {weakStages.length ? (
            <div className="review-stage-list">
              {weakStages.slice(0, 5).map(({ stage, stageIndex, pending, mastered, total }) => (
                <div className="review-stage-row" key={stage.id} style={{ '--review-color': stage.color }}>
                  <span className="review-stage-icon">{stage.icon}</span>
                  <div><small>FASE {String(stageIndex + 1).padStart(2, '0')}</small><b>{stage.name}</b></div>
                  <div className="review-stage-progress"><span style={{ width: `${(mastered / total) * 100}%` }} /></div>
                  <strong>{pending} {pending === 1 ? 'REVISÃO' : 'REVISÕES'}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="review-clear-state"><span>✓</span><p><b>Nada pendente por enquanto.</b>Faça um treino misto ou continue avançando na trilha.</p></div>
          )}
        </section>
      </div>
    </main>
  );
}

function ReviewScreen({ stages, progress, mode, unitStageIds = [], onExit, onStat, onComplete, sfx }) {
  const pool = useMemo(() => questionPool(stages), [stages]);
  const [queue] = useState(() => {
    const source = mode === 'mistakes'
      ? pool.filter((question) => progress.questionStats?.[questionKey(question.stageId, question.questionIndex)]?.needsReview)
      : mode === 'unit' && unitStageIds.length
        ? pool.filter((question) => unitStageIds.includes(question.stageId))
        : pool;
    const limit = mode === 'hearts' ? 5 : mode === 'unit' ? 8 : 10;
    return [...source].sort(() => Math.random() - 0.5).slice(0, limit);
  });
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const question = queue[index];
  const last = index === queue.length - 1;

  const select = useCallback((answerIndex) => {
    if (!question || correct || wrong.includes(answerIndex) || answerIndex >= question.opts.length) return;
    setSelected(answerIndex);
    sfx('click');
  }, [correct, question, sfx, wrong]);

  const check = useCallback(() => {
    if (!question || correct || selected === null) return;
    if (selected === question.a) {
      if (wrong.length === 0) setScore((value) => value + 1);
      setCorrect(true);
      onStat('correct', {
        stageId: question.stageId,
        questionIndex: question.questionIndex,
        mode: 'review',
        firstTry: wrong.length === 0,
      });
      sfx('ok');
    } else {
      setWrong((items) => [...items, selected]);
      setSelected(null);
      onStat('wrong', {
        stageId: question.stageId,
        questionIndex: question.questionIndex,
        mode: 'review',
        firstTry: false,
      });
      sfx('bad');
    }
  }, [correct, onStat, question, selected, sfx, wrong.length]);

  const next = useCallback(() => {
    if (last) onComplete(mode);
    setIndex((value) => value + 1);
    setSelected(null);
    setWrong([]);
    setCorrect(false);
    sfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [last, mode, onComplete, sfx]);

  useEffect(() => {
    const keyboard = (event) => {
      if (['1', '2', '3', '4'].includes(event.key) && !correct) select(Number(event.key) - 1);
      if (event.key === 'Enter') correct ? next() : check();
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, [check, correct, next, select]);

  if (!question) {
    return (
      <main className="review-finish-screen">
        <section className="review-finish-card">
          <div className="review-avatar"><PinscherMascot size="large" mood="celebrate" /><span>◎</span></div>
          <small>{mode === 'hearts' ? 'VIDA RECUPERADA' : mode === 'unit' ? 'UNIDADE REVISADA' : mode === 'mistakes' ? 'REVISÃO FINALIZADA' : 'TREINO FINALIZADO'} · GUIA PY</small><h1>{mode === 'hearts' ? '+1 ♥' : `${score}/${queue.length}`}</h1>
          <p>{mode === 'hearts'
            ? `Prática concluída. Agora você tem ${progress.hearts}/${MAX_HEARTS} vidas para continuar a trilha.`
            : mode === 'unit'
              ? 'Você misturou os conceitos desta unidade. Qualquer dificuldade encontrada entrou na revisão personalizada.'
              : mode === 'mistakes'
                ? 'Acertos de primeira neste bloco. Os pontos que ainda precisam de prática continuam na sua fila.'
                : 'Acertos de primeira. Qualquer dificuldade encontrada já foi adicionada à sua revisão.'}</p>
          <PixelButton color={mode === 'hearts' ? '#ff4b4b' : '#1cb0f6'} onClick={onExit}>{mode === 'hearts' ? 'CONTINUAR NA TRILHA' : 'VOLTAR À CENTRAL'}</PixelButton>
        </section>
      </main>
    );
  }

  const reviewStage = { color: question.color, icon: '◎' };
  return (
    <main className="focus-screen review-screen" style={{ '--stage-color': question.color }}>
      <FocusHeader stage={reviewStage} step={index + 1} total={queue.length} hearts={progress.hearts} safePractice heartReward={mode === 'hearts'} onExit={onExit} />
      <div className="focus-shell challenge-shell">
        <div className="challenge-heading">
          <div><small>{mode === 'hearts' ? 'RECUPERAÇÃO DE VIDA' : mode === 'unit' ? 'REVISÃO DA UNIDADE' : mode === 'mistakes' ? 'REVISÃO DOS ERROS' : 'TREINO MISTO'} · {question.stageName}</small><h1>Questão {index + 1} de {queue.length}</h1></div>
          <span>◎</span>
        </div>
        <QuestionCard
          question={question}
          stageColor={question.color}
          selected={selected}
          wrong={wrong}
          correct={correct}
          onSelect={select}
          hearts={progress.hearts}
          safePractice
        />
        <QuestionFeedback
          question={question}
          selected={selected}
          wrong={wrong}
          correct={correct}
          color={question.color}
          nextLabel={last ? 'FINALIZAR REVISÃO' : 'PRÓXIMA QUESTÃO'}
          onCheck={check}
          onNext={next}
        />
        <p className="keyboard-help">ATALHOS: 1–4 SELECIONA · ENTER VERIFICA OU CONTINUA</p>
      </div>
    </main>
  );
}

export default function CompleteApp() {
  useFonts();
  const stages = course.stages;
  const projects = course.projects || [];
  const tracks = course.tracks || [];
  const [progress, setProgress] = useState(readProgress);
  const [settings, setSettings] = useState(readSettings);
  const [screen, setScreen] = useState('map');
  const [activeStage, setActiveStage] = useState(stages[0]);
  const [battleKey, setBattleKey] = useState(0);
  const [reviewKey, setReviewKey] = useState(0);
  const [reviewMode, setReviewMode] = useState('mixed');
  const [reviewUnit, setReviewUnit] = useState(null);
  const [activeProject, setActiveProject] = useState(projects[0] || null);
  const [lastReward, setLastReward] = useState({ xp: 10, gems: 10 });
  const sfx = useSfx(settings.sound);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const frame = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
    return () => cancelAnimationFrame(frame);
  }, [screen]);

  const answered = progress.correct + progress.wrong;
  const todayXp = progress.dailyXpDate === localDayKey() ? progress.dailyXp || 0 : 0;
  const stats = useMemo(() => ({
    total: stages.length,
    completed: Object.keys(progress.completed).length,
    accuracy: answered ? Math.round((progress.correct / answered) * 100) : 0,
    hearts: progress.hearts,
    infiniteHearts: Boolean(progress.entitlements?.infiniteHearts),
    xp: progress.xp,
    gems: progress.gems,
    streak: progress.streak,
    todayXp,
  }), [answered, progress.completed, progress.correct, progress.entitlements?.infiniteHearts, progress.gems, progress.hearts, progress.streak, progress.xp, stages.length, todayXp]);

  const updateProgress = useCallback((updater) => {
    setProgress((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      persistProgress(next);
      return next;
    });
  }, []);

  const updateSetting = (key) => {
    setSettings((current) => {
      const next = { ...current, [key]: !current[key] };
      persistSettings(next);
      return next;
    });
  };

  const goMap = () => {
    setScreen('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPractice = () => {
    setScreen('practice');
    sfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProject = (project) => {
    setActiveProject(project);
    setScreen('project');
    sfx('click');
    window.scrollTo(0, 0);
  };

  const openHearts = () => {
    setScreen('hearts');
    sfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startReview = (mode, unit = null) => {
    setReviewMode(mode);
    setReviewUnit(unit);
    setReviewKey((key) => key + 1);
    setScreen('review');
    sfx('click');
    window.scrollTo(0, 0);
  };

  const enterStage = (stage) => {
    if (!progress.entitlements?.infiniteHearts && progress.hearts <= 0) {
      openHearts();
      return;
    }
    setActiveStage(stage);
    updateProgress((current) => ({ ...current, lastStage: stage.id }));
    setScreen('lesson');
    sfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startBattle = () => {
    if (!progress.entitlements?.infiniteHearts && progress.hearts <= 0) {
      openHearts();
      return;
    }
    setBattleKey((key) => key + 1);
    setScreen('battle');
    window.scrollTo(0, 0);
  };

  const finishStage = () => {
    const firstCompletion = !progress.completed[activeStage.id];
    const reward = firstCompletion ? { xp: 10, gems: 10 } : { xp: 5, gems: 0 };
    setLastReward(reward);
    updateProgress((current) => withStudyReward({
      ...current,
      completed: { ...current.completed, [activeStage.id]: true },
      attempts: {
        ...current.attempts,
        [activeStage.id]: (current.attempts[activeStage.id] || 0) + 1,
      },
    }, reward));
    setScreen('win');
    window.scrollTo(0, 0);
  };

  const recordAnswer = useCallback((kind, context = {}) => {
    updateProgress((current) => {
      const counter = kind === 'correct' ? 'correct' : 'wrong';
      if (!context.stageId || !Number.isInteger(context.questionIndex)) {
        return { ...current, [counter]: current[counter] + 1 };
      }

      const key = questionKey(context.stageId, context.questionIndex);
      const previous = current.questionStats?.[key] || { correct: 0, wrong: 0, needsReview: false };
      const clearedByReview = kind === 'correct' && context.mode === 'review' && context.firstTry;
      const nextQuestion = {
        ...previous,
        [counter]: (previous[counter] || 0) + 1,
        lastResult: kind,
        needsReview: kind === 'wrong' ? true : clearedByReview ? false : Boolean(previous.needsReview),
      };

      return {
        ...current,
        [counter]: current[counter] + 1,
        hearts: kind === 'wrong' && context.mode === 'battle' && !current.entitlements?.infiniteHearts
          ? Math.max(0, (current.hearts ?? MAX_HEARTS) - 1)
          : current.entitlements?.infiniteHearts ? MAX_HEARTS : current.hearts ?? MAX_HEARTS,
        questionStats: { ...(current.questionStats || {}), [key]: nextQuestion },
      };
    });
  }, [updateProgress]);

  const finishReview = useCallback((mode) => {
    const reward = mode === 'hearts'
      ? { xp: 5, gems: 0, hearts: 1 }
      : mode === 'unit'
        ? { xp: 10, gems: 10, hearts: 0 }
        : { xp: 5, gems: 5, hearts: 0 };
    updateProgress((current) => withStudyReward({
      ...current,
      reviewSessions: (current.reviewSessions || 0) + 1,
      unitReviews: mode === 'unit' && reviewUnit
        ? { ...(current.unitReviews || {}), [reviewUnit.number]: true }
        : current.unitReviews || {},
    }, reward));
  }, [reviewUnit, updateProgress]);

  const finishProject = useCallback((project) => {
    updateProgress((current) => {
      const firstCompletion = !current.projects?.[project.id];
      return withStudyReward({
        ...current,
        projects: { ...(current.projects || {}), [project.id]: true },
      }, firstCompletion ? { xp: 15, gems: 15 } : { xp: 5, gems: 0 });
    });
  }, [updateProgress]);

  const purchasePremiumBundle = () => {
    if (progress.entitlements?.allProjects && progress.entitlements?.infiniteHearts) return false;
    const confirmed = window.confirm('Liberar todos os projetos e ativar vidas infinitas por R$ 25,00?\n\nCompra ilustrativa: nenhuma cobrança real será feita.');
    if (!confirmed) return false;
    updateProgress((current) => ({
      ...current,
      entitlements: {
        ...(current.entitlements || {}),
        allProjects: true,
        infiniteHearts: true,
      },
      hearts: MAX_HEARTS,
    }));
    sfx('win');
    return true;
  };

  const refillHearts = () => {
    if (progress.entitlements?.infiniteHearts || progress.hearts >= MAX_HEARTS || progress.gems < HEART_REFILL_COST) return;
    updateProgress((current) => current.hearts >= MAX_HEARTS || current.gems < HEART_REFILL_COST ? current : ({
      ...current,
      hearts: MAX_HEARTS,
      gems: current.gems - HEART_REFILL_COST,
    }));
    sfx('ok');
  };

  const reset = () => {
    if (!window.confirm('Zerar apenas o progresso e as estatísticas do game?')) return;
    const clean = emptyProgress();
    persistProgress(clean);
    setProgress(clean);
    sfx('bad');
  };

  const activeIndex = stages.findIndex((stage) => stage.id === activeStage.id);
  const nextStage = activeIndex < stages.length - 1 ? stages[activeIndex + 1] : null;
  const showMainNavigation = screen === 'map';

  return (
    <div className={`app ${settings.scanlines ? 'scanlines-on' : ''}`}>
      <div className="page-backdrop" />
      <div className="scanlines" />

      {showMainNavigation && (
        <AppHeader
          stats={stats}
          settings={settings}
          active={screen}
          onHome={goMap}
          onReview={openPractice}
          onHearts={openHearts}
          onToggleSound={() => updateSetting('sound')}
          onToggleScanlines={() => updateSetting('scanlines')}
        />
      )}

      {showMainNavigation && !(progress.entitlements?.allProjects && progress.entitlements?.infiniteHearts) && (
        <PremiumOfferBar onPurchase={purchasePremiumBundle} />
      )}

      {screen === 'map' && (
        <CourseMap
          stages={stages}
          projects={projects}
          tracks={tracks}
          progress={progress}
          onEnter={enterStage}
          onReview={openPractice}
          onUnitReview={(unit) => startReview('unit', unit)}
          onOpenProject={openProject}
          onPurchase={purchasePremiumBundle}
          onReset={reset}
        />
      )}
      {screen === 'project' && activeProject && (
        <ProjectScreen
          key={activeProject.id}
          project={activeProject}
          alreadyCompleted={Boolean(progress.projects?.[activeProject.id])}
          onExit={goMap}
          onComplete={finishProject}
          sfx={sfx}
        />
      )}
      {screen === 'practice' && (
        <PracticeHub stages={stages} progress={progress} onExit={goMap} onStart={startReview} />
      )}
      {screen === 'hearts' && (
        <HeartsScreen progress={progress} onExit={goMap} onPractice={() => startReview('hearts')} onRefill={refillHearts} onPurchasePremium={purchasePremiumBundle} />
      )}
      {screen === 'lesson' && (
        <LessonScreen stage={activeStage} stageIndex={activeIndex} hearts={progress.hearts} infiniteHearts={Boolean(progress.entitlements?.infiniteHearts)} onExit={goMap} onBattle={startBattle} sfx={sfx} />
      )}
      {screen === 'battle' && (
        <BattleScreen
          key={battleKey}
          stage={activeStage}
          hearts={progress.hearts}
          infiniteHearts={Boolean(progress.entitlements?.infiniteHearts)}
          progress={progress}
          onExit={goMap}
          onWin={finishStage}
          onStat={recordAnswer}
          onHeartPractice={() => startReview('hearts')}
          onRefillHearts={refillHearts}
          onPurchasePremium={purchasePremiumBundle}
          sfx={sfx}
        />
      )}
      {screen === 'win' && (
        <WinScreen
          stage={activeStage}
          nextStage={nextStage}
          reward={lastReward}
          streak={progress.streak}
          onMap={goMap}
          onReplay={() => enterStage(activeStage)}
          onContinue={() => nextStage && enterStage(nextStage)}
        />
      )}
      {screen === 'review' && (
        <ReviewScreen
          key={reviewKey}
          stages={stages}
          progress={progress}
          mode={reviewMode}
          unitStageIds={reviewUnit?.stages.map((stage) => stage.id) || []}
          onExit={reviewMode === 'hearts' || reviewMode === 'unit' ? goMap : openPractice}
          onStat={recordAnswer}
          onComplete={finishReview}
          sfx={sfx}
        />
      )}

      {screen === 'map' && (
        <MobileNav active={screen} onHome={goMap} onReview={openPractice} onHearts={openHearts} hearts={progress.hearts} infiniteHearts={Boolean(progress.entitlements?.infiniteHearts)} />
      )}
    </div>
  );
}
