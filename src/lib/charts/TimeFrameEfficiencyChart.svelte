<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  
  export let chartId = 'timeframeChart';
  
  // Chart data
  const data = {
    labels: ['1 minute', '5 minutes'],
    values: [327, 3776],
    colors: ['rgba(18, 211, 157, 0.4)', 'rgba(18, 211, 157, 0.7)']
  };
  
  // Chart instance reference
  let chart;
  let canvas;
  let chartContainer;
  
  function createChart() {
    if (!canvas || !canvas.getContext) return;
    
    // Destroy existing chart if it exists
    if (chart) chart.destroy();
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate total and efficiency
    const total = data.values.reduce((a, b) => a + b, 0);
    const efficiency = Math.round((data.values[1] / total) * 100);
    
    // Chart configuration
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: data.colors,
          borderColor: ['rgba(18, 211, 157, 0.6)', 'rgba(18, 211, 157, 0.9)'],
          borderWidth: 1,
          hoverOffset: 10, // Increased for better hover effect
          hoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%', // Reduced cutout for more visible chart
        layout: {
          padding: 0 // Minimal padding
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
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${percentage}%`;
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
        id: 'timeFrameCenterTextPlugin',
        afterDraw: function(chart) {
          if (chart.canvas.id !== chartId) return;
          
          const ctx = chart.ctx;
          const width = chart.width;
          const height = chart.height;
          
          // Calculate a smaller text size based on chart dimensions
          const smallerDim = Math.min(width, height);
          const valueSize = smallerDim * 0.09; // More adaptive sizing
          const labelSize = smallerDim * 0.06;
          
          ctx.restore();
          
          // Label text
          ctx.font = `${labelSize}px Inter`;
          ctx.fillStyle = 'rgba(230, 230, 230, 0.7)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const text = 'Efficiency';
          ctx.fillText(text, width / 2, height / 2 - valueSize * 0.5);
          
          // Value text
          ctx.font = `bold ${valueSize}px Inter`;
          ctx.fillStyle = 'rgba(18, 211, 157, 1)';
          
          const value = '+' + efficiency + '%';
          ctx.fillText(value, width / 2, height / 2 + labelSize * 0.8);
          
          ctx.save();
        }
      }]
    });
  }
  
  // Handle window resize
  function handleResize() {
    if (chart) {
      // Force redraw with correct dimensions
      chart.destroy();
      setTimeout(createChart, 50);
    }
  }
  
  onMount(() => {
    // Make sure canvas has the proper height
    if (chartContainer) {
      const containerHeight = chartContainer.offsetHeight;
      if (canvas && containerHeight > 0) {
        canvas.style.height = `${containerHeight}px`;
      }
    }
    
    // Create chart with a slight delay to ensure DOM is ready
    setTimeout(() => {
      createChart();
    }, 100);
    
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

<div class="w-full h-full" bind:this={chartContainer}>
  <canvas id={chartId} bind:this={canvas} class="w-full h-full"></canvas>
</div>