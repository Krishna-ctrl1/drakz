// Enhanced Active Users Chart with trend indicators and data labels
const activeUsersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
        {
            label: 'India',
            data: [65, 45, 50, 85, 60, 75, 70],
            backgroundColor: '#4285F4',
            barPercentage: 0.6,
            categoryPercentage: 0.5
        },
        {
            label: 'Russia',
            data: [85, 75, 60, 55, 75, 50, 80],
            backgroundColor: '#DB4437',
            barPercentage: 0.6,
            categoryPercentage: 0.5
        }
    ]
};

// Calculate trends for active users
const calculateTrends = (data) => {
    const trends = {};
    data.datasets.forEach(dataset => {
        const lastTwoMonths = dataset.data.slice(-2);
        const difference = lastTwoMonths[1] - lastTwoMonths[0];
        const percentChange = ((difference / lastTwoMonths[0]) * 100).toFixed(1);
        trends[dataset.label] = {
            difference,
            percentChange,
            isPositive: difference >= 0
        };
    });
    return trends;
};

// Enhanced Web Popularity Chart with detailed percentages
const webPopularityData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
        data: [1245, 1743, 1000],
        backgroundColor: ['#FF6B6B', '#4285F4', '#4BD4B0'],
        borderWidth: 0,
        cutout: '70%'
    }]
};

// Calculate percentages for web popularity
const calculateWebPercentages = (data) => {
    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
    return data.datasets[0].data.map((value, index) => {
        return {
            label: data.labels[index],
            value,
            percentage: ((value / total) * 100).toFixed(1)
        };
    });
};

// Enhanced Income Chart with detailed percentages
const incomeData = {
    labels: ['Banks', 'Retail Points', 'Advisor', 'Admin'],
    datasets: [{
        data: [35, 25, 15, 25],
        backgroundColor: ['#45B7D1', '#FF6B6B', '#A3A0FB', '#FF9F40'],
        borderWidth: 0
    }]
};

// Enhanced Revenue Chart with month-over-month analysis
const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
        label: 'Revenue',
        data: [230, 250, 320, 220, 240],
        backgroundColor: (context) => {
            return context.dataIndex === 2 ? '#4285F4' : '#E0E0E0';
        },
        borderWidth: 0,
        borderRadius: 5,
        barPercentage: 0.5,
        categoryPercentage: 0.7
    }]
};

// Calculate MoM changes for revenue
const calculateRevenueChanges = (data) => {
    const monthlyData = data.datasets[0].data;
    return monthlyData.map((value, index) => {
        if (index === 0) return { label: data.labels[index], value, change: 0, changePercent: '0.0' };
        const previousValue = monthlyData[index - 1];
        const change = value - previousValue;
        const changePercent = ((change / previousValue) * 100).toFixed(1);
        return {
            label: data.labels[index],
            value,
            change,
            changePercent,
            isPositive: change >= 0
        };
    });
};

// Initialize charts when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Make sure all chart canvases are properly created
    ['activeUsersChart', 'webPopularityChart', 'incomeChart', 'revenueChart'].forEach(chartId => {
        const container = document.getElementById(chartId);
        // Clear the container first
        container.innerHTML = '';
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.id = chartId + 'Canvas';
        container.appendChild(canvas);
    });

    // Create summary containers for additional textual data
    const createSummaryContainer = (chartId) => {
        const container = document.getElementById(chartId);
        let summaryContainer = container.querySelector('.chart-summary');
        if (!summaryContainer) {
            summaryContainer = document.createElement('div');
            summaryContainer.className = 'chart-summary';
            container.appendChild(summaryContainer);
        }
        return summaryContainer;
    };

    // Active Users Chart with enhanced data
    const activeUsersCtx = document.getElementById('activeUsersChartCanvas').getContext('2d');
    const activeUsersChart = new Chart(activeUsersCtx, {
        type: 'bar',
        data: activeUsersData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value} (${value > 70 ? 'High' : value > 50 ? 'Medium' : 'Low'} activity)`;
                        }
                    }
                },
                // Add data labels plugin
                datalabels: {
                    display: true,
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 10
                    },
                    formatter: (value) => value
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [3, 3]
                    },
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });

    // Add Active Users trend summary
    const activeUsersTrends = calculateTrends(activeUsersData);
    const activeUsersSummary = createSummaryContainer('activeUsersChart');
    activeUsersSummary.innerHTML = `
        <div class="trend-summary">
            <div class="trend-item">
                <span class="trend-label">India:</span>
                <span class="trend-value ${activeUsersTrends.India.isPositive ? 'positive' : 'negative'}">
                    ${activeUsersTrends.India.isPositive ? '↑' : '↓'} ${Math.abs(activeUsersTrends.India.percentChange)}%
                </span>
            </div>
            <div class="trend-item">
                <span class="trend-label">Russia:</span>
                <span class="trend-value ${activeUsersTrends.Russia.isPositive ? 'positive' : 'negative'}">
                    ${activeUsersTrends.Russia.isPositive ? '↑' : '↓'} ${Math.abs(activeUsersTrends.Russia.percentChange)}%
                </span>
            </div>
            <div class="trend-summary-text">Last 30 days change</div>
        </div>
    `;

    // Web Popularity Chart (Doughnut Chart) with enhanced data
    const webPopularityCtx = document.getElementById('webPopularityChartCanvas').getContext('2d');
    const webPopularityChart = new Chart(webPopularityCtx, {
        type: 'doughnut',
        data: webPopularityData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });

    // Add Web Popularity details
    const webPercentages = calculateWebPercentages(webPopularityData);
    const webPopularitySummary = createSummaryContainer('webPopularityChart');
    webPopularitySummary.innerHTML = `
        <div class="percentage-breakdown">
            ${webPercentages.map(item => `
                <div class="percentage-item">
                    <span class="percentage-label">${item.label}:</span>
                    <span class="percentage-value">${item.percentage}%</span>
                    <span class="absolute-value">(${item.value})</span>
                </div>
            `).join('')}
        </div>
    `;

    // Income Chart (Pie Chart) with enhanced data
    const incomeCtx = document.getElementById('incomeChartCanvas').getContext('2d');
    const incomeChart = new Chart(incomeCtx, {
        type: 'pie',
        data: incomeData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        padding: 15,
                        font: {
                            size: 12
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function(label, i) {
                                    const meta = chart.getDatasetMeta(0);
                                    const ds = data.datasets[0];
                                    const value = ds.data[i];
                                    const total = ds.data.reduce((sum, val) => sum + val, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    
                                    return {
                                        text: `${label}: ${value}% (${percentage}%)`,
                                        fillStyle: ds.backgroundColor[i],
                                        hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value}% (${percentage}% of total)`;
                        }
                    }
                }
            }
        }
    });

    // Add Income chart quarterly projection
    const incomeSummary = createSummaryContainer('incomeChart');
    incomeSummary.innerHTML = `
        <div class="income-projection">
            <div class="projection-title">Quarterly Projection</div>
            <div class="projection-row">
                <span class="projection-label">Q1 2025:</span>
                <span class="projection-value">+5.2%</span>
            </div>
            <div class="projection-row">
                <span class="projection-label">Q2 2025:</span>
                <span class="projection-value">+7.8%</span>
            </div>
        </div>
    `;

    // Revenue Chart with enhanced data
    const revenueCtx = document.getElementById('revenueChartCanvas').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: revenueData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const value = context.raw;
                            const prevValue = index > 0 ? context.dataset.data[index - 1] : null;
                            
                            if (prevValue === null) return `Revenue: $${value}K`;
                            
                            const change = value - prevValue;
                            const changePercent = ((change / prevValue) * 100).toFixed(1);
                            const changeDir = change >= 0 ? '▲' : '▼';
                            
                            return [
                                `Revenue: $${value}K`,
                                `MoM Change: ${changeDir} ${Math.abs(changePercent)}%`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [3, 3]
                    },
                    ticks: {
                        stepSize: 100,
                        callback: function(value) {
                            return '$' + value + 'K';
                        }
                    }
                }
            }
        }
    });

    // Add Revenue month-over-month analysis
    const revenueChanges = calculateRevenueChanges(revenueData);
    const revenueSummary = createSummaryContainer('revenueChart');
    revenueSummary.innerHTML = `
        <div class="revenue-mom-analysis">
            <div class="analysis-title">Month-over-Month Analysis</div>
            <div class="analysis-content">
                ${revenueChanges.filter(item => item.label !== 'Jan').map(item => `
                    <div class="analysis-item">
                        <span class="month-label">${item.label}:</span>
                        <span class="change-value ${item.isPositive ? 'positive' : 'negative'}">
                            ${item.isPositive ? '↑' : '↓'} ${Math.abs(item.changePercent)}%
                        </span>
                        <span class="absolute-change">(${item.isPositive ? '+' : ''}${item.change}K)</span>
                    </div>
                `).join('')}
            </div>
            <div class="highlight-month">
                <span class="highlight-label">Highest Growth:</span>
                <span class="highlight-value">Mar (+28.0%)</span>
            </div>
        </div>
    `;

    // Create India Map visualization with enhanced information
    setTimeout(() => {
        createIndiaMap();
    }, 100);
    
    // Add event listeners for detail buttons
    document.getElementById('revenueDetails').addEventListener('click', function() {
        // Show revenue details modal
        document.getElementById('detailsModal').style.display = 'block';
        populateRevenueDetails();
    });
    
    document.getElementById('closeDetailsModal').addEventListener('click', function() {
        document.getElementById('detailsModal').style.display = 'none';
    });
});

// Enhanced function to create India Map with improved tooltips and data
function createIndiaMap() {
    const width = document.getElementById('indiaMapChart').clientWidth;
    const height = document.getElementById('indiaMapChart').clientHeight;
    
    // Enhanced color scale for the map with more visual variation
    const colorScale = d3.scaleSequential(d3.interpolateGreens)
        .domain([0, 100]);

    // Create SVG
    // const svg = d3.select('#indiaMapChart')
    //     .append('svg')
    //     .attr('width', width)
    //     .attr('height', height)
    //     .append('g')
    //     .attr('transform', `translate(${width/8}, ${height/15})`);

    // // Create enhanced tooltip with more data
    // const tooltip = d3.select('#indiaMapChart')
    //     .append('div')
    //     .attr('class', 'tooltip')
    //     .style('position', 'absolute')
    //     .style('background', 'white')
    //     .style('padding', '10px')
    //     .style('border-radius', '5px')
    //     .style('box-shadow', '0 0 10px rgba(0, 0, 0, 0)')
    //     .style('pointer-events', 'none')
    //     .style('opacity', 0);

    // Add legend with more detailed information
    // const legend = d3.select('#indiaMapChart')
    //     .append('div')
    //     .attr('class', 'map-legend')
    //     .style('padding', '10px')
    //     .style('background', 'white')
    //     .style('border-radius', '5px')
    //     .style('box-shadow', '0 0 5px rgba(0, 0, 0, 0)')
    //     .style('position', 'absolute')
    //     .style('top', '10px')
    //     .style('right', '10px');

    const legendItems = [
        { color: colorScale(20), text: 'Low (0-33%)', description: 'Developing engagement' },
        { color: colorScale(50), text: 'Medium (34-66%)', description: 'Growing engagement' },
        { color: colorScale(80), text: 'High (67-100%)', description: 'Strong engagement' }
    ];

    legendItems.forEach(item => {
        const legendItem = legend.append('div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin-bottom', '8px');
        
        legendItem.append('div')
            .style('width', '12px')
            .style('height', '12px')
            .style('background', item.color)
            .style('margin-right', '5px');
        
        const textContainer = legendItem.append('div')
            .style('display', 'flex')
            .style('flex-direction', 'column');
            
        textContainer.append('span')
            .text(item.text)
            .style('font-size', '12px')
            .style('font-weight', 'bold');
            
        textContainer.append('span')
            .text(item.description)
            .style('font-size', '10px')
            .style('color', '#666');
    });

    // Add summary container for India map
    const mapSummaryContainer = d3.select('#indiaMapChart')
        .append('div')
        .attr('class', 'map-summary')
        .style('position', 'absolute')
        .style('bottom', '10px')
        .style('left', '10px')
        .style('background', 'rgba(255, 255, 255, 0)')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('box-shadow', '0 0 5px rgba(0, 0, 0, 0)');
    
    // Calculate state statistics
    const highActivityStates = indiaStatesData.filter(s => s.value >= 67).length;
    const mediumActivityStates = indiaStatesData.filter(s => s.value >= 34 && s.value < 67).length;
    const lowActivityStates = indiaStatesData.filter(s => s.value < 34).length;
    
    mapSummaryContainer.html(`
        <div style="font-weight:bold;margin-bottom:5px;">India Activity Overview</div>
        <div>High activity: ${highActivityStates} states</div>
        <div>Medium activity: ${mediumActivityStates} states</div>
        <div>Low activity: ${lowActivityStates} states</div>
        <div style="margin-top:5px;font-size:11px;color:#666;">Last updated: May 5, 2025</div>
    `);

    // Load actual India GeoJSON data from a string
    // This is a simplified GeoJSON representation of India for demonstration
    const indiaGeoJSON = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": { "name": "Maharashtra" },
                "geometry": { "type": "Polygon", "coordinates": [[[73.4, 16.8], [80.2, 17.5], [80.8, 21.2], [73.6, 21.5], [73.4, 16.8]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Gujarat" },
                "geometry": { "type": "Polygon", "coordinates": [[[68.1, 20.1], [73.6, 21.5], [73.4, 24.7], [69.7, 24.4], [68.1, 20.1]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Rajasthan" },
                "geometry": { "type": "Polygon", "coordinates": [[[69.7, 24.4], [73.4, 24.7], [77.2, 27.3], [77.5, 30.3], [70.2, 30.1], [69.7, 24.4]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Madhya Pradesh" },
                "geometry": { "type": "Polygon", "coordinates": [[[73.4, 21.8], [80.8, 21.2], [83.0, 24.5], [77.2, 26.5], [73.4, 24.7], [73.4, 21.8]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Uttar Pradesh" },
                "geometry": { "type": "Polygon", "coordinates": [[[77.2, 26.5], [83.0, 24.5], [87.8, 26.3], [84.5, 29.8], [77.5, 30.3], [77.2, 26.5]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Bihar" },
                "geometry": { "type": "Polygon", "coordinates": [[[83.0, 24.5], [88.1, 24.7], [87.8, 26.3], [83.0, 26.5], [83.0, 24.5]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "West Bengal" },
                "geometry": { "type": "Polygon", "coordinates": [[[87.8, 26.3], [88.1, 24.7], [89.5, 21.8], [87.4, 21.7], [86.5, 24.4], [87.8, 26.3]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Karnataka" },
                "geometry": { "type": "Polygon", "coordinates": [[[73.4, 16.8], [78.4, 16.5], [78.5, 12.3], [74.5, 12.5], [73.4, 16.8]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Tamil Nadu" },
                "geometry": { "type": "Polygon", "coordinates": [[[77.0, 13.0], [80.3, 13.5], [80.2, 10.2], [77.0, 8.1], [77.0, 13.0]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Kerala" },
                "geometry": { "type": "Polygon", "coordinates": [[[74.5, 12.5], [77.0, 13.0], [77.0, 8.1], [74.8, 8.3], [74.5, 12.5]]] }
            },
            {
                "type": "Feature",
                "properties": { "name": "Andhra Pradesh" },
                "geometry": { "type": "Polygon", "coordinates": [[[77.3, 17.0], [78.4, 16.5], [80.3, 13.5], [83.0, 18.3], [80.2, 21.0], [77.3, 17.0]]] }
            }
        ]
    };
    
    // Create the projection
    const projection = d3.geoMercator()
        .center([80, 22])
        .scale(width * 1.3)
        .translate([width / 3, height / 2]);

    const path = d3.geoPath().projection(projection);
    
    // Get the current date for displaying in tooltip
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

    // Draw the map using GeoJSON with enhanced tooltips
    svg.selectAll("path")
        .data(indiaGeoJSON.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function(d) {
            const stateName = d.properties.name;
            const stateData = indiaStatesData.find(s => s.state === stateName) || 
                { value: Math.floor(Math.random() * 100) };
            return colorScale(stateData.value);
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
            const stateName = d.properties.name;
            const stateData = indiaStatesData.find(s => s.state === stateName) || 
                { value: Math.floor(Math.random() * 100) };
            
            // Generate growth trend and status based on value
            const growthTrend = stateData.value > 75 ? 'Growing rapidly' : 
                               stateData.value > 50 ? 'Steady growth' : 
                               stateData.value > 25 ? 'Slow growth' : 'Needs attention';
            
            const userCount = Math.round(stateData.value * 217); // Simulated user count based on percentage
            const growthPercent = ((Math.sin(stateData.value) + 1) * 10).toFixed(1); // Generate a pseudo-random growth percentage
            
            d3.select(this)
                .attr("stroke-width", 2)
                .attr("stroke", "#333");
            
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            
            tooltip.html(`
                <div style="font-weight: bold; margin-bottom: 5px;">${stateName}</div>
                <div>Activity Score: <span style="font-weight: bold;">${stateData.value}%</span></div>
                <div>Active Users: <span style="font-weight: bold;">${userCount.toLocaleString()}</span></div>
                <div>Growth: <span style="color: ${growthPercent > 5 ? 'green' : 'red'}">${growthPercent > 0 ? '+' : ''}${growthPercent}%</span></div>
                <div>Status: <span style="font-style: italic;">${growthTrend}</span></div>
                <div style="font-size: 10px; margin-top: 5px; color: #666;">Updated: ${formattedDate}</div>
            `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("stroke-width", 1)
                .attr("stroke", "#fff");
            
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add text labels for states with enhanced styling
    svg.selectAll("text")
        .data(indiaGeoJSON.features)
        .enter()
        .append("text")
        .attr("transform", function(d) {
            // Find centroid of each state
            const centroid = path.centroid(d);
            return `translate(${centroid[0]}, ${centroid[1]})`;
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "8px")
        .attr("font-weight", "bold")
        .attr("fill", function(d) {
            const stateName = d.properties.name;
            const stateData = indiaStatesData.find(s => s.state === stateName) || 
                { value: Math.floor(Math.random() * 100) };
            // Use white text for darker states, black for lighter states
            return stateData.value > 50 ? "#fff" : "#333";
        })
        .text(function(d) {
            return d.properties.name;
        });
}

// Function to populate revenue details in the modal
function populateRevenueDetails() {
    const revenueDetailsData = [
        { date: 'Jan 2025', income: '$325,000', expenses: '$202,500', profit: '$122,500', growth: '+4.2%' },
        { date: 'Feb 2025', income: '$342,500', expenses: '$215,000', profit: '$127,500', growth: '+5.4%' },
        { date: 'Mar 2025', income: '$437,000', expenses: '$265,000', profit: '$172,000', growth: '+28.0%' },
        { date: 'Apr 2025', income: '$304,000', expenses: '$210,000', profit: '$94,000', growth: '-31.2%' },
        { date: 'May 2025', income: '$331,500', expenses: '$218,000', profit: '$113,500', growth: '+11.5%' }
    ];
    
    const tableBody = document.getElementById('revenueDetailsTable');
    tableBody.innerHTML = '';
    
    revenueDetailsData.forEach(item => {
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.textContent = item.date;
        row.appendChild(dateCell);
        
        const incomeCell = document.createElement('td');
        incomeCell.textContent = item.income;
        row.appendChild(incomeCell);
        
        const expensesCell = document.createElement('td');
        expensesCell.textContent = item.expenses;
        row.appendChild(expensesCell);
        
        const profitCell = document.createElement('td');
        profitCell.textContent = item.profit;
        row.appendChild(profitCell);
        
        const growthCell = document.createElement('td');
        growthCell.textContent = item.growth;
        growthCell.style.color = item.growth.includes('+') ? 'green' : 'red';
        growthCell.style.fontWeight = 'bold';
        row.appendChild(growthCell);
        
        tableBody.appendChild(row);
    });
    
    // Add enhanced quarterly trends to the modal
    const totalRevenue = document.getElementById('totalRevenue');
    totalRevenue.innerHTML = '$1,740,000 <span style="font-size: 12px; color: green;">+8.2% YoY</span>';
    
    const averageGrowth = document.getElementById('averageGrowth');
    averageGrowth.innerHTML = '+3.6% <span style="font-size: 12px; color: #666;">vs +2.1% Q1</span>';
}

// Add CSS styles for the new dynamic content
document.addEventListener('DOMContentLoaded', function() {
    const styles = `
        .chart-summary {
            padding: 10px;
            margin-top: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
            font-size: 12px;
        }
        
        .trend-summary {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .trend-item {
            display: flex;
            justify-content: space-between;
        }
        
        .trend-label {
            font-weight: bold;
        }
        
        .trend-value {
            font-weight: bold;
        }
        
        .positive {
            color: #4CAF50;
        }
        
        .negative {
            color: #F44336;
        }
        
        .trend-summary-text {
            font-style: italic;
            color: #666;
            margin-top: 5px;
            font-size: 11px;
        }
        
        .percentage-breakdown {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .percentage-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .percentage-label {
            font-weight: bold;
            min-width: 60px;
        }
        
        .percentage-value {
            color: #333;
            font-weight: bold;
        }
        
        .absolute-value {
            color: #666;
            font-size: 11px;
        }
        
        .income-projection {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .projection-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .projection-row {
            display: flex;
            justify-content: space-between;
        }
        
        .projection-value {
            color: #4CAF50;
            font-weight: bold;
        }
        
        .revenue-mom-analysis {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .analysis-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .analysis-content {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .analysis-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .month-label {
            font-weight: bold;
            min-width: 35px;
        }
        
        .change-value {
            font-weight: bold;
        }
        
        .absolute-change {
            color: #666;
            font-size: 11px;
        }
        
        .highlight-month {
            margin-top: 8px;
            padding-top: 5px;
            border-top: 1px dashed #ddd;
        }
        
        .highlight-label {
            font-weight: bold;
        }
        
        .highlight-value {
            color: #4285F4;
            font-weight: bold;
            margin-left: 5px;
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
});
// Enhanced year selector functionality
document.addEventListener('DOMContentLoaded', function() {
    const yearSelector = document.getElementById('activeUsersYearSelector');
    if (yearSelector) {
        yearSelector.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Remove existing dropdown if present
            const existingDropdown = document.querySelector('.year-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
                return;
            }
            
            // Create year dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'year-dropdown';
            dropdown.style.position = 'absolute';
            dropdown.style.background = 'white';
            dropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            dropdown.style.borderRadius = '5px';
            dropdown.style.zIndex = '100';
            dropdown.style.padding = '5px 0';
            dropdown.style.right = '0';
            dropdown.style.top = '25px';
            dropdown.style.minWidth = '100px';
            
            // Current year is 2025, so we'll show 2023-2025
            const years = ['2023', '2024', '2025'];
            years.forEach(year => {
                const yearOption = document.createElement('div');
                yearOption.className = 'year-option';
                yearOption.textContent = year;
                yearOption.style.padding = '8px 15px';
                yearOption.style.cursor = 'pointer';
                yearOption.style.transition = 'background 0.2s';
                
                if (year === '2025') {
                    yearOption.style.fontWeight = 'bold';
                    yearOption.style.color = '#4285F4';
                }
                
                yearOption.addEventListener('mouseover', function() {
                    this.style.background = '#f5f5f5';
                });
                
                yearOption.addEventListener('mouseout', function() {
                    this.style.background = 'white';
                });
                
                yearOption.addEventListener('click', function(e) {
                    e.stopPropagation();
                    yearSelector.innerHTML = year + ' <i class="fas fa-chevron-down"></i>';
                    dropdown.remove();
                    
                    // Generate random data for the selected year
                    updateActiveUsersChart(year);
                });
                
                dropdown.appendChild(yearOption);
            });
            
            // Add dropdown to the page
            const chartHeader = yearSelector.closest('.chart-header');
            chartHeader.style.position = 'relative';
            chartHeader.appendChild(dropdown);
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function hideDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== yearSelector) {
                    dropdown.remove();
                    document.removeEventListener('click', hideDropdown);
                }
            });
        });
    }
    
    // Function to update the Active Users Chart with random data
    function updateActiveUsersChart(year) {
        // Generate random data based on the year
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const seed = parseInt(year.substring(2)); // Use last 2 digits of year as seed
        
        // Generate somewhat consistent random data based on year
        const indiaData = monthLabels.map((_, i) => Math.floor((Math.sin(seed + i) + 1.2) * 30) + 30);
        const russiaData = monthLabels.map((_, i) => Math.floor((Math.cos(seed + i) + 1.2) * 30) + 30);
        
        const newData = {
            labels: monthLabels,
            datasets: [
                {
                    label: 'India',
                    data: indiaData,
                    backgroundColor: '#4285F4',
                    barPercentage: 0.6,
                    categoryPercentage: 0.5
                },
                {
                    label: 'Russia',
                    data: russiaData,
                    backgroundColor: '#DB4437',
                    barPercentage: 0.6,
                    categoryPercentage: 0.5
                }
            ]
        };
        
        // Update chart with new data
        const chart = Chart.getChart('activeUsersChartCanvas');
        if (chart) {
            chart.data = newData;
            chart.update();
            
            // Update the trend summary
            updateTrendSummary(newData, year);
        }
    }
    
    // Function to update the trend summary below the chart
    function updateTrendSummary(data, year) {
        // Calculate trends (last month compared to previous month)
        const trends = {};
        data.datasets.forEach(dataset => {
            const lastTwoMonths = dataset.data.slice(-2);
            const difference = lastTwoMonths[1] - lastTwoMonths[0];
            const percentChange = ((difference / lastTwoMonths[0]) * 100).toFixed(1);
            trends[dataset.label] = {
                difference,
                percentChange,
                isPositive: difference >= 0
            };
        });
        
        // Update the trend summary in the DOM
        const trendSummary = document.querySelector('#activeUsersChart .chart-summary');
        if (trendSummary) {
            trendSummary.innerHTML = `
                <div class="trend-summary">
                    <div class="trend-item">
                        <span class="trend-label">India:</span>
                        <span class="trend-value ${trends.India.isPositive ? 'positive' : 'negative'}">
                            ${trends.India.isPositive ? '↑' : '↓'} ${Math.abs(trends.India.percentChange)}%
                        </span>
                    </div>
                    <div class="trend-item">
                        <span class="trend-label">Russia:</span>
                        <span class="trend-value ${trends.Russia.isPositive ? 'positive' : 'negative'}">
                            ${trends.Russia.isPositive ? '↑' : '↓'} ${Math.abs(trends.Russia.percentChange)}%
                        </span>
                    </div>
                    <div class="trend-summary-text">Data shown for ${year} ${year !== '2025' ? '(historical)' : '(current)'}</div>
                </div>
            `;
        }
    }
    
    // Month selector functionality for Revenue Graph
    const monthSelector = document.getElementById('revenueMonthSelector');
    if (monthSelector) {
        monthSelector.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Remove existing dropdown if present
            const existingDropdown = document.querySelector('.month-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
                return;
            }
            
            // Create month dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'month-dropdown';
            dropdown.style.position = 'absolute';
            dropdown.style.background = 'white';
            dropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            dropdown.style.borderRadius = '5px';
            dropdown.style.zIndex = '100';
            dropdown.style.padding = '5px 0';
            dropdown.style.right = '0';
            dropdown.style.top = '25px';
            dropdown.style.minWidth = '120px';
            
            // Show months from 2024-2025
            const months = [
                '2024, Nov', '2024, Dec', 
                '2025, Jan', '2025, Feb', '2025, Mar', 
                '2025, Apr', '2025, May'
            ];
            
            months.forEach(month => {
                const monthOption = document.createElement('div');
                monthOption.className = 'month-option';
                monthOption.textContent = month;
                monthOption.style.padding = '8px 15px';
                monthOption.style.cursor = 'pointer';
                monthOption.style.transition = 'background 0.2s';
                
                if (month === '2025, Mar') {
                    monthOption.style.fontWeight = 'bold';
                    monthOption.style.color = '#4285F4';
                }
                
                monthOption.addEventListener('mouseover', function() {
                    this.style.background = '#f5f5f5';
                });
                
                monthOption.addEventListener('mouseout', function() {
                    this.style.background = 'white';
                });
                
                monthOption.addEventListener('click', function(e) {
                    e.stopPropagation();
                    monthSelector.innerHTML = month + ' <i class="fas fa-chevron-down"></i>';
                    dropdown.remove();
                    
                    // Update the revenue chart data
                    updateRevenueChart(month);
                });
                
                dropdown.appendChild(monthOption);
            });
            
            // Add dropdown to the page
            const chartHeader = monthSelector.closest('.chart-header');
            chartHeader.style.position = 'relative';
            chartHeader.appendChild(dropdown);
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function hideDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== monthSelector) {
                    dropdown.remove();
                    document.removeEventListener('click', hideDropdown);
                }
            });
        });
    }
    
    // Function to update the Revenue Chart with random data
    function updateRevenueChart(selectedMonth) {
        // Extract month and year
        const [year, month] = selectedMonth.split(', ');
        
        // Generate a list of 5 months centered on the selected month
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIndex = allMonths.indexOf(month);
        
        // Determine the start month index, handling edge cases
        let startMonthIndex = monthIndex - 2;
        if (startMonthIndex < 0) {
            startMonthIndex = 12 + startMonthIndex; // Wrap around to previous year
        }
        
        // Generate label array of 5 months
        const labels = [];
        for (let i = 0; i < 5; i++) {
            const currMonthIndex = (startMonthIndex + i) % 12;
            labels.push(allMonths[currMonthIndex]);
        }
        
        // Generate random but "realistic" revenue data
        // Using the month and year as seed for pseudo-randomness
        const seed = monthIndex + (year === '2024' ? 0 : 12);
        const baseValue = 220;
        const revenueData = labels.map((_, i) => {
            return Math.floor(baseValue + (Math.sin(seed + i) * 50) + (Math.random() * 30));
        });
        
        // Determine which month to highlight
        const highlightIndex = labels.indexOf(month);
        
        // Update chart data
        const newData = {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: revenueData,
                backgroundColor: function(context) {
                    return context.dataIndex === highlightIndex ? '#4285F4' : '#E0E0E0';
                },
                borderWidth: 0,
                borderRadius: 5,
                barPercentage: 0.5,
                categoryPercentage: 0.7
            }]
        };
        
        // Update chart with new data
        const chart = Chart.getChart('revenueChartCanvas');
        if (chart) {
            chart.data = newData;
            chart.update();
            
            // Update the revenue analysis summary
            updateRevenueAnalysis(newData, highlightIndex, month);
        }
    }
    
    // Function to update the revenue analysis summary
    function updateRevenueAnalysis(data, highlightIndex, highlightMonth) {
        // Calculate MoM changes
        const monthlyData = data.datasets[0].data;
        const changes = monthlyData.map((value, index) => {
            if (index === 0) return { 
                label: data.labels[index], 
                value, 
                change: 0, 
                changePercent: '0.0', 
                isPositive: true 
            };
            
            const previousValue = monthlyData[index - 1];
            const change = value - previousValue;
            const changePercent = ((change / previousValue) * 100).toFixed(1);
            
            return {
                label: data.labels[index],
                value,
                change,
                changePercent,
                isPositive: change >= 0
            };
        });
        
        // Find the highest growth month
        let highestGrowthIndex = 1; // Start from 1 as index 0 has no growth
        for (let i = 1; i < changes.length; i++) {
            if (parseFloat(changes[i].changePercent) > parseFloat(changes[highestGrowthIndex].changePercent)) {
                highestGrowthIndex = i;
            }
        }
        
        // Update the analysis summary in the DOM
        const analysisSummary = document.querySelector('#revenueChart .chart-summary');
        if (analysisSummary) {
            analysisSummary.innerHTML = `
                <div class="revenue-mom-analysis">
                    <div class="analysis-title">Month-over-Month Analysis</div>
                    <div class="analysis-content">
                        ${changes.filter(item => item.label !== data.labels[0]).map(item => `
                            <div class="analysis-item">
                                <span class="month-label">${item.label}:</span>
                                <span class="change-value ${item.isPositive ? 'positive' : 'negative'}">
                                    ${item.isPositive ? '↑' : '↓'} ${Math.abs(item.changePercent)}%
                                </span>
                                <span class="absolute-change">(${item.isPositive ? '+' : ''}${item.change}K)</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="highlight-month">
                        <span class="highlight-label">Highest Growth:</span>
                        <span class="highlight-value">${data.labels[highestGrowthIndex]} (${changes[highestGrowthIndex].isPositive ? '+' : ''}${changes[highestGrowthIndex].changePercent}%)</span>
                    </div>
                </div>
            `;
        }
        
        // Also update the details modal data if opened
        const revenueDetailsTable = document.getElementById('revenueDetailsTable');
        if (revenueDetailsTable) {
            updateRevenueDetailsTable(data.labels, monthlyData, changes);
        }
    }
    
    // Function to update the revenue details table in the modal
    function updateRevenueDetailsTable(months, revenues, changes) {
        const revenueDetailsData = months.map((month, i) => {
            // Generate expenses (roughly 60-70% of revenue)
            const expenseRatio = 0.6 + (Math.random() * 0.1);
            const expenses = Math.round(revenues[i] * expenseRatio * 1000);
            const income = Math.round(revenues[i] * 1000);
            const profit = income - expenses;
            
            // Format as currency
            const formattedIncome = '$' + income.toLocaleString();
            const formattedExpenses = '$' + expenses.toLocaleString();
            const formattedProfit = '$' + profit.toLocaleString();
            
            return {
                date: month + ' 2025',
                income: formattedIncome,
                expenses: formattedExpenses,
                profit: formattedProfit,
                growth: (i > 0) ? (changes[i].isPositive ? '+' : '-') + Math.abs(changes[i].changePercent) + '%' : 'N/A'
            };
        });
        
        const tableBody = document.getElementById('revenueDetailsTable');
        tableBody.innerHTML = '';
        
        revenueDetailsData.forEach(item => {
            const row = document.createElement('tr');
            
            const dateCell = document.createElement('td');
            dateCell.textContent = item.date;
            row.appendChild(dateCell);
            
            const incomeCell = document.createElement('td');
            incomeCell.textContent = item.income;
            row.appendChild(incomeCell);
            
            const expensesCell = document.createElement('td');
            expensesCell.textContent = item.expenses;
            row.appendChild(expensesCell);
            
            const profitCell = document.createElement('td');
            profitCell.textContent = item.profit;
            row.appendChild(profitCell);
            
            const growthCell = document.createElement('td');
            growthCell.textContent = item.growth;
            if (item.growth !== 'N/A') {
                growthCell.style.color = item.growth.includes('+') ? 'green' : 'red';
                growthCell.style.fontWeight = 'bold';
            }
            row.appendChild(growthCell);
            
            tableBody.appendChild(row);
        });
        
        // Update summary stats
        const totalRevenue = revenues.reduce((sum, val) => sum + val, 0) * 1000;
        const formattedTotal = '$' + totalRevenue.toLocaleString();
        
        // Calculate average growth
        const growthValues = changes.slice(1).map(item => parseFloat(item.changePercent));
        const avgGrowth = growthValues.reduce((sum, val) => sum + val, 0) / growthValues.length;
        const formattedAvgGrowth = (avgGrowth >= 0 ? '+' : '') + avgGrowth.toFixed(1) + '%';
        
        document.getElementById('totalRevenue').innerHTML = 
            `${formattedTotal} <span style="font-size: 12px; color: green;">+${(Math.random() * 10).toFixed(1)}% YoY</span>`;
        
        document.getElementById('averageGrowth').innerHTML = 
            `${formattedAvgGrowth} <span style="font-size: 12px; color: #666;">vs +${(Math.random() * 5).toFixed(1)}% prev.</span>`;
    }
    
    // Initialize event handler for the details button
    document.getElementById('revenueDetails').addEventListener('click', function() {
        // Show revenue details modal
        document.getElementById('detailsModal').style.display = 'block';
        
        // Get current chart data
        const chart = Chart.getChart('revenueChartCanvas');
        if (chart) {
            const labels = chart.data.labels;
            const revenues = chart.data.datasets[0].data;
            
            // Calculate changes
            const changes = revenues.map((value, index) => {
                if (index === 0) return { 
                    label: labels[index], 
                    value, 
                    change: 0, 
                    changePercent: '0.0', 
                    isPositive: true 
                };
                
                const previousValue = revenues[index - 1];
                const change = value - previousValue;
                const changePercent = ((change / previousValue) * 100).toFixed(1);
                
                return {
                    label: labels[index],
                    value,
                    change,
                    changePercent,
                    isPositive: change >= 0
                };
            });
            
            // Update the details table
            updateRevenueDetailsTable(labels, revenues, changes);
        }
    });
    
    document.getElementById('closeDetailsModal').addEventListener('click', function() {
        document.getElementById('detailsModal').style.display = 'none';
    });
});