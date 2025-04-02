<script>
  import { onMount } from 'svelte';
  
  let isVisible = false;
  let promptVisible = false;
  let hasSubscribed = false;
  
  function toggleDropdown() {
    isVisible = !isVisible;
  }
  
  function closeDropdown(event) {
    if (event.target.closest('#dropdown-container')) return;
    isVisible = false;
  }
  
  function handleSubscribe() {
    hasSubscribed = true;
    localStorage.setItem('hasSubscribed', 'true');
  }
  
  onMount(() => {
    // Check localStorage first (avoid unnecessary state updates)
    hasSubscribed = localStorage.getItem('hasSubscribed') === 'true';
    
    // Show prompt after a delay
    const promptTimer = setTimeout(() => {
      promptVisible = true;
    }, 2000);
    
    // Hide prompt after a few seconds
    const hideTimer = setTimeout(() => {
      promptVisible = false;
    }, 10000);
    
    // Add global click handler
    document.addEventListener('click', closeDropdown);
    
    return () => {
      document.removeEventListener('click', closeDropdown);
      clearTimeout(promptTimer);
      clearTimeout(hideTimer);
    };
  });
</script>

<div class="fixed bottom-6 left-6 z-20">
  <div id="dropdown-container" class="relative">
    <div 
      id="app-prompt" 
      class="absolute -top-23 left-0 bg-[#111111] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-700 ease-in-out"
      class:opacity-0={!promptVisible}
      class:opacity-100={promptVisible}
      class:translate-y-4={!promptVisible}
      class:translate-y-0={promptVisible}
    >
      Get access! <span class="inline-block ml-1">👆</span>
      <div class="absolute -bottom-2 left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#12d39d]/90"></div>
    </div>
    
    <button id="app-menu-toggle" aria-label="Open J-algo menu" on:click={toggleDropdown}>
      <div class="relative">
        <img 
          src="/images/jalgo-app-logo.png" 
          alt="J-algo app" 
          width="64"
          height="64"
          loading="lazy"
          class="h-16 w-auto rounded-2xl shadow-lg shadow-[#0a7557]/50 transition-transform hover:scale-105 active:scale-95" 
        />
      </div>
    </button>
      
    <div 
      id="app-dropdown" 
      class="absolute bottom-full left-0 mb-2 transition-all duration-300"
      class:opacity-0={!isVisible}
      class:opacity-100={isVisible}
      class:invisible={!isVisible}
    >
      <div class="flex flex-col gap-2 min-w-64 pt-2 pb-1">
        <div class="backdrop-blur-md bg-gradient-to-r from-[#0a7557]/90 to-[#0a7557]/80 rounded-xl overflow-hidden hover:shadow-md p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="bg-[#0ea47a]/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#12d39d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-[#12d39d]">Access J-algo</h3>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-[#e6e6e6]/80">Coming soon</span>
            <span class="inline-flex bg-[#12d39d]/20 text-[#12d39d] text-xs px-2 py-1 rounded">Beta</span>
          </div>
        </div>
        
        <div class="backdrop-blur-md bg-gradient-to-r from-[#0a7557]/90 to-[#0a7557]/80 rounded-xl overflow-hidden hover:shadow-md p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="bg-[#0ea47a]/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#12d39d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M7 12h10M7 5h10M7 19h10"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-[#12d39d]">Trading Indicators</h3>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-[#e6e6e6]/80">{hasSubscribed ? 'Access granted' : 'Subscribe for access'}</span>
            <div id="subscription-container">
              {#if !hasSubscribed}
                <a 
                  href="https://www.youtube.com/channel/UC4_X7MJ8dsj6zjQWk3pUVvA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  on:click={handleSubscribe}
                  class="flex items-center gap-2 p-1 px-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors"
                >
                  <img src="/social/youtube_icon.png" alt="YouTube" width="20" height="20" loading="lazy" class="h-5 w-5">
                  <span class="text-xs text-white">Subscribe</span>
                </a>
              {:else}
                <a 
                  href="https://www.tradingview.com/script/gp70u4Rl-J-Trend-Sniper-v2/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 p-1 px-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                  <span class="text-xs text-white">TradingView</span>
                </a>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>