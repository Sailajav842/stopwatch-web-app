// Stopwatch Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let running = false;
let laps = [];

// Elements
const display = document.getElementById("display");
const lapContainer = document.getElementById("laps");
const lapCount = document.getElementById("lapCount");
const fastLap = document.getElementById("fastLap");
const slowLap = document.getElementById("slowLap");

// =========================
// LIVE CLOCK
// =========================

function updateLiveClock() {
    const now = new Date();

    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    document.getElementById("liveClock").textContent =
        now.toLocaleString("en-US", options);
}

setInterval(updateLiveClock, 1000);
updateLiveClock();

// =========================
// FORMAT TIME
// =========================

function formatTime(time) {

    const hours = Math.floor(time / 3600000);

    const minutes = Math.floor(
        (time % 3600000) / 60000
    );

    const seconds = Math.floor(
        (time % 60000) / 1000
    );

    const milliseconds = time % 1000;

    return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        milliseconds: String(milliseconds).padStart(3, "0")
    };
}

// =========================
// UPDATE DISPLAY
// =========================

function updateDisplay() {

    const currentTime =
        Date.now() - startTime + elapsedTime;

    const t = formatTime(currentTime);

    display.innerHTML = `
        ${t.hours}:${t.minutes}:${t.seconds}
        <span class="ms">.${t.milliseconds}</span>
    `;
}

// =========================
// START
// =========================

function startStopwatch() {

    if (running) return;

    startTime = Date.now();

    timerInterval = setInterval(
        updateDisplay,
        10
    );

    running = true;
}

// =========================
// PAUSE
// =========================

function pauseStopwatch() {

    if (!running) return;

    elapsedTime += Date.now() - startTime;

    clearInterval(timerInterval);

    running = false;
}

// =========================
// RESET
// =========================

function resetStopwatch() {

    clearInterval(timerInterval);

    running = false;

    startTime = 0;
    elapsedTime = 0;
    laps = [];

    display.innerHTML =
        `00:00:00 <span class="ms">.000</span>`;

    lapContainer.innerHTML = "";

    lapCount.textContent = "0";
    fastLap.textContent = "--";
    slowLap.textContent = "--";
}

// =========================
// RECORD LAP
// =========================

function recordLap() {

    if (!running) return;

    const lapTime =
        Date.now() - startTime + elapsedTime;

    laps.push(lapTime);

    updateLapList();
}

// =========================
// FORMAT LAP
// =========================

function formatLap(ms) {

    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const milli = ms % 1000;

    return (
        String(h).padStart(2, "0") + ":" +
        String(m).padStart(2, "0") + ":" +
        String(s).padStart(2, "0") + "." +
        String(milli).padStart(3, "0")
    );
}

// =========================
// UPDATE LAPS
// =========================

function updateLapList() {

    lapContainer.innerHTML = "";

    const fastest = Math.min(...laps);
    const slowest = Math.max(...laps);

    laps.forEach((lap, index) => {

        const lapDiv =
            document.createElement("div");

        let lapClass = "lap-item";

        if (lap === fastest) {
            lapClass += " fastest";
        }

        if (lap === slowest) {
            lapClass += " slowest";
        }

        lapDiv.className = lapClass;

        lapDiv.innerHTML = `
            <span>Lap ${index + 1}</span>
            <span>${formatLap(lap)}</span>
        `;

        lapContainer.prepend(lapDiv);
    });

    lapCount.textContent = laps.length;

    if (laps.length > 0) {

        fastLap.textContent =
            formatLap(fastest);

        slowLap.textContent =
            formatLap(slowest);
    }
}

// =========================
// KEYBOARD SHORTCUTS
// =========================

document.addEventListener(
    "keydown",
    function (event) {

        switch (event.key.toLowerCase()) {

            case "s":
                startStopwatch();
                break;

            case "p":
                pauseStopwatch();
                break;

            case "l":
                recordLap();
                break;

            case "r":
                resetStopwatch();
                break;
        }
    }
);

// =========================
// SMOOTH NAVIGATION
// =========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e) {

        e.preventDefault();

        const target =
            document.querySelector(
                this.getAttribute("href")
            );

        if (target) {

            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });

});

// =========================
// NAVBAR SCROLL EFFECT
// =========================

window.addEventListener("scroll", () => {

    const navbar =
        document.querySelector(".navbar");

    if (window.scrollY > 50) {

        navbar.style.background =
            "rgba(15,23,42,0.98)";

        navbar.style.boxShadow =
            "0 5px 25px rgba(0,0,0,.3)";
    }
    else {

        navbar.style.background =
            "rgba(15,23,42,0.9)";

        navbar.style.boxShadow = "none";
    }

});