<script>
  import { onMount } from 'svelte';
  
  // Props for customization
  export let particleCount = 150;
  export let particleColor = "rgb(10, 117, 87)"; // Updated to RGB format
  export let particleSize = 4;
  export let particleSpeed = 1;
  export let connectionDistance = 100;
  export let particleOpacity = 1;
  export let fullViewport = true; // Controls full viewport coverage
  
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
    const yRange = fullViewport ? Math.max(height, bodyHeight) : height;
    for (let i = 0; i < particleCount; i++) {
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
    const effectiveHeight = fullViewport ? Math.max(height, bodyHeight) : height;
    // Clear the canvas
    ctx.clearRect(0, 0, width, effectiveHeight);
    
    // Create gradient background (extending to the effective height)
    const gradient = ctx.createLinearGradient(0, 0, 0, effectiveHeight);
    gradient.addColorStop(0, '#111111');
    gradient.addColorStop(1, '#0a7557');
    
    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, effectiveHeight);
    
    // Draw each particle
    particles.forEach(particle => {
      const depthFactor = 1 + (particle.y / effectiveHeight) * 0.3;
      // Compute alpha based on depth and overall opacity
      const particleAlpha = Math.min(1, 0.3 + (particle.y / effectiveHeight) * 0.7) * particleOpacity;
      // Convert "rgb(...)" to "rgba(..., alpha)"
      ctx.fillStyle = particleColor.replace(')', `, ${particleAlpha})`).replace('rgb', 'rgba');
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * depthFactor, 0, Math.PI * 2);
      ctx.fill();
      
      // Update particle position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > effectiveHeight) particle.vy *= -1;
      
      // Draw connections between close particles
      particles.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < connectionDistance && distance > 0) {
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
    
    // Mouse interaction: draw connections to mouse and apply a slight attraction
    if (mouseX > 0 && mouseY > 0) {
      particles.forEach(particle => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < connectionDistance * 1.5) {
          const opacity = (1 - distance / (connectionDistance * 1.5)) * 0.5;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(18, 211, 157, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
          
          // Slight movement towards the mouse
          particle.vx += dx > 0 ? -0.02 : 0.02;
          particle.vy += dy > 0 ? -0.02 : 0.02;
          
          const maxVel = particleSpeed * 1.5;
          particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
          particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
        }
      });
    }
    
    // Continue the animation loop
    animationFrameId = requestAnimationFrame(drawParticles);
  }
  
  function updateCanvasSize() {
    if (!canvasEl || typeof window === 'undefined') return;
    
    // Get the current body height
    bodyHeight = document.body.scrollHeight;
    width = window.innerWidth;
    height = window.innerHeight;
    
    // Update canvas dimensions
    canvasEl.width = width;
    canvasEl.height = fullViewport ? Math.max(height, bodyHeight) : height;
    
    // If fullViewport, fix the canvas to cover the entire page
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
  
  function handleScroll() {
    if (fullViewport) {
      // Adjust mouseY based on scroll position
      mouseY = window.scrollY + (mouseY % window.innerHeight);
    }
  }
  
  function observeBodyChanges() {
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateCanvasSize();
      });
      resizeObserver.observe(document.body);
    }
  }
  
  onMount(() => {
    if (!canvasEl || typeof window === 'undefined') return;
    
    // Adjust particle count based on screen size
    particleCount = window.innerWidth < 768 ? 80 : 150;
    
    ctx = canvasEl.getContext('2d');
    updateCanvasSize();
    createParticles();
    drawParticles();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    observeBodyChanges();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
    };
  });
</script>

<canvas
  bind:this={canvasEl}
  class="absolute inset-0 -z-10"
  class:fixed={fullViewport}
  class:w-full={true}
  class:h-full={true}
  class:top-0={fullViewport}
  class:left-0={fullViewport}
  aria-hidden="true"
>
</canvas>

