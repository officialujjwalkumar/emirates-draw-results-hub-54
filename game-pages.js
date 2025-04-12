
// Constants
const RESULTS_STORAGE_KEY = 'emirates_draw_results';
const DARK_MODE_STORAGE_KEY = 'dark_mode_enabled';

// Game-specific storage keys
const MEGA7_RESULTS_KEY = 'mega7_results';
const EASY6_RESULTS_KEY = 'easy6_results';
const FAST5_RESULTS_KEY = 'fast5_results';

// Elements
const updateTimeElement = document.getElementById('update-time');
const mega7ResultsContainer = document.getElementById('mega7-results-container');
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.menu');
const raffleModal = document.getElementById('raffle-modal');
const closeModal = document.querySelector('.close-modal');
const modalWinnersList = document.getElementById('modal-winners-list');
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
themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    
    // Save preference
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem(DARK_MODE_STORAGE_KEY, isDarkMode);
});

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
            
            <div class="raffle-winners">
                <h4>Raffle Winners</h4>
                <button class="view-winners-btn" data-draw-type="${result.draw_type}" data-draw-date="${result.date}">Click to View</button>
            </div>
        </div>
    `;
    
    // Store raffle winners data as a custom attribute
    card.setAttribute('data-raffle-winners', JSON.stringify(raffleWinners));
    
    return card;
}

// Show raffle winners in modal
function showRaffleWinners(drawType, drawDate, raffleWinners) {
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

// Update the last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    
    // Convert to IST (UTC+5:30)
    const istOptions = { 
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'long', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const istTimeString = now.toLocaleString('en-US', istOptions) + ' IST';
    
    if (updateTimeElement) {
        updateTimeElement.textContent = istTimeString;
    }
}

// Load results from local storage
function loadResultsFromStorage() {
    const savedData = localStorage.getItem(RESULTS_STORAGE_KEY);
    if (savedData) {
        return JSON.parse(savedData);
    }
    return null;
}

// Load game-specific results
function loadGameResults(gameType) {
    let gameKey;
    
    switch(gameType) {
        case 'Mega7':
            gameKey = MEGA7_RESULTS_KEY;
            break;
        case 'Easy6':
            gameKey = EASY6_RESULTS_KEY;
            break;
        case 'Fast5':
            gameKey = FAST5_RESULTS_KEY;
            break;
        default:
            gameKey = RESULTS_STORAGE_KEY;
    }
    
    const savedData = localStorage.getItem(gameKey);
    if (savedData) {
        return JSON.parse(savedData);
    }
    
    // If game-specific data doesn't exist, try to filter from all results
    const allResults = loadResultsFromStorage();
    if (allResults && allResults.results) {
        const filteredResults = allResults.results.filter(result => result.draw_type === gameType);
        return filteredResults;
    }
    
    return [];
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

// Load Mega7 results if on Mega7 page
function loadMega7Results() {
    if (mega7ResultsContainer) {
        const mega7Results = loadGameResults('Mega7');
        
        if (mega7Results && mega7Results.length > 0) {
            mega7ResultsContainer.innerHTML = '';
            
            mega7Results.forEach((result, index) => {
                const card = createResultCard(result, index, 'Mega7');
                mega7ResultsContainer.appendChild(card);
            });
            
            // Add event listeners to view winners buttons
            setupRaffleButtons();
        } else {
            // Use demo data if no results found
            useMega7DemoData();
        }
    }
}

// Use demo data for Mega7 page
function useMega7DemoData() {
    const mega7DemoData = [
        {
            "draw_type": "Mega7",
            "date": "06-04-2025",
            "winning_numbers": "19, 18, 15, 10, 26, 25, 20",
            "winning_raffleids": "24401196 - AED 100,000| 24348184 - AED 1,000| 24398732 - AED 1,000| 24401284 - AED 1,000| 24390195 - AED 1,000| 24351351 - AED 1,000",
            "total_winners": "888",
            "total_prizes": "AED 126,827",
            "pick_1_image_url": null
        },
        {
            "draw_type": "Mega7",
            "date": "30-03-2025",
            "winning_numbers": "22, 14, 35, 05, 18, 31, 10",
            "winning_raffleids": "24321196 - AED 100,000| 24318184 - AED 1,000| 24328732 - AED 1,000| 24301284 - AED 1,000",
            "total_winners": "756",
            "total_prizes": "AED 104,000",
            "pick_1_image_url": null
        }
    ];
    
    mega7ResultsContainer.innerHTML = '';
    
    mega7DemoData.forEach((result, index) => {
        const card = createResultCard(result, index, 'Mega7');
        mega7ResultsContainer.appendChild(card);
    });
    
    // Add event listeners to view winners buttons
    setupRaffleButtons();
}

// Initial setup
function initialSetup() {
    // Load theme preference
    loadThemePreference();
    
    // Update the timestamp
    updateLastUpdatedTime();
    
    // If on Mega7 page, load Mega7 results
    loadMega7Results();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initialSetup);
