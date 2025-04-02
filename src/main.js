// Import libraries

import CanvasParticles from '../node_modules/canvasparticles-js/canvasParticles.mjs';
import Chart from "../node_modules/chart.js/auto/auto.mjs";

// Initialize charts as soon as DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize particles background
  initParticles();
  
  // Initialize all charts immediately
  const chartFunctions = [
    updatePLDistributionChart,
    updateDailyPLChart,
    updateCoinPerformanceChart,
    updateTradingActivityChart,
    updatePositionAnalysisChart,
    updateTimeFrameEfficiencyChart
  ];
  
  // Run chart initializations asynchronously
  requestAnimationFrame(() => {
    chartFunctions.forEach(fn => fn());
  });
  
  // Set up UI interactions
  setupUIInteractions();
  setupDropdownMenu();
  setupSubscribeButton();
  setupCarousel();
  setupAppPrompt();
});

// Initialize particles
function initParticles() {
  const selector = document.querySelector('#particles');
  if (!selector) return;
  
  const options = {
    background: 'transparent',
    mouse: {
      interactionType: 0,
      connectDistMult: 0.8,
      distRatio: 1,
    },
    particles: {
      color: '#0a7557',
      max: 200,
      maxWork: Infinity,
      relSize: 3,
    },
  };
  
  new CanvasParticles(selector, options).start();
}

// Set up UI interactions
function setupUIInteractions() {
  // Chart control buttons
  const chartControls = document.querySelectorAll('.chart-control');
  
  chartControls.forEach(control => {
    control.addEventListener('click', function() {
      // Remove active class from siblings
      Array.from(this.parentElement.querySelectorAll('.chart-control'))
        .forEach(sibling => sibling.classList.remove('active'));
      
      // Add active class to clicked control
      this.classList.add('active');
      
      // In a real implementation, you would update the chart here
    });
  });
}

// Register Chart.js plugins once
const registerChartPlugins = (() => {
  let registered = false;
  
  return () => {
    if (registered) return;
    
    // Add plugin for position chart center text
    Chart.register({
      id: 'centerTextPlugin',
      afterDraw: function(chart) {
        if (chart.config.type !== 'doughnut' || chart.canvas.id !== 'positionChart') return;
        
        // Get ctx and data
        const ctx = chart.ctx;
        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        
        // Text configuration
        const txtSize = chart.height / 12;
        const valueSize = chart.height / 8;
        
        // Position for text
        const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        
        // Draw total label
        ctx.font = txtSize + 'px Inter';
        ctx.fillStyle = 'rgba(230, 230, 230, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Total', centerX, centerY - valueSize/2);
        
        // Draw value
        ctx.font = valueSize + 'px Inter';
        ctx.fillStyle = 'rgba(18, 211, 157, 1)';
        ctx.fillText('$' + total.toLocaleString(), centerX, centerY + txtSize/2);
      }
    });
    
    // Add plugin for timeframe chart center text
    Chart.register({
      id: 'timeFrameCenterTextPlugin',
      afterDraw: function(chart) {
        if (chart.config.type !== 'doughnut' || chart.canvas.id !== 'timeframeChart') return;
        
        // Get ctx
        const ctx = chart.ctx;
        
        // Text configuration
        const txtSize = chart.height / 12;
        const valueSize = chart.height / 8;
        
        // Position for text
        const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        
        // Draw label
        ctx.font = txtSize + 'px Inter';
        ctx.fillStyle = 'rgba(230, 230, 230, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Efficiency', centerX, centerY - valueSize/2);
        
        // Draw value
        ctx.font = valueSize + 'px Inter';
        ctx.fillStyle = 'rgba(18, 211, 157, 1)';
        ctx.fillText('+92%', centerX, centerY + txtSize/2);
      }
    });
    
    registered = true;
  };
})();

// Common chart options
const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
};

// Common doughnut chart options
const doughnutOptions = {
  ...commonChartOptions,
  cutout: '70%',
  plugins: {
    ...commonChartOptions.plugins,
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return `${label}: $${value.toFixed(0)} (${percentage}%)`;
        }
      }
    }
  }
};

// Chart 1: P&L Distribution
function updatePLDistributionChart() {
  const ctx = document.getElementById('plChart')?.getContext('2d');
  if (!ctx) return;
  
  registerChartPlugins();
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Profit', 'Loss'],
      datasets: [{
        data: [98.2, 1.8],
        backgroundColor: [
          'rgba(18, 211, 157, 0.8)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      ...commonChartOptions,
      cutout: '70%',
      plugins: {
        ...commonChartOptions.plugins,
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
}

// Chart 2: Daily P&L
function updateDailyPLChart() {
  const ctx = document.getElementById('dailyChart')?.getContext('2d');
  if (!ctx) return;
  
  // Create data showing consistently increasing profits
  const dates = ['6/11', '6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18', '6/19', '6/20', '6/21', '6/22'];
  const values = [175, 250, 210, 320, 450, 420, 680, 720, 830, 920, 1050, 1200];
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Daily P&L',
        data: values,
        borderColor: 'rgba(18, 211, 157, 1)',
        backgroundColor: 'rgba(18, 211, 157, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(18, 211, 157, 1)',
        pointBorderColor: 'rgba(18, 211, 157, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      ...commonChartOptions,
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return '$' + value;
            },
            color: 'rgba(230, 230, 230, 0.7)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'rgba(230, 230, 230, 0.7)'
          }
        }
      }
    }
  });
}

// Chart 3: Coin Performance
function updateCoinPerformanceChart() {
  const ctx = document.getElementById('coinChart')?.getContext('2d');
  if (!ctx) return;
  
  // Top performing coins with high returns
  const coins = ['PEOPLE', 'NOT', 'LUNA2', 'JASMY', 'SAND', 'BTC', 'LTC', 'WAVE'];
  const values = [2735, 1850, 1320, 980, 750, 620, 480, 370];
  
  // Generate gradient colors
  const greenGradients = coins.map((_, index) => {
    const opacity = 0.9 - (index * 0.05);
    return `rgba(18, 211, 157, ${opacity})`;
  });
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: coins,
      datasets: [{
        label: 'P&L by Coin ($)',
        data: values,
        backgroundColor: greenGradients,
        borderWidth: 0,
        borderRadius: 4
      }]
    },
    options: {
      ...commonChartOptions,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return '$' + value;
            },
            color: 'rgba(230, 230, 230, 0.7)'
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            color: 'rgba(230, 230, 230, 0.7)'
          }
        }
      }
    }
  });
}

// Chart 4: Trading Activity
function updateTradingActivityChart() {
  const ctx = document.getElementById('tradesChart')?.getContext('2d');
  if (!ctx) return;
  
  // Generate data for scatter plot with win/loss status
  const tradeData = [
    { x: 11, y: 6, outcome: 'win' },
    { x: 12, y: 8, outcome: 'win' },
    { x: 13, y: 7, outcome: 'win' },
    { x: 13.5, y: 1, outcome: 'loss' },
    { x: 14, y: 9, outcome: 'win' },
    { x: 15, y: 12, outcome: 'win' },
    { x: 16, y: 10, outcome: 'win' },
    { x: 16.5, y: 1, outcome: 'loss' },
    { x: 17, y: 11, outcome: 'win' },
    { x: 18, y: 7, outcome: 'win' },
    { x: 19, y: 9, outcome: 'win' },
    { x: 20, y: 14, outcome: 'win' },
    { x: 21, y: 8, outcome: 'win' },
    { x: 22, y: 10, outcome: 'win' }
  ];
  
  // Split data into wins and losses
  const winData = tradeData.filter(trade => trade.outcome === 'win');
  const lossData = tradeData.filter(trade => trade.outcome === 'loss');
  
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Profitable Trades',
          data: winData,
          backgroundColor: 'rgba(18, 211, 157, 0.7)',
          pointRadius: 8,
          pointHoverRadius: 10
        },
        {
          label: 'Loss Trades',
          data: lossData,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      ...commonChartOptions,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Day of Month',
            color: 'rgba(230, 230, 230, 0.7)'
          },
          min: 10,
          max: 23,
          ticks: {
            stepSize: 1,
            color: 'rgba(230, 230, 230, 0.7)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Number of Trades',
            color: 'rgba(230, 230, 230, 0.7)'
          },
          beginAtZero: true,
          ticks: {
            stepSize: 2,
            color: 'rgba(230, 230, 230, 0.7)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: 'rgba(230, 230, 230, 0.7)',
            boxWidth: 12,
            padding: 10
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const dataset = context.dataset.label;
              return `${dataset}: ${context.parsed.y} trades on day ${context.parsed.x}`;
            }
          }
        }
      }
    }
  });
}

// Position Analysis Chart
function updatePositionAnalysisChart() {
  const ctx = document.getElementById('positionChart')?.getContext('2d');
  if (!ctx) return;
  
  registerChartPlugins();
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Long', 'Short'],
      datasets: [{
        data: [1575, 2528],
        backgroundColor: [
          'rgba(18, 211, 157, 0.7)',
          'rgba(18, 211, 157, 0.4)',
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: doughnutOptions
  });
}

// Time Frame Efficiency Chart
function updateTimeFrameEfficiencyChart() {
  const ctx = document.getElementById('timeframeChart')?.getContext('2d');
  if (!ctx) return;
  
  registerChartPlugins();
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['1 minute', '5 minutes'],
      datasets: [{
        data: [327, 3776],
        backgroundColor: [
          'rgba(18, 211, 157, 0.4)',
          'rgba(18, 211, 157, 0.7)',
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: doughnutOptions
  });
}

// Carousel setup
function setupCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;
  
  const items = document.querySelectorAll(".carousel-item");
  let index = 0;
  let autoSlideInterval;

  // Auto-slide every 3 seconds
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      index = (index + 1) % items.length;
      carousel.scrollTo({ left: items[index].offsetLeft, behavior: "smooth" });
    }, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  startAutoSlide();

  // Swipe gesture support for mobile
  let startX = 0;
  carousel.addEventListener("touchstart", (e) => {
    stopAutoSlide();
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX > endX + 50) {
      index = (index + 1) % items.length;
    } else if (startX < endX - 50) {
      index = (index - 1 + items.length) % items.length;
    }
    carousel.scrollTo({ left: items[index].offsetLeft, behavior: "smooth" });
    startAutoSlide();
  });
}

// App prompt animation
function setupAppPrompt() {
  const prompt = document.getElementById('app-prompt');
  if (!prompt) return;
  
  // Show after 1 second
  setTimeout(() => {
    prompt.classList.remove('opacity-0', 'translate-y-4');
    prompt.classList.add('opacity-100', 'translate-y-0');
  }, 1000);
  
  // Hide after 5 seconds
  setTimeout(() => {
    prompt.classList.remove('opacity-100', 'translate-y-0');
    prompt.classList.add('opacity-0', 'translate-y-[-10px]');
  }, 7000);
}

// Dropdown menu
function setupDropdownMenu() {
  const appButton = document.getElementById('app-menu-toggle');
  const dropdown = document.getElementById('app-dropdown');
  const container = document.getElementById('dropdown-container');
  
  if (!appButton || !dropdown || !container) return;
  
  // Track dropdown state
  let isOpen = false;
  
  // Add click to app button
  appButton.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    toggleDropdown(isOpen);
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (isOpen) {
      isOpen = false;
      toggleDropdown(false);
    }
  });
  
  // Prevent dropdown from closing when clicking inside it
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Add hover behavior on container
  container.addEventListener('mouseenter', () => {
    if (!isOpen) {
      toggleDropdown(true);
    }
  });
  
  container.addEventListener('mouseleave', () => {
    if (!isOpen) {
      toggleDropdown(false);
    }
  });
  
  // Helper function to toggle dropdown state
  function toggleDropdown(show) {
    if (show) {
      dropdown.style.display = 'block';
      // Force reflow to ensure transition works
      dropdown.offsetHeight;
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
    } else {
      dropdown.style.opacity = '0';
      dropdown.style.visibility = 'hidden';
      setTimeout(() => {
        if (!isOpen) dropdown.style.display = 'none';
      }, 300);
    }
  }
}

// Subscribe button
function setupSubscribeButton() {
  const subscribeLink = document.querySelector('#subscription-container a');
  const container = document.getElementById('subscription-container');
  
  if (!subscribeLink || !container) return;
  
  // Function to update the text and button
  function updateToGrantedAccess() {
    // Find all spans that might contain "Subscribe for access"
    document.querySelectorAll('span.text-sm').forEach(span => {
      if (span.textContent.includes("Subscribe for access")) {
        span.textContent = "Access granted";
      }
    });
    
    // Update the button
    container.innerHTML = `
      <a href="https://www.tradingview.com/script/gp70u4Rl-J-Trend-Sniper-v2/" target="_blank" rel="noopener noreferrer" 
         class="flex items-center gap-2 p-1 px-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span class="text-xs text-white">TradingView</span>
      </a>
    `;
  }
  
  // Check localStorage on page load
  if (localStorage.getItem('hasSubscribed') === 'true') {
    updateToGrantedAccess();
    return;
  }
  
  // Add click event for first-time subscribers
  subscribeLink.addEventListener('click', function() {
    // Set localStorage to remember the user has subscribed
    localStorage.setItem('hasSubscribed', 'true');
    
    // Update text and button
    setTimeout(updateToGrantedAccess, 100);
  });
}