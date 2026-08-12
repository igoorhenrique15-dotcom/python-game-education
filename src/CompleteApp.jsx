import React, { useCallback, useEffect, useMemo, useState } from 'react';
import course from './data/course.json';
import '../style.css';
import './rounded-theme.css';

const STORAGE_KEY = 'black-buster-progress-v5';
const SETTINGS_KEY = 'black-buster-settings-v2';
const FONT_ID = 'black-buster-fonts';

const UNIT_META = [
  {
    title: 'Primeiros comandos',
    goal: 'Guarde dados, faça escolhas e repita ações.',
    color: '#58cc02',
  },
  {
    title: 'Dados e funções',
    goal: 'Organize informações e crie blocos reutilizáveis.',
    color: '#1cb0f6',
  },
  {
    title: 'Python essencial',
    goal: 'Receba dados, combine coleções e importe recursos.',
    color: '#ce82ff',
  },
  {
    title: 'Programas robustos',
    goal: 'Trate erros, arquivos, JSON e objetos.',
    color: '#ff9600',
  },
  {
    title: 'Projetos reais',
    goal: 'Aplique orientação a objetos e conclua sua jornada.',
    color: '#ff4b4b',
  },
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
  const empty = { completed: {}, attempts: {}, correct: 0, wrong: 0, lastStage: null };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      completed: saved.completed || {},
      attempts: saved.attempts || {},
      correct: saved.correct || 0,
      wrong: saved.wrong || 0,
      lastStage: saved.lastStage || null,
    };
  } catch {
    return empty;
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

function PythonAvatar({ mood = 'ready', size = 'medium' }) {
  const celebrating = mood === 'celebrate';
  const focused = mood === 'focus';

  return (
    <span className={`python-avatar avatar-${size} mood-${mood}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" focusable="false">
        <circle className="avatar-halo" cx="60" cy="60" r="56" />
        <rect className="avatar-pixel avatar-pixel-blue" x="15" y="25" width="9" height="9" rx="2" />
        <rect className="avatar-pixel avatar-pixel-yellow" x="94" y="18" width="11" height="11" rx="3" />
        <rect className="avatar-pixel avatar-pixel-soft" x="99" y="77" width="7" height="7" rx="2" />

        <path className="avatar-shoulders" d="M20 112c3-22 17-34 40-34s37 12 40 34H20Z" />
        <path className="avatar-hood-blue" d="M20 112c2-17 11-28 26-32l14 32H20Z" />
        <path className="avatar-hood-yellow" d="M100 112c-2-17-11-28-26-32l-14 32h40Z" />
        <path className="avatar-hood" d="M39 83c6-4 13-6 21-6s15 2 21 6l-8 29H47l-8-29Z" />
        <path className="avatar-neck" d="M51 70h18v18H51z" />

        <circle className="avatar-ear" cx="34" cy="54" r="8" />
        <circle className="avatar-ear" cx="86" cy="54" r="8" />
        <path className="avatar-face" d="M35 43c0-19 10-29 25-29s25 10 25 29v15c0 17-11 28-25 28S35 75 35 58V43Z" />
        <path className="avatar-hair" d="M35 45c-2-22 9-35 27-35 15 0 25 9 26 27-9-1-15-5-19-12-7 8-18 13-34 14v6Z" />
        <path className="avatar-headset" d="M31 48v-8c0-17 12-30 29-30s29 13 29 30v8" />
        <rect className="avatar-headset-blue" x="27" y="45" width="10" height="22" rx="5" />
        <rect className="avatar-headset-yellow" x="83" y="45" width="10" height="22" rx="5" />

        {celebrating ? (
          <>
            <path className="avatar-eye-line" d="M44 52l4 3 4-3" />
            <path className="avatar-eye-line" d="M68 52l4 3 4-3" />
            <path className="avatar-mouth-open" d="M51 66c5 6 13 6 18 0-2 9-16 9-18 0Z" />
          </>
        ) : (
          <>
            <circle className="avatar-eye" cx="48" cy="54" r="2.6" />
            <circle className="avatar-eye" cx="72" cy="54" r="2.6" />
            <path className={focused ? 'avatar-mouth-focus' : 'avatar-mouth'} d={focused ? 'M54 68h12' : 'M52 66c4 5 12 5 16 0'} />
          </>
        )}

        {focused && <path className="avatar-glasses" d="M39 49h18v11H39zM63 49h18v11H63zM57 53h6" />}
        <path className="avatar-nose" d="M59 56l-2 6h5" />
        <path className="avatar-collar" d="M45 82l15 11 15-11M60 93v17" />
        <path className="avatar-code-mark" d="M53 99l-4 4 4 4M67 99l4 4-4 4M63 97l-6 12" />
      </svg>
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

function AppHeader({ stats, settings, onHome, onReview, onToggleSound, onToggleScanlines }) {
  return (
    <header className="app-header">
      <button type="button" className="brand" onClick={onHome} aria-label="Voltar para a trilha">
        <span className="brand-cube"><PythonAvatar size="small" /></span>
        <span><b>BLACK BUSTER</b><small>TRILHA DE PYTHON</small></span>
      </button>

      <nav className="desktop-nav" aria-label="Navegação principal">
        <button type="button" className="active" onClick={onHome}><span>⌁</span> TRILHA</button>
        <button type="button" onClick={onReview}><span>◎</span> PRATICAR</button>
      </nav>

      <div className="header-stats">
        <div title="Fases concluídas"><span>◆</span><b>{stats.completed}/{stats.total}</b></div>
        <div title="Precisão nas respostas"><span>⌁</span><b>{stats.accuracy}%</b></div>
        <button type="button" onClick={onToggleSound} title="Ativar ou desativar som" aria-label="Som">
          {settings.sound ? '♪' : '×'}
        </button>
        <button type="button" onClick={onToggleScanlines} title="Ativar ou desativar efeito retrô" aria-label="Efeito retrô">▤</button>
      </div>
    </header>
  );
}

function MobileNav({ onHome, onReview }) {
  return (
    <nav className="mobile-nav" aria-label="Navegação para celular">
      <button type="button" className="active" onClick={onHome}><span>⌁</span><small>TRILHA</small></button>
      <button type="button" onClick={onReview}><span>◎</span><small>PRATICAR</small></button>
    </nav>
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
          <PythonAvatar size="medium" mood={completed ? 'focus' : 'ready'} />
          <div>
            <small>GUIA PY · SEU PARCEIRO DE CÓDIGO</small>
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

function UnitPath({ unit, progress, currentIndex, selectedId, onSelect }) {
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
                {state === 'done' && <span className="node-stars">★★★</span>}
              </button>
              <span className="level-number">FASE {String(stageIndex + 1).padStart(2, '0')}</span>
              <strong>{stage.name}</strong>
              {attemptCount > 1 && <small>{attemptCount} tentativas</small>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StageInspector({ stage, stageIndex, state, picked, onClose, onEnter }) {
  if (!stage) return null;
  const statusLabel = state === 'done' ? 'FASE CONCLUÍDA' : state === 'current' ? 'PRÓXIMA FASE' : 'FASE DISPONÍVEL';
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
        <PythonAvatar size="tiny" mood="focus" />
        <div><small>GUIA PY</small><p>{state === 'done'
          ? 'Revise quando quiser. Repetir ajuda a fixar.'
          : state === 'current'
            ? 'Este é o próximo passo recomendado da sua trilha.'
            : 'Pode estudar fora de ordem: esta fase está liberada.'}</p></div>
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
  return (
    <section className="rail-card progress-card">
      <div className="rail-title"><span>SEU PROGRESSO</span><b>{percent}%</b></div>
      <div className="progress-orbit" style={{ '--course-progress': `${percent * 3.6}deg` }}>
        <div><b>{completed}</b><small>DE {stages.length}</small></div>
      </div>
      <div className="rail-stats">
        <span><b>{progress.correct}</b> ACERTOS</span>
        <span><b>{accuracy}%</b> PRECISÃO</span>
      </div>
    </section>
  );
}

function CourseMap({ stages, progress, onEnter, onReview, onReset }) {
  const units = useMemo(() => courseUnits(stages), [stages]);
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
            <div><span>SEU CAMINHO</span><h2>Uma fase de cada vez</h2></div>
            <p>A fase pulsando é a próxima sugerida. As demais continuam livres para estudo.</p>
          </div>
          {units.map((unit) => (
            <UnitPath
              key={unit.number}
              unit={unit}
              progress={progress}
              currentIndex={recommendedIndex}
              selectedId={selected.id}
              onSelect={(stage) => { setSelected(stage); setPicked(true); }}
            />
          ))}
          <div className="finish-marker"><span>Ω</span><div><b>FIM DA TRILHA</b><small>Seu projeto final espera por você.</small></div></div>
          <button className="reset-progress" type="button" onClick={onReset}>ZERAR PROGRESSO SALVO</button>
        </div>

        <aside className="course-rail">
          <StageInspector
            stage={selected}
            stageIndex={selectedIndex}
            state={selectedState}
            picked={picked}
            onClose={() => setPicked(false)}
            onEnter={onEnter}
          />
          <ProgressCard stages={stages} progress={progress} />
          <section className="rail-card practice-card">
            <span className="practice-symbol">◎</span>
            <div><small>TREINO LIVRE</small><h3>Pratique sem alterar a trilha</h3><p>Dez questões aleatórias de todas as fases.</p></div>
            <PixelButton color="#1cb0f6" variant="outline" onClick={onReview}>PRATICAR AGORA</PixelButton>
          </section>
        </aside>
      </div>
    </main>
  );
}

function FocusHeader({ stage, step, total, onExit }) {
  const percent = total ? (step / total) * 100 : 0;
  return (
    <div className="focus-header" style={{ '--stage-color': stage.color }}>
      <button type="button" onClick={onExit} aria-label="Sair e voltar para a trilha">×</button>
      <LinearProgress value={percent} color={stage.color} label={`${Math.round(percent)}% da fase`} />
      <span className="focus-avatar"><PythonAvatar size="tiny" mood="focus" /></span>
    </div>
  );
}

function LessonScreen({ stage, stageIndex, onExit, onBattle, sfx }) {
  const [index, setIndex] = useState(0);
  const card = stage.lesson[index];
  const last = index === stage.lesson.length - 1;
  const move = (nextIndex) => { setIndex(nextIndex); sfx('click'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <main className="focus-screen lesson-screen" style={{ '--stage-color': stage.color }}>
      <FocusHeader stage={stage} step={index + 1} total={stage.lesson.length + 1} onExit={onExit} />
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

function QuestionCard({ question, stageColor, selected, wrong, correct, onSelect }) {
  return (
    <section className="question-card">
      <div className="question-card-header">
        <span className="card-kicker">ESCOLHA A RESPOSTA CORRETA</span>
        <span className={`question-attempts ${wrong.length ? 'has-errors' : ''}`}>
          {wrong.length ? `${wrong.length} ${wrong.length === 1 ? 'ERRO' : 'ERROS'}` : 'TENTATIVAS LIVRES'}
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

function QuestionFeedback({ question, selected, wrong, correct, color, nextLabel, onCheck, onNext }) {
  const state = correct ? 'success' : wrong.length ? 'error' : 'neutral';
  const title = correct ? 'MANDOU BEM!' : wrong.length ? 'QUASE LÁ' : 'CONFIRME SUA ESCOLHA';
  const message = correct
    ? question.ex
    : wrong.length
      ? question.hint
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

function BattleScreen({ stage, onExit, onWin, onStat, sfx }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [correct, setCorrect] = useState(false);
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
      onStat('correct');
      sfx('ok');
    } else {
      setWrong((items) => [...items, selected]);
      setSelected(null);
      onStat('wrong');
      sfx('bad');
    }
  }, [correct, onStat, question.a, selected, sfx]);

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

  return (
    <main className="focus-screen battle-screen" style={{ '--stage-color': stage.color }}>
      <FocusHeader stage={stage} step={index + 1} total={stage.questions.length} onExit={onExit} />
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
        />
        <p className="keyboard-help">ATALHOS: 1–4 SELECIONA · ENTER VERIFICA OU CONTINUA</p>
      </div>
    </main>
  );
}

function WinScreen({ stage, nextStage, onMap, onReplay, onContinue }) {
  return (
    <main className="win-screen" style={{ '--stage-color': stage.color }}>
      <div className="pixel-confetti" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <section className="win-card">
        <div className="win-avatar"><PythonAvatar size="large" mood="celebrate" /><span>✓</span></div>
        <small>FASE CONCLUÍDA · GUIA PY</small>
        <h1>{stage.name}</h1>
        <p>Conteúdo estudado e desafio finalizado. A fase continua aberta para revisão quando quiser.</p>
        <div className="win-summary">
          <span><b>{stage.lesson.length}</b>AULAS</span>
          <span><b>{stage.questions.length}</b>QUESTÕES</span>
          <span><b>✓</b>SALVO</span>
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

function ReviewScreen({ stages, onExit, onStat, sfx }) {
  const pool = useMemo(
    () => stages.flatMap((stage) => stage.questions.map((question) => ({ ...question, stageName: stage.name, color: stage.color }))),
    [stages],
  );
  const [queue] = useState(() => [...pool].sort(() => Math.random() - 0.5).slice(0, 10));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const question = queue[index];

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
      onStat('correct');
      sfx('ok');
    } else {
      setWrong((items) => [...items, selected]);
      setSelected(null);
      onStat('wrong');
      sfx('bad');
    }
  }, [correct, onStat, question, selected, sfx, wrong.length]);

  const next = useCallback(() => {
    setIndex((value) => value + 1);
    setSelected(null);
    setWrong([]);
    setCorrect(false);
    sfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sfx]);

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
          <div className="review-avatar"><PythonAvatar size="large" mood="celebrate" /><span>◎</span></div>
          <small>TREINO FINALIZADO · GUIA PY</small><h1>{score}/10</h1>
          <p>Acertos de primeira. Você pode voltar e repetir um novo conjunto quando quiser.</p>
          <PixelButton color="#1cb0f6" onClick={onExit}>VOLTAR À TRILHA</PixelButton>
        </section>
      </main>
    );
  }

  const reviewStage = { color: question.color, icon: '◎' };
  return (
    <main className="focus-screen review-screen" style={{ '--stage-color': question.color }}>
      <FocusHeader stage={reviewStage} step={index + 1} total={queue.length} onExit={onExit} />
      <div className="focus-shell challenge-shell">
        <div className="challenge-heading">
          <div><small>TREINO LIVRE · {question.stageName}</small><h1>Questão {index + 1} de 10</h1></div>
          <span>◎</span>
        </div>
        <QuestionCard
          question={question}
          stageColor={question.color}
          selected={selected}
          wrong={wrong}
          correct={correct}
          onSelect={select}
        />
        <QuestionFeedback
          question={question}
          selected={selected}
          wrong={wrong}
          correct={correct}
          color={question.color}
          nextLabel="PRÓXIMA QUESTÃO"
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
  const [progress, setProgress] = useState(readProgress);
  const [settings, setSettings] = useState(readSettings);
  const [screen, setScreen] = useState('map');
  const [activeStage, setActiveStage] = useState(stages[0]);
  const [battleKey, setBattleKey] = useState(0);
  const sfx = useSfx(settings.sound);

  const answered = progress.correct + progress.wrong;
  const stats = useMemo(() => ({
    total: stages.length,
    completed: Object.keys(progress.completed).length,
    accuracy: answered ? Math.round((progress.correct / answered) * 100) : 0,
  }), [answered, progress.completed, progress.correct, stages.length]);

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

  const enterStage = (stage) => {
    setActiveStage(stage);
    updateProgress((current) => ({ ...current, lastStage: stage.id }));
    setScreen('lesson');
    sfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startBattle = () => {
    setBattleKey((key) => key + 1);
    setScreen('battle');
    window.scrollTo(0, 0);
  };

  const finishStage = () => {
    updateProgress((current) => ({
      ...current,
      completed: { ...current.completed, [activeStage.id]: true },
      attempts: {
        ...current.attempts,
        [activeStage.id]: (current.attempts[activeStage.id] || 0) + 1,
      },
    }));
    setScreen('win');
    window.scrollTo(0, 0);
  };

  const recordAnswer = useCallback((kind) => {
    updateProgress((current) => ({
      ...current,
      [kind === 'correct' ? 'correct' : 'wrong']:
        current[kind === 'correct' ? 'correct' : 'wrong'] + 1,
    }));
  }, [updateProgress]);

  const reset = () => {
    if (!window.confirm('Zerar apenas o progresso e as estatísticas do game?')) return;
    const clean = { completed: {}, attempts: {}, correct: 0, wrong: 0, lastStage: null };
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
          onHome={goMap}
          onReview={() => setScreen('review')}
          onToggleSound={() => updateSetting('sound')}
          onToggleScanlines={() => updateSetting('scanlines')}
        />
      )}

      {screen === 'map' && (
        <CourseMap
          stages={stages}
          progress={progress}
          onEnter={enterStage}
          onReview={() => setScreen('review')}
          onReset={reset}
        />
      )}
      {screen === 'lesson' && (
        <LessonScreen stage={activeStage} stageIndex={activeIndex} onExit={goMap} onBattle={startBattle} sfx={sfx} />
      )}
      {screen === 'battle' && (
        <BattleScreen key={battleKey} stage={activeStage} onExit={goMap} onWin={finishStage} onStat={recordAnswer} sfx={sfx} />
      )}
      {screen === 'win' && (
        <WinScreen
          stage={activeStage}
          nextStage={nextStage}
          onMap={goMap}
          onReplay={() => enterStage(activeStage)}
          onContinue={() => nextStage && enterStage(nextStage)}
        />
      )}
      {screen === 'review' && (
        <ReviewScreen stages={stages} onExit={goMap} onStat={recordAnswer} sfx={sfx} />
      )}

      {screen === 'map' && <MobileNav onHome={goMap} onReview={() => setScreen('review')} />}
    </div>
  );
}
