document.addEventListener("DOMContentLoaded", function () {
    // 手機側邊欄收合
    const menuBtn = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    // 上方分頁切換（總覽 / 共享租借 / 商業智慧分析）
    const tabBtns = document.querySelectorAll(".tab-btn");
    const views = document.querySelectorAll(".view");

    if (tabBtns.length && views.length) {
        tabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const target = btn.getAttribute("data-view");
                // 按鈕樣式
                tabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                // 內容切換
                views.forEach(v => {
                    if (v.id === "view-" + target) {
                        v.classList.add("active");
                    } else {
                        v.classList.remove("active");
                    }
                });
            });
        });
    }

    // 病患詳細頁圖表
    if (document.getElementById("hrChart")) {
        initPatientCharts();
    }

    // 商業智慧分析頁圖表
    if (document.getElementById("biEventTrend")) {
        initBiCharts();
    }
});

// 病患詳細頁圖表
function initPatientCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#999" }
            },
            y: {
                grid: { borderDash: [5, 5], color: "#eee" },
                ticks: { color: "#999" }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: "index",
                intersect: false
            }
        },
        elements: {
            point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
            line: { tension: 0.4 }
        }
    };

    const labels = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - (30 - i));
        return d.getHours() + ":" + d.getMinutes().toString().padStart(2, "0");
    });

    // HR
    const ctxHR = document.getElementById("hrChart").getContext("2d");
    new Chart(ctxHR, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Heart Rate (bpm)",
                data: generateRandomData(30, 85, 100),
                borderColor: "#ef5350",
                backgroundColor: "rgba(239, 83, 80, 0.1)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: commonOptions
    });

    // SpO2
    const ctxSpO2 = document.getElementById("spo2Chart").getContext("2d");
    new Chart(ctxSpO2, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "SpO₂ (%)",
                data: generateRandomData(30, 88, 94),
                borderColor: "#039be5",
                backgroundColor: "rgba(3, 155, 229, 0.1)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: { min: 80, max: 100, grid: { borderDash: [5, 5], color: "#eee" }, ticks: { color: "#999" } }
            }
        }
    });

    // RR
    const ctxRR = document.getElementById("rrChart").getContext("2d");
    new Chart(ctxRR, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Resp Rate (bpm)",
                data: generateRandomData(30, 18, 28),
                borderColor: "#43a047",
                backgroundColor: "rgba(67, 160, 71, 0.1)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: commonOptions
    });
}

// 商業智慧分析頁圖表
function initBiCharts() {
    // X 軸用最近 8 週
    const weeks = ["W-1", "W-2", "W-3", "W-4", "W-5", "W-6", "W-7", "W-8"];

    // 低血氧事件趨勢（線圖）
    const ctxEvent = document.getElementById("biEventTrend").getContext("2d");
    new Chart(ctxEvent, {
        type: "line",
        data: {
            labels: weeks,
            datasets: [{
                label: "低血氧事件次數",
                data: [22, 19, 18, 16, 15, 14, 13, 12],
                borderColor: "#ef5350",
                backgroundColor: "rgba(239, 83, 80, 0.15)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, ticks: { color: "#999" } },
                y: { grid: { borderDash: [5, 5], color: "#eee" }, ticks: { color: "#999" } }
            },
            plugins: { legend: { display: false } },
            elements: {
                point: { radius: 3 },
                line: { tension: 0.35 }
            }
        }
    });

    // 各設備貢獻再入院率下降（雷達圖）
    const ctxRadar = document.getElementById("biDeviceRadar").getContext("2d");
    new Chart(ctxRadar, {
        type: "radar",
        data: {
            labels: ["家用製氧機", "SpO₂ 手環", "Capnography", "肺量計", "睡眠監測器"],
            datasets: [{
                label: "再入院率下降指標",
                data: [85, 70, 60, 55, 65],
                borderColor: "#1976d2",
                backgroundColor: "rgba(25, 118, 210, 0.2)",
                borderWidth: 2,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: "#eee" },
                    grid: { color: "#eee" },
                    ticks: { display: false },
                    pointLabels: { color: "#555", font: { size: 11 } },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    // 逾期歸還比例（線圖）
    const ctxOverdue = document.getElementById("biOverdueLine").getContext("2d");
    new Chart(ctxOverdue, {
        type: "line",
        data: {
            labels: weeks,
            datasets: [{
                label: "逾期歸還比例(%)",
                data: [18, 17, 15, 14, 13, 11, 10, 9],
                borderColor: "#ff9800",
                backgroundColor: "rgba(255, 152, 0, 0.15)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, ticks: { color: "#999" } },
                y: { grid: { borderDash: [5, 5], color: "#eee" }, ticks: { color: "#999" } }
            },
            plugins: { legend: { display: false } },
            elements: { point: { radius: 3 }, line: { tension: 0.35 } }
        }
    });
}

// 產生隨機整數陣列
function generateRandomData(count, min, max) {
    return Array.from({ length: count }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}
