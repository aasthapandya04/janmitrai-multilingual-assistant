// --- Navigation Logic ---
function navigateTo(pageId, context = '') {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    document.getElementById(pageId).classList.add('active');

    // Handle context passing (e.g., clicking a specific workflow)
    if (pageId === 'assistant-page' && context) {
        document.getElementById('workflow-title').innerText = `${context} Assistant`;
        document.getElementById('user-input').value = ''; // clear previous inputs
    }
}

// --- AI Processing Mock Logic ---
function processAI() {
    const input = document.getElementById('user-input').value;
    if (!input.trim()) {
        alert("Please describe your issue first.");
        return;
    }

    // Hide input area, show loading spinner
    document.querySelector('.chat-interface').classList.add('hidden');
    document.getElementById('loading-spinner').classList.remove('hidden');

    // Simulate Network/AI processing delay (3 seconds)
    setTimeout(() => {
        generateResults(input);
        
        // Reset assistant page for next time
        document.querySelector('.chat-interface').classList.remove('hidden');
        document.getElementById('loading-spinner').classList.add('hidden');
        
        // Navigate to results
        navigateTo('results-page');
    }, 3000);
}

// --- Populate Results Page ---
function generateResults(userInput) {
    // Mock Data based on the user entering a water supply complaint
    const ticketId = "JM-" + Math.floor(Math.random() * 90000 + 10000);
    const date = new Date().toLocaleDateString();

    const englishDraft = `To,
The Executive Engineer,
Municipal Corporation, Water Supply Dept.
Date: ${date}

Subject: Complaint regarding lack of water supply for the past 3 days.

Respected Sir/Madam,

I am writing to bring to your immediate attention that our residential area has not received any water supply for the last 3 days. This has caused severe hardship to all residents. 

We request you to kindly investigate and resolve this issue on an urgent basis.

Yours faithfully,
[Your Name]
[Your Address]`;

    const hindiDraft = `सेवा में,
कार्यपालक अभियंता,
नगर निगम, जल आपूर्ति विभाग
दिनांक: ${date}

विषय: पिछले 3 दिनों से जल आपूर्ति न होने के संबंध में शिकायत।

महोदय/महोदया,

मैं आपका ध्यान इस ओर आकर्षित करना चाहता/चाहती हूँ कि हमारे आवासीय क्षेत्र में पिछले 3 दिनों से पानी की आपूर्ति नहीं हुई है। इसके कारण सभी निवासियों को भारी परेशानी का सामना करना पड़ रहा है।

हम आपसे अनुरोध करते हैं कि कृपया इस समस्या की जांच करें और इसे तत्काल आधार पर हल करें।

भवदीय,
[आपका नाम]
[आपका पता]`;

    // Populate DOM elements
    document.getElementById('res-ticket').innerText = ticketId;
    document.getElementById('res-category').innerText = "Utility / Water Supply";
    document.getElementById('res-dept').innerText = "Local Municipal Corporation";
    
    document.getElementById('draft-en').innerText = englishDraft;
    document.getElementById('draft-hi').innerText = hindiDraft;
}