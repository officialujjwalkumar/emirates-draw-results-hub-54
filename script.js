
// Constants
const RESULTS_STORAGE_KEY = 'emirates_draw_results';
const DARK_MODE_STORAGE_KEY = 'dark_mode_enabled';

// Elements
const resultsContainer = document.getElementById('results-container');
const updateTimeElement = document.getElementById('update-time');
const refreshMessage = document.getElementById('refresh-message');
const loadingSpinner = document.getElementById('loading-spinner');
const filterTabs = document.querySelectorAll('.filter-tab');
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.menu');
const themeToggle = document.getElementById('theme-toggle');
const raffleModal = document.getElementById('raffle-modal');
const closeModal = document.querySelector('.close-modal');
const modalWinnersList = document.getElementById('modal-winners-list');
const refreshButton = document.getElementById('refresh-button');
const refreshToast = document.getElementById('refresh-toast');
const faqItems = document.querySelectorAll('.faq-item');
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
function createResultCard(result, index) {
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
    
    // Determine if we're on a game-specific page or the main page
    const isGamePage = window.location.pathname.includes(result.draw_type.toLowerCase()) || 
                      (window.location.pathname.includes('mega7') && result.draw_type === 'Mega7') ||
                      (window.location.pathname.includes('easy6') && result.draw_type === 'Easy6') ||
                      (window.location.pathname.includes('fast5') && result.draw_type === 'Fast5');
    
    let raffleWinnersHTML = '';
    
    if (isGamePage) {
        // On game-specific pages, display raffle winners directly
        raffleWinnersHTML = `
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
    } else {
        // On the main page, use the modal
        raffleWinnersHTML = `
            <div class="raffle-winners">
                <h4>Raffle Winners</h4>
                <button class="view-winners-btn" data-draw-type="${result.draw_type}" data-draw-date="${result.date}">Click to View</button>
            </div>
        `;
    }
    
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
    
    // Store raffle winners data as a custom attribute
    card.setAttribute('data-raffle-winners', JSON.stringify(raffleWinners));
    
    return card;
}

// Show raffle winners in modal
function showRaffleWinners(drawType, drawDate, raffleWinners) {
    if (!raffleModal || !modalWinnersList) return;
    
    // Clear existing content
    modalWinnersList.innerHTML = '';
    
    // Create winner elements
    raffleWinners.forEach(winner => {
        const winnerItem = document.createElement('div');
        winnerItem.className = 'modal-winner-item';
        winnerItem.innerHTML = `
            <span class="modal-winner-id">${winner.id}</span>
            <span class="modal-prize-amount">${winner.prize}</span>
        `;
        modalWinnersList.appendChild(winnerItem);
    });
    
    // Show modal
    raffleModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Update the last updated time in IST format
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

// Show loading state
function showLoading() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }
    if (refreshMessage) {
        refreshMessage.textContent = 'Fetching latest results...';
    }
    if (refreshButton) {
        refreshButton.classList.add('rotating');
    }
}

// Hide loading state
function hideLoading() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    if (refreshMessage) {
        refreshMessage.textContent = 'Results updated successfully';
    }
    if (refreshButton) {
        refreshButton.classList.remove('rotating');
    }
    
    // Clear the message after 3 seconds
    setTimeout(() => {
        if (refreshMessage) {
            refreshMessage.textContent = '';
        }
    }, 3000);
}

// Load and display results
function loadResults() {
    if (!resultsContainer) return;
    
    showLoading();
    
    // Since we're using static data, we'll use the JSON file directly
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            if (data && data.results) {
                displayResults(data.results);
                localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(data));
                hideLoading();
                updateLastUpdatedTime();
            }
        })
        .catch(error => {
            console.error('Error loading results:', error);
            hideLoading();
            
            // Try to use cached data if available
            const cachedData = localStorage.getItem(RESULTS_STORAGE_KEY);
            if (cachedData) {
                const data = JSON.parse(cachedData);
                if (data && data.results) {
                    displayResults(data.results);
                }
            }
        });
}

// Display the results in the container
function displayResults(results, filter = 'all') {
    if (!resultsContainer) return;
    
    // Clear existing content
    resultsContainer.innerHTML = '';
    
    // Filter results if needed
    const filteredResults = filter === 'all' 
        ? results 
        : results.filter(result => result.draw_type === filter);
    
    // Create and append result cards
    filteredResults.forEach((result, index) => {
        const card = createResultCard(result, index);
        resultsContainer.appendChild(card);
    });
    
    // Add event listeners to view winners buttons
    setupRaffleButtons();
}

// Setup event listeners for raffle winner buttons
function setupRaffleButtons() {
    const viewWinnersButtons = document.querySelectorAll('.view-winners-btn');
    
    viewWinnersButtons.forEach(button => {
        button.addEventListener('click', function() {
            const drawType = this.getAttribute('data-draw-type');
            const drawDate = this.getAttribute('data-draw-date');
            const card = this.closest('.result-card');
            const raffleWinnersData = JSON.parse(card.getAttribute('data-raffle-winners'));
            
            showRaffleWinners(drawType, drawDate, raffleWinnersData);
        });
    });
}

// Filter results based on the selected tab
if (filterTabs) {
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update the active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Get the filter value
            const filter = this.getAttribute('data-filter');
            
            // Load the cached results
            const cachedData = localStorage.getItem(RESULTS_STORAGE_KEY);
            if (cachedData) {
                const data = JSON.parse(cachedData);
                if (data && data.results) {
                    displayResults(data.results, filter);
                }
            }
        });
    });
}

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', function() {
        raffleModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === raffleModal) {
        raffleModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// FAQ toggle
if (faqItems) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle the current FAQ item
            item.classList.toggle('active');
        });
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
        // Reload the page data and show toast notification
        loadResults();
        showToast();
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    // Load theme preference
    loadThemePreference();
    
    // Load the results
    loadResults();
    
    // Update the timestamp
    updateLastUpdatedTime();
});
