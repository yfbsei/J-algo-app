<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { registerChartPlugins, doughnutOptions } from '../utils/chartHelpers';
  
  export let chartId = 'positionChart';
  
  onMount(() => {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    if (!ctx) return;
    
    registerChartPlugins();
    
    const chart = new Chart(ctx, {
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
    
    return () => {
      chart.destroy();
    };
  });
</script>

<slot></slot>
