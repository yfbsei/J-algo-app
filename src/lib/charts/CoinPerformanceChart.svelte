// src/lib/charts/CoinPerformanceChart.svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { createTooltip, addHoverEffects } from '$lib/utils/chartInteraction';
  
  export let chartId = 'coinChart';
  export let animate = true; // Enable/disable animation
  
  // Chart data with additional details for tooltips
  const coins = [
    { symbol: 'PEOPLE', name: 'People', value: 2735, trades: 28, transactions: '12 buys, 16 sells' },
    { symbol: 'NOT', name: 'Notation', value: 1850, trades: 15, transactions: '8 buys, 7 sells' },
    { symbol: 'LUNA2', name: 'Luna 2.0', value: 1320, trades: 24, transactions: '14 buys, 10 sells' },
    { symbol: 'JASMY', name: 'Jasmy', value: 980, trades: 22, transactions: '10 buys, 12 sells' },
    { symbol: 'SAND', name: 'The Sandbox', value: 750, trades: 16, transactions: '9 buys, 7 sells' },
    { symbol: 'BTC', name: 'Bitcoin', value: 620, trades: 8, transactions: '3 buys, 5 sells' },
    { symbol: 'LTC', name: 'Litecoin', value: 480, trades: 7, transactions: '4 buys, 3 sells' },
    { symbol: 'WAVE', name: 'Wave', value: 370, trades: 6, transactions: '2 buys, 4 sells' }
  ];
  
  // Sort coins by value (descending)
  const sortedCoins = [...coins].sort((a, b) => b.value - a.value);
  
  // Chart dimensions
  let width;
  let height;
  const margin = { top: 10, right: 15, bottom: 10, left: 80 };
  
  // Animation properties
  let animationProgress = 0;
  let animationFrame;
  
  // Interactive elements
  let tooltip;
  let chartContainer;
  let barRefs = [];
  
  // Animation speed
  const animationSpeed = 0.05; // Increase for faster animation
  
  // Generate gradient colors
  const getColor = (index, hover = false) => {
    const opacity = Math.max(0.4, 0.9 - (index * 0.05));
    // Brighter color for hover state
    return hover 
      ? `rgba(18, 211, 180, ${opacity + 0.1})`
      : `rgba(18, 211, 157, ${opacity})`;
  };
  
  // Derived values
  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;
  
  // Bar height and spacing
  $: barHeight = innerHeight ? innerHeight / sortedCoins.length * 0.7 : 0;
  $: barSpacing = innerHeight ? innerHeight / sortedCoins.length * 0.3 : 0;
  
  // Scale calculations
  $: maxValue = Math.max(...sortedCoins.map(c => c.value));
  $: xScale = innerWidth / maxValue;
  
  // Set up the tooltip
  function setupTooltip() {
    if (chartContainer) {
      tooltip = createTooltip(chartContainer, {
        className: 'coin-chart-tooltip',
        offset: { x: 15, y: 10 }
      });
    }
  }
  
  // Add hover effects to bars
  function setupInteractions() {
    barRefs.forEach((bar, index) => {
      if (!bar) return;
      
      const coin = sortedCoins[index];
      
      addHoverEffects(
        bar,
        (event) => {
          // Construct tooltip content
          const tooltipContent = `
            <div class="font-medium mb-1">${coin.name} (${coin.symbol})</div>
            <div class="flex justify-between text-xs mb-1">
              <span>Profit:</span>
              <span class="font-medium text-[#12d39d]">$${coin.value.toLocaleString()}</span>
            </div>
            <div class="flex justify-between text-xs mb-1">
              <span>Trades:</span>
              <span>${coin.trades}</span>
            </div>
            <div class="text-xs opacity-80">${coin.transactions}</div>
          `;
          
          // Show tooltip
          tooltip.show(event, tooltipContent);
        },
        () => {
          // Hide tooltip on leave
          tooltip.hide();
        }
      );
    });
  }
  
  // Animation function
  function animateChart() {
    if (!animate) {
      animationProgress = 1;
      return;
    }
    
    if (animationProgress < 1) {
      animationProgress += animationSpeed;
      if (animationProgress > 1) animationProgress = 1;
      animationFrame = requestAnimationFrame(animateChart);
    }
  }
  
  // Update dimensions on mount and when the window is resized
  function updateDimensions() {
    if (chartContainer) {
      const rect = chartContainer.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }
  }
  
  // Handle bar click
  function handleBarClick(coin) {
    // Dispatch an event that can be handled by parent components
    const event = new CustomEvent('coinselect', { 
      detail: { coin },
      bubbles: true 
    });
    chartContainer.dispatchEvent(event);
  }

  onMount(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Start animation
    animationFrame = requestAnimationFrame(animateChart);
    
    // Set up tooltip
    setupTooltip();
    
    // Set up interactions after a small delay to ensure DOM is ready
    setTimeout(setupInteractions, 100);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });
  
  onDestroy(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

<div bind:this={chartContainer} id={chartId} class="w-full h-full relative">
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
        {#each sortedCoins as coin, i}
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
              {coin.symbol}
            </text>
            
            <!-- Animated Bar -->
            <rect 
              bind:this={barRefs[i]}
              x="0" 
              y="0" 
              width={coin.value * xScale * animationProgress} 
              height={barHeight} 
              rx="4" 
              ry="4" 
              fill={getColor(i)}
              cursor="pointer"
              on:click={() => handleBarClick(coin)}
              class="transition-all duration-300"
            />
            
            <!-- Value label -->
            <text 
              x={Math.min(coin.value * xScale * animationProgress + 10, innerWidth)} 
              y={barHeight / 2} 
              font-size="12" 
              text-anchor={coin.value * xScale + 40 > innerWidth ? "end" : "start"}
              dominant-baseline="middle" 
              fill="white"
              dx={coin.value * xScale + 40 > innerWidth ? -10 : 0}
              opacity={animationProgress}
            >
              ${coin.value}
            </text>
          </g>
        {/each}
      </g>
    </svg>
  {/if}
</div>

<style>
  :global(.coin-chart-tooltip) {
    font-family: 'Inter', sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    max-width: 180px;
    word-break: break-word;
    z-index: 100;
  }
</style>

<slot></slot>