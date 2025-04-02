<script>
  import { onMount } from 'svelte';
  
  export let chartId = 'plChart';
  
  // Chart data
  const data = [
    { label: 'Profit', value: 98.2, color: 'rgba(18, 211, 157, 0.8)' },
    { label: 'Loss', value: 1.8, color: 'rgba(255, 99, 132, 0.7)' }
  ];
  
  // Chart dimensions
  let width;
  let height;
  const margin = 20;
  
  // Refs
  let chartContainer;
  
  // Animation
  let animationProgress = 0;
  let animationFrame;
  
  // Helper functions for doughnut chart
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }
  
  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  }
  
  function createDonutPath(x, y, outerRadius, innerRadius, startAngle, endAngle) {
    const outerArc = describeArc(x, y, outerRadius, startAngle, endAngle);
    const innerArc = describeArc(x, y, innerRadius, endAngle, startAngle);
    
    const start = polarToCartesian(x, y, outerRadius, endAngle);
    const end = polarToCartesian(x, y, innerRadius, endAngle);
    const start2 = polarToCartesian(x, y, innerRadius, startAngle);
    const end2 = polarToCartesian(x, y, outerRadius, startAngle);
    
    return `${outerArc} L ${end.x} ${end.y} ${innerArc} L ${end2.x} ${end2.y} Z`;
  }
  
  // Derived values
  $: centerX = width / 2;
  $: centerY = height / 2;
  $: radius = Math.min(width, height) / 2 - margin;
  $: innerRadius = radius * 0.7; // 70% cutout
  
  // Generate arcs for the doughnut
  $: total = data.reduce((sum, item) => sum + item.value, 0);
  $: arcs = data.map((item, i) => {
    const percentage = item.value / total;
    let startAngle = 0;
    
    // Calculate start angle based on previous segments
    for (let j = 0; j < i; j++) {
      startAngle += (data[j].value / total) * 360 * animationProgress;
    }
    
    const endAngle = startAngle + (percentage * 360 * animationProgress);
    
    return {
      ...item,
      startAngle,
      endAngle,
      path: createDonutPath(centerX, centerY, radius, innerRadius, startAngle, endAngle)
    };
  });
  
  // Animate the chart
  function animateChart() {
    if (animationProgress < 1) {
      animationProgress += 0.04;
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
  
  onMount(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Start animation
    animationFrame = requestAnimationFrame(animateChart);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  });
</script>

<div bind:this={chartContainer} id={chartId} class="w-full h-full">
  {#if width && height}
    <svg width={width} height={height}>
      <!-- Background -->
      <rect width={width} height={height} fill="transparent" />
      
      <!-- Doughnut segments -->
      {#each arcs as arc}
        <path d={arc.path} fill={arc.color} />
      {/each}
      
      <!-- Center text -->
      <text 
        x={centerX} 
        y={centerY - 10} 
        font-size={radius * 0.15} 
        text-anchor="middle" 
        fill="rgba(230, 230, 230, 0.7)"
      >
        Profit/Loss
      </text>
      
      <text 
        x={centerX} 
        y={centerY + 15} 
        font-size={radius * 0.2} 
        text-anchor="middle" 
        font-weight="bold" 
        fill="rgba(18, 211, 157, 1)"
      >
        98.2%
      </text>
    </svg>
  {/if}
</div>

<slot></slot>