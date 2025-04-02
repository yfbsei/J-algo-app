import Chart from 'chart.js/auto';

// Register plugins once
let registered = false;

export function registerChartPlugins() {
  if (registered) return;
  
  // Plugin for position chart center text
  Chart.register({
    id: 'centerTextPlugin',
    afterDraw: function(chart) {
      if (chart.config.type !== 'doughnut' || chart.canvas.id !== 'positionChart') return;
      if (!chart.ctx) return; // Safety check
      
      // Get ctx and data
      const ctx = chart.ctx;
      
      if (!chart.data || !chart.data.datasets || !chart.data.datasets[0] || !chart.data.datasets[0].data) {
        return; // Safety check for data
      }
      
      const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
      
      // Text configuration
      const txtSize = chart.height / 12;
      const valueSize = chart.height / 8;
      
      // Position for text
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      
      // Draw total label
      ctx.font = `${txtSize}px Inter`;
      ctx.fillStyle = 'rgba(230, 230, 230, 0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Total', centerX, centerY - valueSize/2);
      
      // Draw value
      ctx.font = `${valueSize}px Inter`;
      ctx.fillStyle = 'rgba(18, 211, 157, 1)';
      ctx.fillText('$' + total.toLocaleString(), centerX, centerY + txtSize/2);
    }
  });
  
  // Plugin for timeframe chart center text
  Chart.register({
    id: 'timeFrameCenterTextPlugin',
    afterDraw: function(chart) {
      if (chart.config.type !== 'doughnut' || chart.canvas.id !== 'timeframeChart') return;
      if (!chart.ctx) return; // Safety check
      
      // Get ctx
      const ctx = chart.ctx;
      
      // Text configuration
      const txtSize = chart.height / 12;
      const valueSize = chart.height / 8;
      
      // Position for text
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      
      // Draw label
      ctx.font = `${txtSize}px Inter`;
      ctx.fillStyle = 'rgba(230, 230, 230, 0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Efficiency', centerX, centerY - valueSize/2);
      
      // Draw value
      ctx.font = `${valueSize}px Inter`;
      ctx.fillStyle = 'rgba(18, 211, 157, 1)';
      ctx.fillText('+92%', centerX, centerY + txtSize/2);
    }
  });
  
  registered = true;
}

// Common chart options - shared reference to save memory
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
};

// Common doughnut chart options
export const doughnutOptions = {
  ...commonChartOptions,
  cutout: '70%',
  plugins: {
    ...commonChartOptions.plugins,
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const dataset = context.dataset;
          if (!dataset || !dataset.data) return label;
          
          const total = dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: $${value.toFixed(0)} (${percentage}%)`;
        }
      }
    }
  }
};