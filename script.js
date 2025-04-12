
// API endpoint for Emirates Draw results
const API_URL = 'https://webapiserver.online/emiratesresults/';

// Refresh interval in milliseconds (1 minute)
const REFRESH_INTERVAL = 60000;

// Elements
const resultsContainer = document.getElementById('results-container');
const updateTimeElement = document.getElementById('update-time');
const refreshMessage = document.getElementById('refresh-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Format date to display in a more readable format
function formatDate(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Convert month from string to number and subtract 1 (months are 0-indexed in JS)
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex];
    
    return `${day} ${monthName} ${year}`;
}

// Parse winning raffle IDs from the string
function parseRaffleWinners(raffleString) {
    if (!raffleString) return [];
    
    return raffleString.split('|').map(winner => {
        const parts = winner.trim().split(' - ');
        if (parts.length === 2) {
            return {
                id: parts[0].trim(),
                prize: parts[1].trim()
            };
        }
        return { id: winner.trim(), prize: '' };
    });
}

// Create a result card for each draw type
function createResultCard(result) {
    // Parse winning numbers
    const winningNumbers = result.winning_numbers.split(',').map(num => num.trim());
    
    // Parse raffle winners
    const raffleWinners = parseRaffleWinners(result.winning_raffleids);
    
    // Create the card element
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
        <div class="card-header ${result.draw_type}">
            <h3>${result.draw_type}</h3>
            <span>Draw Results</span>
        </div>
        <div class="card-content">
            <div class="draw-date">
                <strong>Draw Date:</strong> ${formatDate(result.date)}
            </div>
            
            <h4>Winning Numbers</h4>
            <div class="numbers-container">
                ${winningNumbers.map(num => `
                    <div class="number ${result.draw_type}">${num}</div>
                `).join('')}
            </div>
            
            <div class="stats">
                <div>
                    <span class="value">${result.total_winners}</span>
                    <span class="label">Total Winners</span>
                </div>
                <div>
                    <span class="value">${result.total_prizes}</span>
                    <span class="label">Total Prizes</span>
                </div>
            </div>
            
            <div class="raffle-winners">
                <h4>Raffle Winners</h4>
                <div class="winners-list">
                    ${raffleWinners.map(winner => `
                        <div class="winner-item">
                            <span class="winner-id">${winner.id}</span> - 
                            <span class="prize-amount">${winner.prize}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Update the last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    const options = { 
        day: '2-digit',
        month: 'long', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    };
    updateTimeElement.textContent = now.toLocaleString('en-US', options);
}

// Show loading state
function showLoading() {
    loadingSpinner.style.display = 'block';
    refreshMessage.textContent = 'Fetching latest results...';
}

// Hide loading state
function hideLoading() {
    loadingSpinner.style.display = 'none';
    refreshMessage.textContent = 'Results updated successfully';
    
    // Clear the message after 3 seconds
    setTimeout(() => {
        refreshMessage.textContent = '';
    }, 3000);
}

// Error handling
function showError(message) {
    loadingSpinner.style.display = 'none';
    refreshMessage.textContent = `Error: ${message}. Retrying soon...`;
    refreshMessage.style.color = 'var(--secondary)';
    
    // Reset message style after 3 seconds
    setTimeout(() => {
        refreshMessage.style.color = '';
    }, 3000);
}

// Compare results to check if they've changed
let previousResults = null;
function resultsHaveChanged(newResults) {
    if (!previousResults) return true;
    
    try {
        return JSON.stringify(newResults) !== JSON.stringify(previousResults);
    } catch (e) {
        return true; // In case of error, assume they've changed
    }
}

// Fetch and display results
async function fetchResults() {
    showLoading();
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if the data structure is as expected
        if (!data.results || !Array.isArray(data.results)) {
            throw new Error('Unexpected data structure');
        }
        
        // Check if results have changed
        if (resultsHaveChanged(data.results)) {
            // Clear previous results
            resultsContainer.innerHTML = '';
            
            // Create and append result cards
            data.results.forEach(result => {
                const card = createResultCard(result);
                resultsContainer.appendChild(card);
            });
            
            // Update previous results
            previousResults = [...data.results];
            
            // Update last updated time
            updateLastUpdatedTime();
        } else {
            refreshMessage.textContent = 'No new results available';
            
            // Clear the message after 3 seconds
            setTimeout(() => {
                refreshMessage.textContent = '';
            }, 3000);
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching results:', error);
        showError(error.message || 'Could not fetch results');
    }
}

// Initial load
fetchResults();

// Set up auto-refresh
setInterval(fetchResults, REFRESH_INTERVAL);

// Add event listener for when tab becomes visible again
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Fetch new results when tab becomes visible again
        fetchResults();
    }
});
