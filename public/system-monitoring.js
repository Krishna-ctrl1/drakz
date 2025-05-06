// Data for different years
const yearData = {
    "2024": {
        activeUsers: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'India',
                    data: [45, 60, 40, 70, 55, 65, 50],
                    backgroundColor: '#4285F4',
                    barPercentage: 0.6,
                    categoryPercentage: 0.5
                },
                {
                    label: 'Russia',
                    data: [70, 55, 65, 45, 60, 40, 75],
                    backgroundColor: '#DB4437',
                    barPercentage: 0.6,
                    categoryPercentage: 0.5
                }
            ]
        },
        revenue: {
            'Jan': [190, 210, 230, 200, 180],
            'Feb': [200, 220, 240, 180, 210],
            'Mar': [230, 260, 280, 240, 220],
            'Apr': [180, 200, 220, 190, 170],
            'May': [210, 230, 250, 220, 200],
            'Jun': [240, 260, 290, 250, 230],
            'Jul': [220, 240, 260, 230, 210],
            'Aug': [200, 220, 240, 210, 190],
            'Sep': [230, 250, 270, 240, 220],
            'Oct': [260, 280, 300, 270, 250],
            'Nov': [220, 240, 260, 230, 210],
            'Dec': [240, 260, 280, 250, 230]
        }
    },
    "2025": {
        activeUsers: {
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
        },
        revenue: {
            'Jan': [230, 250, 270, 220, 240],
            'Feb': [250, 270, 290, 230, 260],
            'Mar': [320, 340, 360, 300, 320],
            'Apr': [220, 240, 260, 200, 220],
            'May': [240, 260, 280, 220, 240],
            'Jun': [280, 300, 320, 260, 280],
            'Jul': [260, 280, 300, 240, 260],
            'Aug': [240, 260, 280, 220, 240],
            'Sep': [270, 290, 310, 250, 270],
            'Oct': [300, 320, 340, 280, 300],
            'Nov': [260, 280, 300, 240, 260],
            'Dec': [280, 300, 320, 260, 280]
        }
    }
};

// Global chart references
let activeUsersChart;
let revenueChart;
let currentYear = "2025";
let currentMonth = "Mar";

// Initialize the charts and add event listeners when the document is loaded
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

    // Initialize charts
    initializeActiveUsersChart(currentYear);
    initializeWebPopularityChart();
    initializeIncomeChart();
    initializeRevenueChart(currentYear, currentMonth);
    
    // Add event listeners to year and month selectors
    initializeSelectors();
    
    // Create India Map visualization
    setTimeout(() => {
        createIndiaMap();
    }, 100);
});

// Initialize Active Users Chart
function initializeActiveUsersChart(year) {
    const activeUsersCtx = document.getElementById('activeUsersChartCanvas').getContext('2d');
    
    // If chart already exists, destroy it first
    if (activeUsersChart) {
        activeUsersChart.destroy();
    }
    
    activeUsersChart = new Chart(activeUsersCtx, {
        type: 'bar',
        data: yearData[year].activeUsers,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
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
    
    // Update the year selector text
    const yearSelector = document.querySelector('.chart-header .year-selector');
    if (yearSelector) {
        yearSelector.innerHTML = `${year} <i class="fas fa-chevron-down"></i>`;
    }
}

// Initialize Web Popularity Chart (Doughnut Chart)
function initializeWebPopularityChart() {
    const webPopularityCtx = document.getElementById('webPopularityChartCanvas').getContext('2d');
    const webPopularityChart = new Chart(webPopularityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: [{
                data: [1245, 1743, 1000],
                backgroundColor: ['#FF6B6B', '#4285F4', '#4BD4B0'],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            cutout: '70%'
        }
    });
}
const webPopularityData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
        data: [1245, 1743, 1000],
        backgroundColor: ['#FF6B6B', '#4285F4', '#4BD4B0'],
        borderWidth: 0,
        cutout: '70%'
    }]
};


// India states data
const indiaStatesData = [
    { id: "AN", state: "Andaman and Nicobar Islands", value: 45 },
    { id: "AP", state: "Andhra Pradesh", value: 78 },
    { id: "AR", state: "Arunachal Pradesh", value: 32 },
    { id: "AS", state: "Assam", value: 67 },
    { id: "BR", state: "Bihar", value: 56 },
    { id: "CH", state: "Chandigarh", value: 87 },
    { id: "CT", state: "Chhattisgarh", value: 43 },
    { id: "DN", state: "Dadra and Nagar Haveli", value: 29 },
    { id: "DD", state: "Daman and Diu", value: 34 },
    { id: "DL", state: "Delhi", value: 95 },
    { id: "GA", state: "Goa", value: 76 },
    { id: "GJ", state: "Gujarat", value: 82 },
    { id: "HR", state: "Haryana", value: 74 },
    { id: "HP", state: "Himachal Pradesh", value: 54 },
    { id: "JK", state: "Jammu and Kashmir", value: 48 },
    { id: "JH", state: "Jharkhand", value: 39 },
    { id: "KA", state: "Karnataka", value: 89 },
    { id: "KL", state: "Kerala", value: 91 },
    { id: "LA", state: "Ladakh", value: 27 },
    { id: "LD", state: "Lakshadweep", value: 18 },
    { id: "MP", state: "Madhya Pradesh", value: 62 },
    { id: "MH", state: "Maharashtra", value: 93 },
    { id: "MN", state: "Manipur", value: 37 },
    { id: "ML", state: "Meghalaya", value: 42 },
    { id: "MZ", state: "Mizoram", value: 31 },
    { id: "NL", state: "Nagaland", value: 29 },
    { id: "OR", state: "Odisha", value: 58 },
    { id: "PY", state: "Puducherry", value: 66 },
    { id: "PB", state: "Punjab", value: 72 },
    { id: "RJ", state: "Rajasthan", value: 69 },
    { id: "SK", state: "Sikkim", value: 38 },
    { id: "TN", state: "Tamil Nadu", value: 88 },
    { id: "TG", state: "Telangana", value: 83 },
    { id: "TR", state: "Tripura", value: 47 },
    { id: "UP", state: "Uttar Pradesh", value: 71 },
    { id: "UT", state: "Uttarakhand", value: 53 },
    { id: "WB", state: "West Bengal", value: 76 }
];



// Function to create India Map
function createIndiaMap() {
    const width = document.getElementById('indiaMapChart').clientWidth;
    const height = document.getElementById('indiaMapChart').clientHeight;
    
    // Color scale for the map
    const colorScale = d3.scaleSequential(d3.interpolateGreens)
        .domain([0, 100]);

    // Create SVG
    const svg = d3.select('#indiaMapChart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width/8}, ${height/15})`);

    // Create tooltip
    const tooltip = d3.select('#indiaMapChart')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('padding', '5px')
        .style('border-radius', '5px')
        .style('box-shadow', '0 0 10px rgba(0,0,0,0.1)')
        .style('pointer-events', 'none')
        .style('opacity', 0);

    // Add legend
    const legend = d3.select('#indiaMapChart')
        .append('div')
        .attr('class', 'map-legend')
        .style('padding', '10px')
        .style('background', 'white')
        .style('border-radius', '5px')
        .style('box-shadow', '0 0 5px rgba(0,0,0,0.1)')
        .style('position', 'absolute')
        .style('top', '10px')
        .style('right', '10px');

    const legendItems = [
        { color: colorScale(20), text: 'Low (0-33%)' },
        { color: colorScale(50), text: 'Medium (34-66%)' },
        { color: colorScale(80), text: 'High (67-100%)' }
    ];

    legendItems.forEach(item => {
        const legendItem = legend.append('div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin-bottom', '5px');
        
        legendItem.append('div')
            .style('width', '12px')
            .style('height', '12px')
            .style('background', item.color)
            .style('margin-right', '5px');
        
        legendItem.append('span')
            .text(item.text)
            .style('font-size', '12px');
    });

    // Define the states and their boundaries
    // For demonstration, we'll create a simplified India map
    // In a real implementation, you would use GeoJSON data of India
    
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
    


    // Draw the map using GeoJSON
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
            
            d3.select(this)
                .attr("stroke-width", 2)
                .attr("stroke", "#333");
            
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            
            tooltip.html(`${stateName}: ${stateData.value}%`)
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

    // Add text labels for states
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
        .attr("fill", "#333")
        .text(function(d) {
            return d.properties.name;
        });
}

// Navigation functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelector('.nav-item.active').classList.remove('active');
        this.classList.add('active');
    });
});

// Initialize Income Chart (Pie Chart)
function initializeIncomeChart() {
    const incomeCtx = document.getElementById('incomeChartCanvas').getContext('2d');
    const incomeChart = new Chart(incomeCtx, {
        type: 'pie',
        data: {
            labels: ['Banks', 'Retail Points', 'Advisor', 'Admin'],
            datasets: [{
                data: [35, 25, 15, 25],
                backgroundColor: ['#45B7D1', '#FF6B6B', '#A3A0FB', '#FF9F40'],
                borderWidth: 0
            }]
        },
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
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize Revenue Chart
function initializeRevenueChart(year, month) {
    const revenueCtx = document.getElementById('revenueChartCanvas').getContext('2d');
    
    // If chart already exists, destroy it first
    if (revenueChart) {
        revenueChart.destroy();
    }
    
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Revenue',
            data: yearData[year].revenue[month],
            backgroundColor: (context) => {
                return context.dataIndex === 2 ? '#4285F4' : '#E0E0E0';
            },
            borderWidth: 0,
            borderRadius: 5,
            barPercentage: 0.5,
            categoryPercentage: 0.7
        }]
    };
    
    revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: revenueData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
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
                        stepSize: 100
                    }
                }
            }
        }
    });
    
    // Update the month selector text
    const monthSelector = document.querySelector('.chart-header .month-selector');
    if (monthSelector) {
        monthSelector.innerHTML = `${year}, ${month} <i class="fas fa-chevron-down"></i>`;
    }
}

// Function to create year and month selector menus
function initializeSelectors() {
    // Year selector for Active Users chart
    const yearSelector = document.querySelector('.chart-header .year-selector');
    if (yearSelector) {
        yearSelector.addEventListener('click', function() {
            // Create dropdown if it doesn't exist
            let dropdown = document.querySelector('.year-dropdown');
            
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.className = 'custom-dropdown year-dropdown';
                dropdown.style.position = 'absolute';
                dropdown.style.backgroundColor = 'white';
                dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                dropdown.style.borderRadius = '4px';
                dropdown.style.zIndex = '1000';
                dropdown.style.minWidth = '100px';
                
                // Add dropdown options
                Object.keys(yearData).forEach(year => {
                    const option = document.createElement('div');
                    option.className = 'dropdown-option';
                    option.textContent = year;
                    option.style.padding = '8px 12px';
                    option.style.cursor = 'pointer';
                    option.style.borderBottom = '1px solid #f0f0f0';
                    
                    option.addEventListener('click', function() {
                        currentYear = year;
                        initializeActiveUsersChart(year);
                        dropdown.remove();
                    });
                    
                    dropdown.appendChild(option);
                });
                
                // Position dropdown below year selector
                const rect = yearSelector.getBoundingClientRect();
                dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
                dropdown.style.left = (rect.left + window.scrollX) + 'px';
                
                document.body.appendChild(dropdown);
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target) && e.target !== yearSelector) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            } else {
                dropdown.remove();
            }
        });
    }
    
    // Month selector for Revenue chart
    const monthSelector = document.querySelector('.chart-header .month-selector');
    if (monthSelector) {
        monthSelector.addEventListener('click', function() {
            // Create dropdown if it doesn't exist
            let dropdown = document.querySelector('.month-dropdown');
            
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.className = 'custom-dropdown month-dropdown';
                dropdown.style.position = 'absolute';
                dropdown.style.backgroundColor = 'white';
                dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                dropdown.style.borderRadius = '4px';
                dropdown.style.zIndex = '1000';
                dropdown.style.minWidth = '150px';
                dropdown.style.maxHeight = '300px';
                dropdown.style.overflowY = 'auto';
                
                // Add year options first
                Object.keys(yearData).forEach(year => {
                    const yearHeader = document.createElement('div');
                    yearHeader.className = 'dropdown-header';
                    yearHeader.textContent = year;
                    yearHeader.style.padding = '8px 12px';
                    yearHeader.style.fontWeight = 'bold';
                    yearHeader.style.backgroundColor = '#f5f5f5';
                    
                    dropdown.appendChild(yearHeader);
                    
                    // Add month options for this year
                    Object.keys(yearData[year].revenue).forEach(month => {
                        const option = document.createElement('div');
                        option.className = 'dropdown-option';
                        option.textContent = `${year}, ${month}`;
                        option.style.padding = '8px 12px 8px 20px';
                        option.style.cursor = 'pointer';
                        option.style.borderBottom = '1px solid #f0f0f0';
                        
                        option.addEventListener('click', function() {
                            currentYear = year;
                            currentMonth = month;
                            initializeRevenueChart(year, month);
                            dropdown.remove();
                        });
                        
                        dropdown.appendChild(option);
                    });
                });
                
                // Position dropdown below month selector
                const rect = monthSelector.getBoundingClientRect();
                dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
                dropdown.style.left = (rect.left + window.scrollX) + 'px';
                
                document.body.appendChild(dropdown);
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target) && e.target !== monthSelector) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            } else {
                dropdown.remove();
            }
        });
    }
}   