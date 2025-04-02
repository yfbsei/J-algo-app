<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  
  export let chartId = 'plChart';
  
  // Chart data
  const data = {
    labels: ['Profit', 'Loss'],
    values: [98.2, 1.8],
    colors: ['rgba(18, 211, 157, 0.8)', 'rgba(255, 99, 132, 0.7)']
  };
  
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
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: data.colors,
          borderColor: ['rgba(18, 211, 157, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1,
          hoverOffset: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
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
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 800,
          easing: 'easeOutQuart'
        }
      },
      plugins: [{
        id: 'centerTextPlugin',
        afterDraw: function(chart) {
          // Skip plugin execution if it's not this specific chart
          if (chart.canvas.id !== chartId) return;
          
          const ctx = chart.ctx;
          const width = chart.width;
          const height = chart.height;
          
          ctx.restore();
          const fontSize = (height / 180).toFixed(2);
          ctx.font = fontSize + 'em Inter';
          ctx.textBaseline = 'middle';
          
          const text = 'Profit/Loss';
          const textX = Math.round((width - ctx.measureText(text).width) / 2);
          const textY = height / 2 - 15;
          
          ctx.fillStyle = 'rgba(230, 230, 230, 0.7)';
          ctx.fillText(text, textX, textY);
          
          const value = data.values[0] + '%';
          const valueX = Math.round((width - ctx.measureText(value).width) / 2);
          const valueY = height / 2 + 15;
          
          ctx.font = (fontSize * 1.5) + 'em Inter';
          ctx.fillStyle = 'rgba(18, 211, 157, 1)';
          ctx.fillText(value, valueX, valueY);
          
          ctx.save();
        }
      }]
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