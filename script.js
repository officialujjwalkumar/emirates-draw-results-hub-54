
// API endpoint for Emirates Draw results
const API_URL = 'https://webapiserver.online/emiratesresults/';
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

// Update the last updated time in IST format
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
    updateTimeElement.textContent = istTimeString;
}

// Show loading state
function showLoading() {
    loadingSpinner.style.display = 'block';
    refreshMessage.textContent = 'Fetching latest results...';
    refreshButton.classList.add('rotating');
}

// Hide loading state
function hideLoading() {
    loadingSpinner.style.display = 'none';
    refreshMessage.textContent = 'Results updated successfully';
    refreshButton.classList.remove('rotating');
    
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
    refreshButton.classList.remove('rotating');
    
    // Reset message style after 3 seconds
    setTimeout(() => {
        refreshMessage.style.color = '';
    }, 3000);
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

// Save results to local storage
function saveResultsToStorage(results) {
    const storageData = {
        timestamp: new Date().toISOString(),
        results: results
    };
    
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(storageData));
}

// Load results from local storage
function loadResultsFromStorage() {
    const savedData = localStorage.getItem(RESULTS_STORAGE_KEY);
    if (savedData) {
        return JSON.parse(savedData);
    }
    return null;
}

// Fetch and display results
async function fetchResults() {
    showLoading();
    
    try {
        // Simulate network delay for better UX with transitions
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demo purposes, using local data instead of API
        // In production, this would be:
        // const response = await fetch(API_URL);
        // const data = await response.json();
        
        const data = {
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
                },
                {
                    "draw_type": "Mega7",
                    "date": "30-03-2025",
                    "winning_numbers": "22, 14, 35, 05, 18, 31, 10",
                    "winning_raffleids": "24321196 - AED 100,000| 24318184 - AED 1,000| 24328732 - AED 1,000| 24301284 - AED 1,000",
                    "total_winners": "756",
                    "total_prizes": "AED 104,000",
                    "pick_1_image_url": null
                },
                {
                    "draw_type": "Easy6",
                    "date": "04-04-2025",
                    "winning_numbers": "10, 22, 38, 06, 31, 19",
                    "winning_raffleids": "24384381 - AED 60,000| 24389693 - AED 1,000| 24381168 - AED 1,000",
                    "total_winners": "598",
                    "total_prizes": "AED 63,000",
                    "pick_1_image_url": null
                },
                {
                    "draw_type": "Fast5",
                    "date": "29-03-2025",
                    "winning_numbers": "17, 22, 09, 30, 15",
                    "winning_raffleids": "24266376 - AED 50,000| 24268736 - AED 1,000| 24265005 - AED 1,000",
                    "total_winners": "420",
                    "total_prizes": "AED 53,000",
                    "pick_1_image_url": null
                }
            ]
        };
        
        // Save results to storage
        saveResultsToStorage(data.results);
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Create and append result cards
        data.results.forEach((result, index) => {
            const card = createResultCard(result, index);
            resultsContainer.appendChild(card);
        });
        
        // Update last updated time
        updateLastUpdatedTime();
        
        hideLoading();
        
        // Apply any active filters
        const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
        filterResults(activeFilter);
        
        // Add event listeners to view winners buttons
        setupRaffleButtons();
        
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
    
    // Save demo data to storage
    saveResultsToStorage(demoData.results);
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Create and append result cards using demo data
    demoData.results.forEach((result, index) => {
        const card = createResultCard(result, index);
        resultsContainer.appendChild(card);
    });
    
    // Update last updated time
    updateLastUpdatedTime();
    
    hideLoading();
    
    // Apply any active filters
    const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
    filterResults(activeFilter);
    
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

// Close modal
closeModal.addEventListener('click', function() {
    raffleModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === raffleModal) {
        raffleModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

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

// Handle refresh button click
refreshButton.addEventListener('click', function() {
    fetchResults();
});

// FAQ functionality
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQs
        faqItems.forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Toggle current FAQ
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Create game-specific pages with historical data
function saveGameSpecificData() {
    const savedData = loadResultsFromStorage();
    
    if (savedData && savedData.results) {
        const mega7Results = savedData.results.filter(result => result.draw_type === 'Mega7');
        const easy6Results = savedData.results.filter(result => result.draw_type === 'Easy6');
        const fast5Results = savedData.results.filter(result => result.draw_type === 'Fast5');
        
        localStorage.setItem('mega7_results', JSON.stringify(mega7Results));
        localStorage.setItem('easy6_results', JSON.stringify(easy6Results));
        localStorage.setItem('fast5_results', JSON.stringify(fast5Results));
    }
}

// Initial setup
function initialSetup() {
    // Load theme preference
    loadThemePreference();
    
    // Check for cached results
    const cachedData = loadResultsFromStorage();
    
    if (cachedData) {
        // Display cached results
        resultsContainer.innerHTML = '';
        
        cachedData.results.forEach((result, index) => {
            const card = createResultCard(result, index);
            resultsContainer.appendChild(card);
        });
        
        // Add event listeners to view winners buttons
        setupRaffleButtons();
        
        // Apply any active filters
        const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
        filterResults(activeFilter);
        
        // Update the timestamp
        updateLastUpdatedTime();
    } else {
        // No cached data, fetch new
        fetchResults();
    }
    
    // Save game-specific data
    saveGameSpecificData();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initialSetup);
