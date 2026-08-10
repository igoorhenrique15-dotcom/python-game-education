import React, { useCallback, useEffect, useMemo, useState } from 'react';
import course from './data/course.json';

const STORAGE_KEY = 'black-buster-progress-v5';
const SETTINGS_KEY = 'black-buster-settings-v2';
const FONT_ID = 'black-buster-fonts';

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_ID;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=JetBrains+Mono:wght@400;600;700;800&display=swap';
    document.head.appendChild(link);
  }, []);
}

function readProgress() {
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
    return { completed: {}, attempts: {}, correct: 0, wrong: 0, lastStage: null };
  }
}

function readSettings() {
  try {
    return { sound: true, scanlines: false, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
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
  return useCallback((type) => {
    if (!enabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      const tones = {
        ok: [560, 760, 0.08],
        bad: [180, 125, 0.09],
        click: [290, 340, 0.04],
        win: [420, 760, 0.14],
      };
      const [a, b, duration] = tones[type] || tones.click;
      osc.type = 'square';
      osc.frequency.setValueAtTime(a, now);
      osc.frequency.exponentialRampToValueAtTime(b, now + duration);
      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.start(now);
      osc.stop(now + duration);
      setTimeout(() => ctx.close(), 250);
    } catch {}
  }, [enabled]);
}

function Corners({ color = '#62d6ff' }) {
  return <>
    <i className="corner tl" style={{ borderColor: color }} />
    <i className="corner tr" style={{ borderColor: color }} />
    <i className="corner bl" style={{ borderColor: color }} />
    <i className="corner br" style={{ borderColor: color }} />
  </>;
}

function Panel({ children, color = '#62d6ff', className = '', style }) {
  return <section className={`panel ${className}`} style={{ '--accent': color, ...style }}>
    <Corners color={color} />
    {children}
  </section>;
}

function PixelButton({ children, onClick, color = '#62d6ff', disabled = false, variant = 'solid', className = '' }) {
  return <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`pixel-button ${variant} ${className}`}
    style={{ '--accent': color }}
  >{children}</button>;
}

function CodeBlock({ text }) {
  const lines = String(text || '').split('\n');
  return <div className="code-block">
    <div className="code-head"><span>PY</span><span>TERMINAL DE ESTUDO</span></div>
    <pre>{lines.map((line, index) => <div key={index} className="code-line"><b>{String(index + 1).padStart(2, '0')}</b><span>{line || ' '}</span></div>)}</pre>
  </div>;
}

function SegmentedBar({ value, max, color }) {
  return <div className="segments" aria-label={`${value} de ${max}`}>
    {Array.from({ length: max }).map((_, i) => <span key={i} className={i < value ? 'on' : ''} style={{ '--accent': color }} />)}
  </div>;
}

function PixelDesk({ color = '#62d6ff' }) {
  return <div className="pixel-desk" style={{ '--accent': color }} aria-hidden="true">
    <div className="desk-window"><i/><i/><i/><i/><i/><i/></div>
    <div className="desk-monitor">
      <div className="screen-lines">
        <span>&gt; python</span>
        <span>print('hello')</span>
        <span className="cursor">_</span>
      </div>
    </div>
    <div className="desk-monitor-neck" />
    <div className="desk-monitor-base" />
    <div className="desk-keyboard"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
    <div className="desk-mug"><span/></div>
    <div className="desk-table" />
  </div>;
}

function StudyCard({ stage, index, total }) {
  return <div className="study-card" style={{ '--accent': stage.color }}>
    <div className="study-icon">{stage.icon}</div>
    <div className="study-label">GUIA DA FASE</div>
    <h3>{stage.name}</h3>
    <p>Leia o conceito, observe o código e depois pratique. Sem pressa e sem penalidade por erro.</p>
    <div className="study-steps">
      <span className="active">01 CONCEITO</span>
      <span className={index > 0 ? 'active' : ''}>02 EXEMPLO</span>
      <span className={index === total - 1 ? 'active' : ''}>03 PRÁTICA</span>
    </div>
  </div>;
}

function Header({ stats, settings, onToggleSound, onToggleScanlines, onHome, onReview }) {
  return <header className="topbar">
    <button className="brand" type="button" onClick={onHome}>
      <span className="brand-mark">PY</span>
      <span><b>PYTHON</b><small>PIXEL ACADEMY</small></span>
    </button>
    <div className="header-stats">
      <div><small>FASES</small><b>{stats.completed}/{stats.total}</b></div>
      <div><small>ACERTOS</small><b>{stats.correct}</b></div>
      <div><small>ERROS</small><b>{stats.wrong}</b></div>
    </div>
    <div className="header-actions">
      <button onClick={onReview} title="Treino livre">◎</button>
      <button onClick={onToggleSound} title="Som">{settings.sound ? '♪' : '×'}</button>
      <button onClick={onToggleScanlines} title="Scanlines">▤</button>
    </div>
  </header>;
}

function MapScreen({ stages, progress, onEnter, onReview, onReset }) {
  const groups = useMemo(() => [...new Set(stages.map((s) => s.group))], [stages]);
  const completed = Object.keys(progress.completed).length;
  return <main className="map-screen">
    <Panel className="hero-panel" color="#62d6ff">
      <div className="hero-copy-wrap">
        <p className="eyebrow">TRILHA COMPLETA · TODAS AS FASES LIBERADAS</p>
        <h1>APRENDA PYTHON<br/><span>JOGANDO E PRATICANDO</span></h1>
        <p className="hero-copy">Aulas curtas, exemplos claros e desafios em sequência. O foco agora é estudo com cara de game retrô, sem personagens se mexendo ou distrações na tela.</p>
        <div className="hero-actions">
          <PixelButton onClick={() => onEnter(stages[0])}>INICIAR FASE 01</PixelButton>
          <PixelButton variant="outline" color="#8df08c" onClick={onReview}>TREINO LIVRE</PixelButton>
        </div>
        <div className="summary-row">
          <div><b>{stages.length}</b><small>FASES</small></div>
          <div><b>{stages.reduce((n,s)=>n+s.lesson.length,0)}</b><small>AULAS</small></div>
          <div><b>{stages.reduce((n,s)=>n+s.questions.length,0)}</b><small>DESAFIOS</small></div>
          <div><b>{completed}</b><small>CONCLUÍDAS</small></div>
        </div>
      </div>
      <div className="hero-scene">
        <PixelDesk color="#62d6ff"/>
        <span className="scene-caption">PYTHON LAB · AMBIENTE DE ESTUDO</span>
      </div>
    </Panel>

    {groups.map((group) => <section key={group} className="world-section">
      <div className="world-title"><span>{group}</span><i /></div>
      <div className="stage-grid">
        {stages.filter((stage) => stage.group === group).map((stage) => {
          const number = stages.indexOf(stage) + 1;
          const done = !!progress.completed[stage.id];
          return <button key={stage.id} className={`stage-card ${done ? 'done' : ''}`} style={{ '--accent': stage.color }} onClick={() => onEnter(stage)}>
            <Corners color={stage.color}/>
            <div className="stage-top"><span className="stage-number">FASE {String(number).padStart(2,'0')}</span><span className="stage-icon">{done ? '✓' : stage.icon}</span></div>
            <strong>{stage.name}</strong>
            <p>{stage.summary}</p>
            <div className="stage-meta"><span>{stage.difficulty}</span><span>{stage.questions.length} QUESTÕES</span></div>
            <div className="stage-footer"><span>ABRIR CONTEÚDO</span><b>→</b></div>
          </button>;
        })}
      </div>
    </section>)}

    <div className="danger-zone">
      <button type="button" onClick={onReset}>ZERAR PROGRESSO SALVO</button>
    </div>
  </main>;
}

function LessonScreen({ stage, onExit, onBattle, sfx }) {
  const [index, setIndex] = useState(0);
  const card = stage.lesson[index];
  const last = index === stage.lesson.length - 1;
  const go = (next) => { sfx('click'); setIndex(next); };
  return <main className="lesson-screen">
    <button type="button" className="back" onClick={onExit}>← VOLTAR AO MAPA</button>
    <div className="stage-banner" style={{ '--accent': stage.color }}>
      <span>{stage.icon}</span><div><small>AULA · {stage.group}</small><strong>{stage.name}</strong></div><em>{index + 1}/{stage.lesson.length}</em>
    </div>
    <div className="lesson-progress">{stage.lesson.map((_,i)=><span key={i} className={i<=index?'on':''} style={{'--accent':stage.color}}/> )}</div>
    <div className="lesson-layout">
      <Panel color={stage.color} className="guide-panel">
        <StudyCard stage={stage} index={index} total={stage.lesson.length}/>
      </Panel>
      <Panel color={stage.color} className="content-panel">
        <p className="eyebrow">CARTÃO DE APRENDIZADO</p>
        <h2>{card.title}</h2>
        <p className="lesson-copy">{card.body}</p>
        <CodeBlock text={card.code}/>
        <div className="lesson-actions">
          <PixelButton variant="outline" color="#7c8798" disabled={index===0} onClick={() => go(Math.max(0,index-1))}>← ANTERIOR</PixelButton>
          {last
            ? <PixelButton color={stage.color} onClick={() => { sfx('click'); onBattle(); }}>INICIAR DESAFIO →</PixelButton>
            : <PixelButton color={stage.color} onClick={() => go(index+1)}>PRÓXIMO →</PixelButton>}
        </div>
      </Panel>
    </div>
  </main>;
}

function BattleScreen({ stage, onExit, onWin, onStat, sfx }) {
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [hp, setHp] = useState(stage.questions.length);
  const q = stage.questions[index];
  const lastWrong = wrong.length > 0 && !correct;

  const answer = (answerIndex) => {
    if (correct || wrong.includes(answerIndex)) return;
    if (answerIndex === q.a) {
      setCorrect(true);
      setHp((v) => Math.max(0, v - 1));
      onStat('correct');
      sfx('ok');
    } else {
      setWrong((list) => [...list, answerIndex]);
      onStat('wrong');
      sfx('bad');
    }
  };

  const next = () => {
    if (index === stage.questions.length - 1) {
      sfx('win');
      onWin();
      return;
    }
    setIndex((v) => v + 1);
    setWrong([]);
    setCorrect(false);
    sfx('click');
  };

  useEffect(() => {
    const handler = (e) => {
      if (['1','2','3','4'].includes(e.key) && !correct) answer(Number(e.key)-1);
      if (e.key === 'Enter' && correct) next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return <main className="battle-screen">
    <button className="back" type="button" onClick={onExit}>← SAIR DO DESAFIO</button>
    <Panel color={stage.color} className="challenge-panel">
      <div className="challenge-symbol">{stage.icon}</div>
      <div className="challenge-info">
        <small>DESAFIO DA FASE</small>
        <h2>{stage.name}</h2>
        <SegmentedBar value={hp} max={stage.questions.length} color={stage.color}/>
        <p>Questão {index+1} de {stage.questions.length}</p>
      </div>
      <div className="challenge-status"><span>PROGRESSO</span><b>{stage.questions.length-hp}/{stage.questions.length}</b></div>
    </Panel>
    <Panel color={stage.color} className="question-panel">
      <p className="eyebrow">QUESTÃO {String(index+1).padStart(2,'0')}</p>
      {q.type === 'code' ? <CodeBlock text={q.q}/> : <h2 className="question-title">{q.q}</h2>}
      <div className="answers">
        {q.opts.map((opt,i) => {
          let state='';
          if (correct && i===q.a) state='correct';
          else if (wrong.includes(i)) state='wrong';
          return <button key={i} type="button" className={`answer ${state}`} disabled={correct || wrong.includes(i)} onClick={()=>answer(i)}>
            <span>{i+1}</span><b>{opt}</b><em>{state==='correct'?'✓':state==='wrong'?'✕':''}</em>
          </button>;
        })}
      </div>
      {lastWrong && <div className="feedback error"><strong>AINDA NÃO</strong><p>💡 {q.hint}</p><small>Tente outra alternativa.</small></div>}
      {correct && <div className="feedback success"><strong>RESPOSTA CORRETA</strong><p>{q.ex}</p><PixelButton color={stage.color} onClick={next}>{index===stage.questions.length-1?'CONCLUIR FASE':'CONTINUAR →'}</PixelButton></div>}
      <div className="keyboard-tip">ATALHOS: 1–4 RESPONDER · ENTER CONTINUAR</div>
    </Panel>
  </main>;
}

function WinScreen({ stage, onMap, onReplay }) {
  return <main className="win-screen">
    <Panel color="#8df08c" className="win-panel">
      <div className="win-symbol">✓</div>
      <p className="eyebrow">DESAFIO CONCLUÍDO</p>
      <h1>FASE FINALIZADA</h1>
      <p>Você concluiu <b>{stage.name}</b>. O conteúdo continua disponível para revisão quando quiser.</p>
      <div className="win-actions"><PixelButton color="#8df08c" onClick={onMap}>VOLTAR AO MAPA</PixelButton><PixelButton variant="outline" color={stage.color} onClick={onReplay}>REPETIR FASE</PixelButton></div>
    </Panel>
  </main>;
}

function ReviewScreen({ stages, onExit, onStat, sfx }) {
  const pool = useMemo(() => stages.flatMap((stage) => stage.questions.map((q) => ({ ...q, stageName: stage.name, color: stage.color }))), [stages]);
  const [queue] = useState(() => [...pool].sort(() => Math.random() - .5).slice(0, 10));
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const q = queue[index];

  if (!q) return <main className="review-screen"><Panel color="#8df08c" className="review-finish"><h1>TREINO FINALIZADO</h1><p>Você acertou {score} de {queue.length} questões de primeira.</p><PixelButton color="#8df08c" onClick={onExit}>VOLTAR AO MAPA</PixelButton></Panel></main>;

  const answer = (i) => {
    if (correct || wrong.includes(i)) return;
    if (i === q.a) {
      if (wrong.length === 0) setScore((s) => s + 1);
      setCorrect(true); onStat('correct'); sfx('ok');
    } else {
      setWrong((w) => [...w,i]); onStat('wrong'); sfx('bad');
    }
  };
  const next = () => { setIndex((i)=>i+1); setWrong([]); setCorrect(false); sfx('click'); };

  return <main className="review-screen">
    <button className="back" type="button" onClick={onExit}>← SAIR DO TREINO</button>
    <Panel color={q.color} className="question-panel">
      <div className="review-head"><span>TREINO LIVRE</span><b>{index+1}/10</b><em>{q.stageName}</em></div>
      {q.type==='code'?<CodeBlock text={q.q}/>:<h2 className="question-title">{q.q}</h2>}
      <div className="answers">{q.opts.map((opt,i)=><button key={i} type="button" className={`answer ${correct&&i===q.a?'correct':''} ${wrong.includes(i)?'wrong':''}`} disabled={correct||wrong.includes(i)} onClick={()=>answer(i)}><span>{i+1}</span><b>{opt}</b></button>)}</div>
      {wrong.length>0&&!correct&&<div className="feedback error"><strong>DICA</strong><p>{q.hint}</p></div>}
      {correct&&<div className="feedback success"><strong>CORRETO</strong><p>{q.ex}</p><PixelButton color={q.color} onClick={next}>PRÓXIMA →</PixelButton></div>}
    </Panel>
  </main>;
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

  const stats = useMemo(() => ({
    total: stages.length,
    completed: Object.keys(progress.completed).length,
    correct: progress.correct,
    wrong: progress.wrong,
  }), [stages.length, progress]);

  const updateProgress = useCallback((fn) => {
    setProgress((current) => {
      const next = typeof fn === 'function' ? fn(current) : fn;
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

  const enter = (stage) => {
    setActiveStage(stage);
    updateProgress((p) => ({ ...p, lastStage: stage.id }));
    setScreen('lesson');
    sfx('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const battle = () => { setBattleKey((k)=>k+1); setScreen('battle'); window.scrollTo(0,0); };
  const win = () => {
    updateProgress((p) => ({ ...p, completed: { ...p.completed, [activeStage.id]: true }, attempts: { ...p.attempts, [activeStage.id]: (p.attempts[activeStage.id] || 0) + 1 } }));
    setScreen('win');
    window.scrollTo(0,0);
  };
  const stat = (kind) => updateProgress((p) => ({ ...p, [kind === 'correct' ? 'correct' : 'wrong']: p[kind === 'correct' ? 'correct' : 'wrong'] + 1 }));
  const reset = () => {
    if (!window.confirm('Zerar apenas o progresso e as estatísticas do game?')) return;
    const clean = { completed: {}, attempts: {}, correct: 0, wrong: 0, lastStage: null };
    persistProgress(clean); setProgress(clean); sfx('bad');
  };

  return <div className={`app ${settings.scanlines ? 'scanlines-on' : ''}`}>
    <style>{styles}</style>
    <div className="backdrop"/><div className="scanlines"/>
    <Header
      stats={stats}
      settings={settings}
      onToggleSound={()=>updateSetting('sound')}
      onToggleScanlines={()=>updateSetting('scanlines')}
      onHome={()=>setScreen('map')}
      onReview={()=>setScreen('review')}
    />
    {screen==='map'&&<MapScreen stages={stages} progress={progress} onEnter={enter} onReview={()=>setScreen('review')} onReset={reset}/>} 
    {screen==='lesson'&&<LessonScreen stage={activeStage} onExit={()=>setScreen('map')} onBattle={battle} sfx={sfx}/>} 
    {screen==='battle'&&<BattleScreen key={battleKey} stage={activeStage} onExit={()=>setScreen('map')} onWin={win} onStat={stat} sfx={sfx}/>} 
    {screen==='win'&&<WinScreen stage={activeStage} onMap={()=>setScreen('map')} onReplay={()=>enter(activeStage)}/>} 
    {screen==='review'&&<ReviewScreen stages={stages} onExit={()=>setScreen('map')} onStat={stat} sfx={sfx}/>} 
  </div>;
}

const styles = `
*{box-sizing:border-box}html,body,#root{margin:0;min-height:100%;background:#0a0d12}body{font-family:'JetBrains Mono',monospace;color:#e8edf3}.app{min-height:100vh;position:relative;overflow-x:hidden;background:#0a0d12}.backdrop{position:fixed;inset:0;pointer-events:none;background-color:#0a0d12;background-image:linear-gradient(#111722 1px,transparent 1px),linear-gradient(90deg,#111722 1px,transparent 1px);background-size:32px 32px;opacity:.65}.backdrop:after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0,rgba(98,214,255,.10),transparent 38%),linear-gradient(to bottom,transparent 60%,rgba(0,0,0,.35))}.scanlines{display:none;position:fixed;inset:0;z-index:100;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.02) 0 1px,transparent 1px 4px)}.scanlines-on .scanlines{display:block}.topbar{position:sticky;top:0;z-index:80;display:grid;grid-template-columns:1fr auto auto;gap:16px;align-items:center;padding:12px 18px;background:#0c1017f2;border-bottom:2px solid #253043;box-shadow:0 5px 0 #05070a}.brand{display:flex;align-items:center;gap:11px;color:white;background:none;border:0;text-align:left;cursor:pointer}.brand-mark{width:44px;height:44px;display:grid;place-items:center;border:3px solid #62d6ff;background:#111923;color:#62d6ff;font-family:'Press Start 2P';font-size:9px;box-shadow:4px 4px 0 #040608}.brand b,.brand small{display:block}.brand b{font-family:'Press Start 2P';font-size:11px;color:#d9f4ff;letter-spacing:2px}.brand small{font-family:'Press Start 2P';font-size:7px;color:#77869c;margin-top:6px;letter-spacing:1px}.header-stats{display:flex;gap:8px}.header-stats div{min-width:78px;padding:7px 9px;border:2px solid #263246;background:#10151e;text-align:center;box-shadow:3px 3px 0 #040608}.header-stats small,.header-stats b{display:block}.header-stats small{font-size:8px;color:#78869c}.header-stats b{color:#8df08c;font-family:'Press Start 2P';font-size:9px;margin-top:5px}.header-actions{display:flex;gap:7px}.header-actions button{width:38px;height:38px;border:2px solid #2c394c;background:#111822;color:#aeb9c8;cursor:pointer;font-size:16px;box-shadow:3px 3px 0 #040608}.header-actions button:hover{border-color:#62d6ff;color:#62d6ff}.panel{--accent:#62d6ff;position:relative;border:2px solid color-mix(in srgb,var(--accent) 42%,#283345);background:#10151e;box-shadow:6px 6px 0 #05070a}.corner{position:absolute;width:9px;height:9px;pointer-events:none}.corner.tl{top:-4px;left:-4px;border-top:2px solid;border-left:2px solid}.corner.tr{top:-4px;right:-4px;border-top:2px solid;border-right:2px solid}.corner.bl{bottom:-4px;left:-4px;border-bottom:2px solid;border-left:2px solid}.corner.br{bottom:-4px;right:-4px;border-bottom:2px solid;border-right:2px solid}.pixel-button{--accent:#62d6ff;border:2px solid color-mix(in srgb,var(--accent) 70%,white 10%);background:var(--accent);color:#071018;padding:12px 16px;font-family:'Press Start 2P';font-size:8px;line-height:1.55;cursor:pointer;box-shadow:4px 4px 0 #040608,inset -3px -3px 0 rgba(0,0,0,.18),inset 2px 2px 0 rgba(255,255,255,.3)}.pixel-button.outline{background:#111822;color:var(--accent);border:2px solid var(--accent);box-shadow:4px 4px 0 #040608}.pixel-button:disabled{opacity:.3;cursor:not-allowed;filter:grayscale(1)}.pixel-button:not(:disabled):active{transform:translate(3px,3px);box-shadow:1px 1px 0 #040608}.map-screen,.lesson-screen,.battle-screen,.review-screen,.win-screen{width:min(1180px,calc(100% - 28px));margin:0 auto;padding:28px 0 72px;position:relative;z-index:2}.hero-panel{padding:30px;display:grid;grid-template-columns:1.2fr .8fr;gap:28px;align-items:center}.eyebrow{font-family:'Press Start 2P';font-size:7px;letter-spacing:1.2px;color:#7f8da2;margin:0 0 15px}.hero-panel h1{font-family:'Press Start 2P';font-size:clamp(20px,4vw,38px);line-height:1.5;margin:0;color:#f3f6fa;text-shadow:4px 4px 0 #040608}.hero-panel h1 span{color:#62d6ff}.hero-copy{max-width:720px;color:#aeb8c6;line-height:1.75;font-size:13px}.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.summary-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:28px}.summary-row div{padding:11px;border:2px solid #263246;background:#0c1118;text-align:center;box-shadow:3px 3px 0 #040608}.summary-row b,.summary-row small{display:block}.summary-row b{font-family:'Press Start 2P';font-size:11px;color:#8df08c}.summary-row small{font-size:8px;color:#758299;margin-top:6px}.hero-scene{display:grid;gap:12px;justify-items:center;padding:18px;border-left:2px dashed #2c394c}.scene-caption{font-family:'Press Start 2P';font-size:7px;color:#8190a5;text-align:center;line-height:1.6}.pixel-desk{--accent:#62d6ff;position:relative;width:280px;height:250px;background:#0c1118;border:3px solid #243247;box-shadow:6px 6px 0 #040608;overflow:hidden}.desk-window{position:absolute;left:22px;top:20px;width:92px;height:72px;border:4px solid #29384c;background:#0a1018;display:grid;grid-template-columns:repeat(3,1fr);gap:5px;padding:8px}.desk-window i{background:#172638;border:1px solid #26435c}.desk-monitor{position:absolute;left:88px;top:50px;width:132px;height:94px;border:5px solid #05070a;background:#161d27;box-shadow:inset 0 0 0 3px #2a3546}.desk-monitor:before{content:'';position:absolute;inset:10px;background:#071219;border:2px solid var(--accent)}.screen-lines{position:absolute;z-index:2;left:20px;top:20px;right:15px;display:grid;gap:8px;font:700 9px/1.2 'JetBrains Mono';color:#9feeff}.screen-lines span:nth-child(2){color:#c9d8e8}.screen-lines .cursor{color:#8df08c}.desk-monitor-neck{position:absolute;left:145px;top:144px;width:20px;height:17px;background:#263246;border-left:4px solid #05070a;border-right:4px solid #05070a}.desk-monitor-base{position:absolute;left:122px;top:159px;width:66px;height:10px;background:#263246;border:4px solid #05070a}.desk-keyboard{position:absolute;left:70px;top:180px;width:145px;height:34px;border:4px solid #05070a;background:#202a38;display:grid;grid-template-columns:repeat(6,1fr);gap:3px;padding:5px}.desk-keyboard i{background:#3a4656;border:1px solid #111722}.desk-mug{position:absolute;right:20px;top:169px;width:34px;height:40px;border:4px solid #05070a;background:#9e5e4e}.desk-mug span{position:absolute;right:-14px;top:8px;width:14px;height:18px;border:4px solid #05070a;border-left:0}.desk-table{position:absolute;left:0;right:0;bottom:18px;height:14px;background:#46505d;border-top:4px solid #05070a;border-bottom:4px solid #05070a}.world-section{margin-top:36px}.world-title{display:flex;align-items:center;gap:14px;margin-bottom:14px}.world-title span{font-family:'Press Start 2P';font-size:9px;color:#b5c0cf}.world-title i{height:2px;flex:1;background:repeating-linear-gradient(90deg,#34445b 0 12px,transparent 12px 20px)}.stage-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.stage-card{--accent:#62d6ff;position:relative;min-height:235px;text-align:left;padding:18px 18px 16px;border:2px solid color-mix(in srgb,var(--accent) 40%,#2b3749);background:#10151e;color:#e5ebf2;cursor:pointer;box-shadow:5px 5px 0 #040608;transition:transform .08s,border-color .08s}.stage-card:before{content:'';position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--accent)}.stage-card:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 #040608;border-color:var(--accent)}.stage-card.done{background:#102019}.stage-card.done:before{background:#8df08c}.stage-top{display:flex;justify-content:space-between;align-items:center}.stage-number{font-family:'Press Start 2P';font-size:7px;color:#69768b}.stage-icon{width:42px;height:42px;display:grid;place-items:center;border:2px solid var(--accent);background:#0a0f16;font-size:20px;color:var(--accent)}.stage-card strong{display:block;font-family:'Press Start 2P';font-size:9px;line-height:1.6;color:var(--accent);margin:19px 0 10px}.stage-card p{font-size:11px;line-height:1.6;color:#9da8b9;min-height:56px}.stage-meta{display:flex;justify-content:space-between;gap:8px;font-size:8px;color:#6f7b90;margin-top:14px}.stage-footer{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:11px;border-top:2px dashed #293649;font-size:8px;color:#8c9aaf}.stage-footer b{font-size:16px;color:var(--accent)}.danger-zone{text-align:center;margin-top:42px}.danger-zone button{border:0;background:none;color:#67555a;font-size:9px;cursor:pointer}.danger-zone button:hover{color:#ff7188}.back{border:0;background:none;color:#8491a5;font-family:'JetBrains Mono';font-weight:800;font-size:11px;cursor:pointer;margin-bottom:16px}.back:hover{color:#62d6ff}.stage-banner{display:flex;align-items:center;gap:12px;padding:14px;border:2px solid color-mix(in srgb,var(--accent) 45%,#2c394b);background:#10151e;margin-bottom:10px;box-shadow:4px 4px 0 #040608}.stage-banner>span{width:48px;height:48px;display:grid;place-items:center;border:2px solid var(--accent);background:#0a0f16;color:var(--accent);font-size:22px}.stage-banner small,.stage-banner strong{display:block}.stage-banner small{font-size:8px;color:#77849a}.stage-banner strong{font-family:'Press Start 2P';font-size:9px;color:var(--accent);margin-top:6px}.stage-banner em{margin-left:auto;font-style:normal;font-size:10px;color:#8591a4}.lesson-progress{display:flex;gap:6px;margin:10px 0 18px}.lesson-progress span{height:5px;flex:1;background:#1b2431;border:1px solid #2a3749}.lesson-progress span.on{background:var(--accent);border-color:var(--accent)}.lesson-layout{display:grid;grid-template-columns:290px 1fr;gap:16px}.guide-panel{padding:18px;align-self:start}.study-card{--accent:#62d6ff}.study-icon{width:64px;height:64px;display:grid;place-items:center;border:3px solid var(--accent);background:#0a0f16;color:var(--accent);font-size:28px;box-shadow:4px 4px 0 #040608}.study-label{font-family:'Press Start 2P';font-size:7px;color:#78869a;margin-top:24px}.study-card h3{font-family:'Press Start 2P';font-size:11px;line-height:1.55;color:var(--accent)}.study-card p{color:#9da9b9;font-size:11px;line-height:1.7}.study-steps{display:grid;gap:8px;margin-top:20px}.study-steps span{padding:9px;border:2px solid #293649;background:#0d1219;color:#626f82;font-family:'Press Start 2P';font-size:6px}.study-steps span.active{border-color:var(--accent);color:var(--accent)}.content-panel{padding:24px;min-height:570px}.content-panel h2,.question-title{font-family:'Press Start 2P';font-size:15px;line-height:1.65;color:var(--accent);margin:0 0 16px}.lesson-copy{font-size:13px;line-height:1.85;color:#b8c1ce}.lesson-actions{display:flex;justify-content:space-between;gap:10px;margin-top:20px}.code-block{border:2px solid #263246;background:#070a0f;margin:20px 0;box-shadow:4px 4px 0 #040608}.code-head{display:flex;justify-content:space-between;padding:8px 11px;border-bottom:2px solid #263246;color:#607087;font-size:8px;background:#0d1219}.code-head span:first-child{color:#62d6ff}.code-block pre{margin:0;padding:13px 0;overflow-x:auto;font:600 13px/1.75 'JetBrains Mono';color:#d5edf4}.code-line{display:grid;grid-template-columns:44px 1fr;padding:0 12px}.code-line b{font-weight:400;color:#445269}.challenge-panel{display:grid;grid-template-columns:82px 1fr auto;gap:18px;align-items:center;padding:18px;margin-bottom:16px}.challenge-symbol{width:70px;height:70px;display:grid;place-items:center;border:3px solid var(--accent);background:#0a0f16;color:var(--accent);font-size:28px;box-shadow:4px 4px 0 #040608}.challenge-info small{font-family:'Press Start 2P';font-size:7px;color:#778499}.challenge-info h2{font-family:'Press Start 2P';font-size:15px;color:var(--accent);line-height:1.5;margin:9px 0}.challenge-info p{font-size:9px;color:#707e92;margin-bottom:0}.challenge-status{text-align:right;border-left:2px dashed #314056;padding-left:18px}.challenge-status span,.challenge-status b{display:block}.challenge-status span{font-size:7px;color:#6e7c91}.challenge-status b{font-family:'Press Start 2P';font-size:10px;color:#eaf1f6;margin-top:6px}.segments{display:flex;gap:5px;flex-wrap:wrap}.segments span{--accent:#62d6ff;width:26px;height:11px;background:#1a2230;border:2px solid #2b394b}.segments span.on{background:var(--accent);border-color:var(--accent)}.question-panel{padding:24px}.answers{display:grid;gap:10px;margin-top:18px}.answer{display:grid;grid-template-columns:40px 1fr 30px;align-items:center;gap:12px;text-align:left;padding:11px;border:2px solid #2d394d;background:#0c1118;color:#dce3eb;cursor:pointer;min-height:58px;box-shadow:3px 3px 0 #040608}.answer:hover:not(:disabled){border-color:#62d6ff}.answer span{width:32px;height:32px;display:grid;place-items:center;border:2px solid #3b4b63;background:#141c27;color:#9bdff1;font-family:'Press Start 2P';font-size:8px}.answer b{font-size:12px;font-weight:600}.answer em{font-style:normal;font-family:'Press Start 2P'}.answer.correct{border-color:#8df08c;background:#102019}.answer.correct span{background:#8df08c;color:#07110a;border-color:#baffb8}.answer.wrong{border-color:#7a3542;background:#201016;color:#8b5861}.answer.wrong span{background:#4d1e27;color:#ff8a99;border-color:#7a3542}.feedback{margin-top:16px;padding:15px;border:2px solid #303d50;background:#0c1118}.feedback strong{font-family:'Press Start 2P';font-size:8px}.feedback p{color:#aeb8c7;font-size:12px;line-height:1.6}.feedback small{color:#737f92;font-size:9px}.feedback.error{border-color:#7a3542}.feedback.error strong{color:#ff7188}.feedback.success{border-color:#498654}.feedback.success strong{color:#8df08c}.feedback .pixel-button{margin-top:6px}.keyboard-tip{text-align:center;color:#4f5b6c;font-size:8px;margin-top:18px}.win-screen{display:grid;place-items:center;min-height:78vh}.win-panel{width:min(720px,100%);padding:50px 30px;text-align:center}.win-symbol{width:86px;height:86px;margin:0 auto 20px;display:grid;place-items:center;border:3px solid #8df08c;background:#0c1710;color:#8df08c;font-family:'Press Start 2P';font-size:28px;box-shadow:5px 5px 0 #040608}.win-panel h1{font-family:'Press Start 2P';font-size:20px;color:#8df08c}.win-panel p{color:#aeb7c5;line-height:1.75}.win-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:24px}.review-head{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;margin-bottom:18px;padding-bottom:12px;border-bottom:2px solid #2b374a;font-family:'Press Start 2P';font-size:7px}.review-head span{color:#62d6ff}.review-head b{color:#8df08c}.review-head em{font-style:normal;color:#7c899d}.review-finish{padding:50px;text-align:center}.review-finish h1{font-family:'Press Start 2P';font-size:17px;color:#8df08c}.review-finish p{color:#aab4c2}.review-finish .pixel-button{margin-top:14px}
@media(max-width:980px){.stage-grid{grid-template-columns:repeat(2,1fr)}.hero-panel{grid-template-columns:1fr 300px}.lesson-layout{grid-template-columns:250px 1fr}.header-stats div:nth-child(3){display:none}}
@media(max-width:760px){.topbar{grid-template-columns:1fr auto}.header-stats{grid-column:1/-1;grid-row:2}.header-stats div{flex:1;min-width:0}.brand small{display:none}.map-screen,.lesson-screen,.battle-screen,.review-screen,.win-screen{width:min(100% - 20px,1180px);padding-top:18px}.hero-panel{grid-template-columns:1fr;padding:20px}.hero-scene{border-left:0;border-top:2px dashed #2c394c;padding-top:22px}.summary-row{grid-template-columns:repeat(2,1fr)}.stage-grid{grid-template-columns:1fr}.stage-card{min-height:0}.stage-card p{min-height:0}.lesson-layout{grid-template-columns:1fr}.guide-panel{display:none}.content-panel,.question-panel{padding:17px}.content-panel h2,.question-title{font-size:12px}.lesson-actions{flex-direction:column-reverse}.lesson-actions button{width:100%}.challenge-panel{grid-template-columns:60px 1fr;padding:12px}.challenge-symbol{width:54px;height:54px;font-size:22px}.challenge-info h2{font-size:10px}.challenge-status{display:none}.segments span{width:18px}.answer{grid-template-columns:36px 1fr}.answer em{display:none}.answer b{font-size:11px}.keyboard-tip{display:none}.win-panel{padding:32px 18px}.review-head{grid-template-columns:1fr auto}.review-head em{grid-column:1/-1}.header-actions button{width:34px;height:34px}.pixel-desk{transform:scale(.88);margin:-12px 0}.hero-panel h1{font-size:20px}}
`;
