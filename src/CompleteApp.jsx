import React, { useCallback, useEffect, useMemo, useState } from 'react';
import course from './data/course.json';

const STORAGE_KEY = 'black-buster-progress-v5';
const SETTINGS_KEY = 'black-buster-settings-v1';
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
    return { sound: true, scanlines: true, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return { sound: true, scanlines: true };
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
      const map = {
        ok: [640, 880, 0.10],
        bad: [170, 110, 0.12],
        click: [300, 360, 0.05],
        win: [440, 880, 0.18],
      };
      const [a, b, duration] = map[type] || map.click;
      osc.type = 'square';
      osc.frequency.setValueAtTime(a, now);
      osc.frequency.exponentialRampToValueAtTime(b, now + duration);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.start(now);
      osc.stop(now + duration);
      setTimeout(() => ctx.close(), 350);
    } catch {}
  }, [enabled]);
}

function Corners({ color = '#00e5ff' }) {
  return <>
    <i className="corner tl" style={{ borderColor: color }} />
    <i className="corner tr" style={{ borderColor: color }} />
    <i className="corner bl" style={{ borderColor: color }} />
    <i className="corner br" style={{ borderColor: color }} />
  </>;
}

function Panel({ children, color = '#00e5ff', className = '', style }) {
  return <section className={`panel ${className}`} style={{ '--accent': color, ...style }}>
    <Corners color={color} />
    {children}
  </section>;
}

function PixelButton({ children, onClick, color = '#00e5ff', disabled = false, variant = 'solid', className = '' }) {
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
    <div className="code-head"><span>PY</span><span>BLACK BUSTER TERMINAL</span></div>
    <pre>{lines.map((line, index) => <div key={index} className="code-line"><b>{String(index + 1).padStart(2, '0')}</b><span>{line || ' '}</span></div>)}</pre>
  </div>;
}

function SegmentedBar({ value, max, color }) {
  return <div className="segments" aria-label={`${value} de ${max}`}>
    {Array.from({ length: max }).map((_, i) => <span key={i} className={i < value ? 'on' : ''} style={{ '--accent': color }} />)}
  </div>;
}

function Mentor({ mood = 'idle', color = '#00e5ff' }) {
  return <div className={`mentor ${mood}`} style={{ '--accent': color }}>
    <div className="antenna"><i /></div>
    <div className="helmet"><div className="visor"><i /><i /></div></div>
    <div className="body"><div className="core">&gt;_</div></div>
    <div className="arm left" /><div className="arm right" />
    <div className="leg left" /><div className="leg right" />
    <div className="shadow" />
  </div>;
}

function Header({ stats, settings, onToggleSound, onToggleScanlines, onHome, onReview }) {
  return <header className="topbar">
    <button className="brand" type="button" onClick={onHome}>
      <span className="brand-mark">BB</span>
      <span><b>PYTHON</b><small>// BLACK BUSTER</small></span>
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
    <Panel className="hero-panel" color="#00e5ff">
      <div>
        <p className="eyebrow">TREINAMENTO COMPLETO · TODAS AS FASES LIBERADAS</p>
        <h1>DOMINE PYTHON<br/><span>DO ZERO A PROJETOS</span></h1>
        <p className="hero-copy">Uma trilha prática em formato de game: primeiro você aprende, depois enfrenta um desafio. Errou? Recebe uma dica e tenta novamente até compreender.</p>
        <div className="hero-actions">
          <PixelButton onClick={() => onEnter(stages[0])}>INICIAR FASE 01</PixelButton>
          <PixelButton variant="outline" color="#76f56f" onClick={onReview}>TREINO LIVRE</PixelButton>
        </div>
        <div className="summary-row">
          <div><b>{stages.length}</b><small>FASES</small></div>
          <div><b>{stages.reduce((n,s)=>n+s.lesson.length,0)}</b><small>AULAS</small></div>
          <div><b>{stages.reduce((n,s)=>n+s.questions.length,0)}</b><small>DESAFIOS</small></div>
          <div><b>{completed}</b><small>CONCLUÍDAS</small></div>
        </div>
      </div>
      <div className="hero-mentor"><Mentor color="#00e5ff"/><span className="speech">SELECIONE QUALQUER FASE. NÃO HÁ BLOQUEIOS.</span></div>
    </Panel>

    {groups.map((group) => <section key={group} className="world-section">
      <div className="world-title"><span>{group}</span><i /></div>
      <div className="stage-grid">
        {stages.filter((stage) => stage.group === group).map((stage, idx) => {
          const number = stages.indexOf(stage) + 1;
          const done = !!progress.completed[stage.id];
          return <button key={stage.id} className={`stage-card ${done ? 'done' : ''}`} style={{ '--accent': stage.color }} onClick={() => onEnter(stage)}>
            <Corners color={stage.color}/>
            <div className="stage-top"><span className="stage-number">{String(number).padStart(2,'0')}</span><span className="stage-icon">{done ? '✓' : stage.icon}</span></div>
            <strong>{stage.name}</strong>
            <p>{stage.summary}</p>
            <div className="stage-meta"><span>{stage.difficulty}</span><span>{stage.questions.length} MISSÕES</span></div>
            <div className="stage-boss">BOSS: {stage.boss}</div>
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
      <Panel color={stage.color} className="mentor-panel">
        <Mentor color={stage.color}/>
        <div className="speech large">{index === 0 ? 'ANTES DO BOSS, ENTENDA O CONCEITO.' : last ? 'ÚLTIMO CARTÃO. DEPOIS VEM A PRÁTICA.' : 'CONTINUE. CONSTRUA A LÓGICA PASSO A PASSO.'}</div>
      </Panel>
      <Panel color={stage.color} className="content-panel">
        <p className="eyebrow">CARTÃO DE APRENDIZADO</p>
        <h2>{card.title}</h2>
        <p className="lesson-copy">{card.body}</p>
        <CodeBlock text={card.code}/>
        <div className="lesson-actions">
          <PixelButton variant="outline" color="#6b7280" disabled={index===0} onClick={() => go(Math.max(0,index-1))}>← ANTERIOR</PixelButton>
          {last
            ? <PixelButton color={stage.color} onClick={() => { sfx('click'); onBattle(); }}>ENFRENTAR {stage.boss} →</PixelButton>
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
  const [mood, setMood] = useState('idle');
  const [hp, setHp] = useState(stage.questions.length);
  const q = stage.questions[index];
  const lastWrong = wrong.length > 0 && !correct;

  const answer = (answerIndex) => {
    if (correct || wrong.includes(answerIndex)) return;
    if (answerIndex === q.a) {
      setCorrect(true);
      setMood('win');
      setHp((v) => Math.max(0, v - 1));
      onStat('correct');
      sfx('ok');
      setTimeout(() => setMood('idle'), 500);
    } else {
      setWrong((list) => [...list, answerIndex]);
      setMood('hit');
      onStat('wrong');
      sfx('bad');
      setTimeout(() => setMood('idle'), 500);
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
    <Panel color={stage.color} className="boss-panel">
      <Mentor mood={mood} color={stage.color}/>
      <div className="boss-info"><small>BOSS ENCOUNTER</small><h2>{stage.boss}</h2><SegmentedBar value={hp} max={stage.questions.length} color={stage.color}/><p>Questão {index+1} de {stage.questions.length}</p></div>
    </Panel>
    <Panel color={stage.color} className="question-panel">
      <p className="eyebrow">MISSÃO {String(index+1).padStart(2,'0')}</p>
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
      {lastWrong && <div className="feedback error"><strong>NÃO FOI DESSA VEZ</strong><p>💡 {q.hint}</p><small>Escolha outra alternativa.</small></div>}
      {correct && <div className="feedback success"><strong>ACERTOU · DANO NO BOSS</strong><p>{q.ex}</p><PixelButton color={stage.color} onClick={next}>{index===stage.questions.length-1?'FINALIZAR BOSS':'CONTINUAR →'}</PixelButton></div>}
      <div className="keyboard-tip">ATALHOS: 1–4 RESPONDER · ENTER CONTINUAR</div>
    </Panel>
  </main>;
}

function WinScreen({ stage, onMap, onReplay }) {
  return <main className="win-screen">
    <Panel color="#76f56f" className="win-panel">
      <div className="win-symbol">✓</div>
      <p className="eyebrow">BOSS DERROTADO</p>
      <h1>FASE CONCLUÍDA</h1>
      <p>Você concluiu <b>{stage.name}</b> e venceu <b>{stage.boss}</b>.</p>
      <div className="win-actions"><PixelButton color="#76f56f" onClick={onMap}>VOLTAR AO MAPA</PixelButton><PixelButton variant="outline" color={stage.color} onClick={onReplay}>REPETIR FASE</PixelButton></div>
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

  if (!q) return <main className="review-screen"><Panel color="#76f56f" className="review-finish"><h1>TREINO FINALIZADO</h1><p>Você acertou {score} de {queue.length} questões sem contar novas tentativas.</p><PixelButton color="#76f56f" onClick={onExit}>VOLTAR AO MAPA</PixelButton></Panel></main>;

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
      <div className="answers">{q.opts.map((opt,i)=><button key={i} className={`answer ${correct&&i===q.a?'correct':''} ${wrong.includes(i)?'wrong':''}`} disabled={correct||wrong.includes(i)} onClick={()=>answer(i)}><span>{i+1}</span><b>{opt}</b></button>)}</div>
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
*{box-sizing:border-box}html,body,#root{margin:0;min-height:100%;background:#050508}body{font-family:'JetBrains Mono',monospace;color:#e8eaf0}.app{min-height:100vh;background:radial-gradient(circle at 50% 0,#151529 0,#07070e 48%,#030306 100%);position:relative;overflow-x:hidden}.backdrop{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,229,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.035) 1px,transparent 1px);background-size:28px 28px;mask-image:radial-gradient(circle at 50% 25%,black,transparent 82%)}.scanlines{display:none;position:fixed;inset:0;z-index:100;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.025) 0 1px,transparent 1px 4px);mix-blend-mode:overlay}.scanlines-on .scanlines{display:block}.topbar{position:sticky;top:0;z-index:80;display:grid;grid-template-columns:1fr auto auto;gap:16px;align-items:center;padding:12px 18px;background:rgba(5,5,8,.92);backdrop-filter:blur(12px);border-bottom:1px solid #25253a;box-shadow:0 8px 30px #0008}.brand{display:flex;align-items:center;gap:10px;color:white;background:none;border:0;text-align:left;cursor:pointer}.brand-mark{width:44px;height:44px;display:grid;place-items:center;border:2px solid #00e5ff;color:#00e5ff;font-family:'Press Start 2P';font-size:9px;box-shadow:0 0 16px #00e5ff66,inset 0 0 10px #00e5ff22}.brand b,.brand small{display:block}.brand b{font-family:'Press Start 2P';font-size:11px;color:#00e5ff;letter-spacing:2px}.brand small{font-family:'Press Start 2P';font-size:7px;color:#ff315b;margin-top:5px;letter-spacing:1px}.header-stats{display:flex;gap:10px}.header-stats div{min-width:78px;padding:7px 9px;border:1px solid #24243a;background:#0c0c15;text-align:center}.header-stats small,.header-stats b{display:block}.header-stats small{font-size:8px;color:#6d7188}.header-stats b{color:#76f56f;font-family:'Press Start 2P';font-size:9px;margin-top:4px}.header-actions{display:flex;gap:7px}.header-actions button{width:38px;height:38px;border:1px solid #303048;background:#0d0d17;color:#b9c0d6;cursor:pointer;font-size:17px}.header-actions button:hover{border-color:#00e5ff;color:#00e5ff}.panel{--accent:#00e5ff;position:relative;border:1px solid color-mix(in srgb,var(--accent) 35%,#232338);background:linear-gradient(145deg,rgba(15,15,26,.98),rgba(8,8,15,.98));box-shadow:inset 0 0 0 1px #ffffff05,0 18px 44px #0008,0 0 25px color-mix(in srgb,var(--accent) 10%,transparent)}.corner{position:absolute;width:10px;height:10px;pointer-events:none}.corner.tl{top:-4px;left:-4px;border-top:2px solid;border-left:2px solid}.corner.tr{top:-4px;right:-4px;border-top:2px solid;border-right:2px solid}.corner.bl{bottom:-4px;left:-4px;border-bottom:2px solid;border-left:2px solid}.corner.br{bottom:-4px;right:-4px;border-bottom:2px solid;border-right:2px solid}.pixel-button{--accent:#00e5ff;border:0;background:var(--accent);color:#050508;padding:13px 17px;font-family:'Press Start 2P';font-size:9px;line-height:1.4;cursor:pointer;clip-path:polygon(0 7px,7px 0,calc(100% - 7px) 0,100% 7px,100% calc(100% - 7px),calc(100% - 7px) 100%,7px 100%,0 calc(100% - 7px));box-shadow:0 0 20px color-mix(in srgb,var(--accent) 45%,transparent),inset -4px -4px 0 #0004,inset 3px 3px 0 #fff5}.pixel-button.outline{background:#0d0d17;color:var(--accent);border:1px solid var(--accent);box-shadow:0 0 14px color-mix(in srgb,var(--accent) 18%,transparent)}.pixel-button:disabled{opacity:.3;cursor:not-allowed;filter:grayscale(1)}.pixel-button:not(:disabled):active{transform:translateY(2px)}.map-screen,.lesson-screen,.battle-screen,.review-screen,.win-screen{width:min(1180px,calc(100% - 28px));margin:0 auto;padding:28px 0 70px;position:relative;z-index:2}.hero-panel{padding:30px;display:grid;grid-template-columns:1fr 320px;gap:28px;align-items:center}.eyebrow{font-family:'Press Start 2P';font-size:8px;letter-spacing:1.4px;color:#6f7891;margin:0 0 15px}.hero-panel h1{font-family:'Press Start 2P';font-size:clamp(20px,4vw,40px);line-height:1.45;margin:0;color:#e8eaf0;text-shadow:4px 4px 0 #000}.hero-panel h1 span{color:#00e5ff;text-shadow:0 0 22px #00e5ff66}.hero-copy{max-width:720px;color:#9aa2b7;line-height:1.75;font-size:14px}.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.summary-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:28px}.summary-row div{padding:11px;border:1px solid #24243a;background:#090911;text-align:center}.summary-row b,.summary-row small{display:block}.summary-row b{font-family:'Press Start 2P';font-size:12px;color:#76f56f}.summary-row small{font-size:8px;color:#666b82;margin-top:5px}.hero-mentor{display:grid;place-items:center;gap:14px}.speech{position:relative;border:1px solid #00e5ff66;background:#07121a;color:#9deaf5;padding:10px 12px;font-size:10px;line-height:1.5;text-align:center}.speech.large{font-size:11px;line-height:1.7}.mentor{--accent:#00e5ff;position:relative;width:170px;height:225px;animation:idle 1.8s steps(2) infinite}.mentor .antenna{position:absolute;left:75px;top:5px;width:18px;height:28px;background:#201b32;border:4px solid #020205}.mentor .antenna i{position:absolute;width:8px;height:8px;background:var(--accent);left:1px;top:-10px;box-shadow:0 0 12px var(--accent)}.mentor .helmet{position:absolute;left:32px;top:35px;width:105px;height:72px;background:#171726;border:5px solid #020205;clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 15px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0 calc(100% - 12px),0 15px)}.mentor .visor{position:absolute;left:20px;top:24px;width:55px;height:23px;border:2px solid var(--accent);background:#02060c;display:flex;align-items:center;justify-content:space-around;box-shadow:0 0 14px color-mix(in srgb,var(--accent) 45%,transparent)}.mentor .visor i{width:8px;height:8px;background:var(--accent);box-shadow:0 0 8px var(--accent)}.mentor .body{position:absolute;left:42px;top:105px;width:85px;height:72px;background:#12121f;border:5px solid #020205;clip-path:polygon(10px 0,calc(100% - 10px) 0,100% 15px,92% 100%,8% 100%,0 15px)}.mentor .core{position:absolute;left:21px;top:18px;width:34px;height:28px;display:grid;place-items:center;border:2px solid var(--accent);color:var(--accent);font-weight:900;background:#02070c}.mentor .arm{position:absolute;top:112px;width:28px;height:62px;background:#141424;border:5px solid #020205}.mentor .arm.left{left:12px;transform:rotate(8deg)}.mentor .arm.right{right:11px;transform:rotate(-8deg)}.mentor .leg{position:absolute;top:172px;width:30px;height:48px;background:#12121f;border:5px solid #020205}.mentor .leg.left{left:48px}.mentor .leg.right{right:45px}.mentor .shadow{position:absolute;left:28px;bottom:0;width:115px;height:13px;background:#000;opacity:.65}.mentor.win{animation:win .3s steps(2) 2}.mentor.hit{animation:hit .25s steps(2) 2}.mentor.hit .visor{border-color:#ff315b}.world-section{margin-top:36px}.world-title{display:flex;align-items:center;gap:14px;margin-bottom:14px}.world-title span{font-family:'Press Start 2P';font-size:10px;color:#a4abc0}.world-title i{height:1px;flex:1;background:linear-gradient(90deg,#343449,transparent)}.stage-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}.stage-card{--accent:#00e5ff;position:relative;min-height:240px;text-align:left;padding:18px;border:1px solid color-mix(in srgb,var(--accent) 35%,#242438);background:linear-gradient(150deg,#10101b,#08080f);color:#e5e7ef;cursor:pointer;box-shadow:0 10px 0 #020205,0 18px 30px #0007;transition:transform .12s,border-color .12s}.stage-card:hover{transform:translateY(-4px);border-color:var(--accent)}.stage-card.done{background:linear-gradient(150deg,#0c2217,#080f0b)}.stage-top{display:flex;justify-content:space-between;align-items:center}.stage-number{font-family:'Press Start 2P';font-size:9px;color:#5f667b}.stage-icon{font-size:25px;color:var(--accent);text-shadow:0 0 12px var(--accent)}.stage-card strong{display:block;font-family:'Press Start 2P';font-size:10px;line-height:1.5;color:var(--accent);margin:19px 0 10px}.stage-card p{font-size:11px;line-height:1.55;color:#8e95aa;min-height:52px}.stage-meta{display:flex;justify-content:space-between;gap:8px;font-size:8px;color:#626980;margin-top:14px}.stage-boss{margin-top:13px;padding-top:10px;border-top:1px dashed #2d2d40;font-size:9px;color:#a7acbd}.danger-zone{text-align:center;margin-top:40px}.danger-zone button{border:0;background:none;color:#56343b;font-size:9px;cursor:pointer}.danger-zone button:hover{color:#ff5f69}.back{border:0;background:none;color:#777e94;font-family:'JetBrains Mono';font-weight:800;font-size:11px;cursor:pointer;margin-bottom:16px}.back:hover{color:#00e5ff}.stage-banner{display:flex;align-items:center;gap:12px;padding:14px;border:1px solid color-mix(in srgb,var(--accent) 45%,#2c2c40);background:#0d0d17;margin-bottom:10px}.stage-banner>span{width:48px;height:48px;display:grid;place-items:center;border:2px solid var(--accent);color:var(--accent);font-size:23px}.stage-banner small,.stage-banner strong{display:block}.stage-banner small{font-size:8px;color:#666d82}.stage-banner strong{font-family:'Press Start 2P';font-size:10px;color:var(--accent);margin-top:6px}.stage-banner em{margin-left:auto;font-style:normal;font-size:10px;color:#737a90}.lesson-progress{display:flex;gap:6px;margin:10px 0 18px}.lesson-progress span{height:4px;flex:1;background:#1a1a29}.lesson-progress span.on{background:var(--accent);box-shadow:0 0 8px var(--accent)}.lesson-layout{display:grid;grid-template-columns:285px 1fr;gap:16px}.mentor-panel{padding:18px;display:grid;align-content:start;justify-items:center;gap:8px}.content-panel{padding:24px;min-height:580px}.content-panel h2,.question-title{font-family:'Press Start 2P';font-size:16px;line-height:1.6;color:var(--accent);margin:0 0 16px}.lesson-copy{font-size:14px;line-height:1.8;color:#b0b5c5}.lesson-actions{display:flex;justify-content:space-between;gap:10px;margin-top:20px}.code-block{border:1px solid #252a3c;background:#040407;margin:20px 0;box-shadow:inset 0 0 22px #000}.code-head{display:flex;justify-content:space-between;padding:8px 11px;border-bottom:1px solid #222638;color:#4f586e;font-size:8px}.code-head span:first-child{color:#00e5ff}.code-block pre{margin:0;padding:13px 0;overflow-x:auto;font:600 13px/1.7 'JetBrains Mono';color:#c8eff5}.code-line{display:grid;grid-template-columns:44px 1fr;padding:0 12px}.code-line b{font-weight:400;color:#34394b}.boss-panel{display:grid;grid-template-columns:220px 1fr;gap:20px;align-items:center;padding:20px;margin-bottom:16px}.boss-panel .mentor{transform:scale(.75);transform-origin:center}.boss-info small{font-family:'Press Start 2P';font-size:8px;color:#646b82}.boss-info h2{font-family:'Press Start 2P';font-size:18px;color:var(--accent);line-height:1.5;margin:10px 0}.boss-info p{font-size:10px;color:#646b82}.segments{display:flex;gap:5px;flex-wrap:wrap}.segments span{--accent:#00e5ff;width:28px;height:12px;background:#151522;border:1px solid #2d2d3d}.segments span.on{background:var(--accent);border-color:var(--accent);box-shadow:0 0 10px var(--accent)}.question-panel{padding:24px}.answers{display:grid;gap:10px;margin-top:18px}.answer{display:grid;grid-template-columns:40px 1fr 30px;align-items:center;gap:12px;text-align:left;padding:11px;border:1px solid #2b3043;background:#0b0b13;color:#d4d7e1;cursor:pointer;min-height:58px}.answer:hover:not(:disabled){border-color:#00e5ff}.answer span{width:32px;height:32px;display:grid;place-items:center;border:1px solid #334055;background:#141824;color:#8bdbea;font-family:'Press Start 2P';font-size:8px}.answer b{font-size:12px;font-weight:600}.answer em{font-style:normal;font-family:'Press Start 2P'}.answer.correct{border-color:#76f56f;background:#0b2011}.answer.correct span{background:#76f56f;color:#041008;border-color:#b4ffae}.answer.wrong{border-color:#72313d;background:#1d0b10;color:#724653}.answer.wrong span{background:#4a1821;color:#ff7c8d;border-color:#74303e}.feedback{margin-top:16px;padding:15px;border:1px solid #303044;background:#0a0a12}.feedback strong{font-family:'Press Start 2P';font-size:9px}.feedback p{color:#a1a7b8;font-size:12px;line-height:1.55}.feedback small{color:#696f84;font-size:9px}.feedback.error{border-color:#6c2633}.feedback.error strong{color:#ff5f69}.feedback.success{border-color:#397649}.feedback.success strong{color:#76f56f}.feedback .pixel-button{margin-top:6px}.keyboard-tip{text-align:center;color:#44495c;font-size:8px;margin-top:18px}.win-screen{display:grid;place-items:center;min-height:78vh}.win-panel{width:min(720px,100%);padding:50px 30px;text-align:center}.win-symbol{width:90px;height:90px;margin:0 auto 20px;display:grid;place-items:center;border:3px solid #76f56f;color:#76f56f;font-family:'Press Start 2P';font-size:30px;box-shadow:0 0 30px #76f56f44}.win-panel h1{font-family:'Press Start 2P';font-size:22px;color:#76f56f}.win-panel p{color:#a8aec0;line-height:1.7}.win-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:24px}.review-head{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #29293b;font-family:'Press Start 2P';font-size:8px}.review-head span{color:#00e5ff}.review-head b{color:#76f56f}.review-head em{font-style:normal;color:#747b90}.review-finish{padding:50px;text-align:center}.review-finish h1{font-family:'Press Start 2P';font-size:18px;color:#76f56f}.review-finish p{color:#9ca2b5}.review-finish .pixel-button{margin-top:14px}@keyframes idle{50%{transform:translateY(-4px)}}@keyframes win{50%{transform:translateY(-12px) scale(1.04)}}@keyframes hit{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
@media(max-width:980px){.stage-grid{grid-template-columns:repeat(2,1fr)}.hero-panel{grid-template-columns:1fr 250px}.lesson-layout{grid-template-columns:1fr}.mentor-panel{grid-template-columns:220px 1fr;align-items:center}.boss-panel{grid-template-columns:150px 1fr}.header-stats div:nth-child(3){display:none}}
@media(max-width:680px){.topbar{grid-template-columns:1fr auto}.header-stats{grid-column:1/-1;grid-row:2}.header-stats div{flex:1;min-width:0}.brand small{display:none}.map-screen,.lesson-screen,.battle-screen,.review-screen,.win-screen{width:min(100% - 20px,1180px);padding-top:18px}.hero-panel{grid-template-columns:1fr;padding:20px}.hero-mentor{display:none}.summary-row{grid-template-columns:repeat(2,1fr)}.stage-grid{grid-template-columns:1fr}.stage-card{min-height:200px}.stage-card p{min-height:0}.mentor-panel{display:none}.content-panel,.question-panel{padding:17px}.content-panel h2,.question-title{font-size:12px}.lesson-actions{flex-direction:column-reverse}.lesson-actions button{width:100%}.boss-panel{grid-template-columns:90px 1fr;padding:12px}.boss-panel .mentor{transform:scale(.48);transform-origin:left center;width:120px}.boss-info h2{font-size:11px}.segments span{width:18px}.answer{grid-template-columns:36px 1fr}.answer em{display:none}.answer b{font-size:11px}.keyboard-tip{display:none}.win-panel{padding:32px 18px}.review-head{grid-template-columns:1fr auto}.review-head em{grid-column:1/-1}.header-actions button{width:34px;height:34px}}
`;
