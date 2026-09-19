(function () {
  const App = {
    route: "home",
    menuOpen: false,
    calcOpen: false,
    practiceAreas: null,
    practiceLabel: "",
    modeState: null
  };

  function navigate(route, options) {
    options = options || {};
    App.route = route;
    App.menuOpen = false;
    if (!options.keepPractice && !options.resume) {
      App.practiceAreas = null;
      App.practiceLabel = "";
    }
    if (options.practiceAreas) {
      App.practiceAreas = options.practiceAreas.slice();
      App.practiceLabel = options.practiceLabel || "Utvalt urval";
    }
    if (!options.resume) App.modeState = null;
    location.hash = route;
    render();
    window.scrollTo(0, 0);
  }

  function saveResume(extra) {
    store.setSession(
      Object.assign(
        { mode: App.route, practiceAreas: App.practiceAreas, practiceLabel: App.practiceLabel },
        extra || {}
      )
    );
  }

  function inExam() {
    return App.route === "exam" && App.modeState && App.modeState.started;
  }

  function hardButton(id) {
    const pressed = store.isHard(id);
    return (
      '<button type="button" class="btn btn-warn" data-action="hard" aria-pressed="' +
      (pressed ? "true" : "false") +
      '">' +
      (pressed ? "Sparad som svår" : "Markera som svårt") +
      "</button>"
    );
  }

  function bindHard(root, id) {
    on(root, '[data-action="hard"]', "click", function () {
      store.toggleHard(id);
      const button = root.querySelector('[data-action="hard"]');
      const pressed = store.isHard(id);
      setPressed(button, pressed);
      button.textContent = pressed ? "Sparad som svår" : "Markera som svårt";
    });
  }

  function banner() {
    if (!App.practiceAreas) return "";
    return '<div class="banner">' + escapeHtml(App.practiceLabel) + "</div>";
  }

  function modeCard(route, title, desc) {
    return '<button type="button" class="btn" data-go="' + route + '"><span>' + escapeHtml(title) + "<small>" + escapeHtml(desc) + "</small></span></button>";
  }

  function layout(inner) {
    const chips = NAV_ITEMS.map(function (item) {
      return '<button type="button" class="chip' + (App.route === item.id ? " active" : "") + '" data-nav="' + item.id + '">' + escapeHtml(item.label) + "</button>";
    }).join("");
    const calc =
      inExam()
        ? ""
        : App.calcOpen
          ? '<div class="calc-panel"><div class="calc-box"><div class="label">Miniräknare</div><form data-calc="1"><input name="expr" placeholder="t.ex. 72/3.6" autocomplete="off"><div class="btn-row"><button class="btn" type="submit">Beräkna</button><button class="btn btn-secondary" type="button" data-action="calc-close">Stäng</button></div></form><p class="meta" data-calc-out></p></div></div>'
          : "";
    return (
      '<header class="topbar">' +
      '<div class="topbar-inner">' +
      '<button type="button" class="brand" data-nav="home" aria-label="Till startsidan"><span class="brand-mark">F1</span><span class="brand-name">Fysik 1</span></button>' +
      (inExam() ? "" : '<button type="button" class="mast-link" data-action="calc-open">Miniräknare</button>') +
      '<a class="mast-link lib-link" href="https://isaksplugglibary.vercel.app">Bibliotek</a>' +
      "</div>" +
      '<div class="topbar-inner chip-row">' + chips + "</div>" +
      "</header>" +
      '<main class="content">' + inner + "</main>" +
      calc
    );
  }

  function bindShell() {
    document.querySelectorAll("[data-nav]").forEach(function (button) {
      button.addEventListener("click", function () {
        navigate(button.getAttribute("data-nav"));
      });
    });
    on(document, "[data-action='menu']", "click", function () {
      App.menuOpen = !App.menuOpen;
      render();
    });
    on(document, "[data-action='close-menu']", "click", function () {
      App.menuOpen = false;
      render();
    });
    on(document, "[data-action='calc-open']", "click", function () {
      App.calcOpen = true;
      render();
    });
    on(document, "[data-action='calc-close']", "click", function () {
      App.calcOpen = false;
      render();
    });
    const form = document.querySelector("[data-calc]");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const n = Phy.evalCalc(form.expr.value);
        const out = document.querySelector("[data-calc-out]");
        out.textContent = n == null ? "Ogiltigt uttryck" : Phy.formatPlain(n, 6);
      });
    }
  }

  function bindGo(root) {
    on(root, "[data-go]", "click", function (event) {
      navigate(event.currentTarget.getAttribute("data-go"), App.practiceAreas ? { practiceAreas: App.practiceAreas, practiceLabel: App.practiceLabel, keepPractice: true } : {});
    });
  }

  function quizNav(state, total) {
    return (
      '<div class="toolbar"><div class="btn-row">' +
      '<button class="btn btn-secondary" data-action="prev"' +
      (state.index === 0 ? " disabled" : "") +
      ">Föregående</button>" +
      '<button class="btn" data-action="next"' +
      (state.index >= total - 1 ? " disabled" : "") +
      ">Nästa</button></div></div>"
    );
  }

  function bindQuizNav(total) {
    const state = App.modeState;
    on(document, "[data-action='prev']", "click", function () {
      if (state.index === 0) return;
      state.index -= 1;
      render();
    });
    on(document, "[data-action='next']", "click", function () {
      if (state.index >= total - 1) return;
      state.index += 1;
      render();
    });
  }

  function feedback(ok, display, steps, extra) {
    const list = (steps || [])
      .map(function (s, i) {
        return "<li><strong>Steg " + (i + 1) + ".</strong> " + escapeHtml(s) + "</li>";
      })
      .join("");
    return (
      '<div class="feedback ' +
      (ok ? "good" : "bad") +
      '"><strong>' +
      (ok ? "Rätt" : "Fel") +
      "</strong>" +
      (display ? '<p>Rätt svar: <span class="correct-answer">' + escapeHtml(display) + "</span></p>" : "") +
      (extra ? "<p>" + extra + "</p>" : "") +
      (list ? '<ol class="steps">' + list + "</ol>" : "") +
      "</div>"
    );
  }

  function renderHome() {
    const mastered = masteredCount();
    const last = store.data.lastResult;
    const session = store.data.lastSession;
    const weak = getWeakAreas().slice(0, 6);
    const cells = AREA_IDS.map(function (id) {
      return '<span class="progress-cell' + (isMastered(id) ? " on" : "") + '"></span>';
    }).join("");
    let lastHtml = '<p class="empty">Inget prov gjort ännu.</p>';
    if (last) {
      lastHtml =
        '<p class="result-score" style="font-size:2rem">' +
        last.score +
        " / " +
        last.total +
        "</p><p class=\"meta\">" +
        last.percent +
        "% · " +
        escapeHtml(formatDate(last.date)) +
        '</p><div class="btn-row"><button class="btn" data-go="results">Visa resultat</button>' +
        (last.missedAreas && last.missedAreas.length
          ? '<button class="btn btn-secondary" data-action="practice-missed">Träna mina fel</button>'
          : "") +
        "</div>";
    }
    let cont = "";
    if (session && session.mode && session.mode !== "home" && session.mode !== "results") {
      cont =
        '<button class="btn btn-secondary" data-action="resume">Fortsätt: ' +
        escapeHtml(MODE_TITLES[session.mode] || "där du slutade") +
        "</button>";
    }
    const weakHtml = weak.length
      ? '<ul class="list">' +
        weak
          .map(function (id) {
            const s = store.getStat(id);
            return (
              "<li><span class=\"en\">" +
              escapeHtml(AREA_LABELS[id]) +
              '</span><span class="sv">' +
              s.incorrect +
              " fel</span></li>"
            );
          })
          .join("") +
        "</ul>"
      : '<p class="empty">Träna först så visas det du behöver repetera.</p>';

    return (
      '<p class="page-kicker">Fysik nivå 1 · Teknikprogrammet TE26</p>' +
      " <h1>Prefix &amp; enheter</h1>" +
      '<p class="lead">Från att kunna prefixen utantill till att lösa uppgifter där enheter, formler och beräkningar måste kombineras.</p>' +
      '<div class="grid-2"><section class="card"><h2>Framsteg</h2><div class="stat-row">' +
      '<div class="stat"><strong>' +
      mastered +
      " / " +
      AREA_IDS.length +
      "</strong><span>Totalt framsteg</span></div>" +
      '<div class="stat"><strong>' +
      store.data.answeredCount +
      "</strong><span>Lösta uppgifter</span></div>" +
      '<div class="stat"><strong>' +
      store.accuracy() +
      "%</strong><span>Rätt procent</span></div>" +
      '<div class="stat"><strong>' +
      store.data.hardIds.length +
      "</strong><span>Svåra områden</span></div></div>" +
      '<div class="progress-track">' +
      cells +
      '</div><div class="btn-row"><button class="btn" data-go="learn">Lär dig</button>' +
      cont +
      "</div></section><section class=\"card\"><h2>Senaste resultat</h2>" +
      lastHtml +
      "</section></div>" +
      '<div class="grid-modes">' +
      modeCard("learn", "Lär dig", "Korta avsnitt. Tänk först, visa sedan förklaring.") +
      modeCard("prefix", "Prefixträning", "Tabell, memorering, utan prefix och med prefix.") +
      modeCard("expand", "Enhetsomvandling", "Skriv ut prefix och sätt dit lämpligt prefix.") +
      modeCard("sigfigs", "Värdesiffror", "Räkna värdesiffror och avrunda produkter och kvoter.") +
      modeCard("time", "Tid", "min, h, dygn och sekunder.") +
      modeCard("velocity", "Hastighet", "v = s/t samt km/h och m/s.") +
      modeCard("density", "Densitet", "ρ = m/V åt alla håll.") +
      modeCard("mix", "Blandad träning", "Du vet inte vilken typ som kommer.") +
      modeCard("exam", "Provläge", "Ingen hjälp förrän du lämnar in.") +
      modeCard("hard", "Mina fel", "Repetera det som inte sitter.") +
      "</div>" +
      '<div class="grid-2"><section class="card"><h2>Vad du behöver träna på</h2>' +
      weakHtml +
      (weak.length
        ? '<div class="btn-row"><button class="btn btn-secondary" data-action="practice-weak">Träna svaga områden</button></div>'
        : "") +
      "</section><section class=\"card\"><h2>Formler att kunna</h2><p class=\"formula\">v = s / t</p><p class=\"formula\">s = v × t</p><p class=\"formula\">ρ = m / V</p><p class=\"formula\">km/h → m/s : ÷ 3,6</p></section></div>"
    );
  }

  function bindHome(root) {
    bindGo(root);
    on(root, "[data-action='resume']", "click", function () {
      const session = store.data.lastSession;
      if (!session) return;
      App.practiceAreas = session.practiceAreas || null;
      App.practiceLabel = session.practiceLabel || "";
      App.modeState = session.modeState || null;
      if (session.mode === "exam" && store.data.activeExam) App.modeState = store.data.activeExam;
      App.route = session.mode;
      location.hash = session.mode;
      render();
    });
    on(root, "[data-action='practice-missed']", "click", function () {
      const ids = store.data.lastResult && store.data.lastResult.missedAreas;
      if (!ids) return;
      navigate("mix", { practiceAreas: ids, practiceLabel: "Träna mina fel", keepPractice: true });
    });
    on(root, "[data-action='practice-weak']", "click", function () {
      navigate("mix", { practiceAreas: getWeakAreas(), practiceLabel: "Smart repetition", keepPractice: true });
    });
  }

  function ensureLearn() {
    if (App.modeState && App.modeState.type === "learn") return App.modeState;
    App.modeState = { type: "learn", index: 0, revealed: false };
    return App.modeState;
  }

  function prefixLineHtml() {
    return (
      '<div class="prefix-line">' +
      Phy.LINE.map(function (p) {
        return (
          '<div class="prefix-chip">' +
          escapeHtml(p.symbol) +
          "<small>" +
          Phy.tenHtml(p.exp) +
          "</small></div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderLearn() {
    const state = ensureLearn();
    const item = LEARN[state.index];
    saveResume({ modeState: state });
    const extra = item.id === "l-line" ? prefixLineHtml() : "";
    const answer = state.revealed
      ? '<div class="answer-block"><div class="label">Förklaring</div><p class="body-text">' +
        escapeHtml(item.explain) +
        "</p></div>"
      : '<div class="think-box"><div class="label">Förklara med egna ord</div><p class="body-text">' +
        escapeHtml(item.think) +
        "</p></div>";
    return (
      '<div class="study-head"><div><p class="page-kicker">Lär dig</p><h1>' +
      escapeHtml(item.title) +
      '</h1></div><div class="meta">' +
      (state.index + 1) +
      " / " +
      LEARN.length +
      "</div></div><section class=\"word-card\"><p class=\"body-text\">" +
      escapeHtml(item.body) +
      "</p>" +
      extra +
      answer +
      '</section><div class="toolbar"><div class="btn-row">' +
      '<button class="btn btn-secondary" data-action="prev"' +
      (state.index === 0 ? " disabled" : "") +
      ">Föregående</button>" +
      '<button class="btn btn-secondary" data-action="next"' +
      (state.index === LEARN.length - 1 ? " disabled" : "") +
      ">Nästa</button></div><div class=\"btn-row\"><button class=\"btn\" data-action=\"toggle\">" +
      (state.revealed ? "Dölj förklaring" : "Visa förklaring") +
      "</button></div></div>"
    );
  }

  function bindLearn() {
    const state = App.modeState;
    on(document, "[data-action='toggle']", "click", function () {
      state.revealed = !state.revealed;
      render();
    });
    on(document, "[data-action='prev']", "click", function () {
      if (state.index === 0) return;
      state.index -= 1;
      state.revealed = false;
      render();
    });
    on(document, "[data-action='next']", "click", function () {
      if (state.index === LEARN.length - 1) return;
      state.index += 1;
      state.revealed = false;
      render();
    });
  }

  function renderPrefixHub() {
    const selected = (App.modeState && App.modeState.selected) || "mega";
    const p = Phy.prefixById(selected) || Phy.prefixById("mega");
    const exampleMap = {
      tera: "1 TW = 1 000 000 000 000 W",
      giga: "1 GW = 1 000 000 000 W",
      mega: "1 MW = 1 000 000 W",
      kilo: "1 km = 1 000 m",
      hekto: "1 hL = 100 L",
      deka: "1 dag = 10 g (dekagram)",
      none: "1 m = 1 × 10⁰ m",
      deci: "1 dm = 0,1 m",
      centi: "1 cm = 0,01 m",
      milli: "1 mm = 0,001 m",
      mikro: "1 µs = 0,000001 s",
      nano: "1 nm = 10⁻⁹ m",
      piko: "1 ps = 10⁻¹² s"
    };
    const rows = Phy.PREFIXES.map(function (row) {
      return (
        "<tr class=\"" +
        (row.id === p.id ? "active" : "") +
        "\"><td><button type=\"button\" data-prefix=\"" +
        row.id +
        "\">" +
        escapeHtml(row.name) +
        "</button></td><td class=\"mono\">" +
        escapeHtml(row.symbol) +
        "</td><td class=\"mono\">" +
        Phy.tenHtml(row.exp) +
        "</td></tr>"
      );
    }).join("");
    return (
      '<p class="page-kicker">Prefix</p><h1>SI-prefix</h1>' +
      '<p class="lead">Klicka på ett prefix. I provläge är linjen avstängd.</p>' +
      prefixLineHtml() +
      '<div class="grid-2"><section class="card"><table class="prefix-table"><thead><tr><th>Prefix</th><th>Symbol</th><th>Faktor</th></tr></thead><tbody>' +
      rows +
      "</tbody></table></section><section class=\"card\"><div class=\"label\">Valt prefix</div><p class=\"prompt\">" +
      escapeHtml(p.name) +
      '</p><p class="formula">' +
      escapeHtml(p.symbol) +
      "</p><p class=\"formula\">" +
      Phy.tenHtml(p.exp) +
      "</p><p class=\"body-text\">" +
      escapeHtml(exampleMap[p.id] || "") +
      "</p></section></div>" +
      '<div class="grid-modes">' +
      modeCard("prefixdrill", "Prefixträning", "Flerval, skriv själv och omvända frågor.") +
      modeCard("flash", "Flashcards", "Prefix, enheter, formler och omvandlingar.") +
      modeCard("expand", "Skriv utan prefix", "7,5 MHz → 7,5 × 10⁶ Hz") +
      modeCard("compress", "Sätt dit prefix", "30 000 V → 30 kV") +
      "</div>"
    );
  }

  function bindPrefixHub(root) {
    bindGo(root);
    App.modeState = App.modeState && App.modeState.type === "phub" ? App.modeState : { type: "phub", selected: "mega" };
    on(root, "[data-prefix]", "click", function (event) {
      App.modeState.selected = event.currentTarget.getAttribute("data-prefix");
      render();
    });
  }

  function filterArea(list, area) {
    if (!App.practiceAreas || !App.practiceAreas.length) return list.slice();
    if (App.practiceAreas.indexOf(area) === -1 && list.length) return list.slice();
    return list.slice();
  }

  function ensureItems(type, items) {
    if (App.modeState && App.modeState.type === type) return App.modeState;
    App.modeState = { type: type, index: 0, items: items, results: {} };
    return App.modeState;
  }

  function renderMc(kicker, title, state, item) {
    const result = state.results[item.id];
    const options = item.shuffled || item.options;
    const buttons = options
      .map(function (opt) {
        var cls = "choice";
        if (result) {
          if (opt === item.answer) cls += " correct";
          else if (opt === result.given && !result.ok) cls += " incorrect";
        }
        return (
          '<button type="button" class="' +
          cls +
          '" data-choice="' +
          escapeHtml(opt) +
          '"' +
          (result ? " disabled" : "") +
          ">" +
          escapeHtml(opt) +
          "</button>"
        );
      })
      .join("");
    return (
      banner() +
      '<div class="study-head"><div><p class="page-kicker">' +
      escapeHtml(kicker) +
      "</p><h1>" +
      escapeHtml(title) +
      '</h1></div><div class="meta">' +
      (state.index + 1) +
      " / " +
      state.items.length +
      '</div></div><section class="word-card"><p class="prompt" style="font-size:1.35rem">' +
      escapeHtml(item.prompt) +
      '</p><div class="choices">' +
      buttons +
      "</div>" +
      (result ? feedback(result.ok, item.answer, item.steps, item.explain) : "") +
      "</section>" +
      '<div class="toolbar"><div class="btn-row"></div><div class="btn-row">' +
      hardButton(item.area) +
      "</div></div>" +
      quizNav(state, state.items.length)
    );
  }

  function bindMc(root) {
    const state = App.modeState;
    const item = state.items[state.index];
    bindHard(root, item.area);
    bindQuizNav(state.items.length);
    on(root, "[data-choice]", "click", function (event) {
      if (state.results[item.id]) return;
      const given = event.currentTarget.getAttribute("data-choice");
      const ok = given === item.answer;
      state.results[item.id] = { ok: ok, given: given };
      store.record(item.area, ok);
      render();
    });
  }

  function renderNumeric(kicker, title, state, item, placeholder) {
    const result = state.results[item.id];
    return (
      banner() +
      '<div class="study-head"><div><p class="page-kicker">' +
      escapeHtml(kicker) +
      "</p><h1>" +
      escapeHtml(title) +
      '</h1></div><div class="meta">' +
      (state.index + 1) +
      " / " +
      state.items.length +
      '</div></div><section class="word-card"><p class="prompt" style="font-size:1.3rem">' +
      escapeHtml(item.prompt) +
      "</p>" +
      (result
        ? feedback(result.ok, item.display, item.steps, result.reason)
        : '<form class="field"><label class="sr-only" for="ans">Svar</label><input id="ans" name="answer" autocomplete="off" placeholder="' +
          escapeHtml(placeholder || "Tal och enhet") +
          '"><div class="btn-row"><button class="btn" type="submit">Rätta</button></div></form>') +
      "</section>" +
      '<div class="toolbar"><div class="btn-row"></div><div class="btn-row">' +
      hardButton(item.area) +
      "</div></div>" +
      quizNav(state, state.items.length)
    );
  }

  function bindNumeric(root, grader) {
    const state = App.modeState;
    const item = state.items[state.index];
    bindHard(root, item.area);
    bindQuizNav(state.items.length);
    const form = root.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const given = form.answer.value;
      const graded = grader(given, item);
      state.results[item.id] = { ok: graded.ok, given: given, reason: graded.reason || "" };
      store.record(item.area, graded.ok);
      render();
    });
  }

  function prepareMc(list) {
    return shuffle(list).map(function (q) {
      return Object.assign({}, q, { shuffled: shuffle((q.options || []).slice()) });
    });
  }

  function renderPrefixDrill() {
    const state = ensureItems("pdrill", weightedPick(prepareMc(PREFIX_MC)));
    saveResume({ modeState: state });
    return renderMc("Prefixträning", "Vad betyder symbolen?", state, state.items[state.index]);
  }

  function expandItems() {
    return shuffle(EXPAND_BANK).slice(0, 16).map(function (row, i) {
      return {
        id: "ex-" + i + "-" + row.display,
        area: "prefix",
        prompt: "Skriv utan prefix: " + row.display,
        si: row.si,
        dim: row.dim,
        display: Phy.formatPlain(row.si, 4) + " " + row.unit + "  (eller " + Phy.formatPlain(row.coeff, 3) + " × " + Phy.tenText(Phy.prefixById(row.prefix).exp) + " " + row.unit + ")",
        steps: [
          row.display + " har prefixet " + Phy.prefixById(row.prefix).name + " = " + Phy.tenText(Phy.prefixById(row.prefix).exp),
          "Multiplicera koefficienten med faktorn.",
          "Svar: " + Phy.formatPlain(row.si, 4) + " " + row.unit
        ]
      };
    });
  }

  function renderExpand() {
    const state = ensureItems("expand", expandItems());
    saveResume({ modeState: state });
    return renderNumeric("Utan prefix", "Skriv i grundenhet", state, state.items[state.index], "t.ex. 7,5e6 Hz");
  }

  function gradeExpand(given, item) {
    return Phy.gradeQuantity(given, item.si, item.dim, { rel: 0.008 });
  }

  function compressItems() {
    return shuffle(COMPRESS_BANK).map(function (row, i) {
      return {
        id: "co-" + i + "-" + row.display,
        area: "prefix",
        prompt: "Skriv med ett lämpligt prefix: " + row.display,
        si: row.si,
        dim: row.dim,
        display: row.prefer,
        steps: [
          "Utgå från " + row.display + ".",
          "Välj ett prefix så att koefficienten hamnar mellan 1 och 1000.",
          "Lämpligt svar: " + row.prefer
        ]
      };
    });
  }

  function renderCompress() {
    const state = ensureItems("compress", compressItems());
    saveResume({ modeState: state });
    return renderNumeric("Med prefix", "Välj lämpligt prefix", state, state.items[state.index], "t.ex. 30 kV");
  }

  function gradeCompress(given, item) {
    const g = Phy.gradeQuantity(given, item.si, item.dim, { rel: 0.012 });
    if (!g.ok) return g;
    const parsed = g.parsed;
    if (!parsed.unitRaw) {
      return { ok: false, reason: "Skriv ett prefix i enheten, till exempel kV." };
    }
    return g;
  }

  function renderFlash() {
    const state =
      App.modeState && App.modeState.type === "flash"
        ? App.modeState
        : (App.modeState = { type: "flash", index: 0, flipped: false, order: shuffle(FLASHCARDS.map(function (c) { return c.id; })) });
    const cards = state.order
      .map(function (id) {
        return FLASHCARDS.find(function (c) {
          return c.id === id;
        });
      })
      .filter(Boolean);
    const card = cards[state.index];
    saveResume({ modeState: state });
    return (
      '<div class="study-head"><div><p class="page-kicker">Flashcards</p><h1>Vänd kortet</h1></div><div class="meta">' +
      (state.index + 1) +
      " / " +
      cards.length +
      '</div></div><div class="flip-wrap"><button type="button" class="flip' +
      (state.flipped ? " is-flipped" : "") +
      '" data-action="flip"><div class="flip-inner"><div class="flip-face"><div class="label">Fråga</div><p class="prompt">' +
      escapeHtml(card.front) +
      '</p><p class="flip-hint">Klicka för att vända</p></div><div class="flip-face flip-back"><div class="label">Svar</div><p class="prompt" style="font-size:1.4rem">' +
      escapeHtml(card.back) +
      "</p></div></div></button></div>" +
      '<div class="toolbar"><div class="btn-row"><button class="btn btn-secondary" data-action="prev">Föregående</button><button class="btn btn-secondary" data-action="next">Nästa</button><button class="btn btn-secondary" data-action="shuffle">Blanda</button></div><div class="btn-row">' +
      hardButton(card.area) +
      "</div></div>"
    );
  }

  function bindFlash(root) {
    const state = App.modeState;
    const n = state.order.length;
    const card = FLASHCARDS.find(function (c) {
      return c.id === state.order[state.index];
    });
    bindHard(root, card.area);
    on(root, "[data-action='flip']", "click", function () {
      state.flipped = !state.flipped;
      render();
    });
    on(root, "[data-action='prev']", "click", function () {
      state.index = (state.index - 1 + n) % n;
      state.flipped = false;
      render();
    });
    on(root, "[data-action='next']", "click", function () {
      state.index = (state.index + 1) % n;
      state.flipped = false;
      render();
    });
    on(root, "[data-action='shuffle']", "click", function () {
      state.order = shuffle(state.order);
      state.index = 0;
      state.flipped = false;
      render();
    });
  }

  function renderUnits() {
    const state = ensureItems("units", weightedPick(prepareMc(UNIT_MC)));
    saveResume({ modeState: state });
    return renderMc("Enheter", "Storhet och SI-enhet", state, state.items[state.index]);
  }

  function sigItems() {
    return shuffle(SIG_COUNT).map(function (row, i) {
      return {
        id: "sg-" + i + "-" + row.prompt,
        area: "sigfigs",
        prompt: "Hur många värdesiffror har " + row.prompt + "?",
        type: "sig",
        answer: row.answer,
        alt: row.alt,
        display: String(row.answer),
        steps: [row.why]
      };
    });
  }

  function renderSig() {
    const state = ensureItems("sig", sigItems());
    saveResume({ modeState: state });
    const item = state.items[state.index];
    return (
      renderNumeric("Värdesiffror", "Räkna värdesiffror", state, item, "Ett heltal") +
      '<p class="meta">Inledande nollor räknas inte. Nollor mellan siffror räknas. Avslutande nollor efter decimaltecken kan räknas.</p>' +
      '<div class="btn-row"><button class="btn btn-secondary" data-go="sigcalc">Värdesiffror i beräkningar</button></div>'
    );
  }

  function gradeSig(given, item) {
    const n = parseInt(String(given).replace(",", "."), 10);
    const ok = n === item.answer || (item.alt && item.alt.indexOf(n) !== -1);
    return { ok: ok, reason: ok ? "" : "Räkna siffrorna i koefficienten, inte tiopotensen." };
  }

  function sigCalcItems() {
    return shuffle(SIG_CALC).map(function (row, i) {
      const op = row.op === "*" ? "×" : "/";
      return {
        id: "sc-" + i,
        area: "sigfigs",
        prompt: "Beräkna och avrunda till rätt antal värdesiffror: " + Phy.formatPlain(row.a, 4) + " " + op + " " + Phy.formatPlain(row.b, 4),
        si: row.answer,
        dim: null,
        display: Phy.formatPlain(row.answer, row.sig),
        sig: row.sig,
        raw: row.raw,
        steps: [
          "Råvärde: " + Phy.formatPlain(row.raw, 6),
          "Minst antal värdesiffror: " + row.sig,
          row.why,
          "Svar: " + Phy.formatPlain(row.answer, row.sig)
        ]
      };
    });
  }

  function renderSigCalc() {
    const state = ensureItems("sigcalc", sigCalcItems());
    saveResume({ modeState: state });
    return renderNumeric("Beräkning", "Avrunda rätt", state, state.items[state.index], "t.ex. 26,9");
  }

  function gradeSigCalc(given, item) {
    const n = Phy.parseNumber(given);
    if (n == null) return { ok: false, reason: "Kunde inte tolka talet." };
    if (!Phy.nearly(n, item.si, 0.02)) {
      if (Phy.nearly(n, item.raw, 0.002)) return { ok: false, reason: "Råvärdet stämmer, men du måste avrunda till " + item.sig + " värdesiffror." };
      return { ok: false, reason: "Fel värde." };
    }
    const sig = Phy.countSigFigs(given);
    if (sig && item.sig && Math.abs(sig - item.sig) > 0 && String(given).indexOf("e") === -1) {
      if (!(item.si >= 10 && sig === item.sig - 0)) {
        if (sig !== item.sig && !(item.answer === 5 && (given === "5,00" || given === "5.00"))) {
          if (sig !== item.sig) return { ok: false, reason: "Värdet är rätt avrundat till storleken, men skriv " + item.sig + " värdesiffror." };
        }
      }
    }
    return { ok: true };
  }

  function timeItems() {
    return shuffle(TIME_Q).map(function (row, i) {
      return Object.assign({ id: "ti-" + i, area: "time" }, row);
    });
  }

  function renderTime() {
    const state = ensureItems("time", timeItems());
    saveResume({ modeState: state });
    return renderNumeric("Tid", "Omvandla tiden", state, state.items[state.index], "t.ex. 12600 s");
  }

  function gradeTime(given, item) {
    return Phy.gradeQuantity(given, item.si, "T", { rel: 0.01 });
  }

  function speedItems() {
    return shuffle(SPEED_Q).map(function (row, i) {
      var si = 0;
      var dim = "V";
      var display = "";
      if (row.kind === "v") {
        display = row.v + " " + row.vu;
        si = row.vu === "km/h" ? row.v / 3.6 : row.v;
        dim = "V";
      } else if (row.kind === "s") {
        display = row.s + " " + row.su;
        si = row.su === "km" ? row.s * 1000 : row.s;
        dim = "L";
      } else {
        display = row.t + " " + row.tu;
        si = row.tu === "h" ? row.t * 3600 : row.tu === "min" ? row.t * 60 : row.t;
        dim = "T";
      }
      return {
        id: "sp-" + i,
        area: "velocity",
        prompt: row.prompt,
        si: si,
        dim: dim,
        display: display,
        steps: row.steps
      };
    });
  }

  function renderVelocity() {
    return (
      '<p class="page-kicker">Hastighet</p><h1>v = s / t</h1>' +
      '<p class="lead">v hastighet, s sträcka, t tid. Enheten måste följa med.</p>' +
      '<p class="formula">v = s / t</p><p class="formula">s = v × t</p><p class="formula">t = s / v</p>' +
      '<div class="grid-modes">' +
      modeCard("speedq", "Hastighetsuppgifter", "En okänd i taget: v, s eller t.") +
      modeCard("convert", "km/h och m/s", "Dividera eller multiplicera med 3,6.") +
      modeCard("mixedu", "Blandade enheter", "Omvandla först, räkna sedan.") +
      modeCard("problems", "Problemlösning", "Flera steg och tydlig lösning efteråt.") +
      modeCard("first", "Vad ska jag göra först?", "Välj nästa steg innan du räknar.") +
      modeCard("linear", "Linjära samband", "Tabell, lutning och graf.") +
      "</div>"
    );
  }

  function renderSpeedQ() {
    const state = ensureItems("speedq", speedItems());
    saveResume({ modeState: state });
    return renderNumeric("Hastighet", "En okänd", state, state.items[state.index], "t.ex. 60 km/h");
  }

  function gradeSpeed(given, item) {
    return Phy.gradeQuantity(given, item.si, item.dim, { rel: 0.015 });
  }

  function convertItems() {
    return shuffle(CONVERT_Q).map(function (row, i) {
      const dim = "V";
      const si = row.toU === "m/s" ? row.to : row.to / 3.6;
      return {
        id: "cv-" + i,
        area: "convert",
        prompt: row.prompt,
        si: si,
        dim: dim,
        display: Phy.formatPlain(row.to, 3) + " " + row.toU,
        steps: row.steps
      };
    });
  }

  function renderConvert() {
    const state = ensureItems("convert", convertItems());
    saveResume({ modeState: state });
    return (
      '<p class="formula">km/h → m/s = ÷ 3,6</p><p class="formula">m/s → km/h = × 3,6</p>' +
      renderNumeric("Omvandling", "km/h och m/s", state, state.items[state.index], "t.ex. 55,6 m/s")
    );
  }

  function mixedItems() {
    return shuffle(MIXED_U).map(function (row, i) {
      return Object.assign({ id: "mu-" + i, area: "problem" }, row);
    });
  }

  function renderMixedU() {
    const state = ensureItems("mixedu", mixedItems());
    saveResume({ modeState: state });
    return renderNumeric("Blandade enheter", "Omvandla först", state, state.items[state.index], "tal och enhet");
  }

  function densItems() {
    return shuffle(DENSITY_Q).map(function (row, i) {
      return Object.assign({ id: "de-" + i, area: "density" }, row);
    });
  }

  function renderDensity() {
    const state = ensureItems("dens", densItems());
    saveResume({ modeState: state });
    return (
      '<p class="formula">ρ = m / V</p><p class="formula">m = ρV</p><p class="formula">V = m / ρ</p>' +
      renderNumeric("Densitet", "Massa, volym, densitet", state, state.items[state.index], "t.ex. 5,0 g/cm³")
    );
  }

  function renderFormulas() {
    const state = ensureItems("form", prepareMc(FORMULA_Q));
    saveResume({ modeState: state });
    return renderMc("Formler", "Välj och skriv om", state, state.items[state.index]);
  }

  function renderFirst() {
    const state = ensureItems("first", prepareMc(FIRST_Q));
    saveResume({ modeState: state });
    return renderMc("Problemlösning", "Vad ska jag göra först?", state, state.items[state.index]);
  }

  function renderLinear() {
    const state = ensureItems("lin", LINEAR_Q.map(function (q) {
      return Object.assign({}, q, { shuffled: q.options ? shuffle(q.options.slice()) : null });
    }));
    saveResume({ modeState: state });
    const item = state.items[state.index];
    const table =
      '<table class="prefix-table"><thead><tr><th>Antal knutar</th><th>Längd</th></tr></thead><tbody>' +
      KNOTS.map(function (r) {
        return "<tr><td>" + r.n + "</td><td>" + String(r.L).replace(".", ",") + " cm</td></tr>";
      }).join("") +
      "</tbody></table><canvas class=\"graph\" id=\"lin-graph\" width=\"640\" height=\"220\"></canvas>";
    if (item.type === "mc") {
      return table + renderMc("Linjära samband", "Tabell och graf", state, item);
    }
    return table + renderNumeric("Linjära samband", "Tabell och graf", state, item, "t.ex. 108,2 cm");
  }

  function drawGraph() {
    const canvas = document.getElementById("lin-graph");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#c4c0b5";
    ctx.beginPath();
    ctx.moveTo(40, h - 30);
    ctx.lineTo(w - 10, h - 30);
    ctx.moveTo(40, 10);
    ctx.lineTo(40, h - 30);
    ctx.stroke();
    const xs = KNOTS.map(function (r) { return r.n; });
    const ys = KNOTS.map(function (r) { return r.L; });
    function xPix(x) { return 40 + (x / 5) * (w - 60); }
    function yPix(y) { return h - 30 - ((y - 70) / 50) * (h - 50); }
    ctx.strokeStyle = "#255a6b";
    ctx.beginPath();
    KNOTS.forEach(function (r, i) {
      const x = xPix(r.n);
      const y = yPix(r.L);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = "#255a6b";
    KNOTS.forEach(function (r) {
      ctx.beginPath();
      ctx.arc(xPix(r.n), yPix(r.L), 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function problemItems() {
    return shuffle(PROBLEM_Q.filter(function (p) { return p.type !== "text"; }).concat(MIXED_U)).map(function (row, i) {
      return Object.assign({ id: "pr-" + i, area: row.area || "problem" }, row);
    });
  }

  function renderProblems() {
    const state = ensureItems("prob", problemItems());
    saveResume({ modeState: state });
    return renderNumeric("Problemlösning", "Flera steg", state, state.items[state.index], "tal och enhet");
  }

  function mixBank() {
    const areas = App.practiceAreas;
    function allow(area) {
      return !areas || areas.indexOf(area) !== -1;
    }
    var list = [];
    if (allow("prefix")) list = list.concat(prepareMc(PREFIX_MC).slice(0, 4)).concat(expandItems().slice(0, 2));
    if (allow("units")) list = list.concat(prepareMc(UNIT_MC).slice(0, 3));
    if (allow("sigfigs")) list = list.concat(sigItems().slice(0, 2)).concat(sigCalcItems().slice(0, 1));
    if (allow("time")) list = list.concat(timeItems().slice(0, 2));
    if (allow("velocity")) list = list.concat(speedItems().slice(0, 2));
    if (allow("convert")) list = list.concat(convertItems().slice(0, 2));
    if (allow("density")) list = list.concat(densItems().slice(0, 2));
    if (allow("formula")) list = list.concat(prepareMc(FORMULA_Q).slice(0, 2));
    if (allow("problem")) list = list.concat(mixedItems().slice(0, 2)).concat(prepareMc(FIRST_Q).slice(0, 1));
    if (allow("linear")) list = list.concat(LINEAR_Q.slice(0, 1));
    if (!list.length) list = prepareMc(PREFIX_MC).slice(0, 8);
    return shuffle(list).slice(0, 12);
  }

  function renderMix() {
    const state = ensureItems("mix", mixBank());
    saveResume({ modeState: state });
    const item = state.items[state.index];
    if (item.type === "mc" || item.options) return renderMc("Blandat", "Testa dig", state, Object.assign({}, item, { shuffled: item.shuffled || shuffle((item.options || []).slice()) }));
    if (item.type === "sig") return renderNumeric("Blandat", "Testa dig", state, item, "heltal");
    return renderNumeric("Blandat", "Testa dig", state, item, "tal och enhet");
  }

  function gradeGeneric(given, item) {
    if (item.type === "sig") return gradeSig(given, item);
    if (item.sig && item.raw != null) return gradeSigCalc(given, item);
    if (item.si != null) return Phy.gradeQuantity(given, item.si, item.dim, { rel: item.rel || 0.015, sig: item.sig });
    if (item.accepted) return { ok: isTextMatch(given, item.accepted) };
    if (item.answer != null && typeof item.answer === "number") {
      const n = Phy.parseNumber(given);
      return { ok: n != null && Phy.nearly(n, item.answer, item.rel || 0.05) };
    }
    return { ok: false, reason: "Kunde inte rätta svaret." };
  }

  function renderHard() {
    const ids = uniqueIds(store.data.hardIds.concat(getWeakAreas()));
    if (!ids.length) {
      return '<p class="page-kicker">Mina fel</p><h1>Mina svåra områden</h1><p class="empty">Inga fel sparade ännu.</p><div class="btn-row"><button class="btn" data-go="mix">Börja träna</button></div>';
    }
    const rows = ids
      .map(function (id) {
        const s = store.getStat(id);
        return "<li><span class=\"en\">" + escapeHtml(AREA_LABELS[id] || id) + '</span><span class="sv">' + s.incorrect + " fel</span></li>";
      })
      .join("");
    return (
      '<p class="page-kicker">Mina fel</p><h1>Mina svåra områden</h1><section class="card"><ul class="list">' +
      rows +
      '</ul><div class="btn-row"><button class="btn" data-action="train-hard">Träna mina fel</button></div></section>'
    );
  }

  function take(list, n) {
    return shuffle(list.slice()).slice(0, n);
  }

  function buildExam() {
    const part1 = take(PREFIX_MC, 4)
      .concat(take(UNIT_MC, 2))
      .concat(expandItems().slice(0, 2))
      .map(function (q) {
        return Object.assign({}, q, { section: "prefix", shuffled: q.options ? shuffle(q.options.slice()) : q.shuffled });
      });
    const part2 = take(SIG_COUNT, 4)
      .map(function (row, i) {
        return { section: "sig", area: "sigfigs", type: "sig", id: "es-" + i, prompt: "Hur många värdesiffror har " + row.prompt + "?", answer: row.answer, alt: row.alt, display: String(row.answer) };
      })
      .concat(
        take(SIG_CALC, 2).map(function (row, i) {
          return { section: "sig", area: "sigfigs", id: "esc-" + i, prompt: "Beräkna med rätt antal värdesiffror: " + row.a + " " + (row.op === "*" ? "×" : "/") + " " + row.b, si: row.answer, raw: row.raw, sig: row.sig, display: String(row.answer).replace(".", ",") };
        })
      );
    const part3 = expandItems()
      .slice(0, 3)
      .concat(convertItems().slice(0, 3))
      .map(function (q) {
        return Object.assign({}, q, { section: "conv" });
      });
    const part4 = timeItems()
      .slice(0, 3)
      .concat(speedItems().slice(0, 5))
      .map(function (q) {
        return Object.assign({}, q, { section: "motion" });
      });
    const part5 = mixedItems()
      .slice(0, 4)
      .concat(densItems().slice(0, 2))
      .map(function (q) {
        return Object.assign({}, q, { section: "mixp" });
      });
    const part6 = problemItems().slice(0, 6).map(function (q) {
      return Object.assign({}, q, { section: "adv" });
    });
    return part1.concat(part2, part3, part4, part5, part6).slice(0, 40);
  }

  function sectionName(s) {
    if (s === "prefix") return "Del 1 – Prefix och enheter";
    if (s === "sig") return "Del 2 – Värdesiffror";
    if (s === "conv") return "Del 3 – Enhetsomvandling";
    if (s === "motion") return "Del 4 – Tid och hastighet";
    if (s === "mixp") return "Del 5 – Blandade problem";
    return "Del 6 – Flera steg";
  }

  function ensureExam() {
    if (App.modeState && App.modeState.type === "exam") return App.modeState;
    if (store.data.activeExam && store.data.activeExam.type === "exam") {
      App.modeState = store.data.activeExam;
      return App.modeState;
    }
    App.modeState = { type: "exam", started: false, index: 0, items: [], answers: {} };
    return App.modeState;
  }

  function persistExam() {
    store.setExam(App.modeState);
    saveResume({ modeState: App.modeState });
  }

  function gradeExamItem(item, given) {
    if (item.type === "mc" || item.options) return given === item.answer;
    return gradeGeneric(given || "", item).ok;
  }

  function finishExam(state) {
    var score = 0;
    const missed = [];
    const by = { prefix: { s: 0, t: 0 }, units: { s: 0, t: 0 }, sigfigs: { s: 0, t: 0 }, velocity: { s: 0, t: 0 }, problem: { s: 0, t: 0 } };
    state.items.forEach(function (item) {
      const given = state.answers[item.id];
      const ok = gradeExamItem(item, given);
      if (ok) score += 1;
      else missed.push(item.area);
      store.record(item.area, ok);
      const key = item.area === "units" ? "units" : item.area === "sigfigs" ? "sigfigs" : item.area === "velocity" || item.area === "convert" || item.area === "time" ? "velocity" : item.area === "prefix" ? "prefix" : "problem";
      if (!by[key]) by[key] = { s: 0, t: 0 };
      by[key].t += 1;
      if (ok) by[key].s += 1;
    });
    store.setResult({
      score: score,
      total: state.items.length,
      percent: percent(score, state.items.length),
      date: new Date().toISOString(),
      missedAreas: uniqueIds(missed),
      by: by
    });
    App.modeState = null;
    navigate("results");
  }

  function renderExam() {
    const state = ensureExam();
    if (!state.started) {
      const resume = store.data.activeExam && store.data.activeExam.started;
      return (
        '<p class="page-kicker">Prov</p><h1>Provläge</h1><p class="lead">Ingen direkt feedback, inga ledtrådar och ingen miniräknare. Resultatet kommer när du lämnar in.</p>' +
        '<section class="card"><ul class="list"><li><span class="en">Del 1 Prefix och enheter</span></li><li><span class="en">Del 2 Värdesiffror</span></li><li><span class="en">Del 3 Enhetsomvandling</span></li><li><span class="en">Del 4 Tid och hastighet</span></li><li><span class="en">Del 5 Blandade problem</span></li><li><span class="en">Del 6 Flera steg</span></li></ul>' +
        '<div class="exam-note" style="margin-top:16px">Prefix-linjen och formelhjälp är avstängda. Svaren sparas lokalt om sidan laddas om.</div><div class="btn-row">' +
        (resume
          ? '<button class="btn" data-action="continue-exam">Fortsätt</button><button class="btn btn-secondary" data-action="new-exam">Starta om</button>'
          : '<button class="btn" data-action="start-exam">Starta provet</button>') +
        "</div></section>"
      );
    }
    const item = state.items[state.index];
    persistExam();
    const given = state.answers[item.id] || "";
    let body = "";
    if (item.type === "mc" || item.options) {
      const opts = item.shuffled || item.options;
      body =
        '<div class="choices">' +
        opts
          .map(function (opt) {
            return (
              '<button type="button" class="choice' +
              (given === opt ? " selected" : "") +
              '" data-choice="' +
              escapeHtml(opt) +
              '">' +
              escapeHtml(opt) +
              "</button>"
            );
          })
          .join("") +
        "</div>";
    } else {
      body =
        '<form class="field"><textarea id="exam-write" name="answer" placeholder="Skriv svaret. Enhet krävs när uppgiften har enhet.">' +
        escapeHtml(given) +
        '</textarea><div class="btn-row"><button class="btn btn-secondary" type="submit">Spara svaret</button></div></form>';
    }
    const last = state.index === state.items.length - 1;
    return (
      '<div class="exam-note">' +
      escapeHtml(sectionName(item.section)) +
      " · Ingen hjälp</div>" +
      '<div class="study-head"><div><p class="page-kicker">Prov</p><h1>Fråga ' +
      (state.index + 1) +
      '</h1></div><div class="meta">' +
      (state.index + 1) +
      " / " +
      state.items.length +
      '</div></div><section class="word-card"><p class="prompt" style="font-size:1.25rem">' +
      escapeHtml(item.prompt) +
      "</p>" +
      body +
      '</section><div class="toolbar"><div class="btn-row"><button class="btn btn-secondary" data-action="prev"' +
      (state.index === 0 ? " disabled" : "") +
      ">Föregående</button>" +
      (last
        ? '<button class="btn" data-action="submit-exam">Lämna in</button>'
        : '<button class="btn" data-action="next">Nästa</button>') +
      "</div></div>"
    );
  }

  function bindExam(root) {
    const state = App.modeState;
    on(root, "[data-action='start-exam']", "click", function () {
      state.started = true;
      state.index = 0;
      state.items = buildExam();
      state.answers = {};
      persistExam();
      render();
    });
    on(root, "[data-action='continue-exam']", "click", function () {
      App.modeState = store.data.activeExam;
      render();
    });
    on(root, "[data-action='new-exam']", "click", function () {
      App.modeState = { type: "exam", started: true, index: 0, items: buildExam(), answers: {} };
      persistExam();
      render();
    });
    if (!state || !state.started) return;
    const item = state.items[state.index];
    function saveWrite() {
      const form = root.querySelector("form");
      if (form && form.answer) state.answers[item.id] = form.answer.value;
    }
    on(root, "[data-choice]", "click", function (event) {
      state.answers[item.id] = event.currentTarget.getAttribute("data-choice");
      persistExam();
      render();
    });
    const form = root.querySelector("form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        saveWrite();
        persistExam();
        if (state.index < state.items.length - 1) state.index += 1;
        persistExam();
        render();
      });
    }
    on(root, "[data-action='prev']", "click", function () {
      saveWrite();
      if (state.index === 0) return;
      state.index -= 1;
      persistExam();
      render();
    });
    on(root, "[data-action='next']", "click", function () {
      saveWrite();
      if (state.index >= state.items.length - 1) return;
      state.index += 1;
      persistExam();
      render();
    });
    on(root, "[data-action='submit-exam']", "click", function () {
      saveWrite();
      finishExam(state);
    });
  }

  function renderResults() {
    const last = store.data.lastResult;
    if (!last) {
      return '<p class="page-kicker">Resultat</p><h1>Inget resultat</h1><div class="btn-row"><button class="btn" data-go="exam">Till provet</button></div>';
    }
    const labels = { prefix: "Prefix", units: "Enheter", sigfigs: "Värdesiffror", velocity: "Hastighet", problem: "Problemlösning" };
    const rows = Object.keys(labels)
      .map(function (k) {
        const row = last.by && last.by[k];
        if (!row || !row.t) return "";
        const pct = percent(row.s, row.t);
        return (
          '<div class="topic-row"><span>' +
          labels[k] +
          '</span><div class="bar"><i style="width:' +
          pct +
          '%"></i></div><span class="meta">' +
          row.s +
          " / " +
          row.t +
          "</span></div>"
        );
      })
      .join("");
    const missed = (last.missedAreas || []).filter(function (id) {
      return AREA_LABELS[id];
    });
    return (
      '<p class="page-kicker">Resultat</p><h1>Ditt resultat</h1><section class="card"><p class="result-score">' +
      last.score +
      " / " +
      last.total +
      '</p><p class="result-pct">' +
      last.percent +
      "%</p>" +
      rows +
      (missed.length
        ? "<h2 style=\"margin-top:22px\">Du behöver träna mer på</h2><ul class=\"list\">" +
          missed
            .map(function (id) {
              return "<li><span class=\"en\">" + escapeHtml(AREA_LABELS[id]) + "</span></li>";
            })
            .join("") +
          '</ul><div class="btn-row"><button class="btn" data-action="practice-missed">Träna mina fel</button></div>'
        : "") +
      "</section>"
    );
  }

  function needCssSelected() {
    return true;
  }

  function renderPage() {
    switch (App.route) {
      case "learn":
        return renderLearn();
      case "prefix":
        return renderPrefixHub();
      case "prefixdrill":
        return renderPrefixDrill();
      case "expand":
        return renderExpand();
      case "compress":
        return renderCompress();
      case "flash":
        return renderFlash();
      case "units":
        return renderUnits();
      case "sigfigs":
        return renderSig();
      case "sigcalc":
        return renderSigCalc();
      case "time":
        return renderTime();
      case "velocity":
        return renderVelocity();
      case "speedq":
        return renderSpeedQ();
      case "convert":
        return renderConvert();
      case "mixedu":
        return renderMixedU();
      case "density":
        return renderDensity();
      case "formulas":
        return renderFormulas();
      case "first":
        return renderFirst();
      case "linear":
        return renderLinear();
      case "problems":
        return renderProblems();
      case "mix":
        return renderMix();
      case "hard":
        return renderHard();
      case "exam":
        return renderExam();
      case "results":
        return renderResults();
      default:
        return renderHome();
    }
  }

  function bindNumericMode(root) {
    const item = App.modeState.items[App.modeState.index];
    bindNumeric(root, gradeGeneric);
  }

  function bindPage(root) {
    const r = App.route;
    if (r === "home") bindHome(root);
    else if (r === "learn") bindLearn();
    else if (r === "prefix") bindPrefixHub(root);
    else if (r === "velocity" || r === "hard") {
      bindGo(root);
      on(root, "[data-action='train-hard']", "click", function () {
        navigate("mix", { practiceAreas: uniqueIds(store.data.hardIds.concat(getWeakAreas())), practiceLabel: "Mina fel", keepPractice: true });
      });
    } else if (r === "flash") bindFlash(root);
    else if (r === "prefixdrill" || r === "units" || r === "formulas" || r === "first") bindMc(root);
    else if (r === "exam") bindExam(root);
    else if (r === "results") {
      bindGo(root);
      on(root, "[data-action='practice-missed']", "click", function () {
        const ids = store.data.lastResult && store.data.lastResult.missedAreas;
        if (!ids) return;
        navigate("mix", { practiceAreas: ids, practiceLabel: "Träna mina fel", keepPractice: true });
      });
    } else if (r === "linear") {
      const item = App.modeState.items[App.modeState.index];
      if (item.type === "mc" || item.options) bindMc(root);
      else bindNumericMode(root);
      drawGraph();
    } else if (r === "mix") {
      const item = App.modeState.items[App.modeState.index];
      if (item.type === "mc" || item.options) bindMc(root);
      else bindNumericMode(root);
    } else if (r === "sigfigs") {
      bindNumericMode(root);
      bindGo(root);
    } else if (
      r === "expand" ||
      r === "compress" ||
      r === "sigcalc" ||
      r === "time" ||
      r === "speedq" ||
      r === "convert" ||
      r === "mixedu" ||
      r === "density" ||
      r === "problems"
    ) {
      bindNumericMode(root);
    } else bindGo(root);
  }

  function render() {
    const root = document.getElementById("app");
    root.innerHTML = layout(renderPage());
    bindShell();
    bindPage(root);
  }

  function boot() {
    const hash = location.hash.replace("#", "");
    if (hash && (MODE_TITLES[hash] || hash === "speedq" || hash === "sigcalc" || hash === "expand" || hash === "compress" || hash === "flash" || hash === "prefixdrill" || hash === "convert" || hash === "mixedu" || hash === "first" || hash === "linear" || hash === "problems" || hash === "results")) {
      App.route = hash;
    }
    const session = store.data.lastSession;
    if (session && session.mode === App.route) {
      App.modeState = session.modeState || null;
      App.practiceAreas = session.practiceAreas || null;
      App.practiceLabel = session.practiceLabel || "";
    }
    if (App.route === "exam" && store.data.activeExam) App.modeState = store.data.activeExam;
    window.addEventListener("hashchange", function () {
      const next = location.hash.replace("#", "") || "home";
      if (next === App.route) return;
      App.route = next;
      App.menuOpen = false;
      App.modeState = null;
      render();
    });
    render();
  }

  boot();
})();
