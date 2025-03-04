function openNav() {
    document.getElementById("mySidebar").style.width = "170px";
    document.getElementById("main").style.marginLeft = "170px";
    document.getElementById("open-button").style.visibility = "hidden";
   
}

  
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("open-button").style.visibility = "visible";
    
}

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("investmentChart").getContext("2d");

    let investmentChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: generateLabels("1Y"),
            datasets: [{
                label: "Portfolio Value",
                data: generateData("1Y"),
                borderColor: "blue",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: false }
            }
        }
    });

    function generateLabels(timeframe) {
        const now = new Date();
        let labels = [];

        if (timeframe === "1D") {
            for (let i = 0; i < 24; i++) labels.push(`${i}:00`);
        } else if (timeframe === "1M") {
            for (let i = 30; i >= 0; i--) {
                let d = new Date();
                d.setDate(now.getDate() - i);
                labels.push(d.toLocaleDateString());
            }
        } else if (timeframe === "6M") {
            for (let i = 5; i >= 0; i--) {
                let d = new Date();
                d.setMonth(now.getMonth() - i);
                labels.push(d.toLocaleString("default", { month: "short" }));
            }
        } else if (timeframe === "1Y") {
            for (let i = 11; i >= 0; i--) {
                let d = new Date();
                d.setMonth(now.getMonth() - i);
                labels.push(d.toLocaleString("default", { month: "short" }));
            }
        }

        return labels;
    }

    function generateData(timeframe) {
        if (timeframe === "1D") return Array(24).fill().map(() => Math.floor(Math.random() * 200) + 100);
        if (timeframe === "1M") return Array(31).fill().map(() => Math.floor(Math.random() * 200) + 100);
        if (timeframe === "6M") return Array(6).fill().map(() => Math.floor(Math.random() * 200) + 100);
        if (timeframe === "1Y") return Array(12).fill().map(() => Math.floor(Math.random() * 200) + 100);
    }

    function updateChart(timeframe) {
        investmentChart.data.labels = generateLabels(timeframe);
        investmentChart.data.datasets[0].data = generateData(timeframe);
        investmentChart.update();
    }

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            updateChart(this.getAttribute("data-timeframe"));
        });
    });
});


    document.addEventListener("DOMContentLoaded", function() {
        const ctx = document.getElementById('revenueChart');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2016', '2017', '2018', '2019', '2020', '2021'],
                datasets: [{
                    label: 'Revenue',
                    data: [8008, 12000, 18000, 25000, 21000, 34000],
                    borderColor: '#00c2ff',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointRadius: 0, /* Hide Data Points */
                    tension: 0.4 /* Smooth Curve */
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                }
            }
        });
    });


    document.addEventListener("DOMContentLoaded", function() {
        const ctx = document.getElementById('totalinvestmentChart');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2016', '2017', '2018', '2019', '2020', '2021'],
                datasets: [{
                    label: 'Total Investment',
                    data: [5000, 20000, 15000, 35000, 18000, 25000],
                    borderColor: '#FFA500', // Orange Line
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#FFA500',
                    pointBorderColor: '#ffffff',
                    pointHoverRadius: 7,
                    tension: 0 
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                }
            }
        });
    });
    
    