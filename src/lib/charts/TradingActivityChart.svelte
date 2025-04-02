<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  
  export let chartId = 'tradesChart';
  
  // Chart data
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
  
  // Split data by outcome
  const winData = tradeData.filter(trade => trade.outcome === 'win');
  const lossData = tradeData.filter(trade => trade.outcome === 'loss');
  
  // Chart instance reference
  let chart;
  let canvas;
  
  function createChart() {
    if (!canvas || !canvas.getContext) return;
    
    // Destroy existing chart if it exists
    if (chart) chart.destroy();
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Chart configuration
    chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Profitable Trades',
            data: winData.map(d => ({ x: d.x, y: d.y })),
            backgroundColor: 'rgba(18, 211, 157, 0.7)',
            borderColor: 'rgba(18, 211, 157, 1)',
            borderWidth: 1,
            pointRadius: 8,
            pointHoverRadius: 10
          },
          {
            label: 'Loss Trades',
            data: lossData.map(d => ({ x: d.x, y: d.y })),
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointRadius: 6,
            pointHoverRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Day of Month',
              color: 'rgba(230, 230, 230, 0.7)',
              font: {
                size: 12
              }
            },
            min: 10,
            max: 23,
            ticks: {
              stepSize: 2,
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
              color: 'rgba(230, 230, 230, 0.7)',
              font: {
                size: 12
              }
            },
            min: 0,
            max: 16,
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
            position: 'top',
            labels: {
              color: 'rgba(230, 230, 230, 0.7)',
              boxWidth: 12,
              padding: 10,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 117, 87, 0.9)',
            titleColor: 'rgba(255, 255, 255, 0.9)',
            bodyColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(18, 211, 157, 0.3)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function(context) {
                const dataIndex = context.dataIndex;
                const datasetIndex = context.datasetIndex;
                const dataset = context.chart.data.datasets[datasetIndex];
                
                const point = dataset.data[dataIndex];
                const label = dataset.label;
                
                return `${label}: ${point.y} trades on day ${point.x}`;
              }
            }
          }
        },
        animation: {
          duration: 800,
          easing: 'easeOutQuart'
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