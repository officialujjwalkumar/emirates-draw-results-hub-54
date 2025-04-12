
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const moonIcon = document.querySelector('.moon-icon');
  const sunIcon = document.querySelector('.sun-icon');
  
  // Check if user previously set a theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const isDarkMode = body.classList.contains('dark-mode');
      
      if (isDarkMode) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
  
  // Mobile menu functionality
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const menu = document.querySelector('.menu');
  
  if (mobileMenuButton && menu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenuButton.classList.toggle('active');
      menu.classList.toggle('active');
    });
  }
  
  // Detect which game page we're on
  const pagePath = window.location.pathname;
  let gameType = 'all';
  
  if (pagePath.includes('mega7')) {
    gameType = 'Mega7';
  } else if (pagePath.includes('easy6')) {
    gameType = 'Easy6';
  } else if (pagePath.includes('fast5')) {
    gameType = 'Fast5';
  }
  
  // Refresh button functionality
  const refreshButton = document.getElementById('refresh-button');
  const floatingRefresh = document.getElementById('floating-refresh');
  
  if (refreshButton) {
    refreshButton.addEventListener('click', function() {
      this.classList.add('rotating');
      fetchGameResults();
      
      setTimeout(() => {
        this.classList.remove('rotating');
        showToast('Results refreshed successfully!');
      }, 1000);
    });
  }
  
  if (floatingRefresh) {
    floatingRefresh.addEventListener('click', function() {
      this.classList.add('rotating');
      fetchGameResults();
      
      setTimeout(() => {
        this.classList.remove('rotating');
        showToast('Results refreshed successfully!');
      }, 1000);
    });
  }
  
  // Initial fetch
  fetchGameResults();
  
  // Fetch game-specific results
  function fetchGameResults() {
    const resultsContainer = document.getElementById(`${gameType.toLowerCase()}-results-container`);
    if (!resultsContainer) return;
    
    // Show loading state
    resultsContainer.innerHTML = `
      <div class="loading-placeholder">
        <div class="loading-card"></div>
        <div class="loading-card"></div>
      </div>
    `;
    
    // Simulate fetch with timeout
    setTimeout(() => {
      // Mock data based on game type
      let results = [];
      
      if (gameType === 'Mega7') {
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
            id: 4,
            draw_type: 'Mega7',
            date: '05-04-2025',
            winning_numbers: ['3', '11', '18', '24', '36', '41', '49'],
            total_winners: 112,
            total_prizes: 'AED 100,000,000',
            raffle_winners: [
              { id: 'ED-5678901', prize: 'AED 10,000' },
              { id: 'ED-6789012', prize: 'AED 5,000' }
            ]
          }
        ];
      } else if (gameType === 'Easy6') {
        results = [
          {
            id: 2,
            draw_type: 'Easy6',
            date: '10-04-2025',
            winning_numbers: ['5', '12', '18', '27', '33', '44'],
            total_winners: 92,
            total_prizes: 'AED 15,000,000',
            raffle_winners: [
              { id: 'ED-1234567', prize: 'AED 5,000' },
              { id: 'ED-2345678', prize: 'AED 2,500' }
            ]
          },
          {
            id: 5,
            draw_type: 'Easy6',
            date: '03-04-2025',
            winning_numbers: ['8', '15', '22', '29', '35', '40'],
            total_winners: 85,
            total_prizes: 'AED 15,000,000',
            raffle_winners: [
              { id: 'ED-7890123', prize: 'AED 5,000' },
              { id: 'ED-8901234', prize: 'AED 2,500' }
            ]
          }
        ];
      } else if (gameType === 'Fast5') {
        results = [
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
          },
          {
            id: 6,
            draw_type: 'Fast5',
            date: '04-04-2025',
            winning_numbers: ['7', '13', '22', '28', '33'],
            total_winners: 64,
            total_prizes: 'AED 25,000',
            raffle_winners: [
              { id: 'ED-9012345', prize: 'AED 2,500' },
              { id: 'ED-0123456', prize: 'AED 1,500' }
            ]
          }
        ];
      }
      
      // Display results
      displayGameResults(results, resultsContainer);
      
      // Update time stamp
      updateTimeStamp();
    }, 1000);
  }
  
  // Display results
  function displayGameResults(results, container) {
    // Clear container
    container.innerHTML = '';
    
    if (results.length === 0) {
      container.innerHTML = '<div class="no-results">No results found.</div>';
      return;
    }
    
    // Create a results grid
    results.forEach(result => {
      const card = document.createElement('div');
      card.className = 'result-card';
      
      const headerClass = `${result.draw_type.toLowerCase()}-header`;
      const numberClass = `number ${result.draw_type.toLowerCase()}-number`;
      
      // Get draw day
      let drawDay = 'Sunday';
      if (result.draw_type === 'Easy6') drawDay = 'Friday';
      if (result.draw_type === 'Fast5') drawDay = 'Saturday';
      
      // Format date
      const formattedDate = formatDate(result.date);
      
      card.innerHTML = `
        <div class="card-header ${headerClass}">
          <h3>${result.draw_type}</h3>
          <p>Draw Results</p>
          <button class="card-refresh-btn" aria-label="Refresh results">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        
        <div class="card-content">
          <div class="draw-date">
            <div><span class="label">Draw Date:</span> ${formattedDate}</div>
            <div><span class="label">Time:</span> 9:00 PM (${drawDay})</div>
          </div>
          
          <h4>Winning Numbers</h4>
          <div class="numbers-container">
            ${result.winning_numbers.map((number, index) => 
              `<div class="${numberClass}" style="animation-delay: ${index * 0.1}s">${number}</div>`
            ).join('')}
          </div>
          
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">${result.total_winners}</span>
              <span class="stat-label">Total Winners</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${result.total_prizes}</span>
              <span class="stat-label">Total Prizes</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${result.winning_numbers.length}</span>
              <span class="stat-label">Numbers Drawn</span>
            </div>
          </div>
          
          <div class="raffle-winners">
            <h4>Raffle Winners</h4>
            <button class="view-winners-btn">Click to View</button>
            <div class="raffle-winners-list" style="display: none;">
              ${result.raffle_winners.map(winner => 
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
          fetchGameResults();
        }, 1000);
      });
      
      container.appendChild(card);
    });
  }
  
  // Format date helper
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
  
  // Update timestamp
  function updateTimeStamp() {
    const updateTimeElement = document.getElementById('update-time');
    if (!updateTimeElement) return;
    
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
    updateTimeElement.textContent = timeString;
  }
  
  // Show toast notification
  function showToast(message) {
    const toast = document.getElementById('refresh-toast');
    if (!toast) return;
    
    const toastContent = toast.querySelector('span') || toast.querySelector('.toast-message');
    if (toastContent) toastContent.textContent = message;
    
    toast.classList.add('active');
    
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }
});
