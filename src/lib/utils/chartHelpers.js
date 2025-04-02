import Chart from 'chart.js/auto';

// Registration state
let registered = false;

// Register Chart.js plugins once
export function registerChartPlugins() {
  if (registered) return;
  
  try {
    // Register default font family
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = 'rgba(230, 230, 230, 0.7)';
    
    // Register global animation defaults
    Chart.defaults.animation = {
      duration: 800,
      easing: 'easeOutQuart'
    };
    
    // Set up global interaction options for better mobile support
    Chart.defaults.interaction = {
      mode: 'nearest',
      intersect: false,
      axis: 'xy'
    };
    
    // Add responsive behavior for touch devices
    Chart.defaults.hover = {
      animationDuration: 400
    };
    
    // Plugin for position chart center text
    Chart.register({
      id: 'centerTextPlugin',
      afterDraw: function(chart) {
        if (!chart.ctx) return; // Safety check
        
        // Skip if not a doughnut chart
        if (chart.config.type !== 'doughnut') return;
        
        // Get data
        if (!chart.data || !chart.data.datasets || !chart.data.datasets[0] || !chart.data.datasets[0].data) {
          return; // Safety check for data
        }
        
        // Let specific plugins handle their own charts
        // This is just a fallback for generic doughnut charts
        if (chart.canvas.id === 'positionChart' || chart.canvas.id === 'timeframeChart' || chart.canvas.id === 'plChart') {
          return;
        }
        
        const ctx = chart.ctx;
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
    
    registered = true;
    console.log('Chart.js plugins registered successfully');
  } catch (error) {
    console.error('Error registering Chart.js plugins:', error);
  }
}

// Common chart options - shared reference to save memory
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
      displayColors: false
    }
  },
  interaction: {
    mode: 'index',
    intersect: false
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: 'rgba(230, 230, 230, 0.7)'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: 'rgba(230, 230, 230, 0.7)'
      }
    }
  },
  animation: {
    duration: 800,
    easing: 'easeOutQuart'
  }
};

// Common doughnut chart options
export const doughnutOptions = {
  ...commonChartOptions,
  cutout: '70%',
  plugins: {
    ...commonChartOptions.plugins,
    tooltip: {
      ...commonChartOptions.plugins.tooltip,
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

// Helper functions for transforming data
export function transformTimeSeriesData(data, options = {}) {
  const { dateField = 'date', valueField = 'value', format = 'MMM DD' } = options;
  
  return {
    labels: data.map(d => {
      const date = new Date(d[dateField]);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }),
    values: data.map(d => d[valueField])
  };
}

// Create a smooth gradient for charts
export function createGradient(ctx, colors) {
  if (!ctx) return colors[0];
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  
  return gradient;
}

// Format currency values
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Safely destroy chart instances
export function safelyDestroyChart(chart) {
  if (chart) {
    try {
      chart.destroy();
    } catch (error) {
      console.error('Error destroying chart:', error);
    }
  }
}