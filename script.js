
// Global variables
let results = [];
let filteredResults = [];
let activeFilter = 'all';

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const moonIcon = document.querySelector('.moon-icon');
  const sunIcon = document.querySelector('.sun-icon');
  const themeText = document.querySelector('.theme-text');
  
  // Check if user previously set a theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    themeText.textContent = 'Light Mode';
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'inline-block';
  } else {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    themeText.textContent = 'Dark Mode';
    moonIcon.style.display = 'inline-block';
    sunIcon.style.display = 'none';
  }
  
  themeToggle.addEventListener('click', function() {
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (isDarkMode) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      themeText.textContent = 'Dark Mode';
      moonIcon.style.display = 'inline-block';
      sunIcon.style.display = 'none';
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      themeText.textContent = 'Light Mode';
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'inline-block';
      localStorage.setItem('theme', 'dark');
    }
  });
  
  // Mobile menu functionality
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const menu = document.querySelector('.menu');
  
  mobileMenuButton.addEventListener('click', function() {
    mobileMenuButton.classList.toggle('active');
    menu.classList.toggle('active');
    
    // Update menu button appearance for close icon
    const spans = mobileMenuButton.querySelectorAll('span');
    if (mobileMenuButton.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Filter tabs functionality
  const filterTabs = document.querySelectorAll('.filter-tab');
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Apply filter
      activeFilter = filter;
      filterResults();
    });
  });
  
  // Refresh buttons functionality
  const refreshButton = document.getElementById('refresh-button');
  const floatingRefresh = document.getElementById('floating-refresh');
  
  if (refreshButton) {
    refreshButton.addEventListener('click', function() {
      this.classList.add('rotating');
      fetchResults();
      
      setTimeout(() => {
        this.classList.remove('rotating');
        showToast('Results refreshed successfully!');
      }, 1000);
    });
  }
  
  if (floatingRefresh) {
    floatingRefresh.addEventListener('click', function() {
      this.classList.add('rotating');
      fetchResults();
      
      setTimeout(() => {
        this.classList.remove('rotating');
        showToast('Results refreshed successfully!');
      }, 1000);
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (menu.classList.contains('active') && 
        !menu.contains(event.target) && 
        !mobileMenuButton.contains(event.target)) {
      menu.classList.remove('active');
      mobileMenuButton.classList.remove('active');
      
      // Reset menu button appearance
      const spans = mobileMenuButton.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Initial data fetch
  fetchResults();
  
  // Fix image loading issues
  fixImageLoading();
});

// Fix image loading issues
function fixImageLoading() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Add error handler to replace broken images
    img.onerror = function() {
      // Check if it's a blog or hero image
      if (img.src.includes('blog')) {
        this.src = 'https://emiratesdraw.com/images/placeholder.jpg';
      } else if (img.src.includes('hero-image')) {
        this.src = 'https://emiratesdraw.com/images/hero-placeholder.jpg';
      } else if (img.src.includes('logo')) {
        this.src = 'https://emiratesdraw.com/images/logo-placeholder.png';
      }
      
      this.onerror = null; // Prevent infinite loop
    };
    
    // Force reload images
    const currentSrc = img.src;
    img.src = '';
    setTimeout(() => {
      img.src = currentSrc;
    }, 10);
  });
}

// Fetch results data
function fetchResults() {
  const resultsContainer = document.getElementById('results-container') || 
                           document.getElementById('mega7-results-container') || 
                           document.getElementById('easy6-results-container') || 
                           document.getElementById('fast5-results-container');
  
  if (!resultsContainer) return;
  
  // Show loading state
  resultsContainer.innerHTML = `
    <div class="loading-placeholder">
      <div class="loading-card"></div>
      <div class="loading-card"></div>
      <div class="loading-card"></div>
    </div>
  `;
  
  // In a real app, this would be an API call
  // For this demo, we'll simulate a fetch with mock data and timeout
  setTimeout(() => {
    // Mock data
    results = [
      {
        id: 1,
        draw_type: 'Mega7',
        date: '12-04-2025',
        winning_numbers: ['7', '14', '22', '31', '38', '46', '50'],
        total_winners: 143,
        total_prizes: 'AED 100,000,000',
        raffle_winners: [
          { id: 'ED-2345678', prize: 'AED 10,000' },
          { id: 'ED-3456789', prize: 'AED 5,000' }
        ]
      },
      {
        id: 2,
        draw_type: 'Easy6',
        date: '10-04-2025',
        winning_numbers: ['5', '12', '18', '27', '33', '44'],
        total_winners: 92,
        total_prizes: 'AED 50,000',
        raffle_winners: [
          { id: 'ED-1234567', prize: 'AED 5,000' },
          { id: 'ED-2345678', prize: 'AED 2,500' }
        ]
      },
      {
        id: 3,
        draw_type: 'Fast5',
        date: '11-04-2025',
        winning_numbers: ['3', '9', '15', '25', '37'],
        total_winners: 78,
        total_prizes: 'AED 25,000',
        raffle_winners: [
          { id: 'ED-3456789', prize: 'AED 2,500' },
          { id: 'ED-4567890', prize: 'AED 1,500' }
        ]
      }
    ];
    
    // Filter and display results
    filterResults();
    
    // Update time stamp
    updateTimeStamp();
  }, 1000);
}

// Filter results based on active filter
function filterResults() {
  const page = window.location.pathname.split('/').pop();
  
  // Handle different pages
  if (page === 'mega7.html') {
    filteredResults = results.filter(result => result.draw_type === 'Mega7');
    displayResults('mega7-results-container');
  } else if (page === 'easy6.html') {
    filteredResults = results.filter(result => result.draw_type === 'Easy6');
    displayResults('easy6-results-container');
  } else if (page === 'fast5.html') {
    filteredResults = results.filter(result => result.draw_type === 'Fast5');
    displayResults('fast5-results-container');
  } else {
    // Home page
    if (activeFilter === 'all') {
      filteredResults = results;
    } else {
      filteredResults = results.filter(result => result.draw_type === activeFilter);
    }
    displayResults('results-container');
  }
}

// Display filtered results
function displayResults(containerId) {
  const resultsContainer = document.getElementById(containerId);
  if (!resultsContainer) return;
  
  // Clear container
  resultsContainer.innerHTML = '';
  
  if (filteredResults.length === 0) {
    resultsContainer.innerHTML = '<div class="no-results">No results found for the selected filter.</div>';
    return;
  }
  
  // Display each result
  filteredResults.forEach(result => {
    try {
      const resultCard = createResultCard(result);
      resultsContainer.appendChild(resultCard);
    } catch (error) {
      console.error('Error creating result card:', error);
      resultsContainer.innerHTML += `<div class="error-card">Error loading result. Please try again.</div>`;
    }
  });
}

// Create a result card element
function createResultCard(data) {
  // Use the imported function if available, otherwise use the inline version
  if (typeof window.createResultCard === 'function') {
    return window.createResultCard(data);
  }
  
  const card = document.createElement('div');
  card.className = 'result-card';
  
  function formatDate(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex];
    
    return `${day} ${monthName} ${year}`;
  }
  
  function getDrawDay(type) {
    switch(type) {
      case 'Easy6': return 'Friday';
      case 'Fast5': return 'Saturday';
      default: return 'Sunday';
    }
  }
  
  const drawDay = getDrawDay(data.draw_type);
  const headerClass = `${data.draw_type.toLowerCase()}-header`;
  const numberClass = `number ${data.draw_type.toLowerCase()}-number`;
  
  card.innerHTML = `
    <div class="card-header ${headerClass}">
      <h3>${data.draw_type}</h3>
      <p>Draw Results</p>
      <button class="card-refresh-btn" aria-label="Refresh results">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>
    
    <div class="card-content">
      <div class="draw-date">
        <div><span class="label">Draw Date:</span> ${formatDate(data.date)}</div>
        <div><span class="label">Time:</span> 9:00 PM (${drawDay})</div>
      </div>
      
      <h4>Winning Numbers</h4>
      <div class="numbers-container">
        ${data.winning_numbers.map((number, index) => 
          `<div class="${numberClass}" style="animation-delay: ${index * 0.1}s">${number}</div>`
        ).join('')}
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">${data.total_winners}</span>
          <span class="stat-label">Total Winners</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${data.total_prizes}</span>
          <span class="stat-label">Total Prizes</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${data.winning_numbers.length}</span>
          <span class="stat-label">Numbers Drawn</span>
        </div>
      </div>
      
      <div class="raffle-winners">
        <h4>Raffle Winners</h4>
        <button class="view-winners-btn">Click to View</button>
        <div class="raffle-winners-list" style="display: none;">
          ${data.raffle_winners.map(winner => 
            `<div class="raffle-winner-item">
              <span>${winner.id}</span>
              <span>${winner.prize}</span>
            </div>`
          ).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  const viewWinnersBtn = card.querySelector('.view-winners-btn');
  const raffleWinnersList = card.querySelector('.raffle-winners-list');
  
  viewWinnersBtn.addEventListener('click', function() {
    const isVisible = raffleWinnersList.style.display !== 'none';
    raffleWinnersList.style.display = isVisible ? 'none' : 'block';
    viewWinnersBtn.textContent = isVisible ? 'Click to View' : 'Hide Winners';
  });
  
  const cardRefreshBtn = card.querySelector('.card-refresh-btn');
  cardRefreshBtn.addEventListener('click', function() {
    this.classList.add('rotating');
    setTimeout(() => {
      this.classList.remove('rotating');
      showToast('Results refreshed successfully!');
      fetchResults();
    }, 1000);
  });
  
  return card;
}

// Update the last updated timestamp
function updateTimeStamp() {
  const updateTimeElements = document.querySelectorAll('#update-time');
  
  const now = new Date();
  const options = { 
    day: '2-digit',
    month: 'long', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  
  const timeString = now.toLocaleString('en-US', options);
  
  updateTimeElements.forEach(element => {
    element.textContent = timeString;
  });
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById('refresh-toast');
  if (!toast) return;
  
  const toastMessage = toast.querySelector('.toast-message') || toast.querySelector('span');
  toastMessage.textContent = message;
  
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// Make sure these functions are globally accessible
window.fetchResults = fetchResults;
window.showToast = showToast;
