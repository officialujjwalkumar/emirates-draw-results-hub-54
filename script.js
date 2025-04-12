
// API endpoint for Emirates Draw results
const API_URL = 'https://webapiserver.online/emiratesresults/';

// Elements
const resultsContainer = document.getElementById('results-container');
const updateTimeElement = document.getElementById('update-time');
const refreshMessage = document.getElementById('refresh-message');
const loadingSpinner = document.getElementById('loading-spinner');
const filterTabs = document.querySelectorAll('.filter-tab');
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.menu');

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
    
    // Calculate draw time based on draw type
    let drawTime = '9:00 PM';
    let drawDay = 'Sunday';
    
    switch(result.draw_type) {
        case 'Easy6':
            drawDay = 'Friday';
            break;
        case 'Fast5':
            drawDay = 'Saturday';
            break;
        default:
            drawDay = 'Sunday';
    }
    
    // Create the card element
    const card = document.createElement('div');
    card.className = `result-card ${result.draw_type}`;
    card.setAttribute('data-type', result.draw_type);
    
    // Add a slight delay for each card to create a staggered animation effect
    const index = Array.from(resultsContainer.children).length;
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="card-header ${result.draw_type}">
            <h3>${result.draw_type}</h3>
            <span>Draw Results</span>
        </div>
        <div class="card-content">
            <div class="draw-date">
                <span><strong>Draw Date:</strong> ${formatDate(result.date)}</span>
                <span><strong>Time:</strong> ${drawTime} (${drawDay})</span>
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
                <div>
                    <span class="value">${winningNumbers.length}</span>
                    <span class="label">Numbers Drawn</span>
                </div>
            </div>
            
            <div class="raffle-winners">
                <h4>Raffle Winners</h4>
                <div class="winners-list">
                    ${raffleWinners.map(winner => `
                        <div class="winner-item">
                            <span class="winner-id">${winner.id}</span>
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

// Filter results based on draw type
function filterResults(drawType) {
    const cards = document.querySelectorAll('.result-card');
    
    cards.forEach(card => {
        if (drawType === 'all' || card.getAttribute('data-type') === drawType) {
            card.style.display = 'block';
            // Add staggered re-animation effect
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300); // Match the CSS animation duration
        }
    });
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
        
        // Since we're not auto-refreshing, let's display the results directly
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Create and append result cards
        data.results.forEach(result => {
            const card = createResultCard(result);
            resultsContainer.appendChild(card);
        });
        
        // Store the results for later comparison if needed
        previousResults = [...data.results];
        
        // Update last updated time
        updateLastUpdatedTime();
        
        hideLoading();
        
        // Apply any active filters
        const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
        filterResults(activeFilter);
        
    } catch (error) {
        console.error('Error fetching results:', error);
        showError(error.message || 'Could not fetch results');
        
        // Use demo data if API fails
        useDemoData();
    }
}

// Use demo data when API fails
function useDemoData() {
    console.log("Using demo data");
    
    const demoData = {
        "results": [
            {
                "draw_type": "Mega7",
                "date": "06-04-2025",
                "winning_numbers": "19, 18, 15, 10, 26, 25, 20",
                "winning_raffleids": "24401196 - AED 100,000| 24348184 - AED 1,000| 24398732 - AED 1,000| 24401284 - AED 1,000| 24390195 - AED 1,000| 24351351 - AED 1,000| 24396121 - AED 1,000| 24385411 - AED 1,000",
                "total_winners": "888",
                "total_prizes": "AED 126,827",
                "pick_1_image_url": null
            },
            {
                "draw_type": "Easy6",
                "date": "11-04-2025",
                "winning_numbers": "30, 39, 34, 14, 11, 13",
                "winning_raffleids": "24434381 - AED 60,000| 24439693 - AED 1,000| 24391168 - AED 1,000| 24429999 - AED 1,000| 24433263 - AED 1,000| 24431293 - AED 1,000| 24442383 - AED 1,000",
                "total_winners": "869",
                "total_prizes": "AED 235,063",
                "pick_1_image_url": null
            },
            {
                "draw_type": "Fast5",
                "date": "05-04-2025",
                "winning_numbers": "34, 07, 04, 25, 30",
                "winning_raffleids": "24366376 - AED 50,000| 24348736 - AED 1,000| 24395005 - AED 1,000| 24392674 - AED 1,000| 24348786 - AED 1,000| 24396309 - AED 1,000",
                "total_winners": "6",
                "total_prizes": "AED 55,000",
                "pick_1_image_url": null
            }
        ]
    };
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Create and append result cards using demo data
    demoData.results.forEach(result => {
        const card = createResultCard(result);
        resultsContainer.appendChild(card);
    });
    
    // Update last updated time
    updateLastUpdatedTime();
    
    hideLoading();
    
    // Apply any active filters
    const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
    filterResults(activeFilter);
}

// Set up event listeners for filter tabs
filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Filter results
        const drawType = this.getAttribute('data-filter');
        filterResults(drawType);
    });
});

// Mobile menu toggle
mobileMenuButton.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function() {
        mobileMenuButton.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.mobile-menu-button') && 
        !event.target.closest('.menu') && 
        mobileMenu.classList.contains('active')) {
        mobileMenuButton.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Initial load
window.addEventListener('DOMContentLoaded', function() {
    fetchResults();
});
