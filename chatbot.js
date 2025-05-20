document.addEventListener("DOMContentLoaded", function() {
            const chatbotButton = document.getElementById("chatbot-button");
            const chatbotPopup = document.getElementById("chatbot-popup");
            const closeChatbot = document.getElementById("close-chatbot");
            const chatInput = document.getElementById("chat-input");
            const sendMessage = document.getElementById("send-message");
            const chatbotBody = document.querySelector(".chatbot-body");
            const quickReplies = document.querySelectorAll(".quick-reply");
            
            // Check if all elements exist
            if (!chatbotButton || !chatbotPopup || !closeChatbot || !chatInput || !sendMessage || !chatbotBody) {
                console.error("Some chatbot elements are missing from the DOM");
                return;
            }
            
            // Data responses for the chatbot
            const responses = {
                "mean": "To calculate the mean (average) in StatCalc:<br>1. Enter your data in the 'Data Input' section<br>2. Go to 'Basic Statistics'<br>3. Click 'Calculate' and the mean will be displayed<br><br>The formula is: Mean = (Sum of all values) ÷ (Number of values)",
                
                "median": "To find the median in StatCalc:<br>1. Enter your data<br>2. Go to 'Basic Statistics'<br>3. Click 'Calculate'<br><br>The median is the middle value when data is arranged in order.",
                
                "mode": "To find the mode (most frequent value):<br>1. Enter your data<br>2. Go to 'Basic Statistics'<br>3. Click 'Calculate'<br><br>The mode is the value that appears most frequently in your dataset.",
                
                "standard deviation": "To calculate standard deviation:<br>1. Enter your data<br>2. Go to 'Basic Statistics'<br>3. Click 'Calculate'<br><br>The standard deviation measures how spread out your data is from the mean. Formula: σ = √(Σ(x-μ)²/n)",
                
                "variance": "To calculate variance:<br>1. Enter your data<br>2. Go to 'Basic Statistics'<br>3. Click 'Calculate'<br><br>Variance measures the average squared deviation from the mean. It's the standard deviation squared.",
                
                "quartile": "To find quartiles (Q1, Q2, Q3):<br>1. Enter your data<br>2. Go to 'Basic Statistics'<br>3. Click 'Calculate'<br><br>Q1 (25th percentile), Q2 (median), and Q3 (75th percentile) divide your data into four equal parts.",
                
                "iqr": "To calculate the Interquartile Range (IQR):<br>1. Enter your data<br>2. Go to 'Basic Statistics'<br>3. Click 'Calculate'<br><br>IQR = Q3 - Q1. It shows the middle 50% of your data and helps identify outliers.",
                
                "normal distribution": "To work with Normal Distribution:<br>1. Go to 'Probability Distributions'<br>2. Select 'Normal Distribution'<br>3. Enter the mean (μ) and standard deviation (σ)<br>4. Calculate PDF or CDF values<br><br>The normal distribution is bell-shaped and defined by its mean and standard deviation.",
                
                "binomial": "To use Binomial Distribution:<br>1. Go to 'Probability Distributions'<br>2. Select 'Binomial Distribution'<br>3. Enter number of trials (n), probability of success (p)<br>4. Calculate probabilities for specific number of successes<br><br>Used for events with two outcomes (success/failure).",
                
                "poisson": "To use Poisson Distribution:<br>1. Go to 'Probability Distributions'<br>2. Select 'Poisson Distribution'<br>3. Enter lambda (λ) - the average rate of occurrence<br>4. Calculate probabilities<br><br>Used for counting events in a fixed interval of time or space.",
                
                "confidence interval": "To calculate Confidence Intervals:<br>1. Go to 'Inferential Statistics'<br>2. Select 'Confidence Interval'<br>3. Enter your data, confidence level (usually 95%)<br>4. Choose Z-test (if n>30) or T-test (if n<30)<br><br>Provides a range that likely contains the true population parameter.",
                
                "hypothesis test": "To perform Hypothesis Testing:<br>1. Go to 'Inferential Statistics'<br>2. Select 'Hypothesis Testing'<br>3. Choose test type (one/two sample)<br>4. Enter null hypothesis, data, and significance level<br>5. Interpret p-value<br><br>Used to test claims about population parameters.",
                
                "chi-square": "To perform Chi-Square Test:<br>1. Go to 'Inferential Statistics'<br>2. Select 'Chi-Square Test'<br>3. Enter observed frequencies and expected frequencies<br>4. Interpret the result<br><br>Used to test independence between categorical variables.",
                
                "visualization": "To create Data Visualizations:<br>1. Go to 'Data Visualization'<br>2. Select chart type (Bar, Pie, Line, Scatter)<br>3. Enter your data or use existing dataset<br>4. Customize title, labels, colors<br>5. Generate and export the visualization",
                
                "histogram": "To create a Histogram:<br>1. Go to 'Data Visualization'<br>2. Select 'Histogram'<br>3. Enter your data<br>4. Set bin width or number of bins<br>5. Generate the histogram<br><br>Helpful for visualizing data distribution.",
                
                "box plot": "To create a Box Plot:<br>1. Go to 'Data Visualization'<br>2. Select 'Box Plot'<br>3. Enter your data<br>4. Generate the box plot<br><br>Shows the five-number summary: minimum, Q1, median, Q3, and maximum.",
                
                "t-test vs z-test": "When to use T-test vs Z-test:<br><br>Z-test:<br>- Used when sample size is large (n>30)<br>- Population standard deviation is known<br>- Data is normally distributed<br><br>T-test:<br>- Used when sample size is small (n<30)<br>- Population standard deviation is unknown<br>- Data approximately normally distributed",
                
                "hello": "Hello! How can I help you with your statistical calculations today?",
                
                "hi": "Hi there! What statistical concept would you like help with?",
                
                "help": "I can help you with:<br>1. Basic Statistics (mean, median, variance, etc.)<br>2. Probability Distributions (normal, binomial, etc.)<br>3. Inferential Statistics (hypothesis testing, confidence intervals)<br>4. Data Visualization (charts, histograms)<br><br>What would you like to know more about?"
            };
            
            // Function to display message in chatbot
            function displayMessage(message, isUser) {
                const messageDiv = document.createElement("div");
                messageDiv.className = isUser ? "chat-message user" : "chat-message chatbot";
                
                if (!isUser) {
                    // Bot avatar for chatbot messages
                    const avatarDiv = document.createElement("div");
                    avatarDiv.className = "chat-avatar";
                    const avatarImg = document.createElement("img");
                    avatarImg.src = "/api/placeholder/35/35";
                    avatarImg.alt = "Bot Avatar";
                    avatarDiv.appendChild(avatarImg);
                    messageDiv.appendChild(avatarDiv);
                }
                
                const chatBubble = document.createElement("div");
                chatBubble.className = "chat-bubble";
                // Use innerHTML to support HTML formatting in responses
                chatBubble.innerHTML = message;
                messageDiv.appendChild(chatBubble);
                
                chatbotBody.appendChild(messageDiv);
                chatbotBody.scrollTop = chatbotBody.scrollHeight; // Auto-scroll to bottom
                
                // Remove quick replies when user sends a message
                const existingQuickReplies = chatbotBody.querySelector(".quick-replies");
                if (existingQuickReplies) {
                    existingQuickReplies.remove();
                }
            }
            
            // Function to add quick replies after bot response
            function addQuickReplies(topic) {
                // Remove existing quick replies if any
                const existingQuickReplies = chatbotBody.querySelector(".quick-replies");
                if (existingQuickReplies) {
                    existingQuickReplies.remove();
                }
                
                // Define topic-based quick replies
                const topicReplies = {
                    "default": ["How to calculate mean?", "Normal distribution help", "T-test vs Z-test"],
                    "mean": ["How to calculate median?", "How to calculate mode?", "What is standard deviation?"],
                    "normal": ["Binomial distribution help", "Poisson distribution help", "When to use normal distribution?"],
                    "test": ["What is a confidence interval?", "Chi-square test explanation", "How to interpret p-value?"],
                    "visualization": ["How to create a histogram?", "How to create a box plot?", "Types of charts available"]
                };
                
                // Determine which quick replies to show based on the user's message
                let replies = topicReplies.default;
                if (topic.includes("mean") || topic.includes("average")) {
                    replies = topicReplies.mean;
                } else if (topic.includes("normal") || topic.includes("distribution")) {
                    replies = topicReplies.normal;
                } else if (topic.includes("test") || topic.includes("hypothesis")) {
                    replies = topicReplies.test;
                } else if (topic.includes("chart") || topic.includes("visual") || topic.includes("plot")) {
                    replies = topicReplies.visualization;
                }
                
                // Create quick replies container
                const quickRepliesDiv = document.createElement("div");
                quickRepliesDiv.className = "quick-replies";
                
                // Add quick reply buttons
                replies.forEach(reply => {
                    const button = document.createElement("button");
                    button.className = "quick-reply";
                    button.textContent = reply;
                    button.addEventListener("click", function() {
                        displayMessage(reply, true);
                        processMessage(reply.toLowerCase());
                    });
                    quickRepliesDiv.appendChild(button);
                });
                
                chatbotBody.appendChild(quickRepliesDiv);
                chatbotBody.scrollTop = chatbotBody.scrollHeight;
            }
            
            // Function to process and respond to user message
            function processMessage(message) {
                let reply = "I'm not sure about that specific topic. Would you like to know about mean, median, standard deviation, probability distributions, or hypothesis testing?";
                let messageLower = message.toLowerCase();
                
                // Check for matches in responses object
                for (const key in responses) {
                    if (messageLower.includes(key)) {
                        reply = responses[key];
                        break;
                    }
                }
                
                // Delayed response for natural feel
                setTimeout(() => {
                    displayMessage(reply, false);
                    // Add quick replies based on the topic of the conversation
                    addQuickReplies(messageLower);
                }, 700);
            }
            
            // Function to send chat message
            function sendChatMessage() {
                let message = chatInput.value.trim();
                if (message) {
                    displayMessage(message, true);
                    processMessage(message.toLowerCase());
                    chatInput.value = ""; // Clear input after sending
                }
            }
            
            // Event listeners for chatbot interactions
            chatbotButton.addEventListener("click", () => {
                // Toggle visibility
                if (chatbotPopup.style.display === "flex") {
                    chatbotPopup.style.display = "none";
                } else {
                    chatbotPopup.style.display = "flex";
                    chatInput.focus(); // Focus on input field when opened
                }
            });
            
            closeChatbot.addEventListener("click", () => {
                chatbotPopup.style.display = "none";
            });
            
            sendMessage.addEventListener("click", sendChatMessage);
            
            chatInput.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    sendChatMessage();
                }
            });
            
            // Set up quick reply functionality
            quickReplies.forEach(button => {
                button.addEventListener("click", function() {
                    const message = this.textContent;
                    displayMessage(message, true);
                    processMessage(message.toLowerCase());
                });
            });
        });
