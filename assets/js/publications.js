/*
 * Renders publications straight from a BibTeX file (assets/papers.bib).
 * No build step: add an entry to the .bib, push, done.
 *
 * Containers:  <div class="publications" data-mode="all|selected"></div>
 * Config:      window.PUB_CONFIG = { bib: "/assets/papers.bib", highlight: ["Turkay"] }
 */
(function () {
  "use strict";

  // ---------- BibTeX parsing ----------

  function parseBibtex(src) {
    const entries = [];
    let i = 0;
    const n = src.length;

    while (i < n) {
      const at = src.indexOf("@", i);
      if (at < 0) break;
      // ignore '@' inside % comment lines
      const lineStart = src.lastIndexOf("\n", at) + 1;
      if (/^\s*%/.test(src.slice(lineStart, at + 1))) { i = at + 1; continue; }

      const m = /^@\s*([A-Za-z]+)\s*([{(])/.exec(src.slice(at, at + 40));
      if (!m) { i = at + 1; continue; }
      const type = m[1].toLowerCase();
      const open = m[2], close = open === "{" ? "}" : ")";
      let j = at + m[0].length;

      // find matching close, respecting nested braces
      let depth = 1, k = j;
      while (k < n && depth > 0) {
        const c = src[k];
        if (c === "{" || (open === "(" && c === "(")) depth++;
        else if (c === "}" || (open === "(" && c === ")")) depth--;
        k++;
      }
      const body = src.slice(j, k - 1);
      const raw = src.slice(at, k);
      i = k;

      if (type === "comment" || type === "preamble" || type === "string") continue;

      const comma = body.indexOf(",");
      if (comma < 0) continue;
      const key = body.slice(0, comma).trim();
      const fields = parseFields(body.slice(comma + 1));
      entries.push({ type, key, fields, raw: raw.trim() });
    }
    return entries;
  }

  function parseFields(s) {
    const fields = {};
    let i = 0;
    const n = s.length;
    while (i < n) {
      while (i < n && /[\s,]/.test(s[i])) i++;
      const nm = /^([A-Za-z][\w\-:.]*)\s*=\s*/.exec(s.slice(i));
      if (!nm) break;
      const name = nm[1].toLowerCase();
      i += nm[0].length;
      let value = "";
      if (s[i] === "{") {
        let depth = 1, k = i + 1;
        while (k < n && depth > 0) {
          if (s[k] === "\\") { k += 2; continue; }
          if (s[k] === "{") depth++;
          else if (s[k] === "}") depth--;
          k++;
        }
        value = s.slice(i + 1, k - 1);
        i = k;
      } else if (s[i] === '"') {
        let k = i + 1, depth = 0;
        while (k < n && !(s[k] === '"' && depth === 0)) {
          if (s[k] === "{") depth++;
          else if (s[k] === "}") depth--;
          k++;
        }
        value = s.slice(i + 1, k);
        i = k + 1;
      } else {
        const bare = /^[^,\s}]+/.exec(s.slice(i));
        value = bare ? bare[0] : "";
        i += value.length;
      }
      fields[name] = value.replace(/\s+/g, " ").trim();
    }
    return fields;
  }

  // ---------- LaTeX → Unicode ----------

  const ACCENTS = {
    "`": "̀", "'": "́", "^": "̂", '"': "̈", "~": "̃",
    "=": "̄", ".": "̇", u: "̆", v: "̌", H: "̋",
    c: "̧", k: "̨", r: "̊", d: "̣", b: "̱"
  };
  const SYMBOLS = {
    ss: "ß", o: "ø", O: "Ø", ae: "æ", AE: "Æ", oe: "œ", OE: "Œ",
    aa: "å", AA: "Å", l: "ł", L: "Ł", i: "ı", j: "ȷ"
  };

  function delatex(s) {
    if (!s) return "";
    let t = s;
    // \'{e}, {\'e}, \'e, \'\i, {\v{S}}
    t = t.replace(/\\([`'^"~=.uvHckrdb])\s*(?:\{\s*(\\?[A-Za-z])\s*\}|(\\?[A-Za-z]))/g,
      function (_, acc, a, b) {
        let base = a || b;
        if (base === "\\i") base = "i";
        else if (base === "\\j") base = "j";
        return base + (ACCENTS[acc] || "");
      });
    t = t.replace(/\\(ss|ae|AE|oe|OE|aa|AA|[oOlLij])(?![A-Za-z])\s?/g, function (_, c) { return SYMBOLS[c]; });
    t = t.replace(/\\&/g, "&").replace(/\\_/g, "_").replace(/\\%/g, "%").replace(/\\\$/g, "$");
    t = t.replace(/---/g, "—").replace(/--/g, "–").replace(/~/g, " ");
    t = t.replace(/``|''/g, '"');
    t = t.replace(/\\[A-Za-z]+\s*/g, "");   // drop any other commands
    t = t.replace(/[{}]/g, "");
    return t.normalize("NFC").trim();
  }

  // ---------- Formatting ----------

  function parseAuthors(s) {
    if (!s) return [];
    return s.split(/\s+and\s+/i).map(function (a) {
      a = a.trim();
      if (/^others$/i.test(a)) return { display: "et al.", last: "", etal: true };
      let first = "", last = "";
      if (a.indexOf(",") >= 0) {
        const p = a.split(",");
        last = p[0].trim(); first = p.slice(1).join(" ").trim();
      } else {
        const p = a.split(/\s+/);
        last = p.pop(); first = p.join(" ");
      }
      last = delatex(last); first = delatex(first);
      if (last === last.toUpperCase() && last.length > 2) last = last.charAt(0) + last.slice(1).toLowerCase();
      return { display: (first ? first + " " : "") + last, last: last };
    });
  }

  const CATEGORIES = [
    { id: "journal", label: "Journal articles" },
    { id: "conference", label: "Conference & workshop papers" },
    { id: "book", label: "Books & chapters" },
    { id: "other", label: "Other" }
  ];

  function category(e) {
    const f = e.fields;
    if (e.type === "article") return f.journal && !/arxiv/i.test(f.journal) ? "journal" : "other";
    if (e.type === "inproceedings" || e.type === "conference") return "conference";
    if (e.type === "book" || e.type === "incollection" || e.type === "inbook") return "book";
    return "other";
  }

  function venueText(e) {
    const f = e.fields;
    let v = f.journal || f.booktitle || "";
    if (!v && (e.type === "book" || e.type === "misc")) v = f.publisher || f.howpublished || "";
    v = delatex(v);
    const bits = [];
    if (f.volume) bits.push(f.volume + (f.number ? "(" + f.number + ")" : ""));
    if (f.pages) bits.push((bits.length ? "" : "pp. ") + delatex(f.pages));
    return { venue: v, details: bits.join(":") };
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function linkHref(u) {
    if (/^https?:\/\//i.test(u)) return u;
    // site-relative path (e.g. /assets/pdf/x.pdf) – prepend baseurl
    const base = (window.PUB_CONFIG && window.PUB_CONFIG.baseurl) || "";
    return base + u;
  }

  function renderEntry(e, highlight) {
    const f = e.fields;
    const authors = parseAuthors(f.author).map(function (a) {
      const h = highlight.some(function (n) { return a.last.toLowerCase() === n.toLowerCase(); });
      return h ? "<strong>" + esc(a.display) + "</strong>" : esc(a.display);
    });
    let authorHtml = authors.length > 1
      ? authors.slice(0, -1).join(", ") + (/et al\./.test(authors[authors.length - 1]) ? ", " : " and ") + authors[authors.length - 1]
      : authors.join("");

    const v = venueText(e);
    const links = [];
    if (f.doi) links.push(["DOI", "https://doi.org/" + f.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, "")]);
    if (f.pdf) links.push(["PDF", linkHref(f.pdf)]);
    if (f.url) links.push(["Link", linkHref(f.url)]);
    if (f.code) links.push(["Code", linkHref(f.code)]);
    if (f.video) links.push(["Video", linkHref(f.video)]);
    if (f.slides) links.push(["Slides", linkHref(f.slides)]);

    const title = delatex(f.title);
    const titleHtml = esc(title).replace(/[.?!]?$/, function (m) { return m || "."; });

    return '<li class="pub" id="' + esc(e.key) + '">' +
      '<div class="pub-title">' + titleHtml +
        (f.award ? ' <span class="badge">' + esc(delatex(f.award)) + "</span>" : "") + "</div>" +
      '<div class="pub-authors">' + authorHtml + "</div>" +
      '<div class="pub-venue"><em>' + esc(v.venue) + "</em>" +
        (v.details ? ", " + esc(v.details) : "") +
        (f.year ? ", " + esc(f.year) : "") +
        (f.note ? ". " + esc(delatex(f.note)) : "") + "</div>" +
      '<div class="pub-links">' +
        links.map(function (l) { return '<a href="' + esc(l[1]) + '">' + l[0] + "</a>"; }).join("") +
        '<button type="button" class="bib-toggle" aria-expanded="false">BibTeX</button>' +
      "</div>" +
      '<pre class="bibtex" hidden>' + esc(cleanRaw(e.raw)) + "</pre>" +
      "</li>";
  }

  // strip website-only fields from the copyable BibTeX
  function cleanRaw(raw) {
    return raw.replace(/^\s*(selected|pdf|code|video|slides|award)\s*=\s*\{[^}]*\},?\s*\n/gim, "")
              .replace(/,(\s*\n\})$/, "$1");
  }

  // ---------- Page wiring ----------

  function byYearDesc(a, b) {
    const ya = parseInt(a.fields.year || "0", 10), yb = parseInt(b.fields.year || "0", 10);
    if (yb !== ya) return yb - ya;
    return delatex(a.fields.title || "").localeCompare(delatex(b.fields.title || ""));
  }

  function renderList(container, entries, highlight, groupByYear) {
    if (!entries.length) { container.innerHTML = '<p class="muted">No publications match.</p>'; return; }
    if (!groupByYear) {
      container.innerHTML = '<ol class="pub-list">' + entries.map(function (e) { return renderEntry(e, highlight); }).join("") + "</ol>";
      return;
    }
    let html = "", year = null;
    entries.forEach(function (e) {
      const y = e.fields.year || "Undated";
      if (y !== year) {
        if (year !== null) html += "</ol>";
        html += '<h2 class="pub-year">' + esc(y) + '</h2><ol class="pub-list">';
        year = y;
      }
      html += renderEntry(e, highlight);
    });
    container.innerHTML = html + "</ol>";
  }

  function setupControls(root, all, highlight) {
    const counts = {};
    all.forEach(function (e) { counts[e._cat] = (counts[e._cat] || 0) + 1; });

    root.innerHTML =
      '<div class="pub-controls">' +
        '<input type="search" class="pub-search" placeholder="Search title, author, venue…" aria-label="Search publications">' +
        '<div class="pub-filters" role="group" aria-label="Filter by type">' +
          '<button type="button" data-cat="all" aria-pressed="true">All <span>' + all.length + "</span></button>" +
          CATEGORIES.filter(function (c) { return counts[c.id]; }).map(function (c) {
            return '<button type="button" data-cat="' + c.id + '" aria-pressed="false">' + c.label + " <span>" + counts[c.id] + "</span></button>";
          }).join("") +
        "</div>" +
      "</div>" +
      '<p class="pub-count muted" aria-live="polite"></p>' +
      '<div class="pub-results"></div>';

    const search = root.querySelector(".pub-search");
    const results = root.querySelector(".pub-results");
    const countEl = root.querySelector(".pub-count");
    let cat = "all";

    function update() {
      const q = search.value.trim().toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      const shown = all.filter(function (e) {
        if (cat !== "all" && e._cat !== cat) return false;
        return terms.every(function (t) { return e._text.indexOf(t) >= 0; });
      });
      countEl.textContent = shown.length === all.length ? "" : shown.length + " of " + all.length + " shown";
      renderList(results, shown, highlight, true);
    }

    root.querySelectorAll(".pub-filters button").forEach(function (b) {
      b.addEventListener("click", function () {
        cat = b.dataset.cat;
        root.querySelectorAll(".pub-filters button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        update();
      });
    });
    search.addEventListener("input", update);
    update();

    // deep links like /publications/#henkin2022words
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) { el.classList.add("target"); el.scrollIntoView(); }
    }
  }

  function init() {
    document.addEventListener("click", function (ev) {
      const btn = ev.target.closest(".bib-toggle");
      if (!btn) return;
      const pre = btn.closest(".pub").querySelector(".bibtex");
      const open = pre.hidden;
      pre.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    });

    const containers = document.querySelectorAll(".publications");
    if (!containers.length) return;
    const cfg = window.PUB_CONFIG || {};
    const highlight = cfg.highlight || [];

    fetch(cfg.bib || "/assets/papers.bib")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (src) {
        const entries = parseBibtex(src).sort(byYearDesc);
        entries.forEach(function (e) {
          e._cat = category(e);
          e._text = [e.fields.title, e.fields.author, e.fields.journal, e.fields.booktitle, e.fields.year, e.key]
            .map(delatex).join(" ").toLowerCase();
        });
        containers.forEach(function (c) {
          if (c.dataset.mode === "selected") {
            renderList(c, entries.filter(function (e) { return /^(true|yes|1)$/i.test(e.fields.selected || ""); }), highlight, false);
          } else {
            setupControls(c, entries, highlight);
          }
        });
      })
      .catch(function (err) {
        containers.forEach(function (c) {
          c.innerHTML = '<p class="muted">Could not load publications (' + esc(err.message) + ").</p>";
        });
      });
  }

  if (typeof module !== "undefined") {
    module.exports = { parseBibtex: parseBibtex, delatex: delatex, parseAuthors: parseAuthors, category: category, renderEntry: renderEntry };
  } else {
    init();
  }
})();
