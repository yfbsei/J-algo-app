<script>
  export let title = '';
  export let chartId = '';
  export let height = '220';
  
  // Optional features
  export let hasLegend = false;
  export let hasControls = false;
  export let controls = [];
</script>

<div class="bg-[#0a7557]/70 rounded-xl overflow-hidden backdrop-blur-md shadow-md border border-[#12d39d]/10">
  <div class="flex justify-between items-center px-5 py-4 border-b border-[#12d39d]/10">
    <h2 class="text-base font-semibold text-[#12d39d]">{title}</h2>
    
    {#if hasLegend}
      <div class="flex gap-4">
        <slot name="legend"></slot>
      </div>
    {/if}
    
    {#if hasControls && controls.length > 0}
      <div class="flex gap-2">
        {#each controls as control, i}
          <span class="text-xs py-1 px-2 rounded {i === 0 ? 'bg-[#12d39d]/30 text-[#12d39d]' : 'bg-[#12d39d]/10 text-[#e6e6e6]/70 cursor-pointer'}">{control}</span>
        {/each}
      </div>
    {/if}
  </div>
  <div class="p-4" style="height: {height}px;">
    <canvas id={chartId} style="width: 100%; height: 100%;"></canvas>
  </div>
  
  {#if $$slots.footer}
    <div class="px-4 pb-4">
      <slot name="footer"></slot>
    </div>
  {/if}
</div>