// Quant Fluency: language-app-style drills for quant asset management.
//
// Content: concepts.yml (the concept map) and questions.yml (lessons and
// questions). Written answers are graded by the scoring API on server1
// (soichi.us/quant-api), which looks up the reference answer itself.
// Progress lives in localStorage only.
//
// Scores shown at the top:
//   mastered = mastered concepts / concepts presented
//   covered  = concepts presented / all concepts in the map
//
// Placement: each concept has a level (1-5) within its domain. The player
// rates their familiarity with each domain once (and can change it any time).
// Concepts below a domain's level are assumed known: skipped, but they count as
// met prerequisites and never as mastered or covered. New questions come from
// the domain's current level. Two answers under 50 out of the last three in a
// domain drop it a level; seeing everything at a level with average strength
// >= 60 raises it.
//
// Spaced repetition (Leitner boxes): a pass (score >= PASS) moves a concept up a
// box and pushes its next review further out; a fail drops it back to box 0.
// A concept is mastered at box >= MASTER_BOX with passes on at least
// MASTER_ANGLES different questions.

const API = "https://soichi.us/quant-api";
const STORE_KEY = "quant-fluency.v1";
const PASS = 70;
const SHAKY = 50;
const MASTER_BOX = 3;
const MASTER_ANGLES = 2;
const BOX_DAYS = [0, 1, 3, 7, 21, 60];
const SESSION_SIZE = 8;
const NEW_PER_SESSION = 3;
const DAY = 86_400_000;

let concepts = [];      // from concepts.yml
let conceptById = {};
let domains = {};
let content = {};       // from questions.yml, keyed by concept id
let state = load();

// ------------------------------------------------------------------ storage

function blankState() {
	return { concepts: {}, streak: { days: 0, last: null }, answered: 0, levels: {}, recent: {}, onboarded: false };
}

function load() {
	try {
		const s = JSON.parse(localStorage.getItem(STORE_KEY));
		if (s && s.concepts) return { levels: {}, recent: {}, onboarded: false, ...s };
	} catch (e) { /* fall through */ }
	return blankState();
}

function save() {
	localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function progress(id) {
	return state.concepts[id];
}

// ------------------------------------------------------------------ scoring model

function isMastered(p) {
	if (!p) return false;
	const passedQs = new Set(p.attempts.filter(a => a.score >= PASS).map(a => a.q));
	return p.box >= MASTER_BOX && passedQs.size >= MASTER_ANGLES;
}

function strength(p) {
	// Weighted average of the last 3 scores, newest counts most.
	if (!p || !p.attempts.length) return 0;
	const last = p.attempts.slice(-3);
	const w = [1, 2, 3].slice(-last.length);
	return Math.round(last.reduce((s, a, i) => s + a.score * w[i], 0) / w.reduce((a, b) => a + b, 0));
}

function recordAttempt(conceptId, qid, score) {
	const p = state.concepts[conceptId] ||= { seen: Date.now(), box: 0, due: 0, attempts: [] };
	const now = Date.now();
	p.attempts.push({ q: qid, score, t: now });
	if (p.attempts.length > 30) p.attempts = p.attempts.slice(-30);

	// Only a pass on a due review advances the box, so mastery needs real spacing.
	const wasDue = p.due <= now;
	if (score >= PASS && wasDue) p.box = Math.min(p.box + 1, BOX_DAYS.length - 1);
	else if (score < SHAKY) p.box = 0;
	p.due = score >= PASS ? now + BOX_DAYS[p.box] * DAY : now;

	const today = new Date().toDateString();
	if (state.streak.last !== today) {
		const yesterday = new Date(now - DAY).toDateString();
		state.streak.days = state.streak.last === yesterday ? state.streak.days + 1 : 1;
		state.streak.last = today;
	}
	state.answered++;
	const note = trackStruggle(conceptById[conceptId].domain, score);
	save();
	return note;
}

// ------------------------------------------------------------------ placement

const LEVELS = [
	[1, "New to this", "never studied it"],
	[2, "Some basics", "know the main terms"],
	[3, "Comfortable", "studied it, e.g. a course or CFA Level I"],
	[4, "Advanced", "use it at work, or CFA Level II-III"],
	[5, "Expert", "could teach it"],
];
const STRUGGLE_SCORE = 50;
const LEVEL_UP_STRENGTH = 60;

function domainConcepts(domain) {
	return concepts.filter(c => c.domain === domain);
}

function maxLevel(domain) {
	return Math.max(1, ...domainConcepts(domain).map(c => c.level));
}

// The level the player is working at now in a domain.
function domainLevel(domain) {
	return Math.min(state.levels[domain] || 1, maxLevel(domain));
}

function assumedKnown(c) {
	return !progress(c.id) && c.level < domainLevel(c.domain);
}

// Levels that have questions written, for the placement screen.
function questionLevels(domain) {
	return [...new Set(domainConcepts(domain).filter(c => hasContent(c.id)).map(c => c.level))].sort();
}

function trackStruggle(domain, score) {
	const recent = (state.recent[domain] ||= []);
	recent.push(score);
	if (recent.length > 3) recent.shift();
	const level = domainLevel(domain);
	if (level > 1 && recent.filter(x => x < STRUGGLE_SCORE).length >= 2) {
		state.levels[domain] = level - 1;
		state.recent[domain] = [];
		return `This one's tough. ${domains[domain]} goes back to level ${level - 1} from your next session, to firm up the groundwork first. You can change this under Your levels.`;
	}
	return null;
}

// Move a domain up once everything available at its level has been seen and is going well.
function levelUpDomains() {
	const ups = [];
	for (const domain of Object.keys(domains)) {
		for (;;) {
			const level = domainLevel(domain);
			if (level >= maxLevel(domain)) break;
			// Only climb to a level that has questions; otherwise a player would skip
			// that material once it's written.
			const next = questionLevels(domain).find(l => l > level);
			if (!next) break;
			const atLevel = domainConcepts(domain).filter(c => c.level === level && hasContent(c.id));
			if (atLevel.some(c => !progress(c.id) && unlocked(c))) break;
			const seen = atLevel.filter(c => progress(c.id));
			const avg = seen.length ? seen.reduce((s, c) => s + strength(progress(c.id)), 0) / seen.length : 100;
			if (avg < LEVEL_UP_STRENGTH) break;
			state.levels[domain] = next;
			if (seen.length) ups.push(domain);
		}
	}
	if (ups.length) save();
	return ups;
}

function totals() {
	const presented = concepts.filter(c => progress(c.id));
	const mastered = presented.filter(c => isMastered(progress(c.id)));
	return {
		presented: presented.length,
		mastered: mastered.length,
		total: concepts.length,
		mastery: presented.length ? Math.round(100 * mastered.length / presented.length) : 0,
		coverage: pct(presented.length, concepts.length),
	};
}

// One decimal below 10%, so the first few concepts don't read as 0%.
function pct(n, total) {
	const v = 100 * n / total;
	return v > 0 && v < 10 ? Math.round(v * 10) / 10 : Math.round(v);
}

function currentStreak() {
	const { days, last } = state.streak;
	if (!last) return 0;
	const today = new Date().toDateString();
	const yesterday = new Date(Date.now() - DAY).toDateString();
	return (last === today || last === yesterday) ? days : 0;
}

function renderScores() {
	const t = totals();
	document.getElementById("mastery").textContent = t.mastery + "%";
	document.getElementById("coverage").textContent = t.coverage + "%";
	document.getElementById("streak").textContent = currentStreak();
	document.getElementById("levels-link").hidden = !state.onboarded;
}

// ------------------------------------------------------------------ selection

function hasContent(id) {
	return Boolean(content[id]?.questions?.length);
}

function unlocked(c) {
	return c.prereqs.every(p => progress(p) || assumedKnown(conceptById[p]));
}

function conceptStatus(c) {
	const p = progress(c.id);
	if (!hasContent(c.id)) return "soon";
	if (isMastered(p)) return "mastered";
	if (p) return "learning";
	if (assumedKnown(c)) return "assumed";
	return unlocked(c) && c.level === domainLevel(c.domain) ? "new" : "locked";
}

function dueConcepts() {
	const now = Date.now();
	return concepts
		.filter(c => hasContent(c.id) && progress(c.id) && progress(c.id).due <= now)
		.sort((a, b) => progress(a.id).due - progress(b.id).due);
}

function newConcepts() {
	return concepts
		.filter(c => hasContent(c.id) && !progress(c.id) && unlocked(c) && c.level === domainLevel(c.domain))
		.sort((a, b) => a.level - b.level || a.tier - b.tier);
}

function pickQuestion(conceptId) {
	// Least recently asked question, so each review comes from a new angle.
	const qs = content[conceptId].questions;
	const p = progress(conceptId);
	const lastAsked = q => {
		const a = p?.attempts.filter(x => x.q === q.id).pop();
		return a ? a.t : 0;
	};
	return [...qs].sort((a, b) => lastAsked(a) - lastAsked(b))[0];
}

function buildSession() {
	const items = [];
	for (const c of dueConcepts()) {
		if (items.length >= SESSION_SIZE) break;
		items.push({ conceptId: c.id, isNew: false });
	}
	for (const c of newConcepts()) {
		if (items.length >= SESSION_SIZE || items.filter(i => i.isNew).length >= NEW_PER_SESSION) break;
		items.push({ conceptId: c.id, isNew: true });
	}
	// Interleave new concepts among reviews rather than bunching them at the end.
	return items.sort(() => Math.random() - 0.5);
}

// ------------------------------------------------------------------ diagrams (Mermaid)
//
// Lessons may carry `figures` and questions a `figure`: {caption, mermaid}.
// Mermaid is large (5+ MB), so it loads only when a screen has a diagram.
// Chart colors are the first three slots of the dataviz reference palette,
// validated against this app's card surfaces in both modes (all pairs pass
// the colorblind and normal-vision checks). Light-mode aqua is under 3:1
// contrast, so every figure ships a caption and multi-series charts name their
// series so Mermaid draws a legend.

const MERMAID_SRC = "https://cdn.jsdelivr.net/npm/mermaid@12.0.0/dist/mermaid.min.js";
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
let mermaidLoading = null;
let diagramSeq = 0;

function loadMermaid() {
	return mermaidLoading ||= new Promise((resolve, reject) => {
		const s = document.createElement("script");
		s.src = MERMAID_SRC;
		s.onload = () => resolve(window.mermaid);
		s.onerror = () => { mermaidLoading = null; reject(new Error("couldn't load Mermaid")); };
		document.head.append(s);
	});
}

function seriesColors() {
	return darkQuery.matches ? ["#3987e5", "#d95926", "#199e70"] : ["#2a78d6", "#eb6834", "#1baf7a"];
}

// Mermaid only draws an xychart legend when the chart is ~600px or wider, so on
// phones a two-series chart would lose it. Instead we strip the series names
// before rendering and draw our own legend under the chart at every width.
// Plots take palette colors in the order they appear, lines and bars alike.
function splitSeries(src) {
	if (!/^\s*xychart/.test(src)) return { src, names: [] };
	const names = [];
	const stripped = src.replace(/^(\s*)(line|bar)\s+"([^"]*)"\s*/gm, (m, ws, kind, name) => {
		names.push(name);
		return `${ws}${kind} `;
	});
	return { src: stripped, names };
}

function chartLegend(names) {
	const colors = seriesColors();
	return el("div", { class: "chart-legend" }, ...names.map((n, i) =>
		el("span", { class: "key" }, el("i", { style: `background:${colors[i]}` }), n)));
}

function mermaidConfig(width = 640) {
	const dark = darkQuery.matches;
	const surface = dark ? "#1b2029" : "#ffffff";
	const ink = dark ? "#e8ebf2" : "#1d2433";
	const muted = dark ? "#98a1b3" : "#667085";
	return {
		startOnLoad: false,
		securityLevel: "strict",
		suppressErrorRendering: true,
		theme: "base",
		fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
		// Draw charts at the width they'll be shown, so phone text isn't shrunk to nothing.
		xyChart: { width, height: Math.round(Math.max(260, width * 0.6)), titleFontSize: width < 480 ? 16 : 20 },
		themeVariables: {
			darkMode: dark,
			background: surface,
			primaryColor: dark ? "#184f95" : "#cde2fb",
			primaryBorderColor: dark ? "#3987e5" : "#2a78d6",
			primaryTextColor: ink,
			textColor: ink,
			lineColor: muted,
			edgeLabelBackground: surface,
			xyChart: {
				backgroundColor: surface,
				titleColor: ink,
				legendTextColor: ink,
				xAxisLabelColor: muted, xAxisTitleColor: muted, xAxisTickColor: muted, xAxisLineColor: muted,
				yAxisLabelColor: muted, yAxisTitleColor: muted, yAxisTickColor: muted, yAxisLineColor: muted,
				plotColorPalette: seriesColors().join(", "),
			},
		},
	};
}

function figure(f) {
	if (!f?.mermaid) return null;
	return el("figure", { class: "diagram" },
		el("div", { class: "mmd", "data-src": f.mermaid }, "Loading diagram..."),
		f.caption ? el("figcaption", {}, f.caption) : null);
}

async function renderDiagrams() {
	const nodes = [...document.querySelectorAll(".mmd")];
	if (!nodes.length) return;
	let mermaid;
	try {
		mermaid = await loadMermaid();
	} catch (e) {
		nodes.forEach(n => n.textContent = "Diagram unavailable.");
		return;
	}
	for (const node of nodes) {
		// Skip finished diagrams, and hidden ones (closed "More detail" or review
		// panels): Mermaid can't measure text there. They render when opened.
		if (!node.isConnected || node.dataset.done || node.offsetParent === null) continue;
		node.dataset.done = "1";
		try {
			const width = Math.min(640, Math.max(280, node.clientWidth - 24));
			mermaid.initialize(mermaidConfig(width));
			// Our own authored source, rendered with securityLevel "strict" (sanitized SVG).
			const { src, names } = splitSeries(node.dataset.src);
			const { svg } = await mermaid.render(`mmd-${++diagramSeq}`, src);
			node.innerHTML = svg;
			// One series needs no legend - the chart title names it.
			if (names.length >= 2) node.append(chartLegend(names));
		} catch (e) {
			node.textContent = "Diagram unavailable.";
			console.error("mermaid:", e);
		}
	}
}
darkQuery.addEventListener("change", () => {
	document.querySelectorAll(".mmd").forEach(n => delete n.dataset.done);
	renderDiagrams();
});

// ------------------------------------------------------------------ DOM helpers

function el(tag, attrs = {}, ...children) {
	const node = document.createElement(tag);
	for (const [k, v] of Object.entries(attrs)) {
		if (k === "class") node.className = v;
		else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
		else if (v !== undefined && v !== null) node.setAttribute(k, v);
	}
	for (const ch of children.flat()) {
		if (ch === null || ch === undefined || ch === false) continue;
		node.append(ch instanceof Node ? ch : document.createTextNode(String(ch)));
	}
	return node;
}

function show(...nodes) {
	const app = document.getElementById("app");
	app.replaceChildren(...nodes);
	renderScores();
	renderDiagrams();
	window.scrollTo(0, 0);
}

// ------------------------------------------------------------------ rich text
//
// A small, safe formatter for lesson text and tutor replies: paragraphs,
// "- " and "1. " lists, **bold**, and ```mermaid fences. It builds DOM nodes
// only (never innerHTML), because tutor replies are model output.

function inline(text) {
	return text.split(/\*\*(.+?)\*\*/g).map((part, i) => i % 2 ? el("strong", {}, part) : part).filter(Boolean);
}

function richText(text, { streaming = false } = {}) {
	const frag = document.createDocumentFragment();
	const segments = String(text || "").split(/```mermaid[ \t]*\n([\s\S]*?)```/g);
	let unfinishedDiagram = false;
	segments.forEach((seg, i) => {
		if (i % 2) return frag.append(figure({ mermaid: seg }));
		const fence = seg.indexOf("```");
		if (fence >= 0) {
			// While streaming, an unclosed fence is a diagram still being written.
			if (streaming) unfinishedDiagram = true;
			seg = streaming ? seg.slice(0, fence) : seg.replace(/```[a-z]*/g, "");
		}
		for (const block of seg.split(/\n\s*\n/)) {
			let list = null;
			let para = [];
			const flush = () => { if (para.length) frag.append(el("p", {}, inline(para.join(" ")))); para = []; };
			for (const line of block.split("\n")) {
				if (!line.trim()) continue;
				const bullet = line.match(/^[-*]\s+(.*)$/);
				const numbered = line.match(/^\d+[.)]\s+(.*)$/);
				const heading = line.match(/^#{1,6}\s+(.*)$/);
				if (bullet || numbered) {
					flush();
					const tag = bullet ? "ul" : "ol";
					if (!list || list.tagName !== tag.toUpperCase()) list = frag.appendChild(el(tag));
					list.append(el("li", {}, inline((bullet || numbered)[1])));
				} else if (/^\s/.test(line) && list) {
					list.lastChild.append(" ", ...inline(line.trim())); // wrapped list item
				} else if (heading) {
					flush(); list = null;
					frag.append(el("p", {}, el("strong", {}, heading[1])));
				} else {
					list = null;
					para.push(line.trim());
				}
			}
			flush();
		}
	});
	if (unfinishedDiagram) frag.append(el("p", { class: "muted small" }, "Drawing a diagram..."));
	return frag;
}

function sourcesList(sources) {
	if (!sources?.length) return null;
	return el("div", { class: "sources" },
		el("h3", {}, "Sources"),
		el("ul", {}, ...sources.filter(x => /^https:\/\//.test(x.url)).map(x =>
			el("li", {}, el("a", { href: x.url, target: "_blank", rel: "noopener" }, x.title)))));
}

// References for a question: its own, then its concept's, without duplicates.
function referencesList(q, conceptId) {
	const seen = new Set();
	const refs = [...(q.references || []), ...(content[conceptId].sources || [])]
		.filter(x => /^https:\/\//.test(x.url) && !seen.has(x.url) && seen.add(x.url));
	if (!refs.length) return null;
	return el("div", { class: "sources references" },
		el("h3", {}, "References"),
		el("p", { class: "muted small" }, "To learn more or check the answer:"),
		el("ul", {}, ...refs.map(x => el("li", {}, el("a", { href: x.url, target: "_blank", rel: "noopener" }, x.title)))));
}

// Lesson text, its figures, and a "More detail" section that opens in place.
function lessonBody(conceptId) {
	const c = content[conceptId];
	const more = c.detail ? el("div", { class: "detail", hidden: "" }, richText(c.detail), sourcesList(c.sources)) : null;
	const toggle = more ? el("button", {
		class: "ghost more", "aria-expanded": "false",
		onclick: () => {
			more.hidden = !more.hidden;
			toggle.textContent = more.hidden ? "More detail" : "Less detail";
			toggle.setAttribute("aria-expanded", String(!more.hidden));
			renderDiagrams();
		},
	}, "More detail") : null;
	return [el("div", { class: "lesson-text" }, richText(c.lesson)), ...(c.figures || []).map(figure), toggle, more];
}

// ------------------------------------------------------------------ tutor (follow-up questions)
//
// The conversation lives on the session item only; nothing is saved. The API
// looks up the lesson and reference answer itself and streams the reply.

const MAX_FOLLOWUPS = 5;
const MAX_FOLLOWUP_CHARS = 500;

function tutorPanel(item, q, answer, result) {
	const thread = item.thread ||= [];
	const log = el("div", { class: "chat-log", "aria-live": "polite" });
	const input = el("textarea", { rows: 2, maxlength: MAX_FOLLOWUP_CHARS, placeholder: 'Ask anything about this concept, e.g. "Why does that happen?"' });
	const ask = el("button", { class: "primary ask" }, "Ask");
	const note = el("span", { class: "muted small" });
	let busy = false;

	const bubble = m => m.role === "user"
		? el("div", { class: "msg user" }, m.content)
		: el("div", { class: "msg tutor" }, richText(m.content));

	function update() {
		const left = MAX_FOLLOWUPS - thread.filter(m => m.role === "user").length;
		note.textContent = left > 0 ? `${left} question${left === 1 ? "" : "s"} left on this card` : "That's the limit for this card.";
		input.disabled = ask.disabled = busy || left <= 0;
	}

	async function send() {
		const text = input.value.trim();
		if (!text || busy) return;
		busy = true;
		input.value = "";
		thread.push({ role: "user", content: text });
		log.append(bubble(thread.at(-1)));
		const reply = el("div", { class: "msg tutor" }, el("span", { class: "grading" }, "Thinking..."));
		log.append(reply);
		update();
		let full = "";
		try {
			const res = await fetch(`${API}/followup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					question_id: q.id, answer, score: result.score, feedback: result.feedback,
					// Older replies are trimmed to keep the request small.
					messages: thread.map(m => ({ role: m.role, content: m.role === "assistant" ? m.content.slice(0, 1500) : m.content })),
				}),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || `Tutor error ${res.status}`);
			}
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				full += decoder.decode(value, { stream: true });
				reply.replaceChildren(richText(full, { streaming: true }));
			}
			if (!full.trim()) throw new Error("The tutor didn't answer.");
			thread.push({ role: "assistant", content: full.trim() });
			reply.replaceChildren(richText(full));
			renderDiagrams();
		} catch (e) {
			thread.pop(); // keep the conversation alternating; let them retry
			reply.replaceChildren(el("p", { class: "error" },
				`${e.message === "Failed to fetch" ? "Couldn't reach the tutor." : e.message} Your question is back in the box - try again.`));
			input.value = text;
		}
		busy = false;
		update();
		input.focus();
	}

	ask.addEventListener("click", send);
	input.addEventListener("keydown", e => {
		if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
	});
	log.append(...thread.map(bubble));
	update();
	return el("section", { class: "tutor" },
		el("h3", {}, "Ask the tutor"),
		el("p", { class: "muted small" }, "Answers come from an AI tutor and can be wrong. It only discusses this course's topics."),
		log,
		el("div", { class: "ask-row" }, input, ask),
		note);
}

// ------------------------------------------------------------------ screens

function homeScreen() {
	if (!state.onboarded) return placementScreen(true);
	const ups = levelUpDomains();
	const t = totals();
	const due = dueConcepts().length;
	const fresh = newConcepts().length;
	const canPlay = due + fresh > 0;

	let hint;
	if (!t.presented) hint = "Each session is about 8 short questions. Answer in your own words; a grader scores how well you understand.";
	else if (due) hint = `${due} concept${due === 1 ? "" : "s"} due for review.`;
	else if (fresh) hint = "Nothing due - time to learn something new.";
	else hint = "All caught up. Come back tomorrow for reviews.";

	show(
		el("section", { class: "hero" },
			el("h1", {}, t.presented ? "Welcome back" : "Learn quant investing like a language"),
			el("p", { class: "muted" }, hint),
			el("button", { class: "primary big", disabled: canPlay ? undefined : "", onclick: startSession },
				t.presented ? "Start session" : "Start learning"),
			el("div", { class: "stats" },
				stat(`${t.mastered} / ${t.presented}`, "concepts mastered of those seen"),
				stat(`${t.presented} / ${t.total}`, "concepts seen of the whole course"),
				stat(state.answered, "answers given")),
		),
		ups.length ? el("p", { class: "levelup" },
			`Level up: ${ups.map(d => `${domains[d]} is now level ${domainLevel(d)}`).join(", ")}.`) : null,
		levelsCard(),
		conceptMap(),
	);
}

function levelsCard() {
	const active = Object.keys(domains).filter(d => questionLevels(d).length);
	return el("section", { class: "levels-card" },
		el("h2", {}, "Your levels"),
		el("p", { class: "chips" }, ...active.map(d => el("span", { class: "chip" }, `${domains[d]} ${domainLevel(d)}`))),
		el("button", { class: "ghost", onclick: () => placementScreen(false) }, "Adjust levels"));
}

function placementScreen(first) {
	const picks = Object.fromEntries(Object.keys(domains).map(d => [d, domainLevel(d)]));
	const rows = Object.entries(domains).map(([d, name]) => {
		const have = questionLevels(d);
		const buttons = LEVELS.map(([n, label, hint]) => {
			const b = el("button", {
				class: `level-pick${picks[d] === n ? " on" : ""}`, title: `${label}: ${hint}`,
				"aria-pressed": String(picks[d] === n),
				onclick: () => {
					picks[d] = n;
					b.parentNode.querySelectorAll(".level-pick").forEach((x, i) => {
						x.classList.toggle("on", i + 1 === n);
						x.setAttribute("aria-pressed", String(i + 1 === n));
					});
				},
			}, String(n));
			return b;
		});
		const avail = have.length
			? `Questions so far: level${have.length > 1 ? "s" : ""} ${have.join(", ")} (course goes to ${maxLevel(d)})`
			: "Questions coming soon";
		return el("div", { class: "level-row" },
			el("div", {}, el("strong", {}, name), el("span", { class: "muted small avail" }, avail)),
			el("div", { class: "level-picks", role: "group", "aria-label": name }, ...buttons));
	});
	const commit = () => {
		for (const [d, n] of Object.entries(picks)) {
			if (n !== domainLevel(d)) state.recent[d] = [];
			state.levels[d] = n;
		}
		state.onboarded = true;
		save();
		homeScreen();
	};
	show(el("article", { class: "card placement" },
		el("h2", {}, first ? "How familiar are you with each area?" : "Your levels"),
		el("p", { class: "muted" }, first
			? "Pick a level for each area. We'll skip what you already know and start where it gets interesting. If it turns out to be too hard, we'll step down automatically, and you can change these any time."
			: "Set the level you want to work at in each area. Lowering a level brings back the easier concepts we skipped."),
		el("ol", { class: "level-key" }, ...LEVELS.map(([n, label, hint]) => el("li", {}, el("strong", {}, label), ` - ${hint}`))),
		...rows,
		el("div", { class: "actions" },
			first ? el("button", { class: "ghost", onclick: () => { Object.keys(picks).forEach(d => picks[d] = 1); commit(); } }, "Skip - start at level 1 everywhere") : el("button", { class: "ghost", onclick: homeScreen }, "Cancel"),
			first ? null : el("button", {
				class: "ghost", onclick: () => {
					if (!confirm("Set every area back to level 1? Your answers and progress are kept.")) return;
					Object.keys(picks).forEach(d => picks[d] = 1);
					commit();
				},
			}, "Reset all to level 1"),
			el("button", { class: "primary", onclick: commit }, first ? "Start learning" : "Save levels"))));
}

function stat(value, label) {
	return el("div", { class: "stat" }, el("strong", {}, value), el("span", {}, label));
}

function conceptMap() {
	const tiers = [...new Set(concepts.map(c => c.tier))].sort((a, b) => a - b);
	const TIER_NAMES = ["Market basics", "Quant foundations", "Asset classes", "Portfolio theory",
		"Quant portfolio management", "Risk management", "Performance", "Advanced topics"];
	const legend = el("p", { class: "legend" },
		...["mastered", "learning", "new", "assumed", "locked", "soon"].map(s =>
			el("span", { class: `chip ${s}` }, { mastered: "mastered", learning: "learning", new: "ready", assumed: "assumed known", locked: "later", soon: "coming soon" }[s])));
	return el("section", { class: "map" },
		el("h2", {}, "Course map"),
		legend,
		...tiers.map(tier => {
			const cs = concepts.filter(c => c.tier === tier);
			return el("div", { class: "tier" },
				el("h3", {}, `Tier ${tier}: ${TIER_NAMES[tier] || ""}`),
				el("div", { class: "chips" }, ...cs.map(c => {
					const s = conceptStatus(c);
					const p = progress(c.id);
					const title = `${c.summary}\n${domains[c.domain]}, level ${c.level}${p ? `\nStrength ${strength(p)}%` : ""}`;
					return el("span", { class: `chip ${s}`, title }, c.name);
				})));
		}));
}

// ------------------------------------------------------------------ session

let session = null;

function startSession() {
	const items = buildSession();
	if (!items.length) return homeScreen();
	session = { items, index: 0, results: [], retried: new Set() };
	nextItem();
}

function nextItem() {
	if (session.index >= session.items.length) return summaryScreen();
	const item = session.items[session.index];
	if (item.isNew && !item.lessonShown) return lessonScreen(item);
	questionScreen(item);
}

function progressBar() {
	const pct = Math.round(100 * session.index / session.items.length);
	return el("div", { class: "bar" }, el("div", { class: "fill", style: `width:${pct}%` }));
}

function lessonScreen(item) {
	const c = conceptById[item.conceptId];
	show(
		progressBar(),
		el("article", { class: "card lesson" },
			el("p", { class: "kicker" }, `New concept · ${domains[c.domain] || c.domain}`),
			el("h2", {}, c.name),
			...lessonBody(c.id),
			el("button", { class: "primary continue", onclick: () => { item.lessonShown = true; questionScreen(item); } }, "Got it - quiz me")));
}

function questionScreen(item) {
	const c = conceptById[item.conceptId];
	const q = item.question || (item.question = pickQuestion(c.id));
	const box = el("textarea", { id: "answer", rows: 5, maxlength: 1500, placeholder: "Answer in your own words. A sentence or two is usually enough." });
	const submit = el("button", { class: "primary", onclick: () => grade(item, q, box.value) }, "Check answer");
	box.addEventListener("keydown", e => {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit.click();
	});
	show(
		progressBar(),
		el("article", { class: "card" },
			el("p", { class: "kicker" }, `${c.name} · ${domains[c.domain]} level ${c.level} · ${q.angle}`),
			el("h2", { class: "prompt" }, q.prompt),
			box,
			el("div", { class: "actions" },
				el("button", { class: "ghost", onclick: () => revealOnly(item, q) }, "I don't know"),
				submit),
			el("p", { class: "muted small" }, "Ctrl+Enter to submit")));
	box.focus();
}

async function grade(item, q, answer) {
	answer = answer.trim();
	if (!answer) return;
	const card = document.querySelector(".card");
	card.querySelectorAll("button, textarea").forEach(n => n.disabled = true);
	card.append(el("p", { class: "grading" }, "Grading..."));

	let result;
	try {
		const res = await fetch(`${API}/score`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ question_id: q.id, answer }),
		});
		const body = await res.json().catch(() => ({}));
		if (!res.ok) throw new Error(body.error || `Grader error ${res.status}`);
		result = body;
	} catch (e) {
		card.querySelector(".grading").remove();
		card.querySelectorAll("button, textarea").forEach(n => n.disabled = false);
		card.append(el("p", { class: "error" },
			`${e.message === "Failed to fetch" ? "Couldn't reach the grader." : e.message} Try again, or use "I don't know" to see the answer.`));
		return;
	}
	result.levelNote = recordAttempt(item.conceptId, q.id, result.score);
	session.results.push({ conceptId: item.conceptId, score: result.score });
	feedbackScreen(item, q, answer, result);
}

function revealOnly(item, q) {
	const levelNote = recordAttempt(item.conceptId, q.id, 0);
	session.results.push({ conceptId: item.conceptId, score: 0 });
	feedbackScreen(item, q, "", { score: 0, feedback: "No problem - read the model answer, and this one will come back soon.", missing: [], levelNote });
}

function feedbackScreen(item, q, answer, result) {
	const { score } = result;
	const tone = score >= PASS ? "pass" : score >= SHAKY ? "shaky" : "fail";
	const cheer = { pass: ["Nice!", "Solid.", "You've got it.", "Correct!"], shaky: ["Close.", "Partly there."], fail: ["Not yet.", "Keep going."] }[tone];

	// A failed concept comes back once later in the same session, with a different question.
	if (tone !== "pass" && !session.retried.has(item.conceptId) && content[item.conceptId].questions.length > 1) {
		session.retried.add(item.conceptId);
		session.items.push({ conceptId: item.conceptId, isNew: false, lessonShown: true });
	}

	const p = progress(item.conceptId);
	show(
		progressBar(),
		el("article", { class: `card result ${tone}` },
			el("div", { class: "score-row" },
				el("div", { class: "ring", style: `--pct:${score}` }, el("span", {}, score)),
				el("div", {},
					el("h2", {}, cheer[Math.floor(Math.random() * cheer.length)]),
					el("p", {}, result.feedback))),
			result.missing?.length ? el("div", { class: "missing" },
				el("h3", {}, "Missing or off"),
				el("ul", {}, ...result.missing.map(m => el("li", {}, m)))) : null,
			answer ? el("details", {}, el("summary", {}, "Your answer"), el("p", { class: "quote" }, answer)) : null,
			result.levelNote ? el("p", { class: "levelnote" }, result.levelNote) : null,
			el("div", { class: "model" }, el("h3", {}, "Model answer"), el("p", {}, q.answer)),
			figure(q.figure),
			tutorPanel(item, q, answer, result),
			el("details", { class: "review", ontoggle: renderDiagrams },
				el("summary", {}, "Review the lesson"),
				...lessonBody(item.conceptId)),
			referencesList(q, item.conceptId),
			// Pinned to the bottom of the screen, so the player can move on at any
			// point while reading or chatting with the tutor.
			el("div", { class: "next-bar" },
				el("span", { class: "muted small" },
					isMastered(p) ? "Concept mastered." : `Concept strength ${strength(p)}% · review box ${p.box} of ${MASTER_BOX} to master`),
				el("button", { class: "primary continue", onclick: () => { session.index++; nextItem(); } },
					session.index + 1 >= session.items.length ? "Finish session" : "Next question"))));
	// Focus without scrolling: the result should open at the top, not jump to the button.
	document.querySelector(".card .continue").focus({ preventScroll: true });
}

function summaryScreen() {
	const n = session.results.length;
	const passed = session.results.filter(r => r.score >= PASS).length;
	const avg = n ? Math.round(session.results.reduce((s, r) => s + r.score, 0) / n) : 0;
	session = null;
	show(
		el("article", { class: "card summary" },
			el("h2", {}, "Session complete"),
			el("div", { class: "stats" },
				stat(`${passed} / ${n}`, "answers passed"),
				stat(avg, "average score"),
				stat(`${currentStreak()}`, "day streak")),
			el("button", { class: "primary", onclick: homeScreen }, "Back to map")));
}

// ------------------------------------------------------------------ export / import / reset

document.getElementById("levels-link").addEventListener("click", () => {
	if (session && !confirm("Leave this session to change your levels? Answers so far are saved.")) return;
	session = null;
	placementScreen(false);
});

document.getElementById("export").addEventListener("click", () => {
	const blob = new Blob([JSON.stringify(state, null, 1)], { type: "application/json" });
	const a = el("a", { href: URL.createObjectURL(blob), download: `quant-fluency-progress-${new Date().toISOString().slice(0, 10)}.json` });
	a.click();
	URL.revokeObjectURL(a.href);
});

document.getElementById("import").addEventListener("click", () => document.getElementById("import-file").click());
document.getElementById("import-file").addEventListener("change", async e => {
	const file = e.target.files[0];
	if (!file) return;
	try {
		const s = JSON.parse(await file.text());
		if (!s.concepts || !s.streak) throw new Error("not a progress file");
		state = s;
		save();
		homeScreen();
	} catch (err) {
		alert(`Couldn't import: ${err.message}`);
	}
	e.target.value = "";
});

document.getElementById("reset").addEventListener("click", () => {
	if (!confirm("Erase all progress in this browser?")) return;
	state = blankState();
	save();
	homeScreen();
});

// ------------------------------------------------------------------ boot

(async function boot() {
	try {
		const [cRaw, qRaw] = await Promise.all([
			fetch("concepts.yml", { cache: "no-cache" }).then(r => r.text()),
			fetch("questions.yml", { cache: "no-cache" }).then(r => r.text()),
		]);
		const cDoc = jsyaml.load(cRaw);
		concepts = cDoc.concepts;
		domains = cDoc.domains;
		conceptById = Object.fromEntries(concepts.map(c => [c.id, c]));
		content = jsyaml.load(qRaw);
	} catch (e) {
		show(el("p", { class: "error" }, `Couldn't load the course: ${e.message}`));
		return;
	}
	homeScreen();
})();
