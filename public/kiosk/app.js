// ===== CONFIGURATION =====
// All data (weather/news/events/facts/quotes/jokes) is fetched hourly by
// server1 and published here as static JSON - this page has no API keys
// and makes no third-party calls except the cat image.
const CONFIG = {
	UPDATE_INTERVAL: 3600 * 1000, // 1 hour
	CLOCK_UPDATE_INTERVAL: 1000,  // 1 second
	CHART_UPDATE_INTERVAL: 60 * 1000, // 1 minute
	MARQUEE_SCROLL_SPEED: '2.5'
};

// ===== UTILITY FUNCTIONS =====

// Temperature conversion utilities
function ctof(c) {
	return (c * 9 / 5 + 32).toFixed(0);
}

function ktof(k) {
	return ((k - 273.15) * 1.8 + 32);
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

		// Update sunrise/sunset times
		updateSunTimes(json.current);

		// Create weather chart
		createWeatherChart(json);
	});
}

function updateCurrentWeather(current) {
	let str = "<span id='temp' style='line-height: 100%;'>" + (ktof(current.feels_like).toFixed(0) | 0) + "F</span>";
	const dew_point = ktof(current.dew_point).toFixed(0);
	str += "<div class='dew-point " + dewPointClass(dew_point) + "'>Dew Pt: " + dew_point + "F</div>";
	str += "<div class='wind-speed'>Wind: " + Math.floor(current.wind_speed / 0.621371192) + " mph</div>";
	document.getElementById("weather").innerHTML = str;
}

function updateWeatherNotes(daily) {
	const today = daily[0];
	const tomorrow = daily[1];

	let title = "Today";
	if (today.summary === tomorrow.summary) {
		title += " and Tomorrow";
	}
	let weatherNote = "<h2>" + title + "</h2><p>" + today.summary + "</p>";

	// Tomorrow's weather (if different)
	if (today.summary !== tomorrow.summary) {
		weatherNote += "<h2>Tomorrow</h2><p>" + tomorrow.summary + "</p>";
	}
	document.getElementById("weather-note").innerHTML = weatherNote;
}

function updateSunTimes(current) {
	setTimeString("sunrise", current.sunrise);
	setTimeString("sunset", current.sunset);
	setTimeString("noon", (current.sunrise + current.sunset) / 2);
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
					data: json.hourly.map(h => h.wind_gust ? Math.floor(h.wind_gust / 0.621371192) : 0),
					backgroundColor: "orange",
					borderColor: "orange",
					yAxisID: 'yWind',
					pointRadius: 1,
				},

				// wind speed
				{
					type: 'line',
					label: 'Wind Speed',
					data: json.hourly.map(h => Math.floor(h.wind_speed / 0.621371192)),
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
						font: { size: 15 }
					},
					ticks: {
						font: { size: 15 },
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
						font: { size: 15 }
					},
					ticks: {
						font: { size: 18 },
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
						font: { size: 15 }
					},
					ticks: {
						font: { size: 15 },
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
			ctx.fillStyle = "#666";
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
				ctx.strokeStyle = 'white';
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
				ctx.font = "18px sans-serif";
				ctx.fillStyle = "white";
				ctx.fillText(" " + date.toLocaleDateString('en-us', { day: "numeric", weekday: "long" }), x1, top + 15);

				ctx.beginPath();
				ctx.moveTo(x1, top);
				ctx.strokeStyle = 'white';
				ctx.lineWidth = 1;
				ctx.lineTo(x1, top + height);
				ctx.stroke();
			}

			// Draw "now" line
			const x = map_number(new Date().getTime() / 1000, dtBegin, dtEnd, left, right);
			ctx.beginPath();
			ctx.moveTo(x, top);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 3;
			ctx.lineTo(x, top + height);
			ctx.stroke();

			ctx.restore();
		}
	};
}

// ===== MARQUEE/NEWS FUNCTIONS =====

async function loadMarquee() {
	// Random cat image (no API key needed)
	let marquee = `<img style="width: 100%" src="https://cataas.com/cat"><hr>`;

	// Everything else (weather alerts/events/news/trivia) is gathered hourly
	// on server1 and turned into a ready-to-show HTML roll-up by a local
	// Ollama model - this page just displays it as-is.
	marquee += await fetch("rollup.html").then(res => res.text());

	// Display marquee
	document.getElementById("marquee").innerHTML = `
		<marquee direction="up" scrollamount="${CONFIG.MARQUEE_SCROLL_SPEED}">
			${marquee}
		</marquee>
	`;
}

// ===== INITIALIZATION =====

// Update clock and date every second
setInterval(() => {
	updateclock();
	updatedate();
}, CONFIG.CLOCK_UPDATE_INTERVAL);

// Initial load
loadWeather();
loadMarquee();

// Reload weather and marquee every hour
setInterval(() => {
	loadWeather();
	loadMarquee();
}, CONFIG.UPDATE_INTERVAL);

// Fix broken charts every minute
setInterval(() => {
	if (previousChart) {
		previousChart.update();
	}
}, CONFIG.CHART_UPDATE_INTERVAL);
