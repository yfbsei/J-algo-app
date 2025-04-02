<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { commonChartOptions } from '../utils/chartHelpers';
  
  export let chartId = 'coinChart';
  
  onMount(() => {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    if (!ctx) return;
    
    // Top performing coins with high returns
    const coins = ['PEOPLE', 'NOT', 'LUNA2', 'JASMY', 'SAND', 'BTC', 'LTC', 'WAVE'];
    const values = [2735, 1850, 1320, 980, 750, 620, 480, 370];
    
    // Generate gradient colors more efficiently
    const greenGradients = Array.from({ length: coins.length }, (_, index) => {
      const opacity = Math.max(0.4, 0.9 - (index * 0.05));
      return `rgba(18, 211, 157, ${opacity})`;
    });
    
    const chart = new Chart(ctx, {
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
              callback: value => '$' + value,
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
        // Add animation duration reduction for better performance
        animation: {
          duration: 750
        }
      }
    });
    
    return () => {
      chart.destroy();
    };
  });
</script>

<slot></slot>