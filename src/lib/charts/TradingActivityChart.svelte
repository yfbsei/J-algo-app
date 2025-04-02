<script>
  import { onMount } from 'svelte';
  
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
  
  // Split data
  const winData = tradeData.filter(trade => trade.outcome === 'win');
  const lossData = tradeData.filter(trade => trade.outcome === 'loss');
  
  // Chart dimensions
  let width;
  let height;
  const margin = { top: 30, right: 20, bottom: 40, left: 50 };
  
  // Refs
  let chartContainer;
  
  // Derived values
  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;
  
  // X and Y axis ranges
  const xMin = 10;
  const xMax = 23;
  const yMin = 0;
  const yMax = 16;
  
  // Scale calculations
  $: xScale = innerWidth / (xMax - xMin);
  $: yScale = innerHeight / (yMax - yMin);
  
  // Calculate point coordinates
  $: getX = (point) => (point.x - xMin) * xScale;
  $: getY = (point) => innerHeight - (point.y - yMin) * yScale;
  
  // Generate ticks
  $: xTicks = Array.from({ length: xMax - xMin + 1 }, (_, i) => i + xMin);
  $: yTicks = Array.from({ length: yMax / 2 + 1 }, (_, i) => i * 2);
  
  // Update dimensions on mount and when the window is resized
  function updateDimensions() {
    if (chartContainer) {
      const rect = chartContainer.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }
  }
  
  onMount(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  });
</script>

<div bind:this={chartContainer} id={chartId} class="w-full h-full">
  {#if width && height}
    <svg width={width} height={height}>
      <!-- Background -->
      <rect width={width} height={height} fill="transparent" />
      
      <!-- Legend -->
      <g transform="translate(60, 15)">
        <!-- Win point -->
        <circle cx="0" cy="0" r="6" fill="rgba(18, 211, 157, 0.7)" />
        <text x="12" y="4" font-size="12" fill="rgba(230, 230, 230, 0.7)">Profitable Trades</text>
        
        <!-- Loss point -->
        <circle cx="120" cy="0" r="5" fill="rgba(255, 99, 132, 0.7)" />
        <text x="132" y="4" font-size="12" fill="rgba(230, 230, 230, 0.7)">Loss Trades</text>
      </g>
      
      <!-- Chart area group -->
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <!-- X-axis grid lines and labels -->
        {#each xTicks as tick}
          <line 
            x1={(tick - xMin) * xScale} 
            y1="0" 
            x2={(tick - xMin) * xScale} 
            y2={innerHeight} 
            stroke="rgba(255, 255, 255, 0.05)" 
            stroke-width="1"
          />
          {#if tick % 2 === 0}
            <text 
              x={(tick - xMin) * xScale} 
              y={innerHeight + 20} 
              font-size="11" 
              text-anchor="middle" 
              fill="rgba(230, 230, 230, 0.7)"
            >
              {tick}
            </text>
          {/if}
        {/each}
        
        <!-- X-axis title -->
        <text 
          x={innerWidth / 2} 
          y={innerHeight + 35} 
          font-size="12" 
          text-anchor="middle" 
          fill="rgba(230, 230, 230, 0.7)"
        >
          Day of Month
        </text>
        
        <!-- Y-axis grid lines and labels -->
        {#each yTicks as tick}
          <line 
            x1="0" 
            y1={innerHeight - tick * yScale} 
            x2={innerWidth} 
            y2={innerHeight - tick * yScale} 
            stroke="rgba(255, 255, 255, 0.05)" 
            stroke-width="1"
          />
          <text 
            x="-10" 
            y={innerHeight - tick * yScale} 
            font-size="11" 
            text-anchor="end" 
            dominant-baseline="middle" 
            fill="rgba(230, 230, 230, 0.7)"
          >
            {tick}
          </text>
        {/each}
        
        <!-- Y-axis title -->
        <text 
          transform="rotate(-90)" 
          x={-innerHeight / 2} 
          y="-35" 
          font-size="12" 
          text-anchor="middle" 
          fill="rgba(230, 230, 230, 0.7)"
        >
          Number of Trades
        </text>
        
        <!-- Win data points -->
        {#each winData as point}
          <circle 
            cx={getX(point)} 
            cy={getY(point)} 
            r="8" 
            fill="rgba(18, 211, 157, 0.7)" 
          />
        {/each}
        
        <!-- Loss data points -->
        {#each lossData as point}
          <circle 
            cx={getX(point)} 
            cy={getY(point)} 
            r="6" 
            fill="rgba(255, 99, 132, 0.7)" 
          />
        {/each}
      </g>
    </svg>
  {/if}
</div>

<slot></slot>