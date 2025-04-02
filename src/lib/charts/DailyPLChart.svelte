<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { commonChartOptions } from '../utils/chartHelpers';
  
  export let chartId = 'dailyChart';
  
  // Memoized data - prevents recreating arrays on each render
  const dates = ['6/11', '6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18', '6/19', '6/20', '6/21', '6/22'];
  const values = [175, 250, 210, 320, 450, 420, 680, 720, 830, 920, 1050, 1200];
  
  let chart;
  
  onMount(() => {
    // Small timeout to ensure the DOM is fully ready
    setTimeout(() => {
      const canvas = document.getElementById(chartId);
      if (!canvas) {
        console.error(`Canvas element with ID ${chartId} not found`);
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get canvas context');
        return;
      }
      
      // Make sure we have dimensions
      if (canvas.parentNode) {
        const parentStyle = getComputedStyle(canvas.parentNode);
        const width = parseInt(parentStyle.width, 10);
        if (width > 0 && !canvas.style.width) {
          canvas.style.width = '100%';
          canvas.style.height = '100%';
        }
      }
      
      // Create chart
      chart = new Chart(ctx, {
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
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              },
              ticks: {
                callback: value => '$' + value,
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
          },
          animation: {
            duration: 750
          }
        }
      });
    }, 100);
    
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });
</script>

<slot></slot>