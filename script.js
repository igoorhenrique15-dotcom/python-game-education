(() => {
  "use strict";

  const course = window.PYTHON_COURSE;
  const app = document.querySelector("#app");
  const screenTitle = document.querySelector("#screenTitle");
  const globalProgressBar = document.querySelector("#globalProgressBar");
  const globalProgressText = document.querySelector("#globalProgressText");
  const resetButton = document.querySelector("#resetButton");
  const gameNav = document.querySelector(".game-nav");
  const navButtons = [...document.querySelectorAll(".nav-button")];
  const mentorTemplate = document.querySelector("#mentorSpriteTemplate");
  const STORAGE_KEY = "noirbyte-python-quest-v2";

  const flatLessons = course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
      moduleIndex,
      lessonIndex
    }))
  );

  let state = loadState();
  let currentLessonId = null;
  let currentStepIndex = 0;
  let interactionLocked = false;
  let practiceSession = [];
  let practiceIndex = 0;
  let practiceLocked = false;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        completedLessons: Array.isArray(saved?.completedLessons)
          ? saved.completedLessons.filter((id) => flatLessons.some((lesson) => lesson.id === id))
          : [],
        lastLessonId: flatLessons.some((lesson) => lesson.id === saved?.lastLessonId) ? saved.lastLessonId : null
      };
    } catch {
      return { completedLessons: [], lastLessonId: null };
    }
  }

  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function escapeHTML(value = "") { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
  function isCompleted(id) { return state.completedLessons.includes(id); }
  function lessonIndex(id) { return flatLessons.findIndex((lesson) => lesson.id === id); }
  function isUnlocked(id) { const index = lessonIndex(id); return index === 0 || isCompleted(id) || isCompleted(flatLessons[index - 1].id); }
  function progressPercent() { return Math.round((state.completedLessons.length / flatLessons.length) * 100); }
  function moduleProgress(module) { const done = module.lessons.filter((lesson) => isCompleted(lesson.id)).length; return { done, total: module.lessons.length }; }
  function nextLesson() {
    if (state.lastLessonId && !isCompleted(state.lastLessonId) && isUnlocked(state.lastLessonId)) return flatLessons.find((lesson) => lesson.id === state.lastLessonId);
    return flatLessons.find((lesson) => !isCompleted(lesson.id) && isUnlocked(lesson.id)) || null;
  }
  function updateHud() { const percent = progressPercent(); globalProgressBar.style.width = `${percent}%`; globalProgressText.textContent = `${percent}%`; }
  function mentorHTML(extraClass = "") { return mentorTemplate.innerHTML.replace('class="mentor-wrap"', `class="mentor-wrap ${extraClass}"`); }

  function validateCourse() {
    const errors = [];
    const ids = new Set();
    flatLessons.forEach((lesson) => {
      if (ids.has(lesson.id)) errors.push(`ID duplicado: ${lesson.id}`);
      ids.add(lesson.id);
      if (!Array.isArray(lesson.steps) || !lesson.steps.length) errors.push(`Lição sem etapas: ${lesson.id}`);
      lesson.steps?.forEach((step, index) => {
        if (!step.type || !step.title) errors.push(`${lesson.id} etapa ${index + 1}: inválida`);
        if (step.type !== "info") {
          if (!Array.isArray(step.options) || step.options.length < 2) errors.push(`${lesson.id} etapa ${index + 1}: opções inválidas`);
          if (!Number.isInteger(step.answer) || step.answer < 0 || step.answer >= (step.options?.length || 0)) errors.push(`${lesson.id} etapa ${index + 1}: resposta inválida`);
        }
      });
    });
    if (!errors.length) return true;
    console.error(errors);
    app.innerHTML = `<section class="pixel-panel panel-pad"><span class="section-tag">ERRO DE CONTEÚDO</span><h2 class="panel-title">A trilha precisa de correção</h2><p class="panel-copy">${escapeHTML(errors[0])}</p></section>`;
    return false;
  }

  function setView(view) {
    currentLessonId = null;
    interactionLocked = false;
    gameNav.hidden = false;
    navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === view));
    updateHud();
    if (view === "home") renderHome();
    if (view === "track") renderTrack();
    if (view === "practice") renderPracticeHome();
  }

  function renderHome() {
    screenTitle.textContent = "Central de Treinamento";
    const target = nextLesson();
    const targetIndex = target ? lessonIndex(target.id) : flatLessons.length - 1;
    const targetModule = target ? course.modules[target.moduleIndex] : course.modules.at(-1);
    const worldCards = course.modules.map((module, index) => {
      const p = moduleProgress(module);
      const finished = p.done === p.total;
      const firstAvailable = module.lessons.find((lesson) => isUnlocked(lesson.id) && !isCompleted(lesson.id));
      const locked = !finished && !firstAvailable;
      return `<button class="stage-node ${finished ? "done" : firstAvailable ? "current" : "locked"}" ${locked ? "disabled" : ""} data-world-target="${firstAvailable?.id || ""}"><strong>W${String(index + 1).padStart(2, "0")} ${finished ? "✓" : ""}</strong><span>${escapeHTML(module.title)}</span><small>${p.done}/${p.total} lições</small></button>`;
    }).join("");

    app.innerHTML = `<div class="base-grid"><div class="stack">
      <section class="pixel-panel panel-pad mission-hero"><div><span class="section-tag">MISSÃO ATUAL</span><h2 class="panel-title">${target ? escapeHTML(target.title) : "Trilha concluída"}</h2><p class="panel-copy">${target ? `Mundo ${target.moduleIndex + 1}: ${escapeHTML(targetModule.title)}. NoirByte vai guiar a próxima microlição.` : "Você concluiu todo o conteúdo disponível. Use o Treino para revisar."}</p><div class="mission-meta"><span class="mini-chip">LIÇÃO <strong>${Math.min(targetIndex + 1, flatLessons.length)}/${flatLessons.length}</strong></span><span class="mini-chip">PROGRESSO <strong>${progressPercent()}%</strong></span><span class="mini-chip">MÉTODO <strong>CLIQUE + PRÁTICA</strong></span></div><button id="continueMission" class="pixel-button primary" type="button">${target ? "INICIAR MISSÃO" : "ABRIR TREINO"}</button></div><div class="mentor-stage">${mentorHTML("talking")}</div></section>
      <section class="pixel-panel track-panel"><span class="section-tag">MAPA DA CAMPANHA</span><h2 class="panel-title">10 mundos de Python</h2><p class="panel-copy">Do primeiro comando até automação, APIs, pandas e conferência de planilhas.</p><div class="stage-path">${worldCards}</div></section>
    </div><aside class="stack">
      <section class="pixel-panel panel-pad"><span class="section-tag">NOIRBYTE</span><h2 class="panel-title">Seu instrutor</h2><p class="panel-copy">“Uma ideia por vez. Primeiro você reconhece o código; depois começa a escrever e automatizar.”</p><div class="mentor-stage" style="margin:18px -24px -24px">${mentorHTML()}</div></section>
      <section class="pixel-panel panel-pad"><span class="section-tag">STATUS REAL</span><h2 class="panel-title">${state.completedLessons.length} / ${flatLessons.length}</h2><p class="panel-copy">Lições concluídas. Sem XP, ranking, moedas ou vidas.</p><button id="openTrackButton" class="pixel-button secondary" type="button">VER TRILHA COMPLETA</button></section>
    </aside></div>`;

    document.querySelector("#continueMission").onclick = () => target ? openLesson(target.id) : setView("practice");
    document.querySelector("#openTrackButton").onclick = () => setView("track");
    document.querySelectorAll("[data-world-target]").forEach((button) => { if (button.dataset.worldTarget) button.onclick = () => openLesson(button.dataset.worldTarget); });
  }

  function renderTrack() {
    screenTitle.textContent = "Trilha de Python";
    const worlds = course.modules.map((module, moduleIndex) => {
      const p = moduleProgress(module);
      const lessons = module.lessons.map((lesson, lessonInModule) => {
        const finished = isCompleted(lesson.id);
        const unlocked = isUnlocked(lesson.id);
        const current = !finished && unlocked;
        return `<button class="stage-node ${finished ? "done" : current ? "current" : "locked"}" data-lesson-id="${lesson.id}" ${unlocked ? "" : "disabled"}><strong>FASE ${moduleIndex + 1}.${lessonInModule + 1}</strong><span>${escapeHTML(lesson.title.replace(/^\d+\.\s*/, ""))}</span><small>${finished ? "Concluída" : current ? "Disponível" : "Bloqueada"}</small></button>`;
      }).join("");
      return `<section class="world-block"><header class="world-head"><div class="world-number">W${String(moduleIndex + 1).padStart(2, "0")}</div><div><h3>${escapeHTML(module.title)}</h3><p>${escapeHTML(module.description)}</p></div><span class="world-state">${p.done}/${p.total}</span></header><div class="stage-path">${lessons}</div></section>`;
    }).join("");
    app.innerHTML = `<section class="pixel-panel track-panel"><span class="section-tag">TRILHA COMPLETA</span><h2 class="panel-title">${escapeHTML(course.title)}</h2><p class="panel-copy">${escapeHTML(course.description)}</p><div class="world-list">${worlds}</div></section>`;
    document.querySelectorAll("[data-lesson-id]:not(:disabled)").forEach((button) => { button.onclick = () => openLesson(button.dataset.lessonId); });
  }

  function openLesson(id) {
    if (!isUnlocked(id)) return;
    currentLessonId = id;
    currentStepIndex = 0;
    interactionLocked = false;
    state.lastLessonId = id;
    saveState();
    gameNav.hidden = true;
    renderLessonStep();
  }

  function currentLesson() { return flatLessons.find((lesson) => lesson.id === currentLessonId); }

  function renderLessonStep(mentorClass = "") {
    const lesson = currentLesson();
    if (!lesson) return setView("track");
    const step = lesson.steps[currentStepIndex];
    interactionLocked = false;
    screenTitle.textContent = lesson.title;
    const stepPercent = Math.round(((currentStepIndex + 1) / lesson.steps.length) * 100);
    const promptLabel = { choice: "ESCOLHA A RESPOSTA", output: "PREVEJA A SAÍDA", fill_choice: "COMPLETE O CÓDIGO", find_error: "ANALISE O CÓDIGO" }[step.type] || "MISSÃO";
    const interactive = step.type !== "info";
    const answers = interactive ? `<div class="answer-grid">${step.options.map((option, index) => `<button class="answer-button" type="button" data-answer="${index}"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span></button>`).join("")}</div>` : "";
    const mentorText = interactive ? "Leia o código com calma. Não tente decorar: acompanhe o que cada linha faz." : step.text;

    app.innerHTML = `<div class="lesson-grid"><aside class="pixel-panel mentor-panel"><div class="mentor-speech"><strong>NOIRBYTE:</strong><br>${escapeHTML(mentorText)}</div><div class="mentor-stage">${mentorHTML(mentorClass || "talking")}</div><button id="exitLesson" class="pixel-button secondary" type="button">SAIR DA MISSÃO</button></aside>
      <section class="pixel-panel lesson-panel"><div class="lesson-topline"><span class="section-tag">${escapeHTML(promptLabel)}</span><div class="pixel-meter"><div class="pixel-meter-fill" style="width:${stepPercent}%"></div></div><span class="world-state">${currentStepIndex + 1}/${lesson.steps.length}</span></div><h2 class="panel-title">${escapeHTML(step.title)}</h2>${step.type === "info" ? `<p class="panel-copy">${escapeHTML(step.text)}</p>` : ""}${step.code ? `<div class="code-window"><div class="code-title">PYTHON // LEITURA</div><pre><code>${escapeHTML(step.code)}</code></pre></div>` : ""}${answers}<div id="lessonFeedback">${step.type === "info" ? `<button id="continueInfo" class="pixel-button primary" type="button">CONTINUAR</button>` : ""}</div></section></div>`;

    document.querySelector("#exitLesson").onclick = () => setView("track");
    if (step.type === "info") document.querySelector("#continueInfo").onclick = guardedAdvance;
    else document.querySelectorAll("[data-answer]").forEach((button) => { button.onclick = () => handleLessonAnswer(Number(button.dataset.answer)); });
  }

  function handleLessonAnswer(selectedIndex) {
    if (interactionLocked) return;
    interactionLocked = true;
    const lesson = currentLesson();
    const step = lesson.steps[currentStepIndex];
    const buttons = [...document.querySelectorAll("[data-answer]")];
    const feedback = document.querySelector("#lessonFeedback");
    const selected = buttons[selectedIndex];
    const correct = selectedIndex === step.answer;
    buttons.forEach((button) => { button.disabled = true; });

    if (correct) {
      selected.classList.add("correct");
      feedback.innerHTML = `<div class="feedback-box success"><div><strong>ACERTOU.</strong><p>${escapeHTML(step.explanation)}</p></div><button id="continueQuestion" class="pixel-button primary" type="button">CONTINUAR</button></div>`;
      animateMentor("correct");
      document.querySelector("#continueQuestion").onclick = guardedAdvance;
    } else {
      selected.classList.add("wrong");
      feedback.innerHTML = `<div class="feedback-box error"><div><strong>AINDA NÃO.</strong><p>Releia o exemplo e tente de novo. A resposta não será avançada automaticamente.</p></div><button id="retryQuestion" class="pixel-button danger" type="button">TENTAR DE NOVO</button></div>`;
      animateMentor("wrong");
      document.querySelector("#retryQuestion").onclick = () => renderLessonStep();
    }
  }

  function animateMentor(className) {
    const mentor = document.querySelector(".mentor-wrap");
    if (!mentor) return;
    mentor.classList.remove("talking", "correct", "wrong");
    mentor.classList.add(className);
  }

  function guardedAdvance(event) {
    const button = event?.currentTarget;
    if (button) button.disabled = true;
    if (interactionLocked && button?.id !== "continueQuestion") return;
    interactionLocked = true;
    const lesson = currentLesson();
    if (currentStepIndex < lesson.steps.length - 1) { currentStepIndex += 1; renderLessonStep(); return; }
    completeLesson(lesson);
  }

  function completeLesson(lesson) {
    if (!isCompleted(lesson.id)) state.completedLessons.push(lesson.id);
    state.lastLessonId = null;
    saveState();
    updateHud();
    const next = nextLesson();
    screenTitle.textContent = "Missão concluída";
    app.innerHTML = `<section class="pixel-panel panel-pad" style="max-width:940px;margin:0 auto;text-align:center"><span class="section-tag">MISSÃO CONCLUÍDA</span><div class="mentor-stage" style="max-width:420px;margin:0 auto 20px">${mentorHTML("correct")}</div><h2 class="panel-title">${escapeHTML(lesson.title)}</h2><p class="panel-copy" style="margin-left:auto;margin-right:auto">A próxima fase foi liberada e seu progresso foi salvo neste navegador.</p><div style="display:grid;grid-template-columns:repeat(2,minmax(0,260px));justify-content:center;gap:12px;margin-top:20px"><button id="nextMission" class="pixel-button primary" type="button">${next ? "PRÓXIMA MISSÃO" : "ABRIR TREINO"}</button><button id="backToTrack" class="pixel-button secondary" type="button">VER TRILHA</button></div></section>`;
    document.querySelector("#nextMission").onclick = () => next ? openLesson(next.id) : setView("practice");
    document.querySelector("#backToTrack").onclick = () => setView("track");
  }

  function getCompletedQuestions() {
    return flatLessons.filter((lesson) => isCompleted(lesson.id)).flatMap((lesson) => lesson.steps.filter((step) => step.type !== "info").map((step) => ({ ...step, lessonTitle: lesson.title })));
  }

  function renderPracticeHome() {
    screenTitle.textContent = "Treino";
    const questions = getCompletedQuestions();
    if (!questions.length) {
      app.innerHTML = `<section class="pixel-panel practice-panel"><div class="practice-empty"><span class="section-tag">TREINO BLOQUEADO</span><h2 class="panel-title">Conclua sua primeira missão</h2><p>O treino só usa assuntos que você já estudou.</p><button id="startFirstMission" class="pixel-button primary" type="button">COMEÇAR</button></div></section>`;
      document.querySelector("#startFirstMission").onclick = () => openLesson(flatLessons[0].id);
      return;
    }
    app.innerHTML = `<section class="pixel-panel panel-pad mission-hero"><div><span class="section-tag">SALA DE TREINO</span><h2 class="panel-title">Revisão por clique</h2><p class="panel-copy">Uma sessão sorteia até 10 perguntas apenas das fases concluídas. Errar aqui mostra a resposta correta e a explicação.</p><div class="mission-meta"><span class="mini-chip">QUESTÕES DISPONÍVEIS <strong>${questions.length}</strong></span></div><button id="startPractice" class="pixel-button primary" type="button">INICIAR TREINO</button></div><div class="mentor-stage">${mentorHTML("talking")}</div></section>`;
    document.querySelector("#startPractice").onclick = startPracticeSession;
  }

  function startPracticeSession() {
    practiceSession = shuffle(getCompletedQuestions()).slice(0, Math.min(10, getCompletedQuestions().length));
    practiceIndex = 0;
    practiceLocked = false;
    renderPracticeQuestion();
  }

  function renderPracticeQuestion() {
    if (practiceIndex >= practiceSession.length) {
      app.innerHTML = `<section class="pixel-panel practice-panel"><div class="practice-empty"><span class="section-tag">TREINO CONCLUÍDO</span><h2 class="panel-title">Revisão finalizada</h2><p>Você revisou ${practiceSession.length} questões do conteúdo já estudado.</p><button id="practiceAgain" class="pixel-button primary" type="button">TREINAR NOVAMENTE</button></div></section>`;
      document.querySelector("#practiceAgain").onclick = startPracticeSession;
      return;
    }
    practiceLocked = false;
    const step = practiceSession[practiceIndex];
    app.innerHTML = `<div class="lesson-grid"><aside class="pixel-panel mentor-panel"><div class="mentor-speech"><strong>NOIRBYTE:</strong><br>Treino não bloqueia seu avanço. Use o erro para revisar o conceito.</div><div class="mentor-stage">${mentorHTML("talking")}</div></aside><section class="pixel-panel lesson-panel"><div class="lesson-topline"><span class="section-tag">TREINO ${practiceIndex + 1}/${practiceSession.length}</span><div class="pixel-meter"><div class="pixel-meter-fill" style="width:${Math.round(((practiceIndex + 1) / practiceSession.length) * 100)}%"></div></div><span class="world-state">${escapeHTML(step.lessonTitle)}</span></div><h2 class="panel-title">${escapeHTML(step.title)}</h2>${step.code ? `<div class="code-window"><div class="code-title">PYTHON // REVISÃO</div><pre><code>${escapeHTML(step.code)}</code></pre></div>` : ""}<div class="answer-grid">${step.options.map((option, index) => `<button class="answer-button" data-practice-answer="${index}" type="button"><span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span></button>`).join("")}</div><div id="practiceFeedback"></div></section></div>`;
    document.querySelectorAll("[data-practice-answer]").forEach((button) => { button.onclick = () => handlePracticeAnswer(Number(button.dataset.practiceAnswer)); });
  }

  function handlePracticeAnswer(selectedIndex) {
    if (practiceLocked) return;
    practiceLocked = true;
    const step = practiceSession[practiceIndex];
    const buttons = [...document.querySelectorAll("[data-practice-answer]")];
    const correct = selectedIndex === step.answer;
    buttons.forEach((button, index) => { button.disabled = true; if (index === step.answer) button.classList.add("correct"); if (index === selectedIndex && !correct) button.classList.add("wrong"); });
    document.querySelector("#practiceFeedback").innerHTML = `<div class="feedback-box ${correct ? "success" : "error"}"><div><strong>${correct ? "CERTO." : "RESPOSTA CORRETA DESTACADA."}</strong><p>${escapeHTML(step.explanation)}</p></div><button id="nextPractice" class="pixel-button primary" type="button">CONTINUAR</button></div>`;
    animateMentor(correct ? "correct" : "wrong");
    document.querySelector("#nextPractice").onclick = (event) => { event.currentTarget.disabled = true; practiceIndex += 1; renderPracticeQuestion(); };
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  }

  navButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  resetButton.addEventListener("click", () => { if (!confirm("Zerar todo o progresso desta trilha?")) return; state = { completedLessons: [], lastLessonId: null }; saveState(); setView("home"); });
  document.addEventListener("keydown", (event) => {
    if (!currentLessonId || interactionLocked) return;
    const index = ["a", "b", "c", "d"].indexOf(event.key.toLowerCase());
    const button = document.querySelector(`[data-answer="${index}"]`);
    if (index >= 0 && button && !button.disabled) button.click();
  });

  if (validateCourse()) setView("home");
})();
