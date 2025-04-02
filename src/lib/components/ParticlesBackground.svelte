<script>
  import { onMount, onDestroy } from 'svelte';
  
  // Props for customization
  export let particleCount = 150;
  export let particleColor = '#0a7557';
  export let particleSize = 3;
  export let particleSpeed = 0.5;
  export let connectionDistance = 100;
  export let particleOpacity = 1;
  export let fullViewport = true; // New prop to control full viewport coverage
  
  let canvasEl;
  let animationFrameId;
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let width = 0;
  let height = 0;
  let ctx;
  let bodyHeight = 0; // Track document body height
  let resizeObserver;
  
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      // Calculate vertical range based on full viewport setting
      const yRange = fullViewport ? Math.max(height, bodyHeight) : height;
      
      particles.push({
        x: Math.random() * width,
        y: Math.random() * yRange,
        vx: (Math.random() - 0.5) * particleSpeed,
        vy: (Math.random() - 0.5) * particleSpeed,
        size: Math.random() * particleSize + 1,
      });
    }
  }
  
  function drawParticles() {
    // Calculate vertical range based on full viewport setting
    const effectiveHeight = fullViewport ? Math.max(height, bodyHeight) : height;
    
    // Clear entire canvas including extended area
    ctx.clearRect(0, 0, width, effectiveHeight);
    
    // Create gradient background - extends to body height
    const gradient = ctx.createLinearGradient(0, 0, 0, effectiveHeight);
    gradient.addColorStop(0, '#111111');
    gradient.addColorStop(1, '#0a7557');
    
    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, effectiveHeight);
    
    // Draw particles with depth effect
    particles.forEach(particle => {
      // Calculate depth factor (particles lower on screen appear slightly larger)
      const depthFactor = 1 + (particle.y / effectiveHeight) * 0.3;
      
      // Adjust particle color based on depth
      const particleAlpha = Math.min(1, 0.3 + (particle.y / effectiveHeight) * 0.7) * particleOpacity;
      ctx.fillStyle = particleColor.replace(')', `, ${particleAlpha})`).replace('rgb', 'rgba');
      
      // Draw particle with depth size adjustment
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * depthFactor, 0, Math.PI * 2);
      ctx.fill();
      
      // Update position with bounds checking against effective height
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges (including extended height)
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > effectiveHeight) particle.vy *= -1;
      
      // Connect particles that are close enough
      particles.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance && distance > 0) {
          // Calculate opacity based on distance and depth
          const opacity = (1 - distance / connectionDistance) * 
                        Math.min(1, 0.1 + (particle.y / effectiveHeight) * 0.2);
          
          ctx.beginPath();
          ctx.strokeStyle = `rgba(10, 117, 87, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });
    
    // Mouse interaction (only if mouse is in viewport)
    if (mouseX > 0 && mouseY > 0) {
      particles.forEach(particle => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance * 1.5) {
          // Brighter connection to mouse
          const opacity = (1 - distance / (connectionDistance * 1.5)) * 0.5;
          
          ctx.beginPath();
          ctx.strokeStyle = `rgba(18, 211, 157, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
          
          // Create slight movement towards mouse
          particle.vx += dx > 0 ? -0.02 : 0.02;
          particle.vy += dy > 0 ? -0.02 : 0.02;
          
          // Limit velocity
          const maxVel = particleSpeed * 1.5;
          particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
          particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
        }
      });
    }
    
    // Continue animation
    animationFrameId = requestAnimationFrame(drawParticles);
  }
  
  function updateCanvasSize() {
    if (!canvasEl || typeof window === 'undefined') return;
    
    // Get the body height for full coverage
    bodyHeight = document.body.scrollHeight;
    
    // Update canvas dimensions
    width = window.innerWidth;
    height = window.innerHeight;
    
    // Set canvas size
    canvasEl.width = width;
    
    // Set height based on fullViewport setting
    canvasEl.height = fullViewport ? Math.max(height, bodyHeight) : height;
    
    // If fullViewport is true, make sure canvas covers the entire page
    if (fullViewport) {
      canvasEl.style.position = 'fixed';
      canvasEl.style.top = '0';
      canvasEl.style.left = '0';
      canvasEl.style.width = '100%';
      canvasEl.style.height = '100%';
      canvasEl.style.minHeight = `${bodyHeight}px`;
      canvasEl.style.pointerEvents = 'none';
    }
  }
  
  function handleResize() {
    updateCanvasSize();
    createParticles();
  }
  
  function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  
  // Handle scroll events to keep particle effects visible
  function handleScroll() {
    if (fullViewport) {
      // Update mouse position relative to scroll
      mouseY = window.scrollY + (mouseY % window.innerHeight);
    }
  }
  
  function observeBodyChanges() {
    // Use ResizeObserver to detect changes in body height
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateCanvasSize();
      });
      resizeObserver.observe(document.body);
    }
  }
  
  onMount(() => {
    if (!canvasEl || typeof window === 'undefined') return;
    
    // Set particle count based on screen size
    particleCount = window.innerWidth < 768 ? 80 : 150;
    
    // Initialize canvas context
    ctx = canvasEl.getContext('2d');
    
    // Set up canvas size
    updateCanvasSize();
    
    // Create particles
    createParticles();
    
    // Start animation
    drawParticles();
    
    // Set up event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Observe body changes
    observeBodyChanges();
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      
      // Clean up animation
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Clean up observer
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  });
  
  onDestroy(() => {
    if (typeof window !== 'undefined' && animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
</script>

<canvas 
  bind:this={canvasEl} 
  class="absolute inset-0 -z-1"
  class:fixed={fullViewport}
  class:w-full={true}
  class:h-full={true}
  class:top-0={fullViewport}
  class:left-0={fullViewport}
  aria-hidden="true"
></canvas>