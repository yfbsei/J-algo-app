<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  
  export let chartId = 'dailyChart';
  export let timeframe = '1 Month'; // Default timeframe
  
  // Chart data based on timeframe
  const chartData = {
    '2 Weeks': {
      labels: ['6/16', '6/17', '6/18', '6/19', '6/20', '6/21', '6/22', '6/23', '6/24', '6/25', '6/26', '6/27', '6/28', '6/29'],
      values: [420, 680, 720, 830, 920, 1050, 1200, 1150, 1300, 1420, 1580, 1650, 1720, 1850]
    },
    '1 Month': {
      labels: ['6/01', '6/04', '6/07', '6/10', '6/13', '6/16', '6/19', '6/22', '6/25', '6/28'],
      values: [100, 150, 210, 320, 450, 580, 830, 1200, 1580, 1850]
    },
    '3 Months': {
      labels: ['4/01', '4/15', '5/01', '5/15', '6/01', '6/15', '6/29'],
      values: [0, 350, 700, 1200, 1500, 1700, 1850]
    },
    '1 Year': {
      labels: ['7/22', '9/22', '11/22', '1/23', '3/23', '5/23', '7/23', '9/23', '11/23', '1/24', '3/24', '5/24', '6/24'],
      values: [0, 200, 400, 800, 1200, 1600, 2200, 2800, 3400, 3800, 4200, 4600, 4850]
    }
  };
  
  // Chart instance reference
  let chart;
  let canvas;
  
  // Initialize or update chart
  function createChart() {
    if (!canvas || !canvas.getContext) return;
    
    // Destroy existing chart if it exists
    if (chart) {
      chart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get current data based on timeframe
    const data = chartData[timeframe] || chartData['1 Month'];
    
    // Create gradient for area fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(18, 211, 157, 0.4)');
    gradient.addColorStop(1, 'rgba(18, 211, 157, 0.0)');
    
    // Chart configuration
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Daily P&L',
          data: data.values,
          borderColor: 'rgba(18, 211, 157, 1)',
          borderWidth: 3,
          pointBackgroundColor: 'rgba(18, 211, 157, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(18, 211, 157, 1)',
          pointHoverBorderWidth: 3,
          tension: 0.3,
          fill: true,
          backgroundColor: gradient
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        hover: {
          mode: 'nearest',
          intersect: false
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(230, 230, 230, 0.7)',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(230, 230, 230, 0.7)',
              callback: function(value) {
                return '$' + value;
              }
            },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(10, 117, 87, 0.9)',
            titleColor: 'rgba(255, 255, 255, 0.9)',
            bodyColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(18, 211, 157, 0.3)',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                return 'Profit: $' + context.parsed.y.toLocaleString();
              }
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear'
          }
        }
      }
    });
  }
  
  // Handle window resize
  function handleResize() {
    if (chart) {
      chart.resize();
    }
  }
  
  // Watch for timeframe changes
  $: {
    if (timeframe && chart) {
      const data = chartData[timeframe] || chartData['1 Month'];
      chart.data.labels = data.labels;
      chart.data.datasets[0].data = data.values;
      chart.update();
    }
  }
  
  onMount(() => {
    // Create chart on mount with a slight delay to ensure the DOM is ready
    setTimeout(() => {
      createChart();
    }, 100);
    
    // Add window resize listener
    window.addEventListener('resize', handleResize);
  });
  
  onDestroy(() => {
    // Clean up on unmount
    if (chart) {
      chart.destroy();
    }
    window.removeEventListener('resize', handleResize);
  });
</script>

<div class="w-full h-full">
  <canvas id={chartId} bind:this={canvas}></canvas>
</div>