<script>
  import SocialLinks from './SocialLinks.svelte';
  
  // Pre-loaded attribute helps with performance
  const imgLoading = "eager";
</script>

<nav id="nav" class="flex justify-between items-center px-3 md:px-6 py-3 w-full backdrop-blur-sm bg-gradient-to-r from-[#0a7557]/10 to-transparent">
  <!-- Social links -->
  <SocialLinks />
  
  <!-- Logo -->
  <div class="my-auto relative group">
    <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#12d39d]/20 to-[#0ea47a]/20 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
    <img 
      src="/images/jalgo-logo.png" 
      alt="J-algo logo" 
      loading={imgLoading}
      width="320"
      height="80"
      class="w-48 md:w-64 lg:w-80 h-auto rounded-3xl opacity-60 group-hover:opacity-90 shadow-[0px_5px_15px_5px_rgba(0,0,0,0.25)] transition-all duration-500 transform group-hover:scale-[1.02]"
    />
  </div>
  
  <!-- Status indicator -->
  <div class="flex items-center gap-2">
    <div class="hidden md:flex items-center gap-2 py-1 px-3 rounded-full bg-[#0a7557]/30 border border-[#0ea47a]/20">
      <span class="inline-block w-2 h-2 rounded-full bg-rose-900 animate-pulse"></span>
      <span class="text-sm text-[#e6e6e6]">Offline</span>
    </div>
  </div>
</nav>