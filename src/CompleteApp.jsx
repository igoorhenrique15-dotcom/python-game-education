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

function CodeBlock({ text }) {
  const lines = String(text || '').split('\n');
  return (
    <div className="code-window">
      <div className="code-titlebar">
        <span><i /><i /><i /></span>
        <b>python.py</b>
        <em>PY</em>
      </div>
      <pre><code>{lines.map((line, index) => (
        <span className="code-line" key={`${index}-${line}`}>
          <b>{String(index + 1).padStart(2, '0')}</b>
          <span>{line || ' '}</span>
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
        <span className="brand-cube">PY</span>
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

function CourseConsole({ currentStage }) {
  return (
    <div className="course-console" aria-hidden="true">
      <div className="console-top"><span><i /><i /><i /></span><b>PYTHON_PATH.EXE</b></div>
      <div className="console-body">
        <p><em>01</em><span className="cyan">def</span> aprender_python():</p>
        <p><em>02</em>&nbsp;&nbsp;fase = <span className="yellow">'{currentStage.name}'</span></p>
        <p><em>03</em>&nbsp;&nbsp;<span className="purple">return</span> pratica + constancia</p>
        <p><em>04</em></p>
        <p><em>05</em><span className="green"># pronto para continuar_</span></p>
      </div>
      <div className="console-grid"><i /><i /><i /><i /><i /><i /><i /><i /></div>
    </div>
  );
}

function CourseHero({ stages, progress, currentStage, currentIndex, onContinue, onReview }) {
  const completed = Object.keys(progress.completed).length;
  const percent = Math.round((completed / stages.length) * 100);
  const lessonCount = stages.reduce((total, stage) => total + stage.lesson.length, 0);
  const challengeCount = stages.reduce((total, stage) => total + stage.questions.length, 0);

  return (
    <section className={`course-hero ${completed ? 'compact' : ''}`}>
      <div className="hero-content">
        <span className="hero-kicker">CURSO INTERATIVO · DO ZERO AO PROJETO</span>
        <h1>{completed ? <>CONTINUE SUA<br /><strong>TRILHA</strong></> : <>SUA TRILHA<br /><strong>DE PYTHON</strong></>}</h1>
        <p>{completed
          ? <>Próxima fase: <b className="hero-next-stage">{currentStage.name}</b>. Continue exatamente de onde parou.</>
          : 'Aulas curtas, código real e desafios sem vidas. Errou, recebe uma dica e tenta novamente até entender.'}</p>

        <div className="hero-actions">
          <PixelButton onClick={onContinue} color="#58cc02">
            {completed ? `CONTINUAR FASE ${String(currentIndex + 1).padStart(2, '0')}` : 'COMEÇAR A TRILHA'}
          </PixelButton>
          <PixelButton onClick={onReview} color="#1cb0f6" variant="outline">TREINO LIVRE</PixelButton>
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
      {completed === 0 && <CourseConsole currentStage={currentStage} />}
    </section>
  );
}

function UnitPath({ unit, progress, currentIndex, selectedId, onSelect }) {
  const points = unit.stages.map((_, localIndex) => ({
    x: JOURNEY_X[(unit.startIndex + localIndex) % JOURNEY_X.length],
    y: 82 + localIndex * 154,
  }));
  const height = Math.max(250, 164 + (unit.stages.length - 1) * 154);

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
            <div><span>CAMINHO RECOMENDADO</span><h2>Avance uma fase por vez</h2></div>
            <p>Concluídas ficam verdes. A fase pulsando é a próxima sugerida.</p>
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
      <span>{stage.icon}</span>
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
          <em>{index + 1}/{stage.lesson.length}</em>
        </div>

        <section className="learning-card">
          <span className="card-kicker">CONCEITO {String(index + 1).padStart(2, '0')}</span>
          <h2>{card.title}</h2>
          <p>{card.body}</p>
          <CodeBlock text={card.code} />
        </section>

        <div className="focus-actions">
          <PixelButton variant="ghost" color="#8190a5" disabled={index === 0} onClick={() => move(index - 1)}>VOLTAR</PixelButton>
          {last ? (
            <PixelButton color={stage.color} onClick={() => { sfx('click'); onBattle(); }}>COMEÇAR DESAFIO</PixelButton>
          ) : (
            <PixelButton color={stage.color} onClick={() => move(index + 1)}>CONTINUAR</PixelButton>
          )}
        </div>
      </div>
    </main>
  );
}

function QuestionCard({ question, stageColor, wrong, correct, onAnswer }) {
  return (
    <section className="question-card">
      <span className="card-kicker">ESCOLHA A RESPOSTA CORRETA</span>
      {question.type === 'code' ? <CodeBlock text={question.q} /> : <h2>{question.q}</h2>}
      <div className="answers">
        {question.opts.map((option, index) => {
          const state = correct && index === question.a ? 'correct' : wrong.includes(index) ? 'wrong' : '';
          return (
            <button
              type="button"
              className={`answer ${state}`}
              key={`${option}-${index}`}
              disabled={correct || wrong.includes(index)}
              onClick={() => onAnswer(index)}
              style={{ '--stage-color': stageColor }}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              <b>{option}</b>
              <em>{state === 'correct' ? '✓' : state === 'wrong' ? '×' : ''}</em>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BattleScreen({ stage, onExit, onWin, onStat, sfx }) {
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [correct, setCorrect] = useState(false);
  const question = stage.questions[index];
  const last = index === stage.questions.length - 1;

  const answer = useCallback((answerIndex) => {
    if (correct || wrong.includes(answerIndex)) return;
    if (answerIndex === question.a) {
      setCorrect(true);
      onStat('correct');
      sfx('ok');
    } else {
      setWrong((items) => [...items, answerIndex]);
      onStat('wrong');
      sfx('bad');
    }
  }, [correct, onStat, question.a, sfx, wrong]);

  const next = useCallback(() => {
    if (last) {
      sfx('win');
      onWin();
      return;
    }
    setIndex((value) => value + 1);
    setWrong([]);
    setCorrect(false);
    sfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [last, onWin, sfx]);

  useEffect(() => {
    const keyboard = (event) => {
      if (['1', '2', '3', '4'].includes(event.key) && !correct) answer(Number(event.key) - 1);
      if (event.key === 'Enter' && correct) next();
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, [answer, correct, next]);

  return (
    <main className="focus-screen battle-screen" style={{ '--stage-color': stage.color }}>
      <FocusHeader stage={stage} step={index + 1} total={stage.questions.length} onExit={onExit} />
      <div className="focus-shell challenge-shell">
        <div className="challenge-heading">
          <div><small>DESAFIO · {stage.name}</small><h1>Questão {index + 1} de {stage.questions.length}</h1></div>
          <span>{stage.icon}</span>
        </div>

        <QuestionCard question={question} stageColor={stage.color} wrong={wrong} correct={correct} onAnswer={answer} />

        {wrong.length > 0 && !correct && (
          <div className="answer-feedback error" role="status">
            <span>!</span><div><b>QUASE LÁ</b><p>{question.hint}</p></div>
          </div>
        )}
        {correct && (
          <div className="answer-feedback success" role="status">
            <span>✓</span><div><b>RESPOSTA CORRETA</b><p>{question.ex}</p></div>
            <PixelButton color="#58cc02" onClick={next}>{last ? 'CONCLUIR FASE' : 'CONTINUAR'}</PixelButton>
          </div>
        )}
        <p className="keyboard-help">ATALHOS: 1–4 PARA RESPONDER · ENTER PARA CONTINUAR</p>
      </div>
    </main>
  );
}

function WinScreen({ stage, nextStage, onMap, onReplay, onContinue }) {
  return (
    <main className="win-screen" style={{ '--stage-color': stage.color }}>
      <div className="pixel-confetti" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <section className="win-card">
        <div className="win-badge"><span>✓</span></div>
        <small>FASE CONCLUÍDA</small>
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
  const [wrong, setWrong] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const question = queue[index];

  if (!question) {
    return (
      <main className="review-finish-screen">
        <section className="review-finish-card">
          <span>◎</span><small>TREINO FINALIZADO</small><h1>{score}/10</h1>
          <p>Acertos de primeira. Você pode voltar e repetir um novo conjunto quando quiser.</p>
          <PixelButton color="#1cb0f6" onClick={onExit}>VOLTAR À TRILHA</PixelButton>
        </section>
      </main>
    );
  }

  const answer = (answerIndex) => {
    if (correct || wrong.includes(answerIndex)) return;
    if (answerIndex === question.a) {
      if (wrong.length === 0) setScore((value) => value + 1);
      setCorrect(true);
      onStat('correct');
      sfx('ok');
    } else {
      setWrong((items) => [...items, answerIndex]);
      onStat('wrong');
      sfx('bad');
    }
  };

  const next = () => {
    setIndex((value) => value + 1);
    setWrong([]);
    setCorrect(false);
    sfx('click');
  };

  const reviewStage = { color: question.color, icon: '◎' };
  return (
    <main className="focus-screen review-screen" style={{ '--stage-color': question.color }}>
      <FocusHeader stage={reviewStage} step={index + 1} total={queue.length} onExit={onExit} />
      <div className="focus-shell challenge-shell">
        <div className="challenge-heading">
          <div><small>TREINO LIVRE · {question.stageName}</small><h1>Questão {index + 1} de 10</h1></div>
          <span>◎</span>
        </div>
        <QuestionCard question={question} stageColor={question.color} wrong={wrong} correct={correct} onAnswer={answer} />
        {wrong.length > 0 && !correct && <div className="answer-feedback error"><span>!</span><div><b>DICA</b><p>{question.hint}</p></div></div>}
        {correct && <div className="answer-feedback success"><span>✓</span><div><b>CORRETO</b><p>{question.ex}</p></div><PixelButton color="#58cc02" onClick={next}>PRÓXIMA</PixelButton></div>}
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
