document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('visualization-form');
    const dataInput = document.getElementById('data-input');
    const chartTypeSelect = document.getElementById('chart-type');
    const binsContainer = document.getElementById('bin-container');
    const binsInput = document.getElementById('bins');
    const generateBtn = document.getElementById('generate-btn');
    const sampleDataBtn = document.getElementById('sample-data-btn');
    const visualizationSection = document.getElementById('visualization-section');
    const analysisSection = document.getElementById('analysis-section');
    const chartTitle = document.getElementById('chart-title');
    const chartCanvas = document.getElementById('chart-canvas');
    const chartInfoBtn = document.getElementById('chart-info-btn');
    const chartTooltip = document.getElementById('chart-tooltip');
    const tooltipClose = document.getElementById('tooltip-close');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipContent = document.getElementById('tooltip-content');
    const statsSummary = document.getElementById('stats-summary');
    const analysisText = document.getElementById('analysis-text');

    // Chart instance
    let chartInstance = null;

    // Event Listeners
    form.addEventListener('submit', handleFormSubmit);
    sampleDataBtn.addEventListener('click', loadSampleData);
    chartTypeSelect.addEventListener('change', toggleBinsInput);
    chartInfoBtn.addEventListener('click', showChartInfo);
    tooltipClose.addEventListener('click', hideChartInfo);

    // Initial setup
    toggleBinsInput();

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        generateVisualization();
    }

    // Load sample data based on chart type
    function loadSampleData() {
        const chartType = chartTypeSelect.value;
        let sampleData;

        switch(chartType) {
            case 'bar':
            case 'line':
                sampleData = '10, 25, 15, 30, 20, 40, 35';
                break;
            case 'pie':
                sampleData = '15, 25, 35, 45, 20';
                break;
            case 'scatter':
                sampleData = '12, 19, 3, 5, 2, 15, 10, 8, 25, 14, 27, 18';
                break;
            case 'histogram':
            case 'boxplot':
                sampleData = '12, 15, 18, 20, 25, 30, 22, 19, 24, 27, 15, 18, 21, 23, 19, 20, 22, 25, 28, 30';
                break;
            default:
                sampleData = '10, 20, 30, 40, 50, 25, 35, 45';
        }

        dataInput.value = sampleData;
    }

    // Toggle bins input for histogram
    function toggleBinsInput() {
        const chartType = chartTypeSelect.value;
        binsContainer.style.display = chartType === 'histogram' ? 'block' : 'none';
    }

    // Show chart info tooltip
    function showChartInfo() {
        const chartType = chartTypeSelect.value;
        
        // Set tooltip title and content based on chart type
        tooltipTitle.textContent = getChartTitle(chartType);
        tooltipContent.innerHTML = getChartInfo(chartType);
        
        // Show tooltip
        chartTooltip.classList.remove('hidden');
        chartTooltip.classList.add('active');
    }

    // Hide chart info tooltip
    function hideChartInfo() {
        chartTooltip.classList.remove('active');
        setTimeout(() => {
            chartTooltip.classList.add('hidden');
        }, 300);
    }

    // Get chart title based on chart type
    function getChartTitle(chartType) {
        const titles = {
            'bar': 'Bar Chart',
            'pie': 'Pie Chart',
            'line': 'Line Chart',
            'scatter': 'Scatter Plot',
            'histogram': 'Histogram',
            'boxplot': 'Box Plot'
        };
        
        return titles[chartType] || 'Chart Information';
    }

    // Get chart information based on chart type
    function getChartInfo(chartType) {
        const info = {
            'bar': `
                <p>A <strong>Bar Chart</strong> displays categorical data with rectangular bars where the height of each bar is proportional to the value it represents.</p>
                <p><strong>When to use:</strong></p>
                <ul>
                    <li>To compare different categories of data</li>
                    <li>When you have discrete categories</li>
                    <li>For visualizing frequency distributions</li>
                </ul>
                <p><strong>Statistical Insight:</strong> Bar charts are excellent for showing comparisons between categories, identifying patterns, and detecting outliers.</p>
            `,
            'pie': `
                <p>A <strong>Pie Chart</strong> is a circular statistical graphic divided into slices to illustrate numerical proportions.</p>
                <p><strong>When to use:</strong></p>
                <ul>
                    <li>To show proportions and percentages</li>
                    <li>When you have fewer than 7 categories</li>
                    <li>When the sum of all values is meaningful (represents 100%)</li>
                </ul>
                <p><strong>Statistical Insight:</strong> Pie charts work best when you want to show the relationship of parts to a whole and when values differ enough to be visible.</p>
            `,
            'line': `
                <p>A <strong>Line Chart</strong> displays information as a series of data points connected by straight line segments.</p>
                <p><strong>When to use:</strong></p>
                <ul>
                    <li>To show trends over time or sequences</li>
                    <li>When continuity between data points is important</li>
                    <li>To compare multiple series of data</li>
                </ul>
                <p><strong>Statistical Insight:</strong> Line charts are ideal for visualizing trends, patterns, and rate of change over time or ordered categories.</p>
            `,
            'scatter': `
                <p>A <strong>Scatter Plot</strong> uses dots to represent values for two different variables, with the position of each dot on the horizontal and vertical axes indicating the values.</p>
                <p><strong>When to use:</strong></p>
                <ul>
                    <li>To identify correlations between variables</li>
                    <li>When examining relationship patterns</li>
                    <li>To identify outliers or clusters</li>
                </ul>
                <p><strong>Statistical Insight:</strong> Scatter plots are powerful for revealing relationships, patterns, correlations, and clustering in datasets.</p>
            `,
            'histogram': `
                <p>A <strong>Histogram</strong> is a graphical representation of the distribution of numerical data, where the data is grouped into bins.</p>
                <p><strong>When to use:</strong></p>
                <ul>
                    <li>To understand the distribution of a dataset</li>
                    <li>To check for normality, skewness, and outliers</li>
                    <li>When analyzing continuous data</li>
                </ul>
                <p><strong>Statistical Insight:</strong> Histograms help visualize the shape, center, and spread of data, making it easier to identify patterns like normal distribution, skewness, or bimodality.</p>
            `,
            'boxplot': `
                <p>A <strong>Box Plot</strong> (or box-and-whisker plot) displays the distribution of a dataset based on a five-number summary: minimum, first quartile (Q1), median, third quartile (Q3), and maximum.</p>
                <p><strong>When to use:</strong></p>
                <ul>
                    <li>To display the distribution of data</li>
                    <li>To compare distributions between groups</li>
                    <li>To identify outliers and understand data spread</li>
                </ul>
                <p><strong>Statistical Insight:</strong> Box plots efficiently show the central tendency, dispersion, and skewness of data, making them ideal for comparing distributions across groups.</p>
            `
        };
        
        return info[chartType] || '<p>Select a chart type to see information about it.</p>';
    }

    // Generate visualization based on form data
    function generateVisualization() {
        // Get input values
        const inputData = dataInput.value.trim();
        const chartType = chartTypeSelect.value;
        
        // Validate input
        if (!inputData) {
            alert('Please enter numeric data separated by commas.');
            return;
        }
        
        // Parse data
        const data = parseData(inputData);
        if (!data.length) {
            alert('Invalid data format. Please enter valid numeric values separated by commas.');
            return;
        }
        
        // Create chart
        createChart(data, chartType);
        
        // Show visualization and analysis sections
        visualizationSection.classList.remove('hidden');
        analysisSection.classList.remove('hidden');
        
        // Update chart title
        chartTitle.textContent = getChartTitle(chartType);
        
        // Generate statistics and analysis
        generateStatistics(data);
        generateAnalysis(data, chartType);
        
        // Scroll to visualization
        visualizationSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Parse input data string to array of numbers
    function parseData(inputStr) {
        try {
            return inputStr.split(',')
                .map(item => item.trim())
                .filter(item => item !== '')
                .map(item => {
                    const num = parseFloat(item);
                    if (isNaN(num)) throw new Error('Invalid number');
                    return num;
                });
        } catch (e) {
            return [];
        }
    }

    // Create chart based on data and chart type
    function createChart(data, chartType) {
        // Destroy previous chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        // Create chart context
        const ctx = chartCanvas.getContext('2d');
        
        // Configure chart based on type
        let chartConfig;
        
        switch(chartType) {
            case 'bar':
                chartConfig = createBarChart(data);
                break;
            case 'pie':
                chartConfig = createPieChart(data);
                break;
            case 'line':
                chartConfig = createLineChart(data);
                break;
            case 'scatter':
                chartConfig = createScatterPlot(data);
                break;
            case 'histogram':
                chartConfig = createHistogram(data);
                break;
            case 'boxplot':
                chartConfig = createBoxPlot(data);
                break;
            default:
                chartConfig = createBarChart(data);
        }
        
        // Create chart instance
        chartInstance = new Chart(ctx, chartConfig);
    }

    // Create bar chart configuration
    function createBarChart(data) {
        const labels = Array.from({ length: data.length }, (_, i) => `Value ${i + 1}`);
        
        return {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Data Values',
                    data: data,
                    backgroundColor: generateGradientColors(data.length),
                    borderColor: 'rgba(74, 111, 165, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItems) {
                                return `Value ${tooltipItems[0].dataIndex + 1}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Data Point'
                        }
                    }
                }
            }
        };
    }

    // Create pie chart configuration
    function createPieChart(data) {
        const labels = Array.from({ length: data.length }, (_, i) => `Segment ${i + 1}`);
        
        return {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: generateGradientColors(data.length),
                    borderColor: 'white',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };
    }

    // Create line chart configuration
    function createLineChart(data) {
        const labels = Array.from({ length: data.length }, (_, i) => `Point ${i + 1}`);
        
        return {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Trend Line',
                    data: data,
                    borderColor: 'rgba(74, 111, 165, 1)',
                    backgroundColor: 'rgba(74, 111, 165, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(74, 111, 165, 1)',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Data Point'
                        }
                    }
                }
            }
        };
    }

    // Create scatter plot configuration
    function createScatterPlot(data) {
        // For scatter plot, we need (x,y) coordinates
        // We'll use index as x and value as y for demonstration
        const scatterData = data.map((value, index) => ({
            x: index + 1,
            y: value
        }));
        
        return {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Data Points',
                    data: scatterData,
                    backgroundColor: 'rgba(255, 152, 0, 0.7)',
                    borderColor: 'rgba(255, 152, 0, 1)',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Data Point'
                        }
                    }
                }
            }
        };
    }

    // Create histogram configuration
    function createHistogram(data) {
        // Get number of bins
        const bins = parseInt(binsInput.value) || 5;
        
        // Calculate bin width and bin edges
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / bins;
        
        // Create bins
        const binCounts = Array(bins).fill(0);
        const binEdges = Array(bins).fill().map((_, i) => min + i * binWidth);
        
        // Count values in each bin
        data.forEach(value => {
            for (let i = 0; i < bins; i++) {
                if (i === bins - 1) {
                    // Last bin includes the max value
                    if (value >= binEdges[i] && value <= max) {
                        binCounts[i]++;
                        break;
                    }
                } else if (value >= binEdges[i] && value < binEdges[i + 1]) {
                    binCounts[i]++;
                    break;
                }
            }
        });
        
        // Create labels for bins
        const binLabels = binEdges.map((edge, i) => {
            if (i === bins - 1) {
                return `${edge.toFixed(1)} - ${max.toFixed(1)}`;
            }
            return `${edge.toFixed(1)} - ${(binEdges[i + 1]).toFixed(1)}`;
        });
        
        return {
            type: 'bar',
            data: {
                labels: binLabels,
                datasets: [{
                    label: 'Frequency',
                    data: binCounts,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)',
                    borderColor: 'rgba(74, 111, 165, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItems) {
                                return tooltipItems[0].label;
                            },
                            label: function(context) {
                                return `Frequency: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Frequency'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Value Range'
                        }
                    }
                }
            }
        };
    }

    // Create box plot configuration
    function createBoxPlot(data) {
        // Calculate box plot statistics
        const sorted = [...data].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const q1 = calculateQuantile(sorted, 0.25);
        const median = calculateQuantile(sorted, 0.5);
        const q3 = calculateQuantile(sorted, 0.75);
        
        // For box plot with Chart.js, we'll use a custom approach
        // since Chart.js doesn't have built-in box plots
        
        return {
            type: 'bar',
            data: {
                labels: ['Box Plot'],
                datasets: [
                    // Min to Q1 (whisker)
                    {
                        label: 'Min to Q1',
                        data: [q1 - min],
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(74, 111, 165, 1)',
                        borderWidth: 2,
                        barPercentage: 0.1,
                        base: min
                    },
                    // Q1 to Median (box)
                    {
                        label: 'Q1 to Median',
                        data: [median - q1],
                        backgroundColor: 'rgba(74, 111, 165, 0.7)',
                        borderColor: 'rgba(74, 111, 165, 1)',
                        borderWidth: 2,
                        barPercentage: 0.5,
                        base: q1
                    },
                    // Median to Q3 (box)
                    {
                        label: 'Median to Q3',
                        data: [q3 - median],
                        backgroundColor: 'rgba(74, 111, 165, 0.4)',
                        borderColor: 'rgba(74, 111, 165, 1)',
                        borderWidth: 2,
                        barPercentage: 0.5,
                        base: median
                    },
                    // Q3 to Max (whisker)
                    {
                        label: 'Q3 to Max',
                        data: [max - q3],
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(74, 111, 165, 1)',
                        borderWidth: 2,
                        barPercentage: 0.1,
                        base: q3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function() {
                                return 'Box Plot Statistics';
                            },
                            label: function() {
                                return [
                                    `Minimum: ${min.toFixed(2)}`,
                                    `Q1 (25%): ${q1.toFixed(2)}`,
                                    `Median: ${median.toFixed(2)}`,
                                    `Q3 (75%): ${q3.toFixed(2)}`,
                                    `Maximum: ${max.toFixed(2)}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: false,
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    },
                    y: {
                        stacked: true,
                        grid: {
                            display: false
                        }
                    }
                }
            }
        };
    }

    // Calculate statistics for the dataset
    function generateStatistics(data) {
        const stats = calculateStats(data);
        
        // Create statistics content
        statsSummary.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">Count</div>
                <div class="stat-value">${stats.count}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Mean</div>
                <div class="stat-value">${stats.mean.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Median</div>
                <div class="stat-value">${stats.median.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Min</div>
                <div class="stat-value">${stats.min.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Max</div>
                <div class="stat-value">${stats.max.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Range</div>
                <div class="stat-value">${stats.range.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Std Dev</div>
                <div class="stat-value">${stats.stdDev.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Q1 (25%)</div>
                <div class="stat-value">${stats.q1.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Q3 (75%)</div>
                <div class="stat-value">${stats.q3.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">IQR</div>
                <div class="stat-value">${stats.iqr.toFixed(2)}</div>
            </div>
        `;
    }

    // Generate analysis based on data and chart type
    function generateAnalysis(data, chartType) {
        const stats = calculateStats(data);
        let analysis = '';
        
        // General analysis
        analysis += `<p>This dataset contains <strong>${stats.count} values</strong> with a range from <strong>${stats.min.toFixed(2)}</strong> to <strong>${stats.max.toFixed(2)}</strong>.</p>`;
        
        // Distribution analysis
        if (stats.mean > stats.median) {
            analysis += `<p>The mean (${stats.mean.toFixed(2)}) is greater than the median (${stats.median.toFixed(2)}), suggesting a <strong>right-skewed (positively skewed)</strong> distribution.</p>`;
        } else if (stats.mean < stats.median) {
            analysis += `<p>The mean (${stats.mean.toFixed(2)}) is less than the median (${stats.median.toFixed(2)}), suggesting a <strong>left-skewed (negatively skewed)</strong> distribution.</p>`;
        } else {
            analysis += `<p>The mean (${stats.mean.toFixed(2)}) is approximately equal to the median (${stats.median.toFixed(2)}), suggesting a <strong>symmetric</strong> distribution.</p>`;
        }
        
        // Specific chart analysis
        switch(chartType) {
            case 'histogram':
                analysis += `<p>The histogram displays the frequency distribution across ${binsInput.value} bins, showing how the values are distributed across the range.</p>`;
                break;
            case 'boxplot':
                analysis += `<p>The box plot shows the central 50% of the data (between Q1: ${stats.q1.toFixed(2)} and Q3: ${stats.q3.toFixed(2)}) with the median line at ${stats.median.toFixed(2)}.</p>`;
                if (stats.outliers.length > 0) {
                    analysis += `<p>There are <strong>${stats.outliers.length} potential outliers</strong> in the dataset that may require further investigation.</p>`;
                }
                break;
            case 'scatter':
                analysis += `<p>The scatter plot shows the distribution of individual data points, allowing you to identify patterns, clusters, or outliers in the dataset.</p>`;
                break;
            case 'pie':
                analysis += `<p>The pie chart displays the proportional relationships between values, where each segment represents a percentage of the total sum (${stats.sum.toFixed(2)}).</p>`;
                break;
        }
        
        // Dispersion analysis
        const cv = (stats.stdDev / stats.mean) * 100;
        analysis += `<p>The standard deviation is ${stats.stdDev.toFixed(2)}, with a coefficient of variation of ${cv.toFixed(2)}%, indicating the level of dispersion relative to the mean.</p>`;
        
        // Set analysis content
        analysisText.innerHTML = analysis;
    }

    // Calculate descriptive statistics
    function calculateStats(data) {
        const count = data.length;
        const sum = data.reduce((a, b) => a + b, 0);
        const mean = sum / count;
        
        // Sort data for quantile calculations
        const sorted = [...data].sort((a, b) => a - b);
        
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const range = max - min;
        
        // Calculate median and quartiles
        const median = calculateQuantile(sorted, 0.5);
        const q1 = calculateQuantile(sorted, 0.25);
        const q3 = calculateQuantile(sorted, 0.75);
        const iqr = q3 - q1;
        
        // Calculate standard deviation
        const sumSquaredDiff = data.reduce((sum, value) => {
            const diff = value - mean;
            return sum + (diff * diff);
        }, 0);
        const variance = sumSquaredDiff / count;
        const stdDev = Math.sqrt(variance);
        
        // Identify outliers (values outside 1.5 * IQR from Q1 and Q3)
        const lowerBound = q1 - (1.5 * iqr);
        const upperBound = q3 + (1.5 * iqr);
        const outliers = data.filter(value => value < lowerBound || value > upperBound);
        
        return {
            count,
            sum,
            mean,
            median,
            min,
            max,
            range,
            q1,
            q3,
            iqr,
            stdDev,
            outliers
        };
    }

    // Calculate quantile (percentile) from sorted array
    function calculateQuantile(sorted, q) {
        const pos = (sorted.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        
        if (sorted[base + 1] !== undefined) {
            return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
        } else {
            return sorted[base];
        }
    }

    // Generate gradient colors for charts
    function generateGradientColors(count) {
        const colors = [];
        const baseHue = 210; // Base color hue (blue)
        
        for (let i = 0; i < count; i++) {
            // For bar/line charts, use shades of blue
            // For pie charts, use rainbow colors
            const hue = (chartTypeSelect.value === 'pie') 
                ? (i * (360 / count)) % 360 
                : (baseHue + (i * 10)) % 360;
                
            const saturation = 70;
            const lightness = 60;
            
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        
        return colors;
    }
});