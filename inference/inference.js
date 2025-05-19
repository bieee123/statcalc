// Initialize tooltips
        document.addEventListener('DOMContentLoaded', function() {
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });
            
            // Initialize toggle functionality for simulation panels
            const toggleButtons = document.querySelectorAll('.simulation-toggle');
            toggleButtons.forEach(button => {
                button.addEventListener('click', function() {
                    this.classList.toggle('toggle-open');
                });
            });
            
            // Form switching based on test selection
            const testTypeSelect = document.getElementById('testType');
            testTypeSelect.addEventListener('change', function() {
                switchTestForm(this.value);
            });
            
            // Add event listeners for calculate buttons
            document.getElementById('calculate-z-ci').addEventListener('click', calculateZCI);
            document.getElementById('calculate-t-ci').addEventListener('click', calculateTCI);
            document.getElementById('calculate-one-sample').addEventListener('click', calculateOneSampleTest);
            document.getElementById('calculate-two-sample').addEventListener('click', calculateTwoSampleTest);
            document.getElementById('calculate-chi-square').addEventListener('click', calculateChiSquare);
            
            // Chi-square table creator
            document.getElementById('create-table').addEventListener('click', createContingencyTable);
            
            // Simulation button
            document.getElementById('run-simulation').addEventListener('click', runSimulation);
        });
        
        // Switch between test forms
        function switchTestForm(testType) {
            // Hide all forms first
            const forms = document.querySelectorAll('#ci-z-form, #ci-t-form, #one-sample-form, #two-sample-form, #chi-square-form');
            forms.forEach(form => {
                form.style.display = 'none';
            });
            
            // Show selected form
            const targetForm = document.getElementById(`${testType}-form`);
            if (targetForm) {
                if (testType !== 'ci-z') {
                    // Move the form from hidden container to dynamic container
                    document.getElementById('dynamicFormContainer').appendChild(targetForm);
                }
                targetForm.style.display = 'block';
            }
            
            // Hide results section when switching forms
            document.getElementById('results-container').style.display = 'none';
        }
        
        // Reset form values
        function resetForm(formId) {
            const form = document.getElementById(`${formId}-form`);
            const inputs = form.querySelectorAll('input[type="number"], select');
            inputs.forEach(input => {
                if (input.type === 'number') {
                    input.value = '';
                } else if (input.type === 'select-one') {
                    input.selectedIndex = 0;
                }
            });
            
            // Hide results
            document.getElementById('results-container').style.display = 'none';
        }
        
        // Create contingency table based on selected rows and columns
        function createContingencyTable() {
            const rows = parseInt(document.getElementById('chi-rows').value);
            const cols = parseInt(document.getElementById('chi-cols').value);
            const tableContainer = document.getElementById('contingency-table-container');
            
            let tableHtml = '<table class="contingency-table" id="chi-table">';
            tableHtml += '<tr><th></th>';
            
            // Create header row
            for (let j = 0; j < cols; j++) {
                tableHtml += `<th>Category ${j+1}</th>`;
            }
            tableHtml += '</tr>';
            
            // Create data rows
            for (let i = 0; i < rows; i++) {
                tableHtml += `<tr><th>Group ${i+1}</th>`;
                for (let j = 0; j < cols; j++) {
                    tableHtml += `<td><input type="number" min="0" class="form-control chi-cell" id="cell-${i}-${j}" required></td>`;
                }
                tableHtml += '</tr>';
            }
            
            tableHtml += '</table>';
            tableContainer.innerHTML = tableHtml;
        }
        
        // Calculate Z Confidence Interval
        function calculateZCI() {
            const mean = parseFloat(document.getElementById('z-sample-mean').value);
            const stdDev = parseFloat(document.getElementById('z-pop-std').value);
            const n = parseInt(document.getElementById('z-sample-size').value);
            const confidenceLevel = parseFloat(document.getElementById('z-confidence').value);
            
            // Validate inputs
            if (isNaN(mean) || isNaN(stdDev) || isNaN(n) || n <= 0 || stdDev < 0) {
                alert('Please enter valid values for all fields.');
                return;
            }
            
            // Calculate confidence interval
            const alpha = 1 - confidenceLevel;
            const zCritical = getZCritical(alpha / 2);
            const marginOfError = zCritical * (stdDev / Math.sqrt(n));
            const lowerBound = mean - marginOfError;
            const upperBound = mean + marginOfError;
            
            // Display results
            const resultsContainer = document.getElementById('results-container');
            const resultsContent = document.getElementById('results-content');
            
            let resultsHtml = '<h4>Z Confidence Interval Results</h4>';
            resultsHtml += `<p>Sample Mean (x̄): ${mean}</p>`;
            resultsHtml += `<p>Population Standard Deviation (σ): ${stdDev}</p>`;
            resultsHtml += `<p>Sample Size (n): ${n}</p>`;
            resultsHtml += `<p>Confidence Level: ${confidenceLevel * 100}%</p>`;
            resultsHtml += `<p>Z Critical Value: ${zCritical.toFixed(4)}</p>`;
            resultsHtml += `<p>Margin of Error: ${marginOfError.toFixed(4)}</p>`;
            resultsHtml += `<p>Confidence Interval: (${lowerBound.toFixed(4)}, ${upperBound.toFixed(4)})</p>`;
            resultsHtml += `<p class="mt-3">Interpretation: We are ${confidenceLevel * 100}% confident that the true population mean lies between ${lowerBound.toFixed(4)} and ${upperBound.toFixed(4)}.</p>`;
            
            resultsContent.innerHTML = resultsHtml;
            resultsContainer.style.display = 'block';
            
            // Draw the chart
            drawNormalDistribution('resultsChart', 0, 1, zCritical, -zCritical, 'Z Confidence Interval');
        }
        
        // Calculate T Confidence Interval
        function calculateTCI() {
            const mean = parseFloat(document.getElementById('t-sample-mean').value);
            const stdDev = parseFloat(document.getElementById('t-sample-std').value);
            const n = parseInt(document.getElementById('t-sample-size').value);
            const confidenceLevel = parseFloat(document.getElementById('t-confidence').value);
            
            // Validate inputs
            if (isNaN(mean) || isNaN(stdDev) || isNaN(n) || n <= 1 || stdDev < 0) {
                alert('Please enter valid values for all fields. Sample size must be at least 2.');
                return;
            }
            
            // Calculate confidence interval
            const alpha = 1 - confidenceLevel;
            const df = n - 1;
            const tCritical = getTCritical(alpha / 2, df);
            const marginOfError = tCritical * (stdDev / Math.sqrt(n));
            const lowerBound = mean - marginOfError;
            const upperBound = mean + marginOfError;
            
            // Display results
            const resultsContainer = document.getElementById('results-container');
            const resultsContent = document.getElementById('results-content');
            
            let resultsHtml = '<h4>T Confidence Interval Results</h4>';
            resultsHtml += `<p>Sample Mean (x̄): ${mean}</p>`;
            resultsHtml += `<p>Sample Standard Deviation (s): ${stdDev}</p>`;
            resultsHtml += `<p>Sample Size (n): ${n}</p>`;
            resultsHtml += `<p>Degrees of Freedom: ${df}</p>`;
            resultsHtml += `<p>Confidence Level: ${confidenceLevel * 100}%</p>`;
            resultsHtml += `<p>t Critical Value: ${tCritical.toFixed(4)}</p>`;
            resultsHtml += `<p>Margin of Error: ${marginOfError.toFixed(4)}</p>`;
            resultsHtml += `<p>Confidence Interval: (${lowerBound.toFixed(4)}, ${upperBound.toFixed(4)})</p>`;
            resultsHtml += `<p class="mt-3">Interpretation: We are ${confidenceLevel * 100}% confident that the true population mean lies between ${lowerBound.toFixed(4)} and ${upperBound.toFixed(4)}.</p>`;
            
            resultsContent.innerHTML = resultsHtml;
            resultsContainer.style.display = 'block';
            
            // Draw the chart
            drawTDistribution('resultsChart', 0, 1, df, tCritical, -tCritical, 'T Confidence Interval');
        }
        
        // Calculate One-Sample Hypothesis Test
        function calculateOneSampleTest() {
            const nullMean = parseFloat(document.getElementById('one-null-hypo').value);
            const sampleMean = parseFloat(document.getElementById('one-sample-mean').value);
            const stdDev = parseFloat(document.getElementById('one-std-dev').value);
            const n = parseInt(document.getElementById('one-sample-size').value);
            const altHypo = document.getElementById('one-alt-hypo').value;
            const alpha = parseFloat(document.getElementById('one-alpha').value);
            const stdType = document.querySelector('input[name="std-type"]:checked').value;
            
            // Validate inputs
            if (isNaN(nullMean) || isNaN(sampleMean) || isNaN(stdDev) || isNaN(n) || n <= 0 || stdDev < 0) {
                alert('Please enter valid values for all fields.');
                return;
            }
            
            let testStat, pValue, criticalValue;
            let testType, df;
            
            // Calculate test statistic
            if (stdType === 'known') {
                // Z-test
                testType = 'Z';
                testStat = (sampleMean - nullMean) / (stdDev / Math.sqrt(n));
                
                // Calculate p-value based on alternative hypothesis
                if (altHypo === 'two-sided') {
                    pValue = 2 * (1 - math.erf(Math.abs(testStat) / Math.sqrt(2)) / 2);
                    criticalValue = getZCritical(alpha / 2);
                } else if (altHypo === 'less-than') {
                    pValue = math.erf(testStat / Math.sqrt(2)) / 2;
                    criticalValue = -getZCritical(alpha);
                } else { // greater-than
                    pValue = 1 - math.erf(testStat / Math.sqrt(2)) / 2;
                    criticalValue = getZCritical(alpha);
                }
            } else {
                // T-test
                testType = 't';
                df = n - 1;
                testStat = (sampleMean - nullMean) / (stdDev / Math.sqrt(n));
                
                // Calculate p-value based on alternative hypothesis
                if (altHypo === 'two-sided') {
                    pValue = 2 * math.min(math.studentT.cdf(testStat, df), 1 - math.studentT.cdf(testStat, df));
                    criticalValue = getTCritical(alpha / 2, df);
                } else if (altHypo === 'less-than') {
                    pValue = math.studentT.cdf(testStat, df);
                    criticalValue = -getTCritical(alpha, df);
                } else { // greater-than
                    pValue = 1 - math.studentT.cdf(testStat, df);
                    criticalValue = getTCritical(alpha, df);
                }
            }
            
            // Determine test decision
            let decision = '';
            if ((altHypo === 'two-sided' && Math.abs(testStat) > Math.abs(criticalValue)) ||
                (altHypo === 'less-than' && testStat < criticalValue) ||
                (altHypo === 'greater-than' && testStat > criticalValue)) {
                decision = `Reject the null hypothesis (H₀: μ = ${nullMean})`;
            } else {
                decision = `Fail to reject the null hypothesis (H₀: μ = ${nullMean})`;
            }
            
            // Alternative hypothesis in words
            let altHypoText = '';
            if (altHypo === 'two-sided') {
                altHypoText = `H₁: μ ≠ ${nullMean}`;
            } else if (altHypo === 'less-than') {
                altHypoText = `H₁: μ < ${nullMean}`;
            } else { // greater-than
                altHypoText = `H₁: μ > ${nullMean}`;
            }
            
            // Display results
            const resultsContainer = document.getElementById('results-container');
            const resultsContent = document.getElementById('results-content');
            
            let resultsHtml = `<h4>One-Sample ${testType}-Test Results</h4>`;
            resultsHtml += `<p>Null Hypothesis (H₀): μ = ${nullMean}</p>`;
            resultsHtml += `<p>Alternative Hypothesis: ${altHypoText}</p>`;
            resultsHtml += `<p>Sample Mean (x̄): ${sampleMean}</p>`;
            resultsHtml += `<p>Standard Deviation ${stdType === 'known' ? '(σ)' : '(s)'}: ${stdDev}</p>`;
            resultsHtml += `<p>Sample Size (n): ${n}</p>`;
            if (stdType === 'sample') {
                resultsHtml += `<p>Degrees of Freedom: ${df}</p>`;
            }
            resultsHtml += `<p>Significance Level (α): ${alpha}</p>`;
            resultsHtml += `<p>${testType} Test Statistic: ${testStat.toFixed(4)}</p>`;
            resultsHtml += `<p>Critical Value: ${criticalValue.toFixed(4)}</p>`;
            resultsHtml += `<p>P-value: ${pValue.toFixed(4)}</p>`;
            resultsHtml += `<p class="mt-3"><strong>Decision:</strong> ${decision}</p>`;
            
            // Add interpretation
            let interpretationText = '';
            if (pValue <= alpha) {
                if (altHypo === 'two-sided') {
                    interpretationText = `At the ${alpha * 100}% significance level, there is sufficient evidence to conclude that the population mean is different from ${nullMean}.`;
                } else if (altHypo === 'less-than') {
                    interpretationText = `At the ${alpha * 100}% significance level, there is sufficient evidence to conclude that the population mean is less than ${nullMean}.`;
                } else { // greater-than
                    interpretationText = `At the ${alpha * 100}% significance level, there is sufficient evidence to conclude that the population mean is greater than ${nullMean}.`;
                }
            } else {
                interpretationText = `At the ${alpha * 100}% significance level, there is insufficient evidence to conclude that the population mean `;
                if (altHypo === 'two-sided') {
                    interpretationText += `is different from ${nullMean}.`;
                } else if (altHypo === 'less-than') {
                    interpretationText += `is less than ${nullMean}.`;
                } else { // greater-than
                    interpretationText += `is greater than ${nullMean}.`;
                }
            }
            
            resultsHtml += `<p><strong>Interpretation:</strong> ${interpretationText}</p>`;
            
            resultsContent.innerHTML = resultsHtml;
            resultsContainer.style.display = 'block';
            
            // Draw the chart
            if (testType === 'Z') {
                drawNormalDistributionWithTestStat('resultsChart', 0, 1, testStat, criticalValue, altHypo);
            } else {
                drawTDistributionWithTestStat('resultsChart', 0, 1, df, testStat, criticalValue, altHypo);
            }
        }
        
        // Calculate Two-Sample Hypothesis Test
        function calculateTwoSampleTest() {
            const mean1 = parseFloat(document.getElementById('two-sample1-mean').value);
            const std1 = parseFloat(document.getElementById('two-sample1-std').value);
            const n1 = parseInt(document.getElementById('two-sample1-size').value);
            
            const mean2 = parseFloat(document.getElementById('two-sample2-mean').value);
            const std2 = parseFloat(document.getElementById('two-sample2-std').value);
            const n2 = parseInt(document.getElementById('two-sample2-size').value);
            
            const altHypo = document.getElementById('two-alt-hypo').value;
            const alpha = parseFloat(document.getElementById('two-alpha').value);
            const varianceType = document.querySelector('input[name="variance-type"]:checked').value;
            
            // Validate inputs
            if (isNaN(mean1) || isNaN(std1) || isNaN(n1) || 
                isNaN(mean2) || isNaN(std2) || isNaN(n2) || 
                n1 <= 1 || n2 <= 1 || std1 <= 0 || std2 <= 0) {
                alert('Please enter valid values for all fields. Sample sizes must be at least 2 and standard deviations must be positive.');
                return;
            }
            
            // Calculate the mean difference
            const meanDiff = mean1 - mean2;
            
            let testStat, df, pooledStdErr;
            
            // Calculate test statistic based on variance assumption
            if (varianceType === 'equal') {
                // Pooled variance t-test
                const pooledVariance = ((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2);
                pooledStdErr = Math.sqrt(pooledVariance * (1/n1 + 1/n2));
                testStat = meanDiff / pooledStdErr;
                df = n1 + n2 - 2;
            } else {
                // Welch's t-test for unequal variances
                const term1 = (std1 * std1) / n1;
                const term2 = (std2 * std2) / n2;
                pooledStdErr = Math.sqrt(term1 + term2);
                testStat = meanDiff / pooledStdErr;
                
                // Calculate Welch-Satterthwaite degrees of freedom
                const numerator = Math.pow(term1 + term2, 2);
                const denominator = (Math.pow(term1, 2) / (n1 - 1)) + (Math.pow(term2, 2) / (n2 - 1));
                df = numerator / denominator;
            }
            
            // Calculate p-value and critical value based on alternative hypothesis
            let pValue, criticalValue;
            if (altHypo === 'two-sided') {
                pValue = 2 * math.min(math.studentT.cdf(testStat, df), 1 - math.studentT.cdf(testStat, df));
                criticalValue = getTCritical(alpha / 2, df);
            } else if (altHypo === 'less-than') {
                pValue = math.studentT.cdf(testStat, df);
                criticalValue = -getTCritical(alpha, df);
            } else { // greater-than
                pValue = 1 - math.studentT.cdf(testStat, df);
                criticalValue = getTCritical(alpha, df);
            }
            
            // Determine test decision
            let decision = '';
            if ((altHypo === 'two-sided' && Math.abs(testStat) > Math.abs(criticalValue)) ||
                (altHypo === 'less-than' && testStat < criticalValue) ||
                (altHypo === 'greater-than' && testStat > criticalValue)) {
                decision = 'Reject the null hypothesis (H₀: μ₁ = μ₂)';
            } else {
                decision = 'Fail to reject the null hypothesis (H₀: μ₁ = μ₂)';
            }
            
            // Alternative hypothesis in words
            let altHypoText = '';
            if (altHypo === 'two-sided') {
                altHypoText = 'H₁: μ₁ ≠ μ₂';
            } else if (altHypo === 'less-than') {
                altHypoText = 'H₁: μ₁ < μ₂';
            } else { // greater-than
                altHypoText = 'H₁: μ₁ > μ₂';
            }
            
            // Display results
            const resultsContainer = document.getElementById('results-container');
            const resultsContent = document.getElementById('results-content');
            
            let resultsHtml = '<h4>Two-Sample t-Test Results</h4>';
            resultsHtml += `<p>Null Hypothesis (H₀): μ₁ = μ₂</p>`;
            resultsHtml += `<p>Alternative Hypothesis: ${altHypoText}</p>`;
            resultsHtml += '<h5>Sample 1</h5>';
            resultsHtml += `<p>Mean (x̄₁): ${mean1}</p>`;
            resultsHtml += `<p>Standard Deviation (s₁): ${std1}</p>`;
            resultsHtml += `<p>Sample Size (n₁): ${n1}</p>`;
            resultsHtml += '<h5>Sample 2</h5>';
            resultsHtml += `<p>Mean (x̄₂): ${mean2}</p>`;
            resultsHtml += `<p>Standard Deviation (s₂): ${std2}</p>`;
            resultsHtml += `<p>Sample Size (n₂): ${n2}</p>`;
            resultsHtml += `<p>Mean Difference (x̄₁ - x̄₂): ${meanDiff.toFixed(4)}</p>`;
            resultsHtml += `<p>Standard Error: ${pooledStdErr.toFixed(4)}</p>`;
            resultsHtml += `<p>Degrees of Freedom: ${df.toFixed(2)}</p>`;
            resultsHtml += `<p>t Test Statistic: ${testStat.toFixed(4)}</p>`;
            resultsHtml += `<p>Critical Value: ${criticalValue.toFixed(4)}</p>`;
            resultsHtml += `<p>P-value: ${pValue.toFixed(4)}</p>`;
            resultsHtml += `<p>Significance Level (α): ${alpha}</p>`;
            resultsHtml += `<p class="mt-3"><strong>Decision:</strong> ${decision}</p>`;
            
            // Add interpretation
            let interpretationText = '';
            if (pValue <= alpha) {
                if (altHypo === 'two-sided') {
                    interpretationText = `At the ${alpha * 100}% significance level, there is sufficient evidence to conclude that the means of the two populations are different.`;
                } else if (altHypo === 'less-than') {
                    interpretationText = `At the ${alpha * 100}% significance level, there is sufficient evidence to conclude that the mean of population 1 is less than the mean of population 2.`;
                } else { // greater-than
                    interpretationText = `At the ${alpha * 100}% significance level, there is sufficient evidence to conclude that the mean of population 1 is greater than the mean of population 2.`;
                }
            } else {
                interpretationText = `At the ${alpha * 100}% significance level, there is insufficient evidence to conclude that `;
                if (altHypo === 'two-sided') {
                    interpretationText += `the means of the two populations are different.`;
                } else if (altHypo === 'less-than') {
                    interpretationText += `the mean of population 1 is less than the mean of population 2.`;
                } else { // greater-than
                    interpretationText += `the mean of population 1 is greater than the mean of population 2.`;
                }
            }
            
            resultsHtml += `<p><strong>Interpretation:</strong> ${interpretationText}</p>`;
            
            resultsContent.innerHTML = resultsHtml;
            resultsContainer.style.display = 'block';
            
            // Draw the chart
            drawTDistributionWithTestStat('resultsChart', 0, 1, df, testStat, criticalValue, altHypo);
        }
        
        // Calculate Chi-Square Test for Independence
        function calculateChiSquare() {
            const rows = parseInt(document.getElementById('chi-rows').value);
            const cols = parseInt(document.getElementById('chi-cols').value);
            const alpha = parseFloat(document.getElementById('chi-alpha').value);
            
            // Get observed values from table cells
            const observed = [];
            for (let i = 0; i < rows; i++) {
                observed[i] = [];
                for (let j = 0; j < cols; j++) {
                    const cellValue = parseInt(document.getElementById(`cell-${i}-${j}`).value);
                    if (isNaN(cellValue) || cellValue < 0) {
                        alert('Please enter valid non-negative integer values for all cells.');
                        return;
                    }
                    observed[i][j] = cellValue;
                }
            }
            
            // Calculate row and column totals
            const rowTotals = Array(rows).fill(0);
            const colTotals = Array(cols).fill(0);
            let grandTotal = 0;
            
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    rowTotals[i] += observed[i][j];
                    colTotals[j] += observed[i][j];
                    grandTotal += observed[i][j];
                }
            }
            
            // Calculate expected values
            const expected = [];
            for (let i = 0; i < rows; i++) {
                expected[i] = [];
                for (let j = 0; j < cols; j++) {
                    expected[i][j] = (rowTotals[i] * colTotals[j]) / grandTotal;
                    // Check for small expected values
                    if (expected[i][j] < 5) {
                        // We should warn the user about small expected values
                        alert('Warning: Some expected frequencies are less than 5. Chi-square test may not be appropriate.');
                        break;
                    }
                }
            }
            
            // Calculate chi-square statistic
            let chiSquareStat = 0;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    chiSquareStat += Math.pow(observed[i][j] - expected[i][j], 2) / expected[i][j];
                }
            }
            
            // Calculate degrees of freedom and critical value
            const df = (rows - 1) * (cols - 1);
            const criticalValue = getChiSquareCritical(alpha, df);
            
            // Calculate p-value
            const pValue = 1 - math.chi2.cdf(chiSquareStat, df);
            
            // Determine test decision
            const decision = pValue <= alpha ? 
                'Reject the null hypothesis (H₀: The variables are independent)' : 
                'Fail to reject the null hypothesis (H₀: The variables are independent)';
            
            // Display results
            const resultsContainer = document.getElementById('results-container');
            const resultsContent = document.getElementById('results-content');
            
            let resultsHtml = '<h4>Chi-Square Test for Independence Results</h4>';
            resultsHtml += `<p>Null Hypothesis (H₀): The row and column variables are independent</p>`;
            resultsHtml += `<p>Alternative Hypothesis (H₁): The row and column variables are not independent (dependent)</p>`;
            
            // Display observed and expected frequencies in tables
            resultsHtml += '<h5>Observed Frequencies</h5>';
            resultsHtml += '<table class="table table-bordered">';
            // Header row
            resultsHtml += '<tr><th></th>';
            for (let j = 0; j < cols; j++) {
                resultsHtml += `<th>Category ${j+1}</th>`;
            }
            resultsHtml += '<th>Total</th></tr>';
            
            // Data rows
            for (let i = 0; i < rows; i++) {
                resultsHtml += `<tr><th>Group ${i+1}</th>`;
                for (let j = 0; j < cols; j++) {
                    resultsHtml += `<td>${observed[i][j]}</td>`;
                }
                resultsHtml += `<td>${rowTotals[i]}</td></tr>`;
            }
            
            // Total row
            resultsHtml += '<tr><th>Total</th>';
            for (let j = 0; j < cols; j++) {
                resultsHtml += `<td>${colTotals[j]}</td>`;
            }
            resultsHtml += `<td>${grandTotal}</td></tr>`;
            resultsHtml += '</table>';
            
            // Expected frequencies table
            resultsHtml += '<h5>Expected Frequencies</h5>';
            resultsHtml += '<table class="table table-bordered">';
            // Header row
            resultsHtml += '<tr><th></th>';
            for (let j = 0; j < cols; j++) {
                resultsHtml += `<th>Category ${j+1}</th>`;
            }
            resultsHtml += '</tr>';
            
            // Data rows
            for (let i = 0; i < rows; i++) {
                resultsHtml += `<tr><th>Group ${i+1}</th>`;
                for (let j = 0; j < cols; j++) {
                    resultsHtml += `<td>${expected[i][j].toFixed(2)}</td>`;
                }
                resultsHtml += '</tr>';
            }
            resultsHtml += '</table>';
            
            // Test statistics
            resultsHtml += `<p>Chi-Square Statistic: ${chiSquareStat.toFixed(4)}</p>`;
            resultsHtml += `<p>Degrees of Freedom: ${df}</p>`;
            resultsHtml += `<p>Critical Value (at α = ${alpha}): ${criticalValue.toFixed(4)}</p>`;
            resultsHtml += `<p>P-value: ${pValue.toFixed(4)}</p>`;
            resultsHtml += `<p class="mt-3"><strong>Decision:</strong> ${decision}</p>`;
            
            // Add interpretation
            let interpretationText = '';
            if (pValue <= alpha) {
                interpretationText = `At the ${alpha * 100}% significance level, there is sufficient evidence to conclude that the row and column variables are dependent (not independent). There is a statistically significant association between the variables.`;
            } else {
                interpretationText = `At the ${alpha * 100}% significance level, there is insufficient evidence to conclude that the row and column variables are dependent. We fail to reject the independence assumption.`;
            }
            
            resultsHtml += `<p><strong>Interpretation:</strong> ${interpretationText}</p>`;
            
            resultsContent.innerHTML = resultsHtml;
            resultsContainer.style.display = 'block';
            
            // Draw the chi-square distribution chart
            drawChiSquareDistribution('resultsChart', df, chiSquareStat, criticalValue);
        }
        
        // Run the hypothesis testing simulation
        function runSimulation() {
            const hypothesizedMean = parseFloat(document.getElementById('sim-hypo-mean').value);
            const sampleMean = parseFloat(document.getElementById('sim-sample-mean').value);
            const stdDev = parseFloat(document.getElementById('sim-std-dev').value);
            const sampleSize = parseInt(document.getElementById('sim-sample-size').value);
            const alpha = parseFloat(document.getElementById('sim-alpha').value);
            const nullHypoType = document.getElementById('sim-h0-type').value;
            
            // Validate inputs
            if (isNaN(hypothesizedMean) || isNaN(sampleMean) || isNaN(stdDev) || isNaN(sampleSize) || 
                sampleSize <= 0 || stdDev <= 0) {
                alert('Please enter valid values for all fields.');
                return;
            }
            
            // Calculate test statistic
            const se = stdDev / Math.sqrt(sampleSize);
            const testStat = (sampleMean - hypothesizedMean) / se;
            
            // Determine alternative hypothesis based on null hypothesis type
            let altHypo;
            if (nullHypoType === 'equal') {
                altHypo = 'two-sided';
            } else if (nullHypoType === 'less-equal') {
                altHypo = 'greater-than';
            } else { // greater-equal
                altHypo = 'less-than';
            }
            
            // Calculate p-value based on alternative hypothesis
            let pValue;
            if (altHypo === 'two-sided') {
                pValue = 2 * (1 - math.erf(Math.abs(testStat) / Math.sqrt(2)) / 2);
            } else if (altHypo === 'less-than') {
                pValue = math.erf(testStat / Math.sqrt(2)) / 2;
            } else { // greater-than
                pValue = 1 - math.erf(testStat / Math.sqrt(2)) / 2;
            }
            
            // Calculate critical value
            let criticalValue;
            if (altHypo === 'two-sided') {
                criticalValue = getZCritical(alpha / 2);
            } else {
                criticalValue = getZCritical(alpha);
            }
            
            // Determine test decision
            let decision;
            if ((altHypo === 'two-sided' && Math.abs(testStat) > criticalValue) ||
                (altHypo === 'less-than' && testStat < -criticalValue) ||
                (altHypo === 'greater-than' && testStat > criticalValue)) {
                decision = 'Reject H₀';
            } else {
                decision = 'Fail to reject H₀';
            }
            
            // Show simulation results
            const simResults = document.getElementById('simulation-results');
            const simExplanation = document.getElementById('sim-explanation');
            
            // Create explanation text
            let explanationHtml = '<div class="sim-result-card">';
            explanationHtml += `<p><strong>Test Statistic (Z):</strong> ${testStat.toFixed(4)}</p>`;
            explanationHtml += `<p><strong>P-value:</strong> ${pValue.toFixed(4)}</p>`;
            
            // Format null hypothesis based on type
            let nullHypoText;
            if (nullHypoType === 'equal') {
                nullHypoText = `H₀: μ = ${hypothesizedMean}`;
            } else if (nullHypoType === 'less-equal') {
                nullHypoText = `H₀: μ ≤ ${hypothesizedMean}`;
            } else { // greater-equal
                nullHypoText = `H₀: μ ≥ ${hypothesizedMean}`;
            }
            
            // Format alternative hypothesis based on null type
            let altHypoText;
            if (nullHypoType === 'equal') {
                altHypoText = `H₁: μ ≠ ${hypothesizedMean}`;
            } else if (nullHypoType === 'less-equal') {
                altHypoText = `H₁: μ > ${hypothesizedMean}`;
            } else { // greater-equal
                altHypoText = `H₁: μ < ${hypothesizedMean}`;
            }
            
            explanationHtml += `<p><strong>Null Hypothesis:</strong> ${nullHypoText}</p>`;
            explanationHtml += `<p><strong>Alternative Hypothesis:</strong> ${altHypoText}</p>`;
            explanationHtml += `<p><strong>Significance Level (α):</strong> ${alpha}</p>`;
            
            // Decision explanation
            let decisionClass = pValue <= alpha ? 'text-success' : 'text-danger';
            explanationHtml += `<p><strong>Decision:</strong> <span class="${decisionClass}">${decision}</span></p>`;
            
            if (pValue <= alpha) {
                explanationHtml += `<p>Since the p-value (${pValue.toFixed(4)}) is less than or equal to alpha (${alpha}), we reject the null hypothesis.</p>`;
            } else {
                explanationHtml += `<p>Since the p-value (${pValue.toFixed(4)}) is greater than alpha (${alpha}), we fail to reject the null hypothesis.</p>`;
            }
            
            explanationHtml += '</div>';
            
            simExplanation.innerHTML = explanationHtml;
            simResults.style.display = 'block';
            
            // Draw the simulation chart
            drawSimulationChart('simulationChart', 0, 1, testStat, criticalValue, altHypo);
        }
        
        // Helper function to get Z critical value
        function getZCritical(alpha) {
            // Z = Phi^(-1)(1-alpha) where Phi is the standard normal CDF
            return math.sqrt(2) * math.erfInv(1 - 2 * alpha);
        }
        
        // Helper function to get T critical value
        function getTCritical(alpha, df) {
            // Use the math.js library to calculate the t critical value
            return math.studentT.inv(1 - alpha, df);
        }
        
        // Helper function to get Chi-Square critical value
        function getChiSquareCritical(alpha, df) {
            // Use the math.js library to calculate the chi-square critical value
            return math.chi2.inv(1 - alpha, df);
        }
        
        // Draw a normal distribution with critical regions
        function drawNormalDistribution(canvasId, mean, stdDev, rightCritical, leftCritical, title) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            // Clear any existing chart
            if (Chart.getChart(canvasId)) {
                Chart.getChart(canvasId).destroy();
            }
            
            // Calculate distribution points for plotting
            const xMin = mean - 4 * stdDev;
            const xMax = mean + 4 * stdDev;
            const step = (xMax - xMin) / 100;
            
            const xValues = [];
            const yValues = [];
            const criticalAreaRight = [];
            const criticalAreaLeft = [];
            const middleArea = [];
            
            for (let x = xMin; x <= xMax; x += step) {
                xValues.push(x);
                const y = normalPDF(x, mean, stdDev);
                yValues.push(y);
                
                // Determine if this point is in a critical region
                if (x >= rightCritical * stdDev + mean) {
                    criticalAreaRight.push(y);
                    criticalAreaLeft.push(null);
                    middleArea.push(null);
                } else if (x <= leftCritical * stdDev + mean) {
                    criticalAreaRight.push(null);
                    criticalAreaLeft.push(y);
                    middleArea.push(null);
                } else {
                    criticalAreaRight.push(null);
                    criticalAreaLeft.push(null);
                    middleArea.push(y);
                }
            }
            
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: [
                        {
                            label: 'Middle Area',
                            data: middleArea,
                            borderColor: 'blue',
                            backgroundColor: 'rgba(0, 0, 255, 0.1)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Right Critical Area',
                            data: criticalAreaRight,
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 0, 0, 0.3)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Left Critical Area',
                            data: criticalAreaLeft,
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 0, 0, 0.3)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: title || 'Normal Distribution',
                            font: { size: 16 }
                        },
                        legend: {
                            display: true
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Z Value'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Probability Density'
                            }
                        }
                    }
                }
            });
        }
        
        // Draw a t-distribution with critical regions
        function drawTDistribution(canvasId, mean, stdDev, df, rightCritical, leftCritical, title) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            // Clear any existing chart
            if (Chart.getChart(canvasId)) {
                Chart.getChart(canvasId).destroy();
            }
            
            // Calculate distribution points for plotting
            const xMin = mean - 4 * stdDev;
            const xMax = mean + 4 * stdDev;
            const step = (xMax - xMin) / 100;
            
            const xValues = [];
            const yValues = [];
            const criticalAreaRight = [];
            const criticalAreaLeft = [];
            const middleArea = [];
            
            for (let x = xMin; x <= xMax; x += step) {
                xValues.push(x);
                const y = tPDF(x, df);
                yValues.push(y);
                
                // Determine if this point is in a critical region
                if (x >= rightCritical) {
                    criticalAreaRight.push(y);
                    criticalAreaLeft.push(null);
                    middleArea.push(null);
                } else if (x <= leftCritical) {
                    criticalAreaRight.push(null);
                    criticalAreaLeft.push(y);
                    middleArea.push(null);
                } else {
                    criticalAreaRight.push(null);
                    criticalAreaLeft.push(null);
                    middleArea.push(y);
                }
            }
            
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: [
                        {
                            label: 'Middle Area',
                            data: middleArea,
                            borderColor: 'blue',
                            backgroundColor: 'rgba(0, 0, 255, 0.1)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Right Critical Area',
                            data: criticalAreaRight,
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 0, 0, 0.3)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Left Critical Area',
                            data: criticalAreaLeft,
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 0, 0, 0.3)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: title || `t-Distribution (df = ${df.toFixed(0)})`,
                            font: { size: 16 }
                        },
                        legend: {
                            display: true
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 't Value'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Probability Density'
                            }
                        }
                    }
                }
            });
        }
        
        // Draw a normal distribution with test statistic
        function drawNormalDistributionWithTestStat(canvasId, mean, stdDev, testStat, criticalValue, altHypo) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            // Clear any existing chart
            if (Chart.getChart(canvasId)) {
                Chart.getChart(canvasId).destroy();
            }
            
            // Calculate distribution points for plotting
            const xMin = mean - 4 * stdDev;
            const xMax = mean + 4 * stdDev;
            const step = (xMax - xMin) / 100;
            
            const xValues = [];
            const yValues = [];
            const criticalArea = [];
            const nonCriticalArea = [];
            
            // Set critical values based on alternative hypothesis type
            let rightCritical = null;
            let leftCritical = null;
            
            if (altHypo === 'two-sided') {
                rightCritical = criticalValue;
                leftCritical = -criticalValue;
            } else if (altHypo === 'less-than') {
                leftCritical = criticalValue; // Note: criticalValue should be negative here
            } else { // greater-than
                rightCritical = criticalValue;
            }
            
            for (let x = xMin; x <= xMax; x += step) {
                xValues.push(x);
                const y = normalPDF(x, mean, stdDev);
                yValues.push(y);
                
                // Determine if this point is in a critical region
                if ((rightCritical !== null && x >= rightCritical) || 
                    (leftCritical !== null && x <= leftCritical)) {
                    criticalArea.push(y);
                    nonCriticalArea.push(null);
                } else {
                    criticalArea.push(null);
                    nonCriticalArea.push(y);
                }
            }
            
            // Create datasets for chart
            const datasets = [
                {
                    label: 'Non-Critical Area',
                    data: nonCriticalArea,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Critical Area',
                    data: criticalArea,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    fill: true,
                    tension: 0.4
                }
            ];
            
            // Add test statistic point
            const testStatPoint = {
                label: 'Test Statistic',
                data: Array(xValues.length).fill(null),
                pointBackgroundColor: 'green',
                pointRadius: 6,
                pointHoverRadius: 8,
                type: 'scatter'
            };
            
            // Find the closest index to test statistic
            const testStatIndex = Math.round((testStat - xMin) / step);
            if (testStatIndex >= 0 && testStatIndex < testStatPoint.data.length) {
                testStatPoint.data[testStatIndex] = normalPDF(testStat, mean, stdDev);
            }
            
            datasets.push(testStatPoint);
            
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: datasets
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Hypothesis Test Results (Z-Distribution)',
                            font: { size: 16 }
                        },
                        legend: {
                            display: true
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.dataset.label === 'Test Statistic') {
                                        return `Test Statistic: ${testStat.toFixed(4)}`;
                                    }
                                    return context.dataset.label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Z Value'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Probability Density'
                            }
                        }
                    }
                }
            });
        }
        
        // Draw a t-distribution with test statistic
        function drawTDistributionWithTestStat(canvasId, mean, stdDev, df, testStat, criticalValue, altHypo) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            // Clear any existing chart
            if (Chart.getChart(canvasId)) {
                Chart.getChart(canvasId).destroy();
            }
            
            // Calculate distribution points for plotting
            const xMin = -4;  // t-distribution range
            const xMax = 4;
            const step = (xMax - xMin) / 100;
            
            const xValues = [];
            const yValues = [];
            const criticalArea = [];
            const nonCriticalArea = [];
            
            // Set critical values based on alternative hypothesis type
            let rightCritical = null;
            let leftCritical = null;
            
            if (altHypo === 'two-sided') {
                rightCritical = Math.abs(criticalValue);
                leftCritical = -Math.abs(criticalValue);
            } else if (altHypo === 'less-than') {
                leftCritical = criticalValue; // Note: criticalValue should be negative here
            } else { // greater-than
                rightCritical = criticalValue;
            }
            
            for (let x = xMin; x <= xMax; x += step) {
                xValues.push(x);
                const y = tPDF(x, df);
                yValues.push(y);
                
                // Determine if this point is in a critical region
                if ((rightCritical !== null && x >= rightCritical) || 
                    (leftCritical !== null && x <= leftCritical)) {
                    criticalArea.push(y);
                    nonCriticalArea.push(null);
                } else {
                    criticalArea.push(null);
                    nonCriticalArea.push(y);
                }
            }
            
            // Create datasets for chart
            const datasets = [
                {
                    label: 'Non-Critical Area',
                    data: nonCriticalArea,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Critical Area',
                    data: criticalArea,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    fill: true,
                    tension: 0.4
                }
            ];
            
            // Add test statistic point
            const testStatPoint = {
                label: 'Test Statistic',
                data: Array(xValues.length).fill(null),
                pointBackgroundColor: 'green',
                pointRadius: 6,
                pointHoverRadius: 8,
                type: 'scatter'
            };
            
            // Find the closest index to test statistic
            const testStatIndex = Math.round((testStat - xMin) / step);
            if (testStatIndex >= 0 && testStatIndex < testStatPoint.data.length) {
                testStatPoint.data[testStatIndex] = tPDF(testStat, df);
            }
            
            datasets.push(testStatPoint);
            
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: datasets
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Hypothesis Test Results (t-Distribution, df = ${df.toFixed(1)})`,
                            font: { size: 16 }
                        },
                        legend: {
                            display: true
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.dataset.label === 'Test Statistic') {
                                        return `Test Statistic: ${testStat.toFixed(4)}`;
                                    }
                                    return context.dataset.label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 't Value'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Probability Density'
                            }
                        }
                    }
                }
            });
        }
        
        // Draw chi-square distribution with test statistic
        function drawChiSquareDistribution(canvasId, df, testStat, criticalValue) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            // Clear any existing chart
            if (Chart.getChart(canvasId)) {
                Chart.getChart(canvasId).destroy();
            }
            
            // Calculate distribution points for plotting
            // Chi-square range depends on df
            const xMax = Math.max(criticalValue * 1.5, testStat * 1.2, 3 * df);
            const xMin = 0;  // Chi-square starts at 0
            const step = xMax / 100;
            
            const xValues = [];
            const yValues = [];
            const criticalArea = [];
            const nonCriticalArea = [];
            
            for (let x = xMin; x <= xMax; x += step) {
                xValues.push(x);
                const y = chiSquarePDF(x, df);
                yValues.push(y);
                
                // Determine if this point is in a critical region
                if (x >= criticalValue) {
                    criticalArea.push(y);
                    nonCriticalArea.push(null);
                } else {
                    criticalArea.push(null);
                    nonCriticalArea.push(y);
                }
            }
            
            // Create datasets for chart
            const datasets = [
                {
                    label: 'Non-Critical Area',
                    data: nonCriticalArea,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Critical Area',
                    data: criticalArea,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    fill: true,
                    tension: 0.4
                }
            ];
            
            // Add test statistic point
            const testStatPoint = {
                label: 'Test Statistic',
                data: Array(xValues.length).fill(null),
                pointBackgroundColor: 'green',
                pointRadius: 6,
                pointHoverRadius: 8,
                type: 'scatter'
            };
            
            // Find the closest index to test statistic
            const testStatIndex = Math.round((testStat - xMin) / step);
            if (testStatIndex >= 0 && testStatIndex < testStatPoint.data.length) {
                testStatPoint.data[testStatIndex] = chiSquarePDF(testStat, df);
            }
            
            datasets.push(testStatPoint);
            
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: datasets
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Chi-Square Test Results (df = ${df})`,
                            font: { size: 16 }
                        },
                        legend: {
                            display: true
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.dataset.label === 'Test Statistic') {
                                        return `Test Statistic: ${testStat.toFixed(4)}`;
                                    }
                                    return context.dataset.label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Chi-Square Value'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Probability Density'
                            }
                        }
                    }
                }
            });
        }
        
        // Draw simulation chart
        function drawSimulationChart(canvasId, mean, stdDev, testStat, criticalValue, altHypo) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            // Clear any existing chart
            if (Chart.getChart(canvasId)) {
                Chart.getChart(canvasId).destroy();
            }
            
            // Calculate distribution points for plotting
            const xMin = mean - 4 * stdDev;
            const xMax = mean + 4 * stdDev;
            const step = (xMax - xMin) / 100;
            
            const xValues = [];
            const yValues = [];
            const criticalArea = [];
            const nonCriticalArea = [];
            
            // Set critical values based on alternative hypothesis type
            let rightCritical = null;
            let leftCritical = null;
            
            if (altHypo === 'two-sided') {
                rightCritical = criticalValue;
                leftCritical = -criticalValue;
            } else if (altHypo === 'less-than') {
                leftCritical = -criticalValue; // negative for less-than
            } else { // greater-than
                rightCritical = criticalValue;
            }
            
            for (let x = xMin; x <= xMax; x += step) {
                xValues.push(x);
                const y = normalPDF(x, mean, stdDev);
                yValues.push(y);
                
                // Determine if this point is in a critical region
                if ((rightCritical !== null && x >= rightCritical) || 
                    (leftCritical !== null && x <= leftCritical)) {
                    criticalArea.push(y);
                    nonCriticalArea.push(null);
                } else {
                    criticalArea.push(null);
                    nonCriticalArea.push(y);
                }
            }
            
            // Create datasets for chart
            const datasets = [
                {
                    label: 'Non-Critical Region',
                    data: nonCriticalArea,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Critical Region',
                    data: criticalArea,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    fill: true,
                    tension: 0.4
                }
            ];
            
            // Add test statistic point
            const testStatPoint = {
                label: 'Test Statistic',
                data: Array(xValues.length).fill(null),
                pointBackgroundColor: 'green',
                pointRadius: 6,
                pointHoverRadius: 8,
                type: 'scatter'
            };
            
            // Find the closest index to test statistic
            const testStatIndex = Math.round((testStat - xMin) / step);
            if (testStatIndex >= 0 && testStatIndex < testStatPoint.data.length) {
                testStatPoint.data[testStatIndex] = normalPDF(testStat, mean, stdDev);
            }
            
            datasets.push(testStatPoint);
            
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: datasets
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Hypothesis Test Simulation',
                            font: { size: 16 }
                        },
                        legend: {
                            display: true
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.dataset.label === 'Test Statistic') {
                                        return `Z = ${testStat.toFixed(4)}`;
                                    }
                                    return context.dataset.label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Z Value'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Probability Density'
                            }
                        }
                    }
                }
            });
        }
        
        // Probability density function for normal distribution
        function normalPDF(x, mean, stdDev) {
            const variance = stdDev * stdDev;
            return (1 / Math.sqrt(2 * Math.PI * variance)) * 
                   Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
        }
        
        // Probability density function for t-distribution
        function tPDF(x, df) {
            const c = math.gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * math.gamma(df / 2));
            return c * Math.pow(1 + (x * x) / df, -((df + 1) / 2));
        }
        
        // Probability density function for chi-square distribution
        function chiSquarePDF(x, df) {
            if (x <= 0) return 0;
            const c = 1 / (Math.pow(2, df / 2) * math.gamma(df / 2));
            return c * Math.pow(x, (df / 2) - 1) * Math.exp(-x / 2);
        }
        
        // Function to create a download link for results
        function createDownloadLink(results, filename) {
            const blob = new Blob([results], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.textContent = 'Download Results';
            downloadLink.classList.add('btn', 'btn-primary', 'mt-3');
            
            return downloadLink;
        }
        
        // Export results for Z confidence interval
        function exportZCI() {
            const mean = parseFloat(document.getElementById('z-sample-mean').value);
            const stdDev = parseFloat(document.getElementById('z-pop-std').value);
            const n = parseInt(document.getElementById('z-sample-size').value);
            const confidenceLevel = parseFloat(document.getElementById('z-confidence').value);
            
            // Calculate confidence interval
            const alpha = 1 - confidenceLevel;
            const zCritical = getZCritical(alpha / 2);
            const marginOfError = zCritical * (stdDev / Math.sqrt(n));
            const lowerBound = mean - marginOfError;
            const upperBound = mean + marginOfError;
            
            // Create results text
            let results = "Z Confidence Interval Results\n\n";
            results += `Sample Mean (x̄): ${mean}\n`;
            results += `Population Standard Deviation (σ): ${stdDev}\n`;
            results += `Sample Size (n): ${n}\n`;
            results += `Confidence Level: ${confidenceLevel * 100}%\n`;
            results += `Z Critical Value: ${zCritical.toFixed(4)}\n`;
            results += `Margin of Error: ${marginOfError.toFixed(4)}\n`;
            results += `Confidence Interval: (${lowerBound.toFixed(4)}, ${upperBound.toFixed(4)})\n\n`;
            results += `Interpretation: We are ${confidenceLevel * 100}% confident that the true population mean lies between ${lowerBound.toFixed(4)} and ${upperBound.toFixed(4)}.`;
            
            // Create download link
            const downloadLink = createDownloadLink(results, 'z_confidence_interval_results.txt');
            
            // Add to results container
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.appendChild(downloadLink);
        }
        
        // Helper function to validate form inputs
        function validateInputs(inputIds) {
            for (const id of inputIds) {
                const input = document.getElementById(id);
                if (!input) continue;
                
                const value = parseFloat(input.value);
                if (isNaN(value)) {
                    alert(`Please enter a valid number for ${input.placeholder || id}`);
                    return false;
                }
                
                // Additional validation based on input type
                if (id.includes('sample-size') && value <= 0) {
                    alert('Sample size must be greater than zero');
                    return false;
                }
                
                if (id.includes('std') && value < 0) {
                    alert('Standard deviation cannot be negative');
                    return false;
                }
            }
            
            return true;
        }
        
        // Add export buttons to the page
        document.addEventListener('DOMContentLoaded', function() {
            // Add export functionality
            const exportButtons = {
                'export-z-ci': exportZCI,
                // Add more export functions as needed
            };
            
            for (const [id, func] of Object.entries(exportButtons)) {
                const button = document.getElementById(id);
                if (button) {
                    button.addEventListener('click', func);
                }
            }
        });
