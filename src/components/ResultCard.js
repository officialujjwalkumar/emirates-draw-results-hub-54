
// ResultCard.js - A vanilla JavaScript implementation
function createResultCard(data) {
  const { drawType, date, winningNumbers, totalWinners, totalPrizes, raffleWinners } = data;
  
  // Formatting functions
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

  function getDrawDayAndTime(type) {
    let day = 'Sunday';
    const time = '9:00 PM';
    
    switch(type) {
      case 'Easy6':
        day = 'Friday';
        break;
      case 'Fast5':
        day = 'Saturday';
        break;
      default:
        day = 'Sunday';
    }
    
    return { day, time };
  }

  function getHeaderClass() {
    switch(drawType) {
      case 'Mega7':
        return 'bg-mega7';
      case 'Easy6':
        return 'bg-easy6';
      case 'Fast5':
        return 'bg-fast5';
      default:
        return 'bg-mega7';
    }
  }

  function getNumberClass() {
    switch(drawType) {
      case 'Mega7':
        return 'number-mega7';
      case 'Easy6':
        return 'number-easy6';
      case 'Fast5':
        return 'number-fast5';
      default:
        return 'number-mega7';
    }
  }

  // Create the result card element
  const card = document.createElement('div');
  card.className = 'result-card';
  
  const { day, time } = getDrawDayAndTime(drawType);
  
  // Create the HTML structure
  card.innerHTML = `
    <div class="card-header ${getHeaderClass()}">
      <h3>${drawType}</h3>
      <p>Draw Results</p>
      <button class="refresh-btn" aria-label="Refresh results">
        <i class="fas fa-sync-alt"></i>
      </button>
    </div>
    
    <div class="card-content">
      <div class="draw-date">
        <div><span class="label">Draw Date:</span> ${formatDate(date)}</div>
        <div><span class="label">Time:</span> ${time} (${day})</div>
      </div>
      
      <h4>Winning Numbers</h4>
      <div class="numbers-container">
        ${winningNumbers.map((number, index) => 
          `<div class="number ${getNumberClass()}" style="animation-delay: ${index * 0.1}s">${number}</div>`
        ).join('')}
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">${totalWinners}</span>
          <span class="stat-label">Total Winners</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${totalPrizes}</span>
          <span class="stat-label">Total Prizes</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${winningNumbers.length}</span>
          <span class="stat-label">Numbers Drawn</span>
        </div>
      </div>
      
      <div class="raffle-winners">
        <h4>Raffle Winners</h4>
        <button class="view-winners-btn">Click to View</button>
        <div class="raffle-winners-list" style="display: none;">
          ${raffleWinners.map(winner => 
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
  
  const refreshBtn = card.querySelector('.refresh-btn');
  refreshBtn.addEventListener('click', function() {
    this.classList.add('rotating');
    setTimeout(() => {
      this.classList.remove('rotating');
      showToast('Results refreshed successfully!');
      fetchResults();
    }, 1000);
  });
  
  return card;
}

// Helper function to show toast notification
function showToast(message) {
  const toast = document.getElementById('refresh-toast');
  toast.querySelector('span').textContent = message;
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}
