/**
 * Main JavaScript file for the Statistical & Probability Calculator
 * Contains shared functionality used across multiple pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initTooltips();
    
    // Add active class to current navigation item
    setActiveNavItem();
});

/**
 * Initialize tooltips for educational explanations
 */
function initTooltips() {
    const tooltipContainers = document.querySelectorAll('.tooltip-container');
    
    tooltipContainers.forEach(container => {
        const tooltipIcon = container.querySelector('.tooltip-icon');
        const tooltipContent = container.querySelector('.tooltip-content');
        
        if (!tooltipIcon || !tooltipContent) return;
        
        // Show tooltip on hover
        tooltipIcon.addEventListener('mouseenter', () => {
            tooltipContent.style.display = 'block';
        });
        
        // Hide tooltip when mouse leaves
        container.addEventListener('mouseleave', () => {
            tooltipContent.style.display = 'none';
        });
    });
}

/**
 * Set active class on current navigation item based on URL
 */
function setActiveNavItem() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        const linkPath = link.getAttribute('href');
        if (currentPage.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if (currentPage.endsWith('index.html') && linkPath === 'index.html') {
            link.classList.add('active');
        } else if (currentPage.endsWith('/') && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
}

/**
 * Parse input data from a string into an array of numbers
 * @param {string} inputStr - Comma or space separated values
 * @returns {Array} - Array of parsed numbers
 */
function parseInputData(inputStr) {
    // Handle comma or space separated values
    const values = inputStr
        .split(/[,\s]+/)
        .map(val => parseFloat(val.trim()))
        .filter(val => !isNaN(val));
    
    return values;
}

/**
 * Calculate basic statistical measures
 * @param {Array} data - Array of numbers
 * @returns {Object} - Object containing statistical measures
 */
function calculateBasicStats(data) {
    if (!data || data.length === 0) {
        return null;
    }
    
    // Sort data for calculations
    const sortedData = [...data].sort((a, b) => a - b);
    
    // Calculate mean
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    
    // Calculate median
    let median;
    const midIndex = Math.floor(sortedData.length / 2);
    
    if (sortedData.length % 2 === 0) {
        median = (sortedData[midIndex - 1] + sortedData[midIndex]) / 2;
    } else {
        median = sortedData[midIndex];
    }
    
    // Calculate mode
    const counts = {};
    let mode = [];
    let maxCount = 0;
    
    for (const value of data) {
        counts[value] = (counts[value] || 0) + 1;
        
        if (counts[value] > maxCount) {
            maxCount = counts[value];
            mode = [value];
        } else if (counts[value] === maxCount) {
            mode.push(value);
        }
    }
    
    // If all values appear the same number of times, no mode
    if (mode.length === data.length) {
        mode = ['No mode'];
    }
    
    // Calculate range
    const range = sortedData[sortedData.length - 1] - sortedData[0];
    
    // Calculate variance
    const meanDiffs = data.map(val => val - mean);
    const squaredDiffs = meanDiffs.map(diff => diff * diff);
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
    
    // Calculate standard deviation
    const stdDev = Math.sqrt(variance);
    
    // Calculate quartiles
    const q1Index = Math.floor(sortedData.length / 4);
    const q3Index = Math.floor(sortedData.length * 3 / 4);
    
    let q1, q3;
    
    if (sortedData.length % 4 === 0) {
        q1 = (sortedData[q1Index - 1] + sortedData[q1Index]) / 2;
        q3 = (sortedData[q3Index - 1] + sortedData[q3Index]) / 2;
    } else {
        q1 = sortedData[q1Index];
        q3 = sortedData[q3Index];
    }
    
    // Calculate IQR
    const iqr = q3 - q1;
    
    return {
        data: sortedData,
        mean: mean,
        median: median,
        mode: mode,
        range: range,
        variance: variance,
        stdDev: stdDev,
        q1: q1,
        q3: q3,
        iqr: iqr,
        min: sortedData[0],
        max: sortedData[sortedData.length - 1]
    };
}

/**
 * Generate steps for calculating statistics (for educational purposes)
 * @param {Array} data - Original data array
 * @param {Object} stats - Calculated statistics object
 * @returns {Object} - Object containing step-by-step calculations
 */
function generateCalculationSteps(data, stats) {
    const steps = {};
    
    // Mean calculation steps
    steps.mean = {
        title: 'Calculating Mean',
        steps: [
            `Sum all values: ${data.join(' + ')} = ${data.reduce((a, b) => a + b, 0)}`,
            `Divide by the number of values (n = ${data.length}): ${data.reduce((a, b) => a + b, 0)} ÷ ${data.length} = ${stats.mean.toFixed(4)}`
        ],
        formula: "Mean = (x₁ + x₂ + ... + xₙ) / n"
    };
    
    // Median calculation steps
    steps.median = {
        title: 'Calculating Median',
        steps: [
            `Sort the values: ${stats.data.join(', ')}`,
            data.length % 2 === 0 
                ? `For even number of values (n = ${data.length}), take the average of the two middle values: (${stats.data[Math.floor(data.length/2) - 1]} + ${stats.data[Math.floor(data.length/2)]}) ÷ 2 = ${stats.median}`
                : `For odd number of values (n = ${data.length}), take the middle value: ${stats.median}`
        ],
        formula: "Median = middle value after sorting (odd n) OR average of two middle values (even n)"
    };
    
    // Mode calculation steps
    steps.mode = {
        title: 'Calculating Mode',
        steps: [
            `Count the frequency of each value:`,
            ...Object.entries(data.reduce((acc, val) => {
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {})).map(([value, count]) => `Value ${value} appears ${count} time(s)`),
            `The mode is the value(s) that appear most frequently: ${stats.mode.join(', ')}`
        ],
        formula: "Mode = value(s) with highest frequency"
    };
    
    // Range calculation steps
    steps.range = {
        title: 'Calculating Range',
        steps: [
            `Identify the maximum value: ${stats.max}`,
            `Identify the minimum value: ${stats.min}`,
            `Calculate the difference: ${stats.max} - ${stats.min} = ${stats.range}`
        ],
        formula: "Range = Maximum value - Minimum value"
    };
    
    // Variance calculation steps
    steps.variance = {
        title: 'Calculating Variance',
        steps: [
            `Calculate the mean: ${stats.mean.toFixed(4)}`,
            `Calculate the difference between each value and the mean:`,
            ...data.map(val => `(${val} - ${stats.mean.toFixed(4)}) = ${(val - stats.mean).toFixed(4)}`),
            `Square each difference:`,
            ...data.map(val => `(${val} - ${stats.mean.toFixed(4)})² = ${((val - stats.mean) ** 2).toFixed(4)}`),
            `Calculate the mean of the squared differences: (${data.map(val => ((val - stats.mean) ** 2).toFixed(4)).join(' + ')}) ÷ ${data.length} = ${stats.variance.toFixed(4)}`
        ],
        formula: "Variance = Σ(xᵢ - μ)² / n"
    };
    
    // Standard deviation calculation steps
    steps.stdDev = {
        title: 'Calculating Standard Deviation',
        steps: [
            `Calculate the variance: ${stats.variance.toFixed(4)}`,
            `Calculate the square root of the variance: √${stats.variance.toFixed(4)} = ${stats.stdDev.toFixed(4)}`
        ],
        formula: "Standard Deviation = √Variance = √(Σ(xᵢ - μ)² / n)"
    };
    
    // Quartiles and IQR calculation steps
    steps.quartiles = {
        title: 'Calculating Quartiles and IQR',
        steps: [
            `Sort the values: ${stats.data.join(', ')}`,
            `First quartile (Q1): ${stats.q1.toFixed(4)} (value at 25% position)`,
            `Second quartile (Q2/Median): ${stats.median.toFixed(4)} (value at 50% position)`,
            `Third quartile (Q3): ${stats.q3.toFixed(4)} (value at 75% position)`,
            `Calculate Interquartile Range (IQR): Q3 - Q1 = ${stats.q3.toFixed(4)} - ${stats.q1.toFixed(4)} = ${stats.iqr.toFixed(4)}`
        ],
        formula: "IQR = Q3 - Q1"
    };
    
    return steps;
}

/**
 * Creates a tooltip element for educational explanations
 * @param {string} title - Title for the tooltip
 * @param {string} explanation - Main explanation text
 * @param {string} formula - Formula in text format
 * @returns {HTMLElement} - Complete tooltip HTML element
 */
function createTooltip(title, explanation, formula) {
    const tooltipContainer = document.createElement('span');
    tooltipContainer.className = 'tooltip-container';
    
    const tooltipIcon = document.createElement('span');
    tooltipIcon.className = 'tooltip-icon';
    tooltipIcon.textContent = 'i';
    
    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'tooltip-content';
    
    const tooltipTitle = document.createElement('h4');
    tooltipTitle.textContent = title;
    
    const tooltipExplanation = document.createElement('p');
    tooltipExplanation.textContent = explanation;
    
    const tooltipFormula = document.createElement('div');
    tooltipFormula.className = 'formula';
    tooltipFormula.textContent = formula;
    
    const tooltipReference = document.createElement('p');
    tooltipReference.innerHTML = '<small>Learn more: <a href="#" target="_blank">Khan Academy</a></small>';
    
    tooltipContent.appendChild(tooltipTitle);
    tooltipContent.appendChild(tooltipExplanation);
    tooltipContent.appendChild(tooltipFormula);
    tooltipContent.appendChild(tooltipReference);
    
    tooltipContainer.appendChild(tooltipIcon);
    tooltipContainer.appendChild(tooltipContent);
    
    return tooltipContainer;
}

/**
 * Generate Chart.js configuration for various chart types
 * @param {string} chartType - Type of chart (bar, line, histogram, boxplot)
 * @param {Array} data - Data array
 * @param {Object} options - Additional chart options
 * @returns {Object} - Chart.js configuration object
 */
function generateChartConfig(chartType, data, options = {}) {
    const labels = options.labels || data.map((_, index) => `Value ${index + 1}`);
    
    // Default chart color
    const backgroundColor = options.backgroundColor || 'rgba(54, 162, 235, 0.7)';
    const borderColor = options.borderColor || 'rgba(54, 162, 235, 1)';
    
    // Basic chart configuration
    const config = {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: options.label || 'Data',
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: options.maintainAspectRatio !== undefined ? options.maintainAspectRatio : false,
            plugins: {
                title: {
                    display: options.title ? true : false,
                    text: options.title || ''
                },
                legend: {
                    display: options.showLegend !== undefined ? options.showLegend : true
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: options.yTitle ? true : false,
                        text: options.yTitle || ''
                    }
                },
                x: {
                    title: {
                        display: options.xTitle ? true : false,
                        text: options.xTitle || ''
                    }
                }
            }
        }
    };
    
    // Special configurations based on chart type
    if (chartType === 'histogram') {
        // For histogram, we need to adjust the type to 'bar' and handle bins differently
        config.type = 'bar';
        
        // Calculate histogram bins
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binCount = options.binCount || 10;
        const binWidth = (max - min) / binCount;
        
        const bins = Array(binCount).fill(0);
        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
            bins[binIndex]++;
        });
        
        // Generate bin labels
        const binLabels = [];
        for (let i = 0; i < binCount; i++) {
            const binStart = min + i * binWidth;
            const binEnd = binStart + binWidth;
            binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
        }
        
        config.data.labels = binLabels;
        config.data.datasets[0].data = bins;
        config.options.scales.x.title.text = options.xTitle || 'Value Ranges';
        config.options.scales.y.title.text = options.yTitle || 'Frequency';
    } else if (chartType === 'boxplot') {
        // For boxplot, we need to use a specific plugin or implement custom logic
        // This is a simplified version
        const stats = calculateBasicStats(data);
        
        config.type = 'bar';
        config.data.labels = ['Box Plot'];
        config.data.datasets = [
            {
                label: 'Min',
                data: [stats.min],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Q1',
                data: [stats.q1 - stats.min],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Q2-Q1',
                data: [stats.median - stats.q1],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Q3-Q2',
                data: [stats.q3 - stats.median],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Max-Q3',
                data: [stats.max - stats.q3],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ];
        
        config.options.scales.x.stacked = true;
        config.options.scales.y.stacked = true;
        config.options.indexAxis = 'y';
    }
    
    return config;
}