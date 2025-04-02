<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import Chart from 'chart.js/auto';
  
  export let chartId = 'coinChart';
  
  // Set up event dispatcher for coin selection
  const dispatch = createEventDispatcher();
  
  // Chart data with additional details for tooltips
  const coins = [
    { symbol: 'PEOPLE', name: 'People', value: 2735, trades: 28, transactions: '12 buys, 16 sells' },
    { symbol: 'NOT', name: 'Notation', value: 1850, trades: 15, transactions: '8 buys, 7 sells' },
    { symbol: 'LUNA2', name: 'Luna 2.0', value: 1320, trades: 24, transactions: '14 buys, 10 sells' },
    { symbol: 'JASMY', name: 'Jasmy', value: 980, trades: 22, transactions: '10 buys, 12 sells' },
    { symbol: 'SAND', name: 'The Sandbox', value: 750, trades: 16, transactions: '9 buys, 7 sells' },
    { symbol: 'BTC', name: 'Bitcoin', value: 620, trades: 8, transactions: '3 buys, 5 sells' },
    { symbol: 'LTC', name: 'Litecoin', value: 480, trades: 7, transactions: '4 buys, 3 sells' },
    { symbol: 'WAVE', name: 'Wave', value: 370, trades: 6, transactions: '2 buys, 4 sells' }
  ];
  
  // Sort coins by value (descending)
  const sortedCoins = [...coins].sort((a, b) => b.value - a.value);
  
  // Chart instance reference
  let chart;
  let canvas;
  
  // Generate gradient colors
  function getBackgroundColor(context) {
    if (!context.chart.chartArea) {
      // This case happens on initial chart load
      return 'rgba(18, 211, 157, 0.8)';
    }
    
    // Get index of the current bar
    const index = context.dataIndex;
    // Adjust opacity based on bar position
    const opacity = Math.max(0.4, 0.9 - (index * 0.05));
    
    // Is hovered?
    const isHovered = context.active;
    
    return isHovered 
      ? `rgba(18, 211, 180, ${opacity + 0.1})`
      : `rgba(18, 211, 157, ${opacity})`;
  }
  
  function createChart() {
    if (!canvas || !canvas.getContext) return;
    
    // Destroy existing chart if it exists
    if (chart) chart.destroy();
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Prepare data
    const labels = sortedCoins.map(coin => coin.symbol);
    const values = sortedCoins.map(coin => coin.value);
    
    // Chart configuration
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: getBackgroundColor,
          borderColor: 'rgba(18, 211, 157, 0.9)',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 15
          }
        },
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
                const index = context[0].dataIndex;
                const coin = sortedCoins[index];
                return `${coin.name} (${coin.symbol})`;
              },
              label: function(context) {
                const index = context.dataIndex;
                const coin = sortedCoins[index];
                return [
                  `Profit: $${coin.value.toLocaleString()}`,
                  `Trades: ${coin.trades}`,
                  `${coin.transactions}`
                ];
              }
            }
          }
        },
        animation: {
          delay: function(context) {
            return context.dataIndex * 50;
          },
          duration: 800,
          easing: 'easeOutQuart'
        },
        onClick: (event, elements) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            const selectedCoin = sortedCoins[index];
            
            // Dispatch the selected coin
            dispatch('coinselect', { coin: selectedCoin });
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
  
  onMount(() => {
    // Create chart with a slight delay to ensure DOM is ready
    setTimeout(() => {
      createChart();
    }, 50);
    
    // Add window resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      // Clean up
      if (chart) {
        chart.destroy();
      }
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<div class="w-full h-full">
  <canvas id={chartId} bind:this={canvas}></canvas>
</div>