<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
  // Props
  export let title = '';
  export let chartId = '';
  export let height = '220';
  
  // Optional features
  export let hasLegend = false;
  export let hasControls = false;
  export let controls = [];
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Active control state
  let activeControl = '';
  
  onMount(() => {
    // Set initial active control
    if (controls && controls.length > 0) {
      activeControl = controls[0];
      
      // Dispatch initial timeframe change event
      setTimeout(() => {
        dispatch('timeframeChange', activeControl);
      }, 100);
    }
  });
  
  // Handle control click
  function handleControlClick(control) {
    if (activeControl !== control) {
      activeControl = control;
      dispatch('timeframeChange', control);
    }
  }
</script>

<div class="bg-[#0a7557]/70 rounded-xl overflow-hidden backdrop-blur-md shadow-md border border-[#12d39d]/10">
  <div class="flex justify-between items-center px-5 py-4 border-b border-[#12d39d]/10">
    <h2 class="text-base font-semibold text-[#12d39d]">{title}</h2>
    
    {#if hasLegend}
      <div class="flex gap-4">
        <slot name="legend"></slot>
      </div>
    {/if}
    
    {#if hasControls && controls && controls.length > 0}
      <div class="flex gap-2">
        {#each controls as control}
          <button 
            class="text-xs py-1 px-2 rounded transition-colors duration-200 {activeControl === control ? 'bg-[#12d39d]/30 text-[#12d39d]' : 'bg-[#12d39d]/10 text-[#e6e6e6]/70 hover:bg-[#12d39d]/20'}"
            on:click={() => handleControlClick(control)}
          >
            {control}
          </button>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- Chart container with explicit height -->
  <div class="p-4 relative" style="height: {height}px;">
    <slot></slot>
  </div>
  
  {#if $$slots.footer}
    <div class="px-4 pb-4">
      <slot name="footer"></slot>
    </div>
  {/if}
</div>