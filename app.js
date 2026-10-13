(() => {
  const STORAGE_KEY = "opengame-nav-lang";
  const I18N = {
    zh: {
      siteTitle: "开源游戏导航",
      siteSubtitle: "Open / Web-ported games",
      heroTitle: "打开浏览器，就能玩。",
      heroDesc: "收集分类近期可玩的开源与网页移植游戏：我的 Flash/经典重制，以及 X 上分享的 FPS、滑板、开放世界等。点卡片直接开玩。",
      searchPlaceholder: "搜索游戏名称、标签…",
      all: "全部",
      featuredLabel: "精选重制",
      featuredSection: "我的重制",
      featuredHint: "亲手重制的 Flash 童年经典，HTML5 原生运行。",
      catalogSection: "游戏目录",
      catalogHint: "按分类浏览 · 支持搜索与筛选",
      play: "开始游戏",
      gamesCount: "款游戏",
      catsCount: "个分类",
      bilingual: "种语言",
      empty: "没有匹配的游戏，换个关键词或分类试试。",
      footerNote:
        "部分粉丝移植需要你自备原版游戏文件；请跳过任何要求下载启动器的站点。更多 GTA / Minecraft 类 WASM 移植可逛 ",
      footerMore: "Wasm Arcade",
      footerCredit: "OpenGame · 静态可部署到 GitHub Pages",
      badgeFeatured: "我的重制",
    },
    en: {
      siteTitle: "OpenGame",
      siteSubtitle: "开源游戏导航",
      heroTitle: "Open a tab. Start playing.",
      heroDesc:
        "A bilingual catalog of recent open / browser-ported games: my Flash remakes, plus FPS, skate, and open-world ports shared on X. Click a card to play.",
      searchPlaceholder: "Search titles, tags…",
      all: "All",
      featuredLabel: "Featured remakes",
      featuredSection: "My Remakes",
      featuredHint: "Childhood Flash classics, rebuilt by hand in HTML5.",
      catalogSection: "Catalog",
      catalogHint: "Browse by category · search & filter",
      play: "Play",
      gamesCount: "games",
      catsCount: "categories",
      bilingual: "languages",
      empty: "No games match. Try another keyword or category.",
      footerNote:
        "Some fan ports need your own original game files; skip anything that asks you to download a launcher. For more GTA / Minecraft-style WASM ports, see ",
      footerMore: "Wasm Arcade",
      footerCredit: "OpenGame · static site, ready for GitHub Pages",
      badgeFeatured: "My Remake",
    },
  };

  let lang = localStorage.getItem(STORAGE_KEY) || "zh";
  let data = null;
  let activeCategory = "all";
  let query = "";

  const $ = (sel) => document.querySelector(sel);

  function t(key) {
    return I18N[lang][key] || I18N.en[key] || key;
  }

  function catLabel(catId) {
    const cat = data.categories.find((c) => c.id === catId);
    return cat ? cat[lang] || cat.en : catId;
  }

  function applyStaticI18n() {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? "开源游戏导航 · OpenGame" : "OpenGame · Open / Web-ported games";
    $("#brand-title").textContent = t("siteTitle");
    $("#brand-sub").textContent = t("siteSubtitle");
    $("#hero-title").textContent = t("heroTitle");
    $("#hero-desc").textContent = t("heroDesc");
    $("#search").placeholder = t("searchPlaceholder");
    $("#featured-title").textContent = t("featuredSection");
    $("#featured-hint").textContent = t("featuredHint");
    $("#catalog-title").textContent = t("catalogSection");
    $("#catalog-hint").textContent = t("catalogHint");
    $("#footer-note-text").textContent = t("footerNote");
    $("#footer-more").textContent = t("footerMore");
    $("#footer-credit").textContent = t("footerCredit");
    const end = document.getElementById("footer-note-end");
    if (end) end.textContent = lang === "zh" ? "。" : ".";
    $("#pill-games").innerHTML = `<strong>${data.games.length}</strong>${t("gamesCount")}`;
    $("#pill-cats").innerHTML = `<strong>${data.categories.length}</strong>${t("catsCount")}`;
    $("#pill-lang").innerHTML = `<strong>2</strong>${t("bilingual")}`;

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  function renderChips() {
    const wrap = $("#chips");
    const items = [
      { id: "all", label: t("all") },
      ...data.categories.map((c) => ({
        id: c.id,
        label: c[lang] || c.en,
        featured: !!c.featured,
      })),
    ];
    wrap.innerHTML = items
      .map(
        (c) =>
          `<button type="button" class="chip${c.featured ? " featured-chip" : ""}${
            activeCategory === c.id ? " active" : ""
          }" data-cat="${c.id}">${escapeHtml(c.label)}</button>`
      )
      .join("");
  }

  function matches(game) {
    if (activeCategory !== "all" && game.category !== activeCategory) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    const hay = [
      game.title.zh,
      game.title.en,
      game.blurb.zh,
      game.blurb.en,
      ...(game.tags || []),
      game.category,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  }

  function cardHtml(game) {
    const title = game.title[lang] || game.title.en;
    const blurb = game.blurb[lang] || game.blurb.en;
    const f = !!game.featured;
    const tags = (game.tags || []).slice(0, 2).map((x) => `<span class="tag">${escapeHtml(x)}</span>`).join("");
    return `<article class="card${f ? " featured" : ""}">
      <a class="card-media" href="${escapeAttr(game.url)}" target="_blank" rel="noopener noreferrer" tabindex="-1"><img src="${escapeAttr(game.screenshot)}" alt="${escapeAttr(title)}" loading="lazy" width="800" height="450" /></a>
      <div class="card-body">
        <span class="card-cat">${escapeHtml(f ? t("badgeFeatured") : catLabel(game.category))}</span>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(blurb)}</p>
        <div class="card-foot"><div class="tags">${tags}</div>
        <a class="play-btn" href="${escapeAttr(game.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("play"))}</a></div>
      </div>
    </article>`;
  }

  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -40px 0px" }) : null;
  function reveal() { document.querySelectorAll(".card:not(.in)").forEach((c) => io ? io.observe(c) : c.classList.add("in")); }

  function render() {
    const featured = data.games.filter((g) => g.featured && matches(g));
    const rest = data.games.filter((g) => !g.featured && matches(g));
    const showFeatured =
      activeCategory === "all" || activeCategory === "remakes";

    const featuredSection = $("#featured-section");
    const featuredGrid = $("#featured-grid");
    if (showFeatured && featured.length) {
      featuredSection.hidden = false;
      featuredGrid.innerHTML = featured.map((g) => cardHtml(g, { featuredSection: true })).join("");
    } else {
      featuredSection.hidden = true;
      featuredGrid.innerHTML = "";
    }

    const catalogGrid = $("#catalog-grid");
    const list =
      activeCategory === "remakes"
        ? [] // remakes already in featured
        : activeCategory === "all"
          ? rest
          : data.games.filter((g) => matches(g));

    // When filtering remakes only, featured section shows them; catalog can hide empty
    if (activeCategory === "remakes") {
      $("#catalog-section").hidden = true;
    } else {
      $("#catalog-section").hidden = false;
      catalogGrid.innerHTML = list.length
        ? list.map((g) => cardHtml(g)).join("")
        : `<div class="empty">${escapeHtml(t("empty"))}</div>`;
    }
    reveal();

    // If search hides all featured and catalog empty
    if (!showFeatured || !featured.length) {
      if (activeCategory === "all" && !rest.length && !featured.length) {
        $("#catalog-section").hidden = false;
        catalogGrid.innerHTML = `<div class="empty">${escapeHtml(t("empty"))}</div>`;
      }
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  function setLang(next) {
    lang = next;
    localStorage.setItem(STORAGE_KEY, lang);
    applyStaticI18n();
    renderChips();
    render();
  }

  async function init() {
    const res = await fetch("games.json");
    data = await res.json();

    applyStaticI18n();
    renderChips();
    render();

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });

    $("#chips").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      activeCategory = btn.dataset.cat;
      renderChips();
      render();
    });

    $("#search").addEventListener("input", (e) => {
      query = e.target.value.trim();
      render();
    });
  }

  init().catch((err) => {
    console.error(err);
    $("#catalog-grid").innerHTML =
      `<div class="empty">Failed to load games.json</div>`;
  });
})();
