<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { commonChartOptions } from '../utils/chartHelpers';
  
  export let chartId = 'tradesChart';
  
  onMount(() => {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    if (!ctx) return;
    
    // Pre-processed trade data - reduces re-calculation during render
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
    
    // Split data into wins and losses - do this once
    const winData = tradeData.filter(trade => trade.outcome === 'win');
    const lossData = tradeData.filter(trade => trade.outcome === 'loss');
    
    const chart = new Chart(ctx, {
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
              label: context => {
                return `${context.dataset.label}: ${context.parsed.y} trades on day ${context.parsed.x}`;
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