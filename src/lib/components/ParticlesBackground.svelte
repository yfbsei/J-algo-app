<script>
  import { onMount, onDestroy } from 'svelte';
  
  let canvasEl;
  let animationFrameId;
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let width = 0;
  let height = 0;
  let ctx;
  
  // Configuration
  const particleColor = '#0a7557';
  let particleCount = 150;
  const particleSize = 3;
  const particleSpeed = 0.5;
  const connectionDistance = 100;
  
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * particleSpeed,
        vy: (Math.random() - 0.5) * particleSpeed,
        size: Math.random() * particleSize + 1,
      });
    }
  }
  
  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw particles
    ctx.fillStyle = particleColor;
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      
      // Connect particles that are close enough
      particles.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(10, 117, 87, ${(1 - distance / connectionDistance) * 0.2})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });
    
    // Mouse interaction
    if (mouseX > 0 && mouseY > 0) {
      particles.forEach(particle => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance * 1.5) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(18, 211, 157, ${(1 - distance / (connectionDistance * 1.5)) * 0.3})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      });
    }
    
    animationFrameId = requestAnimationFrame(drawParticles);
  }
  
  function handleResize() {
    if (!canvasEl) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvasEl.width = width;
    canvasEl.height = height;
    createParticles();
  }
  
  function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  
  onMount(() => {
    if (!canvasEl) return;
    
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      // Set particle count based on screen size
      particleCount = window.innerWidth < 768 ? 80 : 150;
      
      ctx = canvasEl.getContext('2d');
      width = window.innerWidth;
      height = window.innerHeight;
      canvasEl.width = width;
      canvasEl.height = height;
      
      createParticles();
      drawParticles();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  });
  
  onDestroy(() => {
    if (typeof window !== 'undefined' && animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
</script>

<canvas bind:this={canvasEl} class="absolute inset-0 w-full h-full -z-1" aria-hidden="true"></canvas>