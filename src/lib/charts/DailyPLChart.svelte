<script>
  import { onMount } from 'svelte';
  
  export let chartId = 'dailyChart';
  
  // Chart data
  const dates = ['6/11', '6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18', '6/19', '6/20', '6/21', '6/22'];
  const values = [175, 250, 210, 320, 450, 420, 680, 720, 830, 920, 1050, 1200];
  
  // Chart dimensions
  let width;
  let height;
  const margin = { top: 20, right: 15, bottom: 30, left: 50 };
  
  // Refs
  let chartContainer;
  
  // Derived values
  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;
  
  // Scale calculations
  $: xScale = innerWidth ? innerWidth / (dates.length - 1) : 0;
  $: yMin = Math.min(...values) * 0.9;
  $: yMax = Math.max(...values) * 1.1;
  $: yScale = innerHeight ? innerHeight / (yMax - yMin) : 0;
  
  // Generate points for the path
  $: points = values.map((value, i) => {
    const x = i * xScale;
    const y = innerHeight - (value - yMin) * yScale;
    return `${x},${y}`;
  }).join(' ');
  
  // Generate the fill path
  $: fillPath = `
    M${0},${innerHeight}
    ${values.map((value, i) => {
      const x = i * xScale;
      const y = innerHeight - (value - yMin) * yScale;
      return `L${x},${y}`;
    }).join(' ')}
    L${(dates.length - 1) * xScale},${innerHeight}
    Z`;
  
  // Generate x-axis ticks
  $: xTicks = dates.map((date, i) => ({
    x: i * xScale,
    label: date
  }));
  
  // Generate y-axis ticks (5 evenly spaced ticks)
  $: yTicks = Array.from({ length: 6 }, (_, i) => {
    const value = yMin + (yMax - yMin) * (i / 5);
    return {
      y: innerHeight - (value - yMin) * yScale,
      label: `$${Math.round(value)}`
    };
  });
  
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
      
      <!-- Chart area group -->
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <!-- Y-axis grid lines -->
        {#each yTicks as tick}
          <line 
            x1="0" 
            y1={tick.y} 
            x2={innerWidth} 
            y2={tick.y} 
            stroke="rgba(255, 255, 255, 0.05)" 
            stroke-width="1"
          />
        {/each}
        
        <!-- X-axis line -->
        <line 
          x1="0" 
          y1={innerHeight} 
          x2={innerWidth} 
          y2={innerHeight} 
          stroke="rgba(255, 255, 255, 0.1)" 
          stroke-width="1"
        />
        
        <!-- X-axis labels -->
        {#each xTicks as tick, i}
          {#if i % 2 === 0 || i === xTicks.length - 1}
            <text 
              x={tick.x} 
              y={innerHeight + 20} 
              font-size="12" 
              text-anchor="middle" 
              fill="rgba(230, 230, 230, 0.7)"
            >
              {tick.label}
            </text>
          {/if}
        {/each}
        
        <!-- Y-axis labels -->
        {#each yTicks as tick}
          <text 
            x="-10" 
            y={tick.y} 
            font-size="12" 
            text-anchor="end" 
            dominant-baseline="middle" 
            fill="rgba(230, 230, 230, 0.7)"
          >
            {tick.label}
          </text>
        {/each}
        
        <!-- Area fill -->
        <path 
          d={fillPath} 
          fill="rgba(18, 211, 157, 0.2)" 
          stroke="none"
        />
        
        <!-- Line -->
        <polyline 
          points={points} 
          fill="none" 
          stroke="rgba(18, 211, 157, 1)" 
          stroke-width="2" 
          stroke-linejoin="round" 
          stroke-linecap="round"
        />
        
        <!-- Data points -->
        {#each values as value, i}
          <circle 
            cx={i * xScale} 
            cy={innerHeight - (value - yMin) * yScale} 
            r="4" 
            fill="rgba(18, 211, 157, 1)" 
            stroke="rgba(18, 211, 157, 1)" 
            stroke-width="2"
          />
        {/each}
      </g>
    </svg>
  {/if}
</div>

<slot></slot>