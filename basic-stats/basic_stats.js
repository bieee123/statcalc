/**
 * Basic Statistics Calculator JavaScript
 * Handles calculations and display for the basic statistics page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page
    initStatisticsCalculator();
});

/**
 * Initialize the statistics calculator page
 */
function initStatisticsCalculator() {
    // Get DOM elements
    const dataInput = document.getElementById('dataInput');
    const sampleSelect = document.getElementById('loadSample');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultCards = document.getElementById('resultCards');
    const showStepsBtn = document.getElementById('showStepsBtn');
    const stepsContainer = document.getElementById('stepsContainer');
    const calculationSteps = document.getElementById('calculationSteps');
    const decimalPlaces = document.getElementById('decimalPlaces');
    const dataChart = document.getElementById('dataChart');
    
    // Chart instance
    let chartInstance = null;
    
    // Sample data sets
    const sampleData = {
        basic: [12, 15, 18, 19, 22, 25, 26, 28, 30, 35],
        normal: [68, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 99, 103, 105, 110],
        skewed: [2, 3, 3, 4, 4, 5, 5, 5, 6, 7, 8, 10, 15, 20, 40]
    };
    
    // Event: Load sample data
    sampleSelect.addEventListener('change', function() {
        const selectedSample = this.value;
        if (selectedSample && sampleData[selectedSample]) {
            dataInput.value = sampleData[selectedSample].join(', ');
        }
    });
    
    // Event: Calculate button click
    calculateBtn.addEventListener('click', function() {
        // Parse input data
        const inputText = dataInput.value.trim();
        if (!inputText) {
            alert('Please enter data values.');
            return;
        }
        
        const values = parseInputData(inputText);
        if (values.length === 0) {
            alert('No valid numeric values found. Please check your input.');
            return;
        }
        
        // Determine which calculations are selected
        const selectedCalculations = getSelectedCalculations();
        if (selectedCalculations.length === 0) {
            alert('Please select at least one calculation to perform.');
            return;
        }
        
        // Calculate statistics
        const stats = calculateBasicStats(values);
        if (!stats) {
            alert('Error calculating statistics. Please check your input data.');
            return;
        }
        
        // Get decimal precision
        const precision = parseInt(decimalPlaces.value) || 2;
        
        // Display results
        displayResults(stats, selectedCalculations, precision);
        
        // Generate calculation steps
        const steps = generateCalculationSteps(values, stats);
        
        // Store steps for later use
        showStepsBtn.setAttribute('data-steps', JSON.stringify(steps));
        
        // Show results container
        resultsContainer.style.display = 'block';
        
        // Reset steps container
        stepsContainer.style.display = 'none';
        
        // Create or update chart
        createOrUpdateChart(values, stats);
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Event: Show steps button click
    showStepsBtn.addEventListener('click', function() {
        const stepsVisible = stepsContainer.style.display !== 'none';
        
        if (stepsVisible) {
            stepsContainer.style.display = 'none';
            showStepsBtn.textContent = 'Show Calculation Steps';
        } else {
            // Get stored steps
            const steps = JSON.parse(showStepsBtn.getAttribute('data-steps') || '{}');
            
            // Get selected calculations
            const selectedCalculations = getSelectedCalculations();
            
            // Display steps
            displayCalculationSteps(steps, selectedCalculations);
            
            stepsContainer.style.display = 'block';
            showStepsBtn.textContent = 'Hide Calculation Steps';
            
            // Scroll to steps
            stepsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    /**
     * Get selected calculations from checkboxes
     * @returns {Array} - Array of selected calculation types
     */
    function getSelectedCalculations() {
        const checkboxes = document.querySelectorAll('input[name="calculations"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    /**
     * Display calculation results in the result cards area
     * @param {Object} stats - Calculated statistics
     * @param {Array} selectedCalcs - Selected calculation types
     * @param {number} precision - Decimal precision
     */
    function displayResults(stats, selectedCalcs, precision) {
        // Clear previous results
        resultCards.innerHTML = '';
        
        // Create result cards based on selected calculations
        if (selectedCalcs.includes('mean') || selectedCalcs.includes('median') || selectedCalcs.includes('mode')) {
            const centralTendencyCard = document.createElement('div');
            centralTendencyCard.className = 'result-card';
            
            let cardContent = '<h3>Central Tendency</h3>';
            
            if (selectedCalcs.includes('mean')) {
                cardContent += createResultRow('Mean', stats.mean.toFixed(precision), 'Average of all values');
            }
            
            if (selectedCalcs.includes('median')) {
                cardContent += createResultRow('Median', stats.median.toFixed(precision), 'Middle value');
            }
            
            if (selectedCalcs.includes('mode')) {
                const modeStr = Array.isArray(stats.mode) ? stats.mode.map(m => m.toFixed(precision)).join(', ') : stats.mode;
                cardContent += createResultRow('Mode', modeStr, 'Most frequent value(s)');
            }
            
            centralTendencyCard.innerHTML = cardContent;
            resultCards.appendChild(centralTendencyCard);
        }
        
        if (selectedCalcs.includes('range') || selectedCalcs.includes('variance') || selectedCalcs.includes('stdDev')) {
            const dispersionCard = document.createElement('div');
            dispersionCard.className = 'result-card';
            
            let cardContent = '<h3>Dispersion</h3>';
            
            if (selectedCalcs.includes('range')) {
                cardContent += createResultRow('Range', stats.range.toFixed(precision), 'Difference between max and min');
            }
            
            if (selectedCalcs.includes('variance')) {
                cardContent += createResultRow('Variance', stats.variance.toFixed(precision), 'Average squared deviation from the mean');
            }
            
            if (selectedCalcs.includes('stdDev')) {
                cardContent += createResultRow('Standard Deviation', stats.stdDev.toFixed(precision), 'Square root of variance');
            }
            
            dispersionCard.innerHTML = cardContent;
            resultCards.appendChild(dispersionCard);
        }
        
        if (selectedCalcs.includes('quartiles')) {
            const quartilesCard = document.createElement('div');
            quartilesCard.className = 'result-card';
            
            let cardContent = '<h3>Quartiles and IQR</h3>';
            
            cardContent += createResultRow('Minimum', stats.min.toFixed(precision), '0th percentile');
            cardContent += createResultRow('First Quartile (Q1)', stats.q1.toFixed(precision), '25th percentile');
            cardContent += createResultRow('Second Quartile (Q2/Median)', stats.median.toFixed(precision), '50th percentile');
            cardContent += createResultRow('Third Quartile (Q3)', stats.q3.toFixed(precision), '75th percentile');
            cardContent += createResultRow('Maximum', stats.max.toFixed(precision), '100th percentile');
            cardContent += createResultRow('Interquartile Range (IQR)', stats.iqr.toFixed(precision), 'Q3 - Q1');
            
            quartilesCard.innerHTML = cardContent;
            resultCards.appendChild(quartilesCard);
        }
        
        // Summary info
        const summaryCard = document.createElement('div');
        summaryCard.className = 'result-card';
        summaryCard.innerHTML = `
            <h3>Data Summary</h3>
            ${createResultRow('Sample Size', stats.data.length, 'Number of values')}
            ${createResultRow('Minimum', stats.min.toFixed(precision), 'Smallest value')}
            ${createResultRow('Maximum', stats.max.toFixed(precision), 'Largest value')}
        `;
        resultCards.appendChild(summaryCard);
    }
    
    /**
     * Create a result row HTML with tooltip
     * @param {string} label - Result label
     * @param {string} value - Result value
     * @param {string} tooltip - Tooltip explanation
     * @returns {string} - HTML for the result row
     */
    function createResultRow(label, value, tooltip) {
        return `
            <div class="result-row">
                <div class="result-label">
                    ${label}
                    <span class="tooltip-container">
                        <span class="tooltip-icon">i</span>
                        <div class="tooltip-content">
                            <p>${tooltip}</p>
                        </div>
                    </span>
                </div>
                <div class="result-value">${value}</div>
            </div>
        `;
    }
    
    /**
     * Display calculation steps in the steps container
     * @param {Object} steps - Calculation steps object
     * @param {Array} selectedCalcs - Selected calculation types
     */
    function displayCalculationSteps(steps, selectedCalcs) {
        // Clear previous steps
        calculationSteps.innerHTML = '';
        
        // Map calculation types to steps keys
        const stepsMapping = {
            'mean': 'mean',
            'median': 'median',
            'mode': 'mode',
            'range': 'range',
            'variance': 'variance',
            'stdDev': 'stdDev',
            'quartiles': 'quartiles'
        };
        
        // Create steps sections for selected calculations
        selectedCalcs.forEach(calc => {
            const stepKey = stepsMapping[calc];
            if (steps[stepKey]) {
                const stepSection = document.createElement('div');
                stepSection.className = 'step-section';
                stepSection.innerHTML = `
                    <h3>${getCalculationTitle(calc)}</h3>
                    <div class="step-content">${steps[stepKey]}</div>
                `;
                calculationSteps.appendChild(stepSection);
            }
        });
        
    }
    
    /**
     * Get a human-readable title for a calculation type
     * @param {string} calcType - Calculation type
     * @returns {string} - Human-readable title
     */
    function getCalculationTitle(calcType) {
        const titles = {
            'mean': 'Mean Calculation',
            'median': 'Median Calculation',
            'mode': 'Mode Calculation',
            'range': 'Range Calculation',
            'variance': 'Variance Calculation',
            'stdDev': 'Standard Deviation Calculation',
            'quartiles': 'Quartiles and IQR Calculation'
        };
        
        return titles[calcType] || calcType;
    }
    
    /**
     * Parse input data from text to array of numbers
     * @param {string} inputText - Input text to parse
     * @returns {Array} - Array of numeric values
     */
    function parseInputData(inputText) {
        // Split by common delimiters (comma, space, tab, newline)
        const parts = inputText.split(/[,\s\t\n]+/);
        
        // Convert to numbers and filter out non-numeric values
        return parts
            .map(part => parseFloat(part.trim()))
            .filter(num => !isNaN(num));
    }
    
    /**
     * Calculate basic statistics from an array of values
     * @param {Array} data - Array of numeric values
     * @returns {Object} - Object containing calculated statistics
     */
    function calculateBasicStats(data) {
        if (!data || data.length === 0) {
            return null;
        }
        
        // Make a copy and sort the data for various calculations
        const sortedData = [...data].sort((a, b) => a - b);
        const n = data.length;
        
        // Calculate basic statistics
        const sum = data.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;
        
        // Calculate median
        let median;
        if (n % 2 === 0) {
            // Even number of elements
            median = (sortedData[n/2 - 1] + sortedData[n/2]) / 2;
        } else {
            // Odd number of elements
            median = sortedData[Math.floor(n/2)];
        }
        
        // Calculate mode
        const counts = {};
        let maxCount = 0;
        
        for (const value of data) {
            counts[value] = (counts[value] || 0) + 1;
            if (counts[value] > maxCount) {
                maxCount = counts[value];
            }
        }
        
        let mode = [];
        for (const [value, count] of Object.entries(counts)) {
            if (count === maxCount && maxCount > 1) {
                mode.push(parseFloat(value));
            }
        }
        
        // If no mode found (all values occur once), set to "No mode"
        if (mode.length === 0 || maxCount === 1) {
            mode = "No mode";
        } else if (mode.length === 1) {
            mode = mode[0]; // Return single value if only one mode
        }
        
        // Calculate range
        const min = sortedData[0];
        const max = sortedData[n - 1];
        const range = max - min;
        
        // Calculate variance
        const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / n;
        
        // Calculate standard deviation
        const stdDev = Math.sqrt(variance);
        
        // Calculate quartiles
        const q1Index = Math.floor(n * 0.25);
        const q3Index = Math.floor(n * 0.75);
        
        const q1 = sortedData[q1Index];
        const q3 = sortedData[q3Index];
        const iqr = q3 - q1;
        
        // Return calculated stats
        return {
            data: data,
            sortedData: sortedData,
            mean: mean,
            median: median,
            mode: mode,
            min: min,
            max: max,
            range: range,
            variance: variance,
            stdDev: stdDev,
            q1: q1,
            q3: q3,
            iqr: iqr
        };
    }
    
    /**
     * Generate detailed calculation steps for each statistic
     * @param {Array} data - Original data array
     * @param {Object} stats - Calculated statistics
     * @returns {Object} - Object containing HTML strings with calculation steps
     */
    function generateCalculationSteps(data, stats) {
        const steps = {};
        const n = data.length;
        
        // Mean calculation steps
        steps.mean = `
            <p>The mean is calculated by summing all values and dividing by the number of values:</p>
            <div class="formula">Mean = (${data.join(' + ')}) / ${n}</div>
            <div class="formula">Mean = ${data.reduce((acc, val) => acc + val, 0)} / ${n}</div>
            <div class="formula">Mean = ${stats.mean}</div>
        `;
        
        // Median calculation steps
        steps.median = `
            <p>To find the median, we first sort the data:</p>
            <div class="formula">Sorted data: [${stats.sortedData.join(', ')}]</div>
        `;
        
        if (n % 2 === 0) {
            const midIndex1 = n/2 - 1;
            const midIndex2 = n/2;
            steps.median += `
                <p>Since there are ${n} values (an even number), the median is the average of the middle two values:</p>
                <div class="formula">Median = (${stats.sortedData[midIndex1]} + ${stats.sortedData[midIndex2]}) / 2</div>
                <div class="formula">Median = ${stats.median}</div>
            `;
        } else {
            const midIndex = Math.floor(n/2);
            steps.median += `
                <p>Since there are ${n} values (an odd number), the median is the middle value:</p>
                <div class="formula">Median = Value at position ${midIndex + 1} = ${stats.sortedData[midIndex]}</div>
            `;
        }
        
        // Mode calculation steps
        steps.mode = `
            <p>The mode is the value(s) that appear most frequently in the dataset.</p>
            <div class="formula">Frequency count:</div>
            <ul>
        `;
        
        // Count frequencies
        const counts = {};
        for (const value of data) {
            counts[value] = (counts[value] || 0) + 1;
        }
        
        // Add each value's frequency
        Object.entries(counts).forEach(([value, count]) => {
            steps.mode += `<li>Value ${value} appears ${count} time${count !== 1 ? 's' : ''}</li>`;
        });
        
        steps.mode += `</ul>`;
        
        if (stats.mode === "No mode") {
            steps.mode += `<p>All values appear with the same frequency, so there is no mode.</p>`;
        } else if (Array.isArray(stats.mode)) {
            steps.mode += `<p>The most frequent values are: ${stats.mode.join(', ')}, each appearing ${counts[stats.mode[0]]} times.</p>`;
        } else {
            steps.mode += `<p>The most frequent value is ${stats.mode}, appearing ${counts[stats.mode]} times.</p>`;
        }
        
        // Range calculation steps
        steps.range = `
            <p>The range is the difference between the maximum and minimum values:</p>
            <div class="formula">Range = Maximum - Minimum</div>
            <div class="formula">Range = ${stats.max} - ${stats.min}</div>
            <div class="formula">Range = ${stats.range}</div>
        `;
        
        // Variance calculation steps
        steps.variance = `
            <p>The variance is calculated by:</p>
            <ol>
                <li>Finding the mean: ${stats.mean}</li>
                <li>Calculating the squared difference between each value and the mean</li>
                <li>Finding the average of these squared differences</li>
            </ol>
            <div class="formula">Squared differences:</div>
            <ul>
        `;
        
        // Calculate each squared difference
        const squaredDiffs = data.map(val => Math.pow(val - stats.mean, 2));
        data.forEach((val, i) => {
            steps.variance += `
                <li>(${val} - ${stats.mean.toFixed(4)})² = ${squaredDiffs[i].toFixed(4)}</li>
            `;
        });
        
        steps.variance += `
            </ul>
            <div class="formula">Variance = (${squaredDiffs.map(val => val.toFixed(4)).join(' + ')}) / ${n}</div>
            <div class="formula">Variance = ${stats.variance}</div>
        `;
        
        // Standard deviation calculation steps
        steps.stdDev = `
            <p>The standard deviation is the square root of the variance:</p>
            <div class="formula">Standard Deviation = √Variance</div>
            <div class="formula">Standard Deviation = √${stats.variance}</div>
            <div class="formula">Standard Deviation = ${stats.stdDev}</div>
        `;
        
        // Quartiles calculation steps
        steps.quartiles = `
            <p>To find quartiles, we work with the sorted data:</p>
            <div class="formula">Sorted data: [${stats.sortedData.join(', ')}]</div>
            <p>First Quartile (Q1): The value below which 25% of observations may be found</p>
            <div class="formula">Q1 = Value at position ${Math.floor(n * 0.25) + 1} = ${stats.q1}</div>
            <p>Second Quartile (Q2/Median): The value below which 50% of observations may be found</p>
            <div class="formula">Q2 = ${stats.median}</div>
            <p>Third Quartile (Q3): The value below which 75% of observations may be found</p>
            <div class="formula">Q3 = Value at position ${Math.floor(n * 0.75) + 1} = ${stats.q3}</div>
            <p>Interquartile Range (IQR): The difference between the third and first quartiles</p>
            <div class="formula">IQR = Q3 - Q1 = ${stats.q3} - ${stats.q1} = ${stats.iqr}</div>
        `;
        
        return steps;
    }
    
    /**
     * Create or update the data visualization chart
     * @param {Array} data - Data array
     * @param {Object} stats - Calculated statistics
     */
    function createOrUpdateChart(data, stats) {
        // Get the context of the canvas element
        const ctx = dataChart.getContext('2d');
        
        // Destroy previous chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        // Determine chart type based on data size
        const chartType = data.length > 15 ? 'histogram' : 'bar';
        
        if (chartType === 'histogram') {
            // Create histogram data
            const binCount = Math.ceil(Math.sqrt(data.length)); // Square root rule for bin count
            const binWidth = (stats.max - stats.min) / binCount;
            
            // Create bins
            const bins = Array(binCount).fill(0);
            const binLabels = [];
            
            // Calculate bin ranges
            for (let i = 0; i < binCount; i++) {
                const binStart = stats.min + i * binWidth;
                const binEnd = binStart + binWidth;
                binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
            }
            
            // Count values in each bin
            data.forEach(val => {
                const binIndex = Math.min(
                    Math.floor((val - stats.min) / binWidth),
                    binCount - 1
                );
                bins[binIndex]++;
            });
            
            // Create histogram chart
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: binLabels,
                    datasets: [{
                        label: 'Frequency',
                        data: bins,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Data Distribution Histogram'
                        },
                        annotation: {
                            annotations: {
                                mean: {
                                    type: 'line',
                                    mode: 'vertical',
                                    scaleID: 'x',
                                    value: binLabels.findIndex(label => {
                                        const [start, end] = label.split('-').map(parseFloat);
                                        return stats.mean >= start && stats.mean <= end;
                                    }),
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 2,
                                    label: {
                                        content: `Mean: ${stats.mean.toFixed(2)}`,
                                        enabled: true,
                                        position: 'top'
                                    }
                                }
                            }
                        }
                    }
                }
            });
        } else {
            // Count the frequency of each value
            const valueCounts = {};
            data.forEach(val => {
                valueCounts[val] = (valueCounts[val] || 0) + 1;
            });
            
            // Sort values
            const sortedValues = Object.keys(valueCounts).map(parseFloat).sort((a, b) => a - b);
            
            // Create bar chart
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedValues.map(String),
                    datasets: [{
                        label: 'Frequency',
                        data: sortedValues.map(val => valueCounts[val]),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                                text: 'Value'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Data Distribution'
                        },
                        annotation: {
                            annotations: {
                                mean: {
                                    type: 'line',
                                    mode: 'vertical',
                                    scaleID: 'x',
                                    value: sortedValues.indexOf(sortedValues.find(val => val >= stats.mean)),
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 2,
                                    label: {
                                        content: `Mean: ${stats.mean.toFixed(2)}`,
                                        enabled: true,
                                        position: 'top'
                                    }
                                },
                                median: {
                                    type: 'line',
                                    mode: 'vertical',
                                    scaleID: 'x',
                                    value: sortedValues.indexOf(sortedValues.find(val => val >= stats.median)),
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 2,
                                    label: {
                                        content: `Median: ${stats.median.toFixed(2)}`,
                                        enabled: true,
                                        position: 'bottom'
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Add export data functionality
    document.getElementById('exportCSV').addEventListener('click', function() {
        exportData('csv');
    });
    
    document.getElementById('exportJSON').addEventListener('click', function() {
        exportData('json');
    });
    
    /**
     * Export results in specified format
     * @param {string} format - 'csv' or 'json'
     */
    function exportData(format) {
        // Get steps data
        const stepsData = showStepsBtn.getAttribute('data-steps');
        if (!stepsData) {
            alert('No data to export. Please calculate statistics first.');
            return;
        }
        
        const stats = calculateBasicStats(parseInputData(dataInput.value.trim()));
        if (!stats) {
            alert('Error processing data for export.');
            return;
        }
        
        let content = '';
        let filename = 'statistics_results';
        
        if (format === 'csv') {
            // Create CSV content
            content = 'Statistic,Value\n';
            content += `Sample Size,${stats.data.length}\n`;
            content += `Mean,${stats.mean}\n`;
            content += `Median,${stats.median}\n`;
            content += `Mode,${Array.isArray(stats.mode) ? stats.mode.join(';') : stats.mode}\n`;
            content += `Range,${stats.range}\n`;
            content += `Minimum,${stats.min}\n`;
            content += `Maximum,${stats.max}\n`;
            content += `Variance,${stats.variance}\n`;
            content += `Standard Deviation,${stats.stdDev}\n`;
            content += `First Quartile (Q1),${stats.q1}\n`;
            content += `Third Quartile (Q3),${stats.q3}\n`;
            content += `Interquartile Range (IQR),${stats.iqr}\n`;
            content += `Raw Data,${stats.data.join(';')}\n`;
            
            filename += '.csv';
        } else if (format === 'json') {
            // Create JSON content
            const jsonData = {
                sampleSize: stats.data.length,
                rawData: stats.data,
                centralTendency: {
                    mean: stats.mean,
                    median: stats.median,
                    mode: stats.mode
                },
                dispersion: {
                    range: stats.range,
                    minimum: stats.min,
                    maximum: stats.max,
                    variance: stats.variance,
                    standardDeviation: stats.stdDev
                },
                quartiles: {
                    q1: stats.q1,
                    q2: stats.median,
                    q3: stats.q3,
                    iqr: stats.iqr
                },
                timestamp: new Date().toISOString()
            };
            
            content = JSON.stringify(jsonData, null, 2);
            filename += '.json';
        }
        
        // Create and trigger download
        const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }
    
    /**
     * Add functionality to copy results to clipboard
     */
    document.getElementById('copyResults').addEventListener('click', function() {
        if (resultCards.children.length === 0) {
            alert('No results to copy. Please calculate statistics first.');
            return;
        }
        
        // Create a text representation of results
        let textResults = "STATISTICS CALCULATION RESULTS\n";
        textResults += "===========================\n\n";
        
        // Process each result card
        Array.from(resultCards.children).forEach(card => {
            const cardTitle = card.querySelector('h3').innerText;
            textResults += `${cardTitle}\n${'-'.repeat(cardTitle.length)}\n`;
            
            // Get all result rows
            const rows = card.querySelectorAll('.result-row');
            Array.from(rows).forEach(row => {
                const label = row.querySelector('.result-label').innerText.replace('i', '').trim();
                const value = row.querySelector('.result-value').innerText;
                textResults += `${label}: ${value}\n`;
            });
            
            textResults += "\n";
        });
        
        // Copy to clipboard
        navigator.clipboard.writeText(textResults)
            .then(() => {
                alert('Results copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy results to clipboard. Please try again.');
            });
    });
    
    /**
     * Add save/load functionality using local storage
     */
    document.getElementById('saveData').addEventListener('click', function() {
        const inputData = dataInput.value.trim();
        if (!inputData) {
            alert('No data to save. Please enter data first.');
            return;
        }
        
        const savedName = prompt('Enter a name for this data set:', 'My Data Set');
        if (!savedName) return;
        
        // Get existing saved data or initialize empty array
        const savedData = JSON.parse(localStorage.getItem('statCalcSavedData') || '[]');
        
        // Add new data set
        savedData.push({
            name: savedName,
            data: inputData,
            timestamp: new Date().toISOString()
        });
        
        // Save back to local storage
        localStorage.setItem('statCalcSavedData', JSON.stringify(savedData));
        
        // Update the saved data dropdown
        updateSavedDataDropdown();
        
        alert(`Data saved as "${savedName}"`);
    });
    
    /**
     * Load saved data
     */
    document.getElementById('loadSavedData').addEventListener('change', function() {
        const selectedId = this.value;
        if (!selectedId) return;
        
        // Get saved data
        const savedData = JSON.parse(localStorage.getItem('statCalcSavedData') || '[]');
        const selected = savedData[parseInt(selectedId)];
        
        if (selected) {
            dataInput.value = selected.data;
            alert(`Loaded dataset: ${selected.name}`);
        }
        
        // Reset dropdown
        this.value = '';
    });
    
    /**
     * Clear data input
     */
    document.getElementById('clearData').addEventListener('click', function() {
        dataInput.value = '';
        resultsContainer.style.display = 'none';
        stepsContainer.style.display = 'none';
        
        // Destroy chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
    });
    
    /**
     * Update saved data dropdown
     */
    function updateSavedDataDropdown() {
        const savedDataSelect = document.getElementById('loadSavedData');
        
        // Clear existing options except the default
        while (savedDataSelect.options.length > 1) {
            savedDataSelect.options.remove(1);
        }
        
        // Get saved data
        const savedData = JSON.parse(localStorage.getItem('statCalcSavedData') || '[]');
        
        // Add options for each saved dataset
        savedData.forEach((dataset, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = dataset.name;
            savedDataSelect.appendChild(option);
        });
    }
    
    // Initialize saved data dropdown on page load
    updateSavedDataDropdown();
}

// Add this to your basic_stats.js file
document.addEventListener('DOMContentLoaded', function() {
    // Get references to elements
    const miniGlossary = document.getElementById('miniGlossary');
    const hideGlossaryBtn = document.getElementById('hideGlossaryBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Show glossary when results are displayed
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            // This assumes you have validation and calculation logic elsewhere
            // that shows the resultsContainer when calculations are successful
            
            // Use setTimeout to show the glossary after results are displayed
            // This ensures the glossary appears after your existing calculation logic runs
            setTimeout(() => {
                if (resultsContainer.style.display !== 'none') {
                    miniGlossary.style.display = 'block';
                }
            }, 100);  // Small delay to ensure it happens after your existing code
        });
    }
    
    // Hide glossary when button is clicked
    if (hideGlossaryBtn) {
        hideGlossaryBtn.addEventListener('click', function() {
            miniGlossary.style.display = 'none';
        });
    }
    
    // Additional function to toggle glossary visibility
    window.toggleGlossary = function(show) {
        if (miniGlossary) {
            miniGlossary.style.display = show ? 'block' : 'none';
        }
    };
});

function updateGlossaryVisibility() {
    const selectedTerms = Array.from(document.querySelectorAll('input[name="calculations"]:checked'))
        .map(cb => cb.getAttribute('data-term'));

    const glossaryItems = document.querySelectorAll('.glossary-item');
    let visibleCount = 0;

    glossaryItems.forEach(item => {
        const term = item.getAttribute('data-term');
        if (selectedTerms.includes(term)) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    const glossaryBox = document.getElementById('miniGlossary');
    glossaryBox.style.display = visibleCount > 0 ? 'block' : 'none';
}

document.getElementById('calculateBtn').addEventListener('click', function () {
    updateGlossaryVisibility();
    // lanjutkan hitung statistik...
});

