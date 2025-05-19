// MathJax Configuration
        window.MathJax = {
            tex: {
                inlineMath: [[', '], ['\\(', '\\)']],
                displayMath: [['$', '$'], ['\\[', '\\]']],
                processEscapes: true
            },
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
            }
        };

        // Wait for document to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const mainDistSelect = document.getElementById('mainDistribution');
            const compareSwitch = document.getElementById('compareSwitch');
            const compareSwitchLabel = document.getElementById('compareSwitchLabel');
            const compareDistCol = document.getElementById('compareDistCol');
            const compareDistSelect = document.getElementById('compareDistribution');
            const calculateBtn = document.getElementById('calculateBtn');
            const resultsSection = document.getElementById('results');
            const comparisonSection = document.getElementById('comparisonSection');
            const comparisonParameters = document.getElementById('comparisonParameters');
            
            // Toggle buttons for chart display
            const pdfToggle = document.getElementById('pdfToggle');
            const cdfToggle = document.getElementById('cdfToggle');
            const bothToggle = document.getElementById('bothToggle');

            // Chart setup
            let distributionChart = null;
            
            // Initialize tooltips
            function initTooltips() {
                const tooltips = document.querySelectorAll('.tooltip-icon');
                tooltips.forEach(tooltip => {
                    tooltip.addEventListener('mouseenter', function() {
                        this.querySelector('.tooltip-content').style.visibility = 'visible';
                        this.querySelector('.tooltip-content').style.opacity = '1';
                    });
                    
                    tooltip.addEventListener('mouseleave', function() {
                        this.querySelector('.tooltip-content').style.visibility = 'hidden';
                        this.querySelector('.tooltip-content').style.opacity = '0';
                    });
                });
            }
            
            // Initialize tooltips
            initTooltips();
            
            // Show/hide parameter inputs based on selected distribution
            function updateParameterInputs() {
                // Hide all parameter inputs first
                document.querySelectorAll('#mainParameters .distribution-params').forEach(el => {
                    el.style.display = 'none';
                });
                
                // Show the selected distribution parameters
                const selected = mainDistSelect.value;
                document.getElementById(`${selected}Params`).style.display = 'block';
                
                // If comparison is active, do the same for comparison distribution
                if (compareSwitch.checked) {
                    // Hide all comparison parameters first
                    document.querySelectorAll('#comparisonParameters .distribution-params').forEach(el => {
                        el.style.display = 'none';
                    });
                    
                    // Show the selected comparison distribution parameters
                    const compareSelected = compareDistSelect.value;
                    document.getElementById(`${compareSelected}CompareParams`).style.display = 'block';
                }
            }
            
            // Toggle comparison functionality
            compareSwitch.addEventListener('change', function() {
                if (this.checked) {
                    compareDistCol.style.display = 'block';
                    comparisonParameters.style.display = 'block';
                    compareSwitchLabel.textContent = 'Yes';
                } else {
                    compareDistCol.style.display = 'none';
                    comparisonParameters.style.display = 'none';
                    comparisonSection.style.display = 'none';
                    compareSwitchLabel.textContent = 'No';
                }
                updateParameterInputs();
            });
            
            // Handle distribution selection changes
            mainDistSelect.addEventListener('change', updateParameterInputs);
            compareDistSelect.addEventListener('change', updateParameterInputs);
            
            // Binomial PMF calculation
            function binomialPMF(x, n, p) {
                if (x < 0 || x > n || !Number.isInteger(x)) return 0;
                
                // Calculate binomial coefficient (n choose x)
                let coefficient = 1;
                for (let i = 1; i <= x; i++) {
                    coefficient *= (n - i + 1) / i;
                }
                
                return coefficient * Math.pow(p, x) * Math.pow(1 - p, n - x);
            }
            
            // Binomial CDF calculation
            function binomialCDF(x, n, p) {
                let cdf = 0;
                for (let i = 0; i <= x; i++) {
                    cdf += binomialPMF(i, n, p);
                }
                return cdf;
            }
            
            // Poisson PMF calculation
            function poissonPMF(x, lambda) {
                if (x < 0 || !Number.isInteger(x)) return 0;
                
                // Calculate e^(-lambda) * lambda^x / x!
                return Math.exp(-lambda) * Math.pow(lambda, x) / factorial(x);
            }
            
            // Poisson CDF calculation
            function poissonCDF(x, lambda) {
                let cdf = 0;
                for (let i = 0; i <= x; i++) {
                    cdf += poissonPMF(i, lambda);
                }
                return cdf;
            }
            
            // Normal PDF calculation
            function normalPDF(x, mean, sd) {
                const coefficient = 1 / (sd * Math.sqrt(2 * Math.PI));
                const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(sd, 2));
                return coefficient * Math.exp(exponent);
            }
            
            // Normal CDF calculation (approximation)
            function normalCDF(x, mean, sd) {
                // Z-score
                const z = (x - mean) / sd;
                
                // Approximation using error function
                if (z < -6) return 0;
                if (z > 6) return 1;
                
                // Approximation from Abramowitz and Stegun
                let sign = 1;
                if (z < 0) {
                    sign = -1;
                    z = -z;
                }
                
                const b1 = 0.31938153;
                const b2 = -0.356563782;
                const b3 = 1.781477937;
                const b4 = -1.821255978;
                const b5 = 1.330274429;
                const p = 0.2316419;
                const c = 0.39894228;
                
                if (z > 0) {
                    const t = 1.0 / (1.0 + p * z);
                    const val = 1.0 - c * Math.exp(-z * z / 2.0) * t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
                    return val;
                } else {
                    return 0.5;
                }
            }
            
            // Exponential PDF calculation
            function exponentialPDF(x, lambda) {
                if (x < 0) return 0;
                return lambda * Math.exp(-lambda * x);
            }
            
            // Exponential CDF calculation
            function exponentialCDF(x, lambda) {
                if (x < 0) return 0;
                return 1 - Math.exp(-lambda * x);
            }
            
            // Factorial helper function
            function factorial(n) {
                if (n === 0 || n === 1) return 1;
                let result = 1;
                for (let i = 2; i <= n; i++) {
                    result *= i;
                }
                return result;
            }
            
            // Get distribution parameters based on selected distribution
            function getDistributionParams(prefix = '') {
                const selectedDist = prefix ? 
                    document.getElementById('compareDistribution').value : 
                    document.getElementById('mainDistribution').value;
                
                let params = {};
                
                switch (selectedDist) {
                    case 'binomial':
                        params.n = parseInt(document.getElementById(prefix ? 'binomial-compare-n' : 'binomial-n').value);
                        params.p = parseFloat(document.getElementById(prefix ? 'binomial-compare-p' : 'binomial-p').value);
                        params.x = parseInt(document.getElementById(prefix ? 'binomial-compare-x' : 'binomial-x').value);
                        break;
                    case 'poisson':
                        params.lambda = parseFloat(document.getElementById(prefix ? 'poisson-compare-lambda' : 'poisson-lambda').value);
                        params.x = parseInt(document.getElementById(prefix ? 'poisson-compare-x' : 'poisson-x').value);
                        break;
                    case 'normal':
                        params.mean = parseFloat(document.getElementById(prefix ? 'normal-compare-mean' : 'normal-mean').value);
                        params.sd = parseFloat(document.getElementById(prefix ? 'normal-compare-sd' : 'normal-sd').value);
                        params.x = parseFloat(document.getElementById(prefix ? 'normal-compare-x' : 'normal-x').value);
                        break;
                    case 'exponential':
                        params.lambda = parseFloat(document.getElementById(prefix ? 'exponential-compare-lambda' : 'exponential-lambda').value);
                        params.x = parseFloat(document.getElementById(prefix ? 'exponential-compare-x' : 'exponential-x').value);
                        break;
                }
                
                return { dist: selectedDist, params };
            }
            
            // Calculate PDF/PMF value based on distribution type and parameters
            function calculatePDF(dist, params) {
                switch (dist) {
                    case 'binomial':
                        return binomialPMF(params.x, params.n, params.p);
                    case 'poisson':
                        return poissonPMF(params.x, params.lambda);
                    case 'normal':
                        return normalPDF(params.x, params.mean, params.sd);
                    case 'exponential':
                        return exponentialPDF(params.x, params.lambda);
                    default:
                        return 0;
                }
            }
            
            // Calculate CDF value based on distribution type and parameters
            function calculateCDF(dist, params) {
                switch (dist) {
                    case 'binomial':
                        return binomialCDF(params.x, params.n, params.p);
                    case 'poisson':
                        return poissonCDF(params.x, params.lambda);
                    case 'normal':
                        return normalCDF(params.x, params.mean, params.sd);
                    case 'exponential':
                        return exponentialCDF(params.x, params.lambda);
                    default:
                        return 0;
                }
            }
            
            // Calculate mean based on distribution type and parameters
            function calculateMean(dist, params) {
                switch (dist) {
                    case 'binomial':
                        return params.n * params.p;
                    case 'poisson':
                        return params.lambda;
                    case 'normal':
                        return params.mean;
                    case 'exponential':
                        return 1 / params.lambda;
                    default:
                        return 0;
                }
            }
            
            // Calculate variance based on distribution type and parameters
            function calculateVariance(dist, params) {
                switch (dist) {
                    case 'binomial':
                        return params.n * params.p * (1 - params.p);
                    case 'poisson':
                        return params.lambda;
                    case 'normal':
                        return params.sd * params.sd;
                    case 'exponential':
                        return 1 / (params.lambda * params.lambda);
                    default:
                        return 0;
                }
            }
            
            // Generate data points for chart
            function generateChartData(dist, params, color = 'rgba(74, 111, 165, 1)') {
                let pdfData = [];
                let cdfData = [];
                
                switch (dist) {
                    case 'binomial':
                        // For discrete distributions, we generate points from 0 to n
                        for (let i = 0; i <= params.n; i++) {
                            pdfData.push({
                                x: i,
                                y: binomialPMF(i, params.n, params.p)
                            });
                            cdfData.push({
                                x: i,
                                y: binomialCDF(i, params.n, params.p)
                            });
                        }
                        break;
                    case 'poisson':
                        // For Poisson, we use a reasonable range based on lambda
                        const maxX = Math.max(20, Math.ceil(params.lambda * 3));
                        for (let i = 0; i <= maxX; i++) {
                            pdfData.push({
                                x: i,
                                y: poissonPMF(i, params.lambda)
                            });
                            cdfData.push({
                                x: i,
                                y: poissonCDF(i, params.lambda)
                            });
                        }
                        break;
                    case 'normal':
                        // For continuous distributions, we sample points
                        const min = params.mean - 4 * params.sd;
                        const max = params.mean + 4 * params.sd;
                        const step = (max - min) / 100;
                        
                        for (let i = 0; i <= 100; i++) {
                            const x = min + i * step;
                            pdfData.push({
                                x: x,
                                y: normalPDF(x, params.mean, params.sd)
                            });
                            cdfData.push({
                                x: x,
                                y: normalCDF(x, params.mean, params.sd)
                            });
                        }
                        break;
                    case 'exponential':
                        // For exponential, we use a range based on lambda
                        const expMax = 5 / params.lambda; // Covers most of the distribution
                        const expStep = expMax / 100;
                        
                        for (let i = 0; i <= 100; i++) {
                            const x = i * expStep;
                            pdfData.push({
                                x: x,
                                y: exponentialPDF(x, params.lambda)
                            });
                            cdfData.push({
                                x: x,
                                y: exponentialCDF(x, params.lambda)
                            });
                        }
                        break;
                }
                
                return {
                    pdf: {
                        label: `PDF/PMF (${dist})`,
                        data: pdfData,
                        backgroundColor: color.replace('1)', '0.2)'),
                        borderColor: color,
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.4,
                        fill: dist === 'binomial' || dist === 'poisson' ? false : true
                    },
                    cdf: {
                        label: `CDF (${dist})`,
                        data: cdfData,
                        backgroundColor: 'transparent',
                        borderColor: color,
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.4,
                        borderDash: [5, 5]
                    }
                };
            }
            
            // Initialize chart
            function initChart(datasets, chartType = 'pdf') {
                const ctx = document.getElementById('distributionChart').getContext('2d');
                
                // Destroy existing chart if it exists
                if (distributionChart) {
                    distributionChart.destroy();
                }
                
                // Prepare datasets based on chart type
                let activeDatasets = [];
                if (chartType === 'pdf' || chartType === 'both') {
                    activeDatasets.push(datasets.main.pdf);
                    if (datasets.comparison) activeDatasets.push(datasets.comparison.pdf);
                }
                
                if (chartType === 'cdf' || chartType === 'both') {
                    activeDatasets.push(datasets.main.cdf);
                    if (datasets.comparison) activeDatasets.push(datasets.comparison.cdf);
                }
                
                // Create new chart
                distributionChart = new Chart(ctx, {
                    type: (datasets.main.pdf.data[0].x % 1 === 0 && chartType === 'pdf') ? 'bar' : 'line',
                    data: {
                        datasets: activeDatasets
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'linear',
                                title: {
                                    display: true,
                                    text: 'Value'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: chartType === 'pdf' ? 'PDF/PMF' : (chartType === 'cdf' ? 'CDF' : 'Probability')
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.parsed.y.toFixed(4);
                                        return `${context.dataset.label}: ${value}`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
            
            // Display calculation steps
            function displayCalculationSteps(dist, params, pdfValue, cdfValue) {
                const stepsContainer = document.getElementById('calculationSteps');
                const formulaContainer = document.getElementById('formula');
                
                let steps = '';
                let formula = '';
                
                switch (dist) {
                    case 'binomial':
                        formula = `
                        $P(X = x) = \\binom{n}{x} p^x (1-p)^{n-x}$
                        $P(X \\leq x) = \\sum_{i=0}^{x} \\binom{n}{i} p^i (1-p)^{n-i}$
                        `;
                        
                        steps = `
                        <p><strong>PDF Calculation</strong> (Probability Mass Function)</p>
                        <p>Given values: n = ${params.n}, p = ${params.p}, x = ${params.x}</p>
                        <p>$P(X = ${params.x}) = \\binom{${params.n}}{${params.x}} \\times ${params.p}^{${params.x}} \\times (1-${params.p})^{${params.n}-${params.x}}$</p>
                        <p>$= \\frac{${params.n}!}{${params.x}!(${params.n}-${params.x})!} \\times ${params.p}^{${params.x}} \\times ${(1-params.p).toFixed(4)}^{${params.n-params.x}}$</p>
                        <p>$= ${pdfValue.toFixed(6)}$</p>
                        
                        <p><strong>CDF Calculation</strong> (Cumulative Distribution Function)</p>
                        <p>$P(X \\leq ${params.x}) = \\sum_{i=0}^{${params.x}} P(X = i)$</p>
                        <p>$= ${cdfValue.toFixed(6)}$</p>
                        `;
                        break;
                    case 'poisson':
                        formula = `
                        $P(X = x) = \\frac{e^{-\\lambda} \\lambda^x}{x!}$
                        $P(X \\leq x) = \\sum_{i=0}^{x} \\frac{e^{-\\lambda} \\lambda^i}{i!}$
                        `;
                        
                        steps = `
                        <p><strong>PMF Calculation</strong> (Probability Mass Function)</p>
                        <p>Given values: λ = ${params.lambda}, x = ${params.x}</p>
                        <p>$P(X = ${params.x}) = \\frac{e^{-${params.lambda}} \\times ${params.lambda}^{${params.x}}}{${params.x}!}$</p>
                        <p>$= \\frac{${Math.exp(-params.lambda).toFixed(6)} \\times ${Math.pow(params.lambda, params.x).toFixed(6)}}{${factorial(params.x)}}$</p>
                        <p>$= ${pdfValue.toFixed(6)}$</p>
                        
                        <p><strong>CDF Calculation</strong> (Cumulative Distribution Function)</p>
                        <p>$P(X \\leq ${params.x}) = \\sum_{i=0}^{${params.x}} P(X = i)$</p>
                        <p>$= ${cdfValue.toFixed(6)}$</p>
                        `;
                        break;
                    case 'normal':
                        formula = `
                        $f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$
                        $F(x) = P(X \\leq x) = \\int_{-\\infty}^{x} f(t)\\,dt$
                        `;
                        
                        steps = `
                        <p><strong>PDF Calculation</strong> (Probability Density Function)</p>
                        <p>Given values: μ = ${params.mean}, σ = ${params.sd}, x = ${params.x}</p>
                        <p>$f(${params.x}) = \\frac{1}{${params.sd}\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{${params.x}-${params.mean}}{${params.sd}}\\right)^2}$</p>
                        <p>$= \\frac{1}{${params.sd} \\times ${Math.sqrt(2*Math.PI).toFixed(4)}} \\times e^{-\\frac{1}{2} \\times ${Math.pow((params.x-params.mean)/params.sd, 2).toFixed(4)}}$</p>
                        <p>$= \\frac{1}{${(params.sd * Math.sqrt(2*Math.PI)).toFixed(4)}} \\times ${Math.exp(-0.5 * Math.pow((params.x-params.mean)/params.sd, 2)).toFixed(6)}$</p>
                        <p>$= ${pdfValue.toFixed(6)}$</p>
                        
                        <p><strong>CDF Calculation</strong> (Cumulative Distribution Function)</p>
                        <p>For the standard normal CDF, we convert to a z-score:</p>
                        <p>$z = \\frac{x - \\mu}{\\sigma} = \\frac{${params.x} - ${params.mean}}{${params.sd}} = ${((params.x - params.mean) / params.sd).toFixed(4)}$</p>
                        <p>$P(X \\leq ${params.x}) = \\Phi(z) = \\Phi(${((params.x - params.mean) / params.sd).toFixed(4)}) = ${cdfValue.toFixed(6)}$</p>
                        `;
                        break;
                    case 'exponential':
                        formula = `
                        $f(x) = \\lambda e^{-\\lambda x}, \\quad x \\geq 0$
                        $F(x) = P(X \\leq x) = 1 - e^{-\\lambda x}, \\quad x \\geq 0$
                        `;
                        
                        steps = `
                        <p><strong>PDF Calculation</strong> (Probability Density Function)</p>
                        <p>Given values: λ = ${params.lambda}, x = ${params.x}</p>
                        <p>$f(${params.x}) = ${params.lambda} \\times e^{-${params.lambda} \\times ${params.x}}$</p>
                        <p>$= ${params.lambda} \\times e^{${-params.lambda * params.x}}$</p>
                        <p>$= ${params.lambda} \\times ${Math.exp(-params.lambda * params.x).toFixed(6)}$</p>
                        <p>$= ${pdfValue.toFixed(6)}$</p>
                        
                        <p><strong>CDF Calculation</strong> (Cumulative Distribution Function)</p>
                        <p>$F(${params.x}) = P(X \\leq ${params.x}) = 1 - e^{-${params.lambda} \\times ${params.x}}$</p>
                        <p>$= 1 - e^{${-params.lambda * params.x}}$</p>
                        <p>$= 1 - ${Math.exp(-params.lambda * params.x).toFixed(6)}$</p>
                        <p>$= ${cdfValue.toFixed(6)}$</p>
                        `;
                        break;
                }
                
                // Display formula and steps
                formulaContainer.innerHTML = formula;
                stepsContainer.innerHTML = steps;
                
                // Typeset the formulas with MathJax
                if (window.MathJax && window.MathJax.typeset) {
                    window.MathJax.typeset();
                }
            }
            
            // Generate comparison insights
            function generateComparisonInsight(main, comparison) {
                const insightContainer = document.getElementById('comparisonInsight');
                
                let insight = '<p><strong>Key Insights:</strong></p>';
                
                if (main.dist === comparison.dist) {
                    // Same distribution type, different parameters
                    switch (main.dist) {
                        case 'binomial':
                            insight += `<p>Both distributions are Binomial. The main distribution has parameters n=${main.params.n} and p=${main.params.p}, while the comparison distribution has n=${comparison.params.n} and p=${comparison.params.p}.</p>`;
                            if (main.params.n > comparison.params.n && main.params.p === comparison.params.p) {
                                insight += '<p>The main distribution has a larger number of trials, which generally results in a wider spread of possible outcomes.</p>';
                                } else if (main.params.n === comparison.params.n && main.params.p > comparison.params.p) {
                                insight += '<p>The main distribution has a larger probability of success, shifting the distribution to the right compared to the comparison distribution.</p>';
                            } else if (main.params.n * main.params.p === comparison.params.n * comparison.params.p) {
                                insight += '<p>Both distributions have the same mean but different shapes. The distribution with smaller n and larger p tends to be more symmetric.</p>';
                            }
                            break;
                        case 'poisson':
                            insight += `<p>Both distributions are Poisson. The main distribution has λ=${main.params.lambda}, while the comparison distribution has λ=${comparison.params.lambda}.</p>`;
                            if (main.params.lambda > comparison.params.lambda) {
                                insight += '<p>The main distribution has a larger rate parameter, resulting in a higher mean and variance. The distribution is shifted to the right with a wider spread.</p>';
                            } else {
                                insight += '<p>The comparison distribution has a larger rate parameter, resulting in a higher mean and variance. The distribution is shifted to the right with a wider spread.</p>';
                            }
                            break;
                        case 'normal':
                            insight += `<p>Both distributions are Normal. The main distribution has μ=${main.params.mean} and σ=${main.params.sd}, while the comparison distribution has μ=${comparison.params.mean} and σ=${comparison.params.sd}.</p>`;
                            if (main.params.mean !== comparison.params.mean && main.params.sd === comparison.params.sd) {
                                insight += '<p>The distributions have the same spread but different centers.</p>';
                            } else if (main.params.mean === comparison.params.mean && main.params.sd !== comparison.params.sd) {
                                insight += '<p>The distributions have the same center but different spreads. The distribution with the larger standard deviation is more spread out.</p>';
                            } else {
                                insight += '<p>The distributions differ in both center and spread.</p>';
                            }
                            break;
                        case 'exponential':
                            insight += `<p>Both distributions are Exponential. The main distribution has λ=${main.params.lambda}, while the comparison distribution has λ=${comparison.params.lambda}.</p>`;
                            if (main.params.lambda > comparison.params.lambda) {
                                insight += '<p>The main distribution has a larger rate parameter, resulting in a lower mean (1/λ) and a more concentrated distribution near zero.</p>';
                            } else {
                                insight += '<p>The comparison distribution has a larger rate parameter, resulting in a lower mean (1/λ) and a more concentrated distribution near zero.</p>';
                            }
                            break;
                    }
                } else {
                    // Different distribution types
                    insight += `<p>The main distribution is ${main.dist.charAt(0).toUpperCase() + main.dist.slice(1)}, while the comparison distribution is ${comparison.dist.charAt(0).toUpperCase() + comparison.dist.slice(1)}.</p>`;
                    insight += '<p>These distributions have different shapes and properties:</p>';
                    
                    // Add specific insights about the different distributions
                    const mainMean = calculateMean(main.dist, main.params);
                    const mainVar = calculateVariance(main.dist, main.params);
                    const compMean = calculateMean(comparison.dist, comparison.params);
                    const compVar = calculateVariance(comparison.dist, comparison.params);
                    
                    insight += `<p>- The ${main.dist} distribution has a mean of ${mainMean.toFixed(2)} and variance of ${mainVar.toFixed(2)}.</p>`;
                    insight += `<p>- The ${comparison.dist} distribution has a mean of ${compMean.toFixed(2)} and variance of ${compVar.toFixed(2)}.</p>`;
                    
                    if (main.dist === 'normal' || comparison.dist === 'normal') {
                        insight += '<p>- The Normal distribution is symmetric about its mean.</p>';
                    }
                    
                    if (main.dist === 'exponential' || comparison.dist === 'exponential') {
                        insight += '<p>- The Exponential distribution is skewed right with a long tail.</p>';
                    }
                    
                    if ((main.dist === 'binomial' || main.dist === 'poisson') && 
                        (comparison.dist === 'binomial' || comparison.dist === 'poisson')) {
                        insight += '<p>- Both are discrete distributions but with different underlying assumptions.</p>';
                    } else if ((main.dist === 'normal' || main.dist === 'exponential') && 
                             (comparison.dist === 'normal' || comparison.dist === 'exponential')) {
                        insight += '<p>- Both are continuous distributions but with different shapes.</p>';
                    } else {
                        insight += '<p>- One distribution is discrete while the other is continuous.</p>';
                    }
                }
                
                insightContainer.innerHTML = insight;
            }
            
            // Calculate distribution statistics and results
            calculateBtn.addEventListener('click', function() {
                // Get main distribution parameters
                const main = getDistributionParams();
                
                // Calculate PDF/PMF and CDF values
                const pdfValue = calculatePDF(main.dist, main.params);
                const cdfValue = calculateCDF(main.dist, main.params);
                
                // Display results
                document.getElementById('pdfResult').textContent = pdfValue.toFixed(6);
                document.getElementById('cdfResult').textContent = cdfValue.toFixed(6);
                
                // Display calculation steps
                displayCalculationSteps(main.dist, main.params, pdfValue, cdfValue);
                
                // Generate chart data
                const chartData = {
                    main: generateChartData(main.dist, main.params, 'rgba(74, 111, 165, 1)')
                };
                
                // Check if comparison is active
                if (compareSwitch.checked) {
                    // Get comparison distribution parameters
                    const comparison = getDistributionParams('compare');
                    
                    // Add comparison data to the chart
                    chartData.comparison = generateChartData(comparison.dist, comparison.params, 'rgba(165, 74, 74, 1)');
                    
                    // Display distribution statistics for comparison
                    document.getElementById('mean1').textContent = calculateMean(main.dist, main.params).toFixed(4);
                    document.getElementById('mean2').textContent = calculateMean(comparison.dist, comparison.params).toFixed(4);
                    document.getElementById('variance1').textContent = calculateVariance(main.dist, main.params).toFixed(4);
                    document.getElementById('variance2').textContent = calculateVariance(comparison.dist, comparison.params).toFixed(4);
                    
                    // Generate and display comparison insights
                    generateComparisonInsight(main, comparison);
                    
                    // Show comparison section
                    comparisonSection.style.display = 'block';
                } else {
                    // Hide comparison section if not active
                    comparisonSection.style.display = 'none';
                }
                
                // Initialize chart with PDF data by default
                initChart(chartData, 'pdf');
                
                // Show results section
                resultsSection.style.display = 'block';
                
                // Reset toggle buttons
                pdfToggle.classList.add('active');
                cdfToggle.classList.remove('active');
                bothToggle.classList.remove('active');
            });
            
            // Handle chart toggle buttons
            pdfToggle.addEventListener('click', function() {
                if (!distributionChart) return;
                
                // Get current chart data
                const main = getDistributionParams();
                const chartData = {
                    main: generateChartData(main.dist, main.params, 'rgba(74, 111, 165, 1)')
                };
                
                if (compareSwitch.checked) {
                    const comparison = getDistributionParams('compare');
                    chartData.comparison = generateChartData(comparison.dist, comparison.params, 'rgba(165, 74, 74, 1)');
                }
                
                // Update chart with PDF data only
                initChart(chartData, 'pdf');
                
                // Update active state of toggle buttons
                pdfToggle.classList.add('active');
                cdfToggle.classList.remove('active');
                bothToggle.classList.remove('active');
            });
            
            cdfToggle.addEventListener('click', function() {
                if (!distributionChart) return;
                
                // Get current chart data
                const main = getDistributionParams();
                const chartData = {
                    main: generateChartData(main.dist, main.params, 'rgba(74, 111, 165, 1)')
                };
                
                if (compareSwitch.checked) {
                    const comparison = getDistributionParams('compare');
                    chartData.comparison = generateChartData(comparison.dist, comparison.params, 'rgba(165, 74, 74, 1)');
                }
                
                // Update chart with CDF data only
                initChart(chartData, 'cdf');
                
                // Update active state of toggle buttons
                pdfToggle.classList.remove('active');
                cdfToggle.classList.add('active');
                bothToggle.classList.remove('active');
            });
            
            bothToggle.addEventListener('click', function() {
                if (!distributionChart) return;
                
                // Get current chart data
                const main = getDistributionParams();
                const chartData = {
                    main: generateChartData(main.dist, main.params, 'rgba(74, 111, 165, 1)')
                };
                
                if (compareSwitch.checked) {
                    const comparison = getDistributionParams('compare');
                    chartData.comparison = generateChartData(comparison.dist, comparison.params, 'rgba(165, 74, 74, 1)');
                }
                
                // Update chart with both PDF and CDF data
                initChart(chartData, 'both');
                
                // Update active state of toggle buttons
                pdfToggle.classList.remove('active');
                cdfToggle.classList.remove('active');
                bothToggle.classList.add('active');
            });
            
            // Set up initial state
            updateParameterInputs();
        });