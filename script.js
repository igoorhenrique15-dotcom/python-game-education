(() => {
  const course = window.PYTHON_COURSE;
  const app = document.querySelector("#app");
  const screenTitle = document.querySelector("#screenTitle");
  const backButton = document.querySelector("#backButton");
  const resetButton = document.querySelector("#resetButton");
  const bottomNav = document.querySelector(".bottom-nav");
  const navButtons = [...document.querySelectorAll(".nav-item")];

  const STORAGE_KEY = "python-study-progress-v1";

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
  let currentView = "home";
  let currentLessonId = null;
  let currentStep = 0;
  let practiceSession = [];
  let practiceIndex = 0;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        completedLessons: Array.isArray(saved?.completedLessons) ? saved.completedLessons : [],
        lastLessonId: saved?.lastLessonId || null
      };
    } catch {
      return { completedLessons: [], lastLessonId: null };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function escapeHTML(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function isCompleted(lessonId) {
    return state.completedLessons.includes(lessonId);
  }

  function lessonPosition(lessonId) {
    return flatLessons.findIndex((lesson) => lesson.id === lessonId);
  }

  function isUnlocked(lessonId) {
    const index = lessonPosition(lessonId);
    return index === 0 || isCompleted(flatLessons[index - 1].id) || isCompleted(lessonId);
  }

  function nextLesson() {
    return flatLessons.find((lesson) => !isCompleted(lesson.id) && isUnlocked(lesson.id)) || null;
  }

  function progressPercent() {
    return Math.round((state.completedLessons.length / flatLessons.length) * 100);
  }

  function moduleProgress(module) {
    const done = module.lessons.filter((lesson) => isCompleted(lesson.id)).length;
    return { done, total: module.lessons.length };
  }

  function setView(view) {
    currentView = view;
    currentLessonId = null;
    backButton.hidden = view === "home";
    bottomNav.hidden = false;
    navButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === view));

    if (view === "home") renderHome();
    if (view === "track") renderTrack();
    if (view === "practice") renderPractice();
  }

  function renderHome() {
    screenTitle.textContent = "Aprender Python";
    const target = nextLesson();
    const completed = state.completedLessons.length;
    const percent = progressPercent();

    const preview = course.modules.map((module, index) => {
      const progress = moduleProgress(module);
      const firstLesson = module.lessons.find((lesson) => isUnlocked(lesson.id) && !isCompleted(lesson.id));
      const complete = progress.done === progress.total;
      const locked = !complete && !firstLesson;
      return `
        <article class="module-card ${locked ? "locked" : "clickable"}" data-module-action="${firstLesson?.id || ""}">
          <div class="module-icon">${complete ? "✓" : String(index + 1).padStart(2, "0")}</div>
          <div class="module-meta">
            <h3>${escapeHTML(module.title)}</h3>
            <p>${progress.done} de ${progress.total} lições</p>
          </div>
          <span class="module-state">${complete ? "Concluído" : locked ? "Bloqueado" : "Continuar →"}</span>
        </article>`;
    }).join("");

    app.innerHTML = `
      <div class="home-layout">
        <div class="home-main">
          <section class="hero-card">
            <p class="section-label">${target ? "CONTINUAR" : "TRILHA CONCLUÍDA"}</p>
            <h2>${target ? escapeHTML(target.title) : "Fundamentos concluídos"}</h2>
            <p>${target ? `Módulo: ${escapeHTML(target.moduleTitle)}. Continue exatamente de onde você parou.` : "Você concluiu todas as lições disponíveis neste protótipo."}</p>
            <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
            <div class="progress-row"><strong>${completed} de ${flatLessons.length} lições</strong><span>${percent}%</span></div>
            <button class="primary-button" id="continueButton">${target ? "Continuar estudando" : "Praticar conteúdo"}</button>
          </section>
          <section>
            <div class="section-heading">
              <div><p class="section-label">TRILHA</p><h2>Seu caminho</h2></div>
              <button class="text-button" id="openTrack">Ver tudo</button>
            </div>
            <div class="module-preview">${preview}</div>
          </section>
        </div>
        <aside class="home-side">
          <section class="summary-grid">
            <article class="summary-card"><span class="summary-number">${completed}</span><span>Lições concluídas</span></article>
            <article class="summary-card"><span class="summary-number">${flatLessons.length}</span><span>Total atual</span></article>
          </section>
          <section class="practice-panel">
            <p class="section-label">MÉTODO</p>
            <h2>Aprender sem enrolação</h2>
            <p class="lesson-copy">Explicação curta, resposta por clique, feedback imediato e avanço sequencial. Sem XP, ranking ou conquistas.</p>
            <button class="secondary-button" id="practiceButton">Abrir prática</button>
          </section>
        </aside>
      </div>`;

    document.querySelector("#continueButton").onclick = () => target ? openLesson(target.id) : setView("practice");
    document.querySelector("#openTrack").onclick = () => setView("track");
    document.querySelector("#practiceButton").onclick = () => setView("practice");
    document.querySelectorAll("[data-module-action]").forEach((card) => {
      if (card.dataset.moduleAction) card.onclick = () => openLesson(card.dataset.moduleAction);
    });
  }

  function renderTrack() {
    screenTitle.textContent = "Trilha de Python";

    const modulesHTML = course.modules.map((module, moduleIndex) => {
      const progress = moduleProgress(module);
      const lessonsHTML = module.lessons.map((lesson) => {
        const complete = isCompleted(lesson.id);
        const unlocked = isUnlocked(lesson.id);
        return `
          <button class="lesson-row" data-lesson-id="${lesson.id}" ${unlocked ? "" : "disabled"}>
            <span class="lesson-status">${complete ? "✓" : unlocked ? "○" : "·"}</span>
            <span><strong>${escapeHTML(lesson.title)}</strong></span>
            <span class="lesson-kind">${complete ? "Concluída" : unlocked ? "Disponível" : "Bloqueada"}</span>
          </button>`;
      }).join("");

      return `
        <section class="module-detail">
          <div class="module-detail-header">
            <div class="module-icon">${String(moduleIndex + 1).padStart(2, "0")}</div>
            <div><h3>${escapeHTML(module.title)}</h3><p>${escapeHTML(module.description)}</p></div>
            <span class="module-state">${progress.done}/${progress.total}</span>
          </div>
          <div class="lesson-list">${lessonsHTML}</div>
        </section>`;
    }).join("");

    app.innerHTML = `
      <section class="track-panel">
        <div class="track-header">
          <p class="section-label">CURSO</p>
          <h2>${escapeHTML(course.title)}</h2>
          <p>${escapeHTML(course.description)}</p>
        </div>
        <div class="track-list">${modulesHTML}</div>
      </section>`;

    document.querySelectorAll("[data-lesson-id]:not(:disabled)").forEach((button) => {
      button.onclick = () => openLesson(button.dataset.lessonId);
    });
  }

  function openLesson(lessonId) {
    if (!isUnlocked(lessonId)) return;
    currentLessonId = lessonId;
    currentStep = 0;
    state.lastLessonId = lessonId;
    saveState();
    bottomNav.hidden = true;
    backButton.hidden = true;
    renderLessonStep();
  }

  function renderLessonStep() {
    const lesson = flatLessons.find((item) => item.id === currentLessonId);
    const step = lesson.steps[currentStep];
    const percent = Math.round(((currentStep + 1) / lesson.steps.length) * 100);
    screenTitle.textContent = lesson.title;

    const content = step.type === "info" ? `
      <p class="lesson-topic">${escapeHTML(lesson.moduleTitle)}</p>
      <h2>${escapeHTML(step.title)}</h2>
      <p class="lesson-copy">${escapeHTML(step.text)}</p>
      ${step.code ? `<pre class="code-block"><code>${escapeHTML(step.code)}</code></pre>` : ""}
    ` : `
      <p class="lesson-topic">ESCOLHA A RESPOSTA</p>
      <h2>${escapeHTML(step.title)}</h2>
      ${step.code ? `<pre class="code-block"><code>${escapeHTML(step.code)}</code></pre>` : ""}
      <div class="answers">
        ${step.options.map((option, index) => `<button class="answer-button" data-answer="${index}">${escapeHTML(option)}</button>`).join("")}
      </div>
    `;

    app.innerHTML = `
      <section class="lesson-screen">
        <div class="lesson-progress">
          <button class="close-lesson" id="closeLesson" aria-label="Fechar lição">×</button>
          <div class="progress-track compact"><div class="progress-fill" style="width:${percent}%"></div></div>
          <span>${currentStep + 1}/${lesson.steps.length}</span>
        </div>
        <article class="lesson-card">${content}</article>
        <div class="lesson-footer" id="lessonFooter">
          ${step.type === "info" ? `<button class="primary-button" id="nextInfo">Continuar</button>` : ""}
        </div>
      </section>`;

    document.querySelector("#closeLesson").onclick = () => setView("track");

    if (step.type === "info") {
      document.querySelector("#nextInfo").onclick = advanceLesson;
    } else {
      document.querySelectorAll("[data-answer]").forEach((button) => {
        button.onclick = () => checkAnswer(Number(button.dataset.answer));
      });
    }
  }

  function checkAnswer(selectedIndex) {
    const lesson = flatLessons.find((item) => item.id === currentLessonId);
    const step = lesson.steps[currentStep];
    const buttons = [...document.querySelectorAll("[data-answer]")];
    const footer = document.querySelector("#lessonFooter");

    if (selectedIndex === step.answer) {
      buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === step.answer) button.classList.add("correct");
      });
      footer.innerHTML = `
        <div class="feedback success">
          <div><strong>Correto</strong><p>${escapeHTML(step.explanation)}</p></div>
          <button class="primary-button" id="nextQuestion">Continuar</button>
        </div>`;
      document.querySelector("#nextQuestion").onclick = advanceLesson;
    } else {
      buttons[selectedIndex].classList.add("wrong");
      buttons[selectedIndex].disabled = true;
      footer.innerHTML = `
        <div class="feedback error">
          <div><strong>Não é essa.</strong><p>Analise novamente e escolha outra resposta.</p></div>
          <button class="secondary-button" id="retryQuestion">Tentar novamente</button>
        </div>`;
      document.querySelector("#retryQuestion").onclick = () => {
        buttons.forEach((button) => { button.classList.remove("wrong"); button.disabled = false; });
        footer.innerHTML = "";
      };
    }
  }

  function advanceLesson() {
    const lesson = flatLessons.find((item) => item.id === currentLessonId);
    if (currentStep < lesson.steps.length - 1) {
      currentStep += 1;
      renderLessonStep();
      return;
    }
    completeLesson(lesson);
  }

  function completeLesson(lesson) {
    if (!isCompleted(lesson.id)) state.completedLessons.push(lesson.id);
    saveState();
    const next = nextLesson();
    screenTitle.textContent = "Lição concluída";
    app.innerHTML = `
      <section class="lesson-screen">
        <article class="lesson-card" style="justify-content:center; text-align:center; align-items:center;">
          <div class="module-icon" style="width:64px;height:64px;font-size:1.5rem;">✓</div>
          <p class="lesson-topic" style="margin-top:20px;">CONCLUÍDA</p>
          <h2>${escapeHTML(lesson.title)}</h2>
          <p class="lesson-copy">A próxima lição foi liberada. O progresso já está salvo neste navegador.</p>
          <div style="width:min(420px,100%);margin-top:18px;display:grid;gap:12px;">
            <button class="primary-button" id="continueCourse">${next ? "Próxima lição" : "Voltar para a trilha"}</button>
            <button class="secondary-button" id="returnTrack">Ver trilha</button>
          </div>
        </article>
      </section>`;
    document.querySelector("#continueCourse").onclick = () => next ? openLesson(next.id) : setView("track");
    document.querySelector("#returnTrack").onclick = () => setView("track");
  }

  function renderPractice() {
    screenTitle.textContent = "Prática";
    const completedQuestions = flatLessons
      .filter((lesson) => isCompleted(lesson.id))
      .flatMap((lesson) => lesson.steps.filter((step) => step.type === "choice").map((step) => ({ ...step, lessonTitle: lesson.title })));

    if (!completedQuestions.length) {
      app.innerHTML = `
        <section class="practice-panel">
          <div class="practice-empty">
            <h2>Conclua uma lição primeiro</h2>
            <p>A prática usa somente assuntos que você já estudou.</p>
            <button class="primary-button" id="startFirst" style="max-width:360px;">Começar a trilha</button>
          </div>
        </section>`;
      document.querySelector("#startFirst").onclick = () => openLesson(flatLessons[0].id);
      return;
    }

    practiceSession = [...completedQuestions].sort(() => Math.random() - 0.5).slice(0, Math.min(10, completedQuestions.length));
    practiceIndex = 0;
    renderPracticeQuestion();
  }

  function renderPracticeQuestion() {
    if (practiceIndex >= practiceSession.length) {
      app.innerHTML = `
        <section class="practice-panel">
          <div class="practice-empty">
            <h2>Revisão concluída</h2>
            <p>Você revisou ${practiceSession.length} perguntas de conteúdos já estudados.</p>
            <button class="primary-button" id="practiceAgain" style="max-width:360px;">Praticar novamente</button>
          </div>
        </section>`;
      document.querySelector("#practiceAgain").onclick = renderPractice;
      return;
    }

    const step = practiceSession[practiceIndex];
    app.innerHTML = `
      <section class="practice-panel">
        <p class="section-label">REVISÃO ${practiceIndex + 1}/${practiceSession.length}</p>
        <h2>${escapeHTML(step.title)}</h2>
        <p class="lesson-copy">Revisando: ${escapeHTML(step.lessonTitle)}</p>
        ${step.code ? `<pre class="code-block"><code>${escapeHTML(step.code)}</code></pre>` : ""}
        <div class="answers">
          ${step.options.map((option, index) => `<button class="answer-button" data-practice-answer="${index}">${escapeHTML(option)}</button>`).join("")}
        </div>
        <div class="lesson-footer" id="practiceFooter"></div>
      </section>`;

    document.querySelectorAll("[data-practice-answer]").forEach((button) => {
      button.onclick = () => checkPracticeAnswer(Number(button.dataset.practiceAnswer));
    });
  }

  function checkPracticeAnswer(selectedIndex) {
    const step = practiceSession[practiceIndex];
    const buttons = [...document.querySelectorAll("[data-practice-answer]")];
    const footer = document.querySelector("#practiceFooter");
    const correct = selectedIndex === step.answer;

    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === step.answer) button.classList.add("correct");
      if (index === selectedIndex && !correct) button.classList.add("wrong");
    });

    footer.innerHTML = `
      <div class="feedback ${correct ? "success" : "error"}">
        <div><strong>${correct ? "Correto" : "Resposta correta destacada"}</strong><p>${escapeHTML(step.explanation)}</p></div>
        <button class="primary-button" id="nextPractice">Continuar</button>
      </div>`;
    document.querySelector("#nextPractice").onclick = () => {
      practiceIndex += 1;
      renderPracticeQuestion();
    };
  }

  navButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  backButton.addEventListener("click", () => setView("home"));
  resetButton.addEventListener("click", () => {
    if (!confirm("Zerar todo o progresso salvo neste navegador?")) return;
    state = { completedLessons: [], lastLessonId: null };
    saveState();
    setView("home");
  });

  setView("home");
})();
