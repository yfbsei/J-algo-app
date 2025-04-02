<script>
  import { onMount } from 'svelte';
  
  export let chartId = 'coinChart';
  
  // Chart data
  const coins = ['PEOPLE', 'NOT', 'LUNA2', 'JASMY', 'SAND', 'BTC', 'LTC', 'WAVE'];
  const values = [2735, 1850, 1320, 980, 750, 620, 480, 370];
  
  // Chart dimensions
  let width;
  let height;
  const margin = { top: 10, right: 15, bottom: 10, left: 80 };
  
  // Refs
  let chartContainer;
  
  // Generate gradient colors
  const getColor = (index) => {
    const opacity = Math.max(0.4, 0.9 - (index * 0.05));
    return `rgba(18, 211, 157, ${opacity})`;
  };
  
  // Derived values
  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;
  
  // Bar height and spacing
  $: barHeight = innerHeight ? innerHeight / coins.length * 0.7 : 0;
  $: barSpacing = innerHeight ? innerHeight / coins.length * 0.3 : 0;
  
  // Scale calculations
  $: maxValue = Math.max(...values);
  $: xScale = innerWidth / maxValue;
  
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
        <!-- X-axis grid lines -->
        {#each [0, 0.25, 0.5, 0.75, 1] as ratio}
          <line 
            x1={ratio * innerWidth} 
            y1="0" 
            x2={ratio * innerWidth} 
            y2={innerHeight} 
            stroke="rgba(255, 255, 255, 0.05)" 
            stroke-width="1"
          />
          <text 
            x={ratio * innerWidth} 
            y={innerHeight + 10} 
            font-size="11" 
            text-anchor="middle" 
            fill="rgba(230, 230, 230, 0.7)"
          >
            ${Math.round(ratio * maxValue)}
          </text>
        {/each}
        
        <!-- Bars and labels -->
        {#each coins as coin, i}
          <g transform={`translate(0, ${i * (barHeight + barSpacing)})`}>
            <!-- Coin label -->
            <text 
              x="-10" 
              y={barHeight / 2} 
              font-size="12" 
              text-anchor="end" 
              dominant-baseline="middle" 
              fill="rgba(230, 230, 230, 0.7)"
            >
              {coin}
            </text>
            
            <!-- Bar -->
            <rect 
              x="0" 
              y="0" 
              width={values[i] * xScale} 
              height={barHeight} 
              rx="4" 
              ry="4" 
              fill={getColor(i)}
            />
            
            <!-- Value label -->
            <text 
              x={Math.min(values[i] * xScale + 10, innerWidth)} 
              y={barHeight / 2} 
              font-size="12" 
              text-anchor={values[i] * xScale + 40 > innerWidth ? "end" : "start"}
              dominant-baseline="middle" 
              fill="white"
              dx={values[i] * xScale + 40 > innerWidth ? -10 : 0}
            >
              ${values[i]}
            </text>
          </g>
        {/each}
      </g>
    </svg>
  {/if}
</div>

<slot></slot>