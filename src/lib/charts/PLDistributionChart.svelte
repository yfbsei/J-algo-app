<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { registerChartPlugins, commonChartOptions } from '../utils/chartHelpers';
  
  export let chartId = 'plChart';
  
  onMount(() => {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    if (!ctx) return;
    
    registerChartPlugins();
    
    const chart = new Chart(ctx, {
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
    
    return () => {
      chart.destroy();
    };
  });
</script>

<slot></slot>
