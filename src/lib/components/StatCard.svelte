
<script>
  export let title = '';
  export let value = '';
  export let subtitle = '';
  export let icon = '';
  export let iconColor = 'text-[#12d39d]';
  export let valueColor = 'text-[#12d39d]';
  export let subtitleColor = 'text-[#e6e6e6]/70';
</script>

<div class="bg-[#0a7557]/70 rounded-xl p-4 flex items-center backdrop-blur-md shadow-md border border-[#12d39d]/10 transition-transform duration-200 hover:translate-y-[-2px] hover:shadow-lg">
  <div class="bg-[#12d39d]/20 rounded-full w-12 h-12 flex items-center justify-center mr-4 {iconColor}">
    {@html icon}
  </div>
  <div class="flex-1">
    <h3 class="text-xs font-medium text-[#e6e6e6]/70 uppercase tracking-wider mb-1">{title}</h3>
    <p class="text-xl font-bold {valueColor} mb-1">{value}</p>
    <div class="text-xs {subtitleColor}">
      <slot>{subtitle}</slot>
    </div>
  </div>
</div>