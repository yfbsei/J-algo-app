<script>
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import ChartContainer from '$lib/components/ChartContainer.svelte';
  import AppDropdown from '$lib/components/AppDropdown.svelte';
  import ParticlesBackground from '$lib/components/ParticlesBackground.svelte';
  
  // Import charts
  import PLDistributionChart from '$lib/charts/PLDistributionChart.svelte';
  import DailyPLChart from '$lib/charts/DailyPLChart.svelte';
  import CoinPerformanceChart from '$lib/charts/CoinPerformanceChart.svelte';
  import TradingActivityChart from '$lib/charts/TradingActivityChart.svelte';
  import PositionAnalysisChart from '$lib/charts/PositionAnalysisChart.svelte';
  import TimeFrameEfficiencyChart from '$lib/charts/TimeFrameEfficiencyChart.svelte';
  
  let loading = true;
  
  onMount(() => {
    // Simulate loading the dashboard data
    setTimeout(() => {
      loading = false;
    }, 800);
  });
</script>

<svelte:head>
  <title>J-algo Trading | Scientific Precision</title>
</svelte:head>

<!-- Background -->
<ParticlesBackground />

<!-- Main app container -->
<div class="flex flex-col min-h-screen relative overflow-hidden">
  <!-- Header -->
  <Header />
  
  <!-- Main content -->
  <main class="flex-1 px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
    {#if loading}
      <div class="flex items-center justify-center h-[80vh]">
        <div class="bg-[#0a7557]/70 p-6 rounded-xl backdrop-blur-md shadow-lg border border-[#12d39d]/10 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-[#12d39d] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25" stroke-dasharray="30 100" />
            <circle cx="12" cy="12" r="10" stroke-dasharray="30 100" stroke-dashoffset="50" />
          </svg>
          <p class="text-[#e6e6e6] mt-4 text-center font-medium">Loading dashboard...</p>
        </div>
      </div>
    {:else}
      <!-- Dashboard content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Profit" 
          value="$31,842.56" 
          subtitle="+15.3% this month"
          icon='<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        />
        
        <StatCard 
          title="Win Rate" 
          value="98.2%" 
          subtitle="294 successful trades"
          icon='<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        />
        
        <StatCard 
          title="Average Profit/Trade" 
          value="$108.29" 
          subtitle="$2.74 avg. loss on failed trades"
          icon='<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>'
        />
        
        <StatCard 
          title="Total Trades" 
          value="300" 
          subtitle="Last trade: 2 hours ago"
          icon='<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>'
        />
      </div>
      
      <!-- Charts section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div class="lg:col-span-2">
          <ChartContainer 
            title="Daily P&L Performance" 
            chartId="dailyChart" 
            height="250"
            hasControls={true}
            controls={['2 Weeks', '1 Month', '3 Months', '1 Year']}
          >
            <DailyPLChart />
            <div slot="footer" class="flex justify-between items-center mt-2 text-xs text-[#e6e6e6]/70">
              <span>Starting date: June 11, 2024</span>
              <span class="text-[#12d39d]">+$1,025 increase over period</span>
            </div>
          </ChartContainer>
        </div>
        
        <div>
          <ChartContainer title="P&L Distribution" chartId="plChart" height="250">
            <PLDistributionChart />
            <div slot="footer" class="grid grid-cols-2 gap-4 mt-2">
              <div class="text-xs">
                <p class="text-[#e6e6e6]/70 mb-1">Profit</p>
                <p class="text-base font-medium text-[#12d39d]">98.2%</p>
              </div>
              <div class="text-xs">
                <p class="text-[#e6e6e6]/70 mb-1">Loss</p>
                <p class="text-base font-medium text-[#e6e6e6]">1.8%</p>
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>
      
      <!-- Second row of charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <ChartContainer title="Top Performing Coins" chartId="coinChart" height="300">
          <CoinPerformanceChart />
          <div slot="footer" class="text-xs text-[#e6e6e6]/70 mt-2">
            Best performer: PEOPLE with $2,735 profit
          </div>
        </ChartContainer>
        
        <ChartContainer title="Trading Activity" chartId="tradesChart" height="300">
          <TradingActivityChart />
          <div slot="footer" class="flex justify-between items-center mt-2 text-xs text-[#e6e6e6]/70">
            <span>Last 2 weeks</span>
            <span>Total trades: 124</span>
          </div>
        </ChartContainer>
        
        <ChartContainer title="Analysis Metrics" chartId="analysisMetrics" height="300">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <p class="text-sm text-[#e6e6e6]/70 mb-2">Position Distribution</p>
              <div class="h-32">
                <PositionAnalysisChart chartId="positionChart" />
              </div>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div class="text-xs">
                  <p class="text-[#e6e6e6]/70">Long</p>
                  <p class="text-sm text-[#12d39d]">38.4%</p>
                </div>
                <div class="text-xs">
                  <p class="text-[#e6e6e6]/70">Short</p>
                  <p class="text-sm text-[#e6e6e6]">61.6%</p>
                </div>
              </div>
            </div>
            
            <div>
              <p class="text-sm text-[#e6e6e6]/70 mb-2">Timeframe Efficiency</p>
              <div class="h-32">
                <TimeFrameEfficiencyChart chartId="timeframeChart" />
              </div>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div class="text-xs">
                  <p class="text-[#e6e6e6]/70">1min</p>
                  <p class="text-sm text-[#e6e6e6]">8%</p>
                </div>
                <div class="text-xs">
                  <p class="text-[#e6e6e6]/70">5min</p>
                  <p class="text-sm text-[#12d39d]">92%</p>
                </div>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>
      
      <!-- Metrics section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-[#0a7557]/70 rounded-xl p-5 backdrop-blur-md shadow-md border border-[#12d39d]/10">
          <h2 class="text-base font-semibold text-[#12d39d] mb-4">Risk Management</h2>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-xs text-[#e6e6e6]/70">Avg. Risk/Reward</span>
                <span class="text-xs text-[#12d39d]">1:5.2</span>
              </div>
              <div class="w-full bg-[#0a7557]/50 rounded-full h-1.5">
                <div class="bg-[#12d39d] h-1.5 rounded-full" style="width: 84%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-xs text-[#e6e6e6]/70">Stop Loss Accuracy</span>
                <span class="text-xs text-[#12d39d]">96.8%</span>
              </div>
              <div class="w-full bg-[#0a7557]/50 rounded-full h-1.5">
                <div class="bg-[#12d39d] h-1.5 rounded-full" style="width: 97%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-xs text-[#e6e6e6]/70">Account Risk per Trade</span>
                <span class="text-xs text-[#12d39d]">1.2%</span>
              </div>
              <div class="w-full bg-[#0a7557]/50 rounded-full h-1.5">
                <div class="bg-[#12d39d] h-1.5 rounded-full" style="width: 30%"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-[#0a7557]/70 rounded-xl p-5 backdrop-blur-md shadow-md border border-[#12d39d]/10">
          <h2 class="text-base font-semibold text-[#12d39d] mb-4">Strategy Performance</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-[#e6e6e6]">J-Trend Sniper</span>
              <span class="inline-flex bg-[#12d39d]/20 text-[#12d39d] text-xs px-2 py-0.5 rounded">97.8%</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-[#e6e6e6]">MACD Crossover</span>
              <span class="inline-flex bg-[#12d39d]/20 text-[#12d39d] text-xs px-2 py-0.5 rounded">92.4%</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-[#e6e6e6]">RSI Divergence</span>
              <span class="inline-flex bg-[#12d39d]/20 text-[#12d39d] text-xs px-2 py-0.5 rounded">89.5%</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-[#e6e6e6]">Bollinger Squeeze</span>
              <span class="inline-flex bg-[#12d39d]/20 text-[#12d39d] text-xs px-2 py-0.5 rounded">85.2%</span>
            </div>
          </div>
        </div>
        
        <div class="bg-[#0a7557]/70 rounded-xl p-5 backdrop-blur-md shadow-md border border-[#12d39d]/10">
          <h2 class="text-base font-semibold text-[#12d39d] mb-4">Algorithm Updates</h2>
          
          <div class="space-y-3">
            <div class="border-b border-[#12d39d]/10 pb-2">
              <p class="text-sm text-[#e6e6e6] mb-1">v2.4.8 - Momentum Filter</p>
              <p class="text-xs text-[#e6e6e6]/70">Advanced filtering to reduce false signals in sideways markets</p>
            </div>
            
            <div class="border-b border-[#12d39d]/10 pb-2">
              <p class="text-sm text-[#e6e6e6] mb-1">v2.4.7 - Volatility Adjustment</p>
              <p class="text-xs text-[#e6e6e6]/70">Automatic position sizing based on real-time volatility</p>
            </div>
            
            <div>
              <p class="text-sm text-[#e6e6e6] mb-1">v2.4.6 - Pattern Recognition</p>
              <p class="text-xs text-[#e6e6e6]/70">ML-powered candlestick pattern detection with 97.8% accuracy</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom banner -->
      <div class="bg-gradient-to-r from-[#0a7557]/80 to-[#111111]/70 rounded-xl p-5 backdrop-blur-md shadow-md border border-[#12d39d]/10">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="mb-4 md:mb-0">
            <h2 class="text-lg font-semibold text-[#12d39d] mb-2">Ready to unlock the full power of algorithmic trading?</h2>
            <p class="text-sm text-[#e6e6e6]/80">Get early access to J-algo Trading's advanced suite of tools and indicators.</p>
          </div>
          
          <a 
            href="https://discord.gg/nyRUmCgwhC" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#12d39d] text-[#111111] font-medium hover:bg-[#0ea47a] transition-colors shadow-lg shadow-[#0a7557]/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 7v8a2 2 0 002 2h6M16 17l-2-2 2-2M8 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-2" />
            </svg>
            Join Discord Community
          </a>
        </div>
      </div>
    {/if}
  </main>
  
  <!-- App dropdown menu -->
  <AppDropdown />
</div>
