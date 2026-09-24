// ===== CONFIGURATION =====
// All data (weather/news/events/facts/quotes/jokes) is fetched hourly by
// server1 and published here as static JSON - this page has no API keys
// and makes no third-party calls except the cat image.
const CONFIG = {
	UPDATE_INTERVAL: 3600 * 1000, // 1 hour
	CLOCK_UPDATE_INTERVAL: 1000,  // 1 second
	CHART_UPDATE_INTERVAL: 60 * 1000, // 1 minute
	NEWS_SCROLL_SPEED: 0.012 // news panes scroll at this fraction of screen width per second
};

// ===== UTILITY FUNCTIONS =====

// Temperature conversion utilities
function ctof(c) {
	return (c * 9 / 5 + 32).toFixed(0);
}

function ktof(k) {
	return ((k - 273.15) * 1.8 + 32);
}

// OpenWeather's default ("standard") units give wind in meters per second
function mpsToMph(mps) {
	return mps * 2.236936;
}

function ktocolor(k) {
	// Temperature to color mapping (270-290K range)
	return `hsl(${300 - (k - 250) * 5}, 100%, 50%)`;
}

// Map a value from one range to another
function map_number(x, in_min, in_max, out_min, out_max) {
	return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// ===== DEW POINT UTILITIES =====

function dewPointComfort(d) {
	if (d < 50) return "<span class='dew-fall'>Fall-Like</span>";
	if (d < 60) return "<span class='dew-pleasant'>Pleasant</span>";
	if (d < 65) return "<span class='dew-noticeable'>Noticeable</span>";
	if (d < 70) return "<span class='dew-steamy'>Steamy</span>";
	if (d < 75) return "<span class='dew-oppressive'>Oppressive</span>";
	return "<span class='dew-unbearable'>Unbearable</span>";
}

function dewPointClass(d) {
	if (d < 50) return "dew-fall";
	if (d < 60) return "dew-pleasant";
	if (d < 65) return "dew-noticeable";
	if (d < 70) return "dew-steamy";
	if (d < 75) return "dew-oppressive";
	return "dew-unbearable";
}

// ===== DATE & TIME FUNCTIONS =====

function updateclock() {
	var time = new Date();
	var todisplay = '';
	var ap = "AM";

	var hours = time.getHours();
	if (hours >= 12) {
		hours -= 12;
		ap = "PM";
	}
	if (hours == 0) {
		hours = 12;
	}
	todisplay += hours;

	if (time.getMinutes() < 10) todisplay += ':0' + time.getMinutes();
	else todisplay += ':' + time.getMinutes();
	todisplay += "<small>." + String(time.getSeconds()).padStart(2, "0") + "</small>";
	todisplay += ap;

	document.getElementById("time-now").innerHTML = todisplay;
}

function updatedate() {
	var str = new Date().toLocaleDateString('en-us', {
		weekday: "long",
		month: "long",
		day: "numeric"
	});
	document.getElementById("date").innerHTML = str;
}

function setTimeString(id, t) {
	const dSunrise = new Date(t * 1000);
	document.getElementById(id).innerHTML = dSunrise.toLocaleTimeString("en-us", {
		hour: "numeric",
		minute: "numeric",
	});
}

// ===== WEATHER FUNCTIONS =====

let previousChart = null;

function loadWeather() {
	fetch("weather.json").then(res => res.json()).then(json => {
		if (previousChart) previousChart.destroy();

		// Update current temperature display
		updateCurrentWeather(json.current);

		// Update weather forecast notes
		updateWeatherNotes(json.daily);

		// Update sunrise/sunset times and tonight's moon
		updateSunTimes(json.current);
		updateMoon(json.daily[0]);

		// Create weather chart
		createWeatherChart(json);
	});
}

function updateCurrentWeather(current) {
	let str = "<span id='temp' style='line-height: 100%;'>" + (ktof(current.feels_like).toFixed(0) | 0) + "F</span>";
	const dew_point = ktof(current.dew_point).toFixed(0);
	str += "<div class='dew-point " + dewPointClass(dew_point) + "'>Dew Pt: " + dew_point + "F</div>";
	str += "<div class='wind-speed'>Wind: " + Math.round(mpsToMph(current.wind_speed)) + " mph</div>";
	document.getElementById("weather").innerHTML = str;
}

// One line per day built from the numbers, e.g. "Light rain · 72° / 55° · 60% rain".
// OpenWeather's own `summary` text is often ungrammatical ("There will be
// partly cloudy today"), so it isn't used.
function dayForecast(day) {
	const desc = day.weather?.[0]?.description || "";
	const parts = [desc.charAt(0).toUpperCase() + desc.slice(1)];
	parts.push(`${Math.round(ktof(day.temp.max))}° / ${Math.round(ktof(day.temp.min))}°`);
	const pop = Math.round((day.pop || 0) * 100);
	if (pop >= 10) parts.push(`${pop}% rain`);
	if (day.uvi >= 6) parts.push(`UV ${Math.round(day.uvi)}`);
	return parts.filter(Boolean).join(" · ");
}

function updateWeatherNotes(daily) {
	const note = document.getElementById("weather-note");
	note.replaceChildren();
	[["Today", daily[0]], ["Tomorrow", daily[1]]].forEach(([title, day]) => {
		if (!day) return;
		note.append(el("h2", null, title), el("p", null, dayForecast(day)));
	});
}

function updateSunTimes(current) {
	setTimeString("sunrise", current.sunrise);
	setTimeString("sunset", current.sunset);
	setTimeString("noon", (current.sunrise + current.sunset) / 2);
}

// moon_phase: 0 and 1 are new moon, 0.25 first quarter, 0.5 full, 0.75 last quarter
const MOON_PHASES = [
	["🌑", "New moon"], ["🌒", "Waxing crescent"], ["🌓", "First quarter"], ["🌔", "Waxing gibbous"],
	["🌕", "Full moon"], ["🌖", "Waning gibbous"], ["🌗", "Last quarter"], ["🌘", "Waning crescent"]
];

function updateMoon(today) {
	const moon = document.getElementById("moon");
	if (typeof today?.moon_phase !== "number") return moon.replaceChildren();
	const [icon, name] = MOON_PHASES[Math.round(today.moon_phase * 8) % 8];
	moon.textContent = icon;
	moon.title = name;
}

function createWeatherChart(json) {
	// Find temperature domain
	let minF = 1000;
	let maxF = 0;

	json.hourly.forEach(d => {
		const t = d.feels_like;
		if (t > maxF) maxF = t;
		if (t < minF) minF = t;
	});

	json.daily.forEach(d => {
		for (let k in d.feels_like) {
			const t = d.feels_like[k];
			if (t > maxF) maxF = t;
			if (t < minF) minF = t;
		}
	});

	maxF += 1;
	minF -= 1;

	// Create chart background plugin
	const canvasBackgroundColor = createChartBackgroundPlugin(json);

	// Create the chart
	previousChart = new Chart(document.getElementById('weather-chart'), {
		data: {
			labels: json.hourly.map(h => (h.dt * 1000)),
			datasets: [
				// Feels like temperature
				{
					type: 'line',
					label: 'Feels Like',
					data: json.hourly.map(h => ktof(h.feels_like)),
					backgroundColor: json.hourly.map(h => ktocolor(h.feels_like)),
					yAxisID: 'yF',
					borderColor: 'black',
					pointRadius: 5,
				},
				// Dew point
				{
					type: 'line',
					label: 'Dew Pt.',
					data: json.hourly.map(h => ktof(h.dew_point)),
					backgroundColor: json.hourly.map(h => ktocolor(h.dew_point)),
					yAxisID: 'yF',
				},
				// Rain
				{
					type: 'bar',
					label: '1h Rain',
					data: json.hourly.map(h => {
						if (h.rain) return h.rain['1h'];
						return 0;
					}),
					backgroundColor: "#69f",
					yAxisID: 'yRain',
				},
				// Snow
				{
					type: 'bar',
					label: '1h Snow',
					data: json.hourly.map(h => {
						if (h.snow) return h.snow['1h'];
						return 0;
					}),
					backgroundColor: "white",
					yAxisID: 'yRain',
				},

				// wind gusts
				{
					type: 'line',
					label: 'Wind Gusts',
					data: json.hourly.map(h => h.wind_gust ? Math.round(mpsToMph(h.wind_gust)) : 0),
					backgroundColor: "orange",
					borderColor: "orange",
					yAxisID: 'yWind',
					pointRadius: 1,
				},

				// wind speed
				{
					type: 'line',
					label: 'Wind Speed',
					data: json.hourly.map(h => Math.round(mpsToMph(h.wind_speed))),
					backgroundColor: "yellow",
					borderColor: "yellow",
					yAxisID: 'yWind',
					pointRadius: 1,
				},
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				yF: {
					type: 'linear',
					display: true,
					position: 'left',
					title: {
						display: true,
						text: 'F',
						color: "gray",
						font: { size: 16 }
					},
					ticks: {
						font: { size: 18 },
						color: "gray",
					},
					grid: {
						color: '#0009',
					},
					min: ktof(minF) | 0,
					max: ktof(maxF) | 0,
				},
				yRain: {
					type: 'linear',
					display: true,
					position: 'right',
					title: {
						display: true,
						text: '(rain) mm',
						color: "gray",
						font: { size: 12 },
						padding: 0
					},
					ticks: {
						font: { size: 14 },
						padding: 2,
						color: "gray"
					},
					min: 0,
					max: 10,
				},
				yWind: {
					type: 'linear',
					display: true,
					position: 'right',
					title: {
						display: true,
						text: 'mph',
						color: "orange",
						font: { size: 12 },
						padding: 0
					},
					ticks: {
						font: { size: 14 },
						padding: 2,
						color: "orange"
					},
					grid: {
						display: false,
					},
					min: 0,
					max: 40,
				},
				x: {
					type: 'timeseries',
					ticks: {
						font: { size: 20 },
						color: "gray",
					},
					stacked: true,
				}
			}
		},
		plugins: [canvasBackgroundColor],
	});
}

function createChartBackgroundPlugin(json) {
	return {
		id: 'canvasBackgroundColor',
		beforeDraw: (chart, args, options) => {
			const { ctx } = chart;
			const { top, left, right, width, height } = chart.chartArea;

			ctx.save();

			// Only draw inside the chart area
			ctx.beginPath();
			ctx.fillStyle = "#4b5a70";
			ctx.rect(left, top, width, height);
			ctx.fill();
			ctx.clip();

			const dtBegin = json.hourly[0].dt;
			const dtEnd = json.hourly[json.hourly.length - 1].dt;

			// Draw night time and day time background
			for (let d = 0; d < 3; ++d) {
				const aday = 24 * 60 * 60 * d;
				const startLeft = map_number(json.current.sunrise + aday, dtBegin, dtEnd, left, right);
				const startRight = map_number(json.current.sunset + aday, dtBegin, dtEnd, left, right);

				const grd = ctx.createLinearGradient(startLeft - 20, 0, startRight + 20, 0);
				grd.addColorStop(0, "#0000");
				grd.addColorStop(0.05, "lightcyan");
				grd.addColorStop(0.95, "lightcyan");
				grd.addColorStop(1, "#0000");
				ctx.fillStyle = grd;

				ctx.fillRect(startLeft - 20, top, startRight - startLeft + 40, height);
			}

			// UV index indicator
			json.hourly.forEach(hour => {
				ctx.beginPath();
				const x1 = map_number(hour.dt, dtBegin, dtEnd, left, right);
				const x2 = map_number(hour.dt + 3600, dtBegin, dtEnd, left, right);
				const h = map_number(hour.uvi, 1, 12, 0, height);
				ctx.fillStyle = `hsla(190, 100%, 50%, 0.5)`;
				ctx.rect(x1, height - h, x2 - x1, height);
				ctx.fill();
			});

			// Draw noon lines
			let noon = new Date();
			noon.setHours(12);
			for (let d = 0; d < 3; ++d) {
				ctx.beginPath();
				const noonx = map_number(noon.getTime() / 1000, dtBegin, dtEnd, left, right);
				ctx.moveTo(noonx, top);
				ctx.strokeStyle = 'rgba(255,255,255,0.7)';
				ctx.lineWidth = 2;
				ctx.lineTo(noonx, top + height);
				ctx.stroke();

				noon.setTime(noon.getTime() + 24 * 3600 * 1000);
			}

			// Date labels and lines
			for (let d = 1; d < 3; ++d) {
				const dt = json.daily[d].dt;
				const date = new Date(dt * 1000);
				date.setHours(0);
				const x1 = map_number(date.getTime() / 1000, dtBegin, dtEnd, left, right);
				ctx.font = "20px sans-serif";
				ctx.fillStyle = "#ffffff";
				ctx.fillText(" " + date.toLocaleDateString('en-us', { day: "numeric", weekday: "long" }), x1, top + 18);

				ctx.beginPath();
				ctx.moveTo(x1, top);
				ctx.strokeStyle = 'rgba(255,255,255,0.7)';
				ctx.lineWidth = 1;
				ctx.lineTo(x1, top + height);
				ctx.stroke();
			}

			// Draw "now" line
			const x = map_number(new Date().getTime() / 1000, dtBegin, dtEnd, left, right);
			ctx.beginPath();
			ctx.moveTo(x, top);
			ctx.strokeStyle = '#0f172a';
			ctx.lineWidth = 3;
			ctx.lineTo(x, top + height);
			ctx.stroke();

			ctx.restore();
		}
	};
}

// ===== NEWS PANEL FUNCTIONS =====

// Stories come from news/news.yml, written twice a day by a Claude agent
// (scripts/kiosk-news.sh + .claude/skills/kiosk-news). They are grouped by
// section into the 4 panes of a 2x2 grid (NEWS_GROUPS), and each pane shows
// its whole group as one list that scrolls upward in a continuous loop.
//
// The agent writes this file after reading arbitrary web pages, so every
// field is treated as plain text (textContent, never innerHTML) and images
// are only loaded from the agent's own img/ folder.

const NEWS_URL = "news/news.yml";

// One entry per pane, in grid order. A section not listed here (the agent
// can invent one) goes to the last pane rather than being dropped.
const NEWS_GROUPS = [
	{ label: "Local Events", sections: ["Local Events"] },
	{ label: "Local News", sections: ["Weather Alert", "Local News"] },
	{ label: "US & World", sections: ["US News", "World News"] },
	{ label: "AI & On This Day", sections: ["AI News", "On This Day"] }
];

const news = {
	raw: null,
	generated: ""
};

function el(tag, className, text) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text) node.textContent = text;
	return node;
}

function str(value) {
	return typeof value === "string" ? value.trim() : "";
}

function buildStory(story, showSection) {
	const item = el("div", "news-item");

	// panes holding more than one section label each story with its own
	if (showSection && str(story.section)) item.append(el("div", "news-kicker", str(story.section)));

	const image = str(story.image);
	if (/^img\/[a-z0-9-]+\.jpg$/.test(image)) {
		const img = el("img");
		// generated time busts the cache when a later run reuses a file name
		img.src = `news/${image}?v=${encodeURIComponent(news.generated)}`;
		img.alt = "";
		img.addEventListener("error", () => img.remove());
		item.append(img);
	}

	item.append(el("h4", null, str(story.title)));
	for (const para of str(story.body).split(/\n\s*\n/)) {
		if (para.trim()) item.append(el("p", null, para.trim()));
	}

	const credit = str(story.image_credit);
	const where = str(story.where);
	const source = str(story.source) === where ? "" : str(story.source); // venue is often the source too
	const meta = [str(story.when), where, source];
	if (image && credit && credit !== str(story.source)) meta.push(`Photo: ${credit}`);
	const metaText = meta.filter(Boolean).join(" · ");
	if (metaText) item.append(el("small", null, metaText));
	return item;
}

// Resolves once every image in `node` has loaded or failed (a failed one
// removes itself), so heights are final before the marquee is measured.
function imagesSettled(node) {
	const pending = [...node.querySelectorAll("img")].filter(img => !img.complete);
	return Promise.all(pending.map(img => new Promise(resolve => {
		img.addEventListener("load", resolve, { once: true });
		img.addEventListener("error", resolve, { once: true });
	})));
}

// If the list is taller than its pane, append an identical copy below it and
// scroll the viewport down by exactly one list height, forever: when it
// wraps, the copy sits where the original started, so the loop has no seam.
// It moves scrollTop rather than a transform so the sticky story headings
// (see .news-item h4 in styles.css) pin to the top as their story passes.
async function startMarquee(paneEl, list) {
	const token = paneEl.dataset.token;
	await imagesSettled(list);
	if (paneEl.dataset.token !== token) return; // pane was rebuilt meanwhile

	const viewport = paneEl.querySelector(".news-viewport");
	const distance = list.offsetHeight;
	if (distance <= viewport.clientHeight) return; // fits: nothing to scroll

	list.parentElement.append(list.cloneNode(true));
	const start = performance.now();
	const step = now => {
		if (paneEl.dataset.token !== token) return; // pane rebuilt: stop this loop
		const pos = (now - start) / 1000 * window.innerWidth * CONFIG.NEWS_SCROLL_SPEED;
		viewport.scrollTop = pos % distance;
		requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
}

function setPane(paneEl, group, stories) {
	paneEl.dataset.token = String(Date.now() + Math.random());
	paneEl.replaceChildren();
	paneEl.classList.toggle("empty", stories.length === 0);
	if (!stories.length) return;

	const mixed = new Set(stories.map(s => str(s.section))).size > 1;
	const list = el("div", "news-list");
	stories.forEach(story => list.append(buildStory(story, mixed)));

	const track = el("div", "news-track");
	track.append(list);
	const viewport = el("div", "news-viewport");
	viewport.append(track);
	paneEl.append(el("div", "news-section", group.label), viewport);
	startMarquee(paneEl, list);
}

function groupOf(story) {
	const i = NEWS_GROUPS.findIndex(g => g.sections.includes(str(story.section)));
	return i === -1 ? NEWS_GROUPS.length - 1 : i;
}

async function loadNews() {
	let raw;
	try {
		const res = await fetch(NEWS_URL, { cache: "no-store" });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		raw = await res.text();
	} catch (err) {
		console.error("news: could not load", NEWS_URL, err);
		return; // keep showing whatever is on screen
	}
	if (raw === news.raw) return; // unchanged since last hourly check

	let data;
	try {
		data = jsyaml.load(raw);
	} catch (err) {
		console.error("news: invalid YAML", err);
		return;
	}
	news.raw = raw;
	news.generated = str(data?.generated);
	const stories = (Array.isArray(data?.stories) ? data.stories : [])
		.filter(story => story && str(story.title));

	// within a pane, stories keep the order the agent wrote them in
	const groups = NEWS_GROUPS.map(() => []);
	stories.forEach(story => groups[groupOf(story)].push(story));

	const panes = document.querySelectorAll("#news-panel .news-slot");
	panes.forEach((paneEl, i) => setPane(paneEl, NEWS_GROUPS[i], groups[i] || []));
}

// ===== INITIALIZATION =====

// Update clock and date every second
setInterval(() => {
	updateclock();
	updatedate();
}, CONFIG.CLOCK_UPDATE_INTERVAL);

// Initial load
loadWeather();
loadNews();

// Reload weather and news every hour
setInterval(() => {
	loadWeather();
	loadNews();
}, CONFIG.UPDATE_INTERVAL);

// Fix broken charts every minute
setInterval(() => {
	if (previousChart) {
		previousChart.update();
	}
}, CONFIG.CHART_UPDATE_INTERVAL);
