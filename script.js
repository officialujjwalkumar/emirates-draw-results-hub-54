
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
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    themeText.textContent = 'Light Mode';
  }
  
  themeToggle.addEventListener('click', function() {
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (isDarkMode) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      themeText.textContent = 'Dark Mode';
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      themeText.textContent = 'Light Mode';
      localStorage.setItem('theme', 'dark');
    }
  });
  
  // Mobile menu functionality
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const menu = document.querySelector('.menu');
  
  mobileMenuButton.addEventListener('click', function() {
    mobileMenuButton.classList.toggle('active');
    menu.classList.toggle('active');
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
  
  // Initial data fetch
  fetchResults();
});

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
    const resultCard = createResultCard(result);
    resultsContainer.appendChild(resultCard);
  });
}

// Create a result card element
function createResultCard(data) {
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
        <div class="raffle-winners-list">
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
    if (raffleWinnersList.style.display === 'block') {
      raffleWinnersList.style.display = 'none';
      viewWinnersBtn.textContent = 'Click to View';
    } else {
      raffleWinnersList.style.display = 'block';
      viewWinnersBtn.textContent = 'Hide Winners';
    }
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
