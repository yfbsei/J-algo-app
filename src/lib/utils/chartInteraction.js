// src/lib/utils/chartInteraction.js
/**
 * Chart Interaction Utilities
 * Provides reusable interaction handlers for SVG-based charts
 */

/**
 * Creates a tooltip for chart elements
 * @param {HTMLElement} container - The chart container element
 * @param {Object} options - Configuration options
 * @returns {Object} - Tooltip methods
 */
export function createTooltip(container, options = {}) {
    // Default options
    const defaults = {
      className: 'chart-tooltip',
      offset: { x: 10, y: 10 },
      duration: 200
    };
    
    const config = { ...defaults, ...options };
    
    // Create tooltip element if it doesn't exist
    let tooltip = container.querySelector(`.${config.className}`);
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = config.className;
      tooltip.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        padding: 8px 12px;
        background: rgba(10, 117, 87, 0.9);
        border: 1px solid rgba(18, 211, 157, 0.3);
        border-radius: 6px;
        color: white;
        font-size: 12px;
        pointer-events: none;
        opacity: 0;
        transition: opacity ${config.duration}ms;
        backdrop-filter: blur(8px);
        z-index: 100;
        max-width: 200px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      `;
      container.appendChild(tooltip);
    }
    
    // Calculate position based on event and offset
    const updatePosition = (event, content) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left + config.offset.x;
      const y = event.clientY - rect.top + config.offset.y;
      
      // Make sure tooltip stays within container bounds
      const tooltipRect = tooltip.getBoundingClientRect();
      const adjustedX = Math.min(x, rect.width - tooltipRect.width - 10);
      const adjustedY = Math.min(y, rect.height - tooltipRect.height - 10);
      
      tooltip.style.transform = `translate(${adjustedX}px, ${adjustedY}px)`;
      tooltip.innerHTML = content;
    };
    
    // Show the tooltip
    const show = (event, content) => {
      updatePosition(event, content);
      tooltip.style.opacity = '1';
    };
    
    // Hide the tooltip
    const hide = () => {
      tooltip.style.opacity = '0';
    };
    
    return {
      show,
      hide,
      update: updatePosition
    };
  }
  
  /**
   * Adds hover detection to SVG elements
   * @param {SVGElement} element - SVG element to add hover detection to
   * @param {Function} onHover - Callback for hover event
   * @param {Function} onLeave - Callback for leave event
   */
  export function addHoverEffects(element, onHover, onLeave) {
    // Store original styles
    const originalFill = element.getAttribute('fill');
    const originalStroke = element.getAttribute('stroke');
    const originalStrokeWidth = element.getAttribute('stroke-width');
    
    // Hover state
    element.addEventListener('mouseenter', (event) => {
      // Brighten the element
      if (originalFill && !originalFill.includes('url(')) {
        element.setAttribute('fill', brightenColor(originalFill, 0.2));
      }
      
      if (originalStroke) {
        element.setAttribute('stroke-width', parseFloat(originalStrokeWidth || 1) + 1);
      }
      
      if (onHover) onHover(event, element);
    });
    
    // Leave state
    element.addEventListener('mouseleave', (event) => {
      // Restore original styles
      if (originalFill) {
        element.setAttribute('fill', originalFill);
      }
      
      if (originalStroke) {
        element.setAttribute('stroke-width', originalStrokeWidth || 1);
      }
      
      if (onLeave) onLeave(event, element);
    });
  }
  
  /**
   * Creates a time period selector for charts
   * @param {HTMLElement} container - The control container
   * @param {Array} periods - Array of period options
   * @param {Function} onChange - Callback when period changes
   */
  export function createTimeControls(container, periods, onChange) {
    periods.forEach((period, index) => {
      const button = document.createElement('button');
      button.className = `chart-control ${index === 0 ? 'active' : ''}`;
      button.textContent = period;
      
      button.addEventListener('click', () => {
        // Update active state
        container.querySelectorAll('.chart-control').forEach(btn => {
          btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Call callback
        if (onChange) onChange(period, index);
      });
      
      container.appendChild(button);
    });
  }
  
  /**
   * Brightens a color by a given factor
   * @param {string} color - CSS color string
   * @param {number} factor - Brightening factor (0-1)
   * @returns {string} - Brightened color
   */
  function brightenColor(color, factor) {
    // Handle rgba and rgb formats
    if (color.startsWith('rgba(') || color.startsWith('rgb(')) {
      const values = color.replace(/rgba?\(|\)/g, '').split(',');
      const r = Math.min(255, parseInt(values[0]) + 255 * factor);
      const g = Math.min(255, parseInt(values[1]) + 255 * factor);
      const b = Math.min(255, parseInt(values[2]) + 255 * factor);
      const a = values.length === 4 ? values[3] : 1;
      
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
    }
    
    // Handle hex format
    if (color.startsWith('#')) {
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);
      
      r = Math.min(255, Math.round(r + 255 * factor));
      g = Math.min(255, Math.round(g + 255 * factor));
      b = Math.min(255, Math.round(b + 255 * factor));
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    return color; // Return original color if format not supported
  }
  
  /**
   * Adds zoom and pan functionality to a chart
   * @param {SVGElement} svg - SVG element to add zoom/pan to
   * @param {Object} options - Configuration options
   */
  export function addZoomPan(svg, options = {}) {
    const defaults = {
      minScale: 0.5,
      maxScale: 3,
      zoomSpeed: 0.1
    };
    
    const config = { ...defaults, ...options };
    let scale = 1;
    let pointX = 0;
    let pointY = 0;
    let start = { x: 0, y: 0 };
    
    // Get the main group element
    const mainGroup = svg.querySelector('g') || svg;
    
    // Set initial transform
    mainGroup.setAttribute('transform', `translate(0,0) scale(1)`);
    
    // Zoom functionality
    svg.addEventListener('wheel', (event) => {
      event.preventDefault();
      
      const delta = -Math.sign(event.deltaY);
      const rect = svg.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      
      // Calculate new scale
      const newScale = Math.max(config.minScale, Math.min(config.maxScale, scale + delta * config.zoomSpeed));
      
      // Calculate zoom point
      const zoomRatio = newScale / scale;
      pointX = offsetX - zoomRatio * (offsetX - pointX);
      pointY = offsetY - zoomRatio * (offsetY - pointY);
      
      scale = newScale;
      
      // Apply transform
      mainGroup.setAttribute('transform', `translate(${pointX},${pointY}) scale(${scale})`);
    });
    
    // Pan functionality
    svg.addEventListener('mousedown', (event) => {
      event.preventDefault();
      start = { x: event.clientX - pointX, y: event.clientY - pointY };
      
      const mousemove = (moveEvent) => {
        pointX = moveEvent.clientX - start.x;
        pointY = moveEvent.clientY - start.y;
        mainGroup.setAttribute('transform', `translate(${pointX},${pointY}) scale(${scale})`);
      };
      
      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      };
      
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    });
    
    // Return control methods
    return {
      reset: () => {
        scale = 1;
        pointX = 0;
        pointY = 0;
        mainGroup.setAttribute('transform', `translate(0,0) scale(1)`);
      },
      zoomIn: () => {
        scale = Math.min(config.maxScale, scale + config.zoomSpeed);
        mainGroup.setAttribute('transform', `translate(${pointX},${pointY}) scale(${scale})`);
      },
      zoomOut: () => {
        scale = Math.max(config.minScale, scale - config.zoomSpeed);
        mainGroup.setAttribute('transform', `translate(${pointX},${pointY}) scale(${scale})`);
      }
    };
  }