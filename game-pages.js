
// Constants
const RESULTS_STORAGE_KEY = 'emirates_draw_results';
const DARK_MODE_STORAGE_KEY = 'dark_mode_enabled';

// Elements
const updateTimeElement = document.getElementById('update-time');
const mega7ResultsContainer = document.getElementById('mega7-results-container');
const easy6ResultsContainer = document.getElementById('easy6-results-container');
const fast5ResultsContainer = document.getElementById('fast5-results-container');
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.menu');
const refreshButton = document.getElementById('refresh-button');
const refreshToast = document.getElementById('refresh-toast');
const body = document.body;

// Check for saved theme preference
function loadThemePreference() {
    const isDarkMode = localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true';
    if (isDarkMode) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }
}

// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        
        // Save preference
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem(DARK_MODE_STORAGE_KEY, isDarkMode);
    });
}

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
function createResultCard(result, index, gameType) {
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
    const delay = index * 0.1;
    card.style.animationDelay = `${delay}s`;
    
    // Display raffle winners directly on game-specific pages
    const raffleWinnersHTML = `
        <div class="raffle-winners">
            <h4>Raffle Winners</h4>
            <div class="raffle-winners-list">
                ${raffleWinners.map(winner => `
                    <div class="raffle-winner-item">
                        <span class="raffle-winner-id">${winner.id}</span>
                        <span class="raffle-prize">${winner.prize}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
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
                ${winningNumbers.map((num, i) => `
                    <div class="number ${result.draw_type}" style="animation-delay: ${i * 0.1}s">${num}</div>
                `).join('')}
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-value">${result.total_winners}</div>
                    <div class="stat-label">Total Winners</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.total_prizes}</div>
                    <div class="stat-label">Total Prizes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${winningNumbers.length}</div>
                    <div class="stat-label">Numbers Drawn</div>
                </div>
            </div>
            
            ${raffleWinnersHTML}
        </div>
    `;
    
    return card;
}

// Update the last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    
    // Format the date and time
    const options = { 
        day: '2-digit',
        month: 'long', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const timeString = now.toLocaleString('en-US', options) + ' IST';
    
    if (updateTimeElement) {
        updateTimeElement.textContent = timeString;
    }
}

// Show toast notification
function showToast() {
    if (refreshToast) {
        refreshToast.classList.add('active');
        
        // Hide toast after 2 seconds
        setTimeout(() => {
            refreshToast.classList.remove('active');
        }, 2000);
    }
}

// Load results from local storage or fetch from data.json
function loadResults(gameType, container) {
    if (!container) return;
    
    // Show loading animation
    container.innerHTML = `
        <div class="loading-placeholder">
            <div class="loading-card"></div>
            <div class="loading-card"></div>
        </div>
    `;
    
    // Load results from data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            if (data && data.results) {
                const filteredResults = data.results.filter(result => result.draw_type === gameType);
                
                if (filteredResults.length > 0) {
                    // Clear loading placeholders
                    container.innerHTML = '';
                    
                    // Display results
                    filteredResults.forEach((result, index) => {
                        const card = createResultCard(result, index, gameType);
                        container.appendChild(card);
                    });
                    
                    // Save to localStorage
                    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(data));
                    
                    // Update last updated time
                    updateLastUpdatedTime();
                } else {
                    // No results found for this game type
                    container.innerHTML = `<p class="no-results">No results found for ${gameType}. Please check back later.</p>`;
                }
            }
        })
        .catch(error => {
            console.error('Error loading results:', error);
            
            // Try to use cached data if available
            const cachedData = localStorage.getItem(RESULTS_STORAGE_KEY);
            if (cachedData) {
                try {
                    const data = JSON.parse(cachedData);
                    if (data && data.results) {
                        const filteredResults = data.results.filter(result => result.draw_type === gameType);
                        
                        if (filteredResults.length > 0) {
                            // Clear loading placeholders
                            container.innerHTML = '';
                            
                            // Display results
                            filteredResults.forEach((result, index) => {
                                const card = createResultCard(result, index, gameType);
                                container.appendChild(card);
                            });
                        } else {
                            // No results found for this game type
                            container.innerHTML = `<p class="no-results">No results found for ${gameType}. Please check back later.</p>`;
                        }
                    }
                } catch (e) {
                    console.error('Error parsing cached data:', e);
                    container.innerHTML = `<p class="error">Error loading results. Please try again later.</p>`;
                }
            } else {
                container.innerHTML = `<p class="error">Error loading results. Please try again later.</p>`;
            }
        });
}

// Mobile menu toggle
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function() {
        if (mobileMenuButton) {
            mobileMenuButton.classList.remove('active');
        }
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    if (mobileMenu && mobileMenuButton) {
        if (!event.target.closest('.mobile-menu-button') && 
            !event.target.closest('.menu') && 
            mobileMenu.classList.contains('active')) {
            mobileMenuButton.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    }
});

// Handle refresh button click
if (refreshButton) {
    refreshButton.addEventListener('click', function() {
        // Show toast notification
        showToast();
        
        // Reload the appropriate results based on the current page
        if (window.location.pathname.includes('mega7') && mega7ResultsContainer) {
            loadResults('Mega7', mega7ResultsContainer);
        } else if (window.location.pathname.includes('easy6') && easy6ResultsContainer) {
            loadResults('Easy6', easy6ResultsContainer);
        } else if (window.location.pathname.includes('fast5') && fast5ResultsContainer) {
            loadResults('Fast5', fast5ResultsContainer);
        }
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    // Load theme preference
    loadThemePreference();
    
    // Update the timestamp
    updateLastUpdatedTime();
    
    // Load the appropriate results based on the current page
    if (window.location.pathname.includes('mega7') && mega7ResultsContainer) {
        loadResults('Mega7', mega7ResultsContainer);
    } else if (window.location.pathname.includes('easy6') && easy6ResultsContainer) {
        loadResults('Easy6', easy6ResultsContainer);
    } else if (window.location.pathname.includes('fast5') && fast5ResultsContainer) {
        loadResults('Fast5', fast5ResultsContainer);
    }
});
