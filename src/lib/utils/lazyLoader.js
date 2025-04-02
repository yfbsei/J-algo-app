// src/lib/utils/lazyLoader.js

import { writable } from 'svelte/store';

/**
 * Creates a lazily-loaded Svelte component
 * 
 * @param {Function} importFunc - Dynamic import function that returns a Promise resolving to a component
 * @returns {Function} Component constructor that loads the actual component on demand
 */
export function lazyLoad(importFunc) {
  const componentStore = writable(null);
  let loading = false;
  let loaded = false;
  
  // Return a function that can be used in place of the component
  // This will trigger loading when the component is first used
  return function LazyComponent(options) {
    if (!loaded && !loading) {
      loading = true;
      
      // Import the component
      importFunc().then(module => {
        // Get the default export (the component)
        const component = module.default;
        componentStore.set(component);
        loaded = true;
        loading = false;
      }).catch(err => {
        console.error('Error lazy loading component:', err);
        loading = false;
      });
    }
    
    // Return a store-based component
    const component = options.component || {};
    component.subscribe = componentStore.subscribe;
    
    return {
      component,
      fallback: options.fallback || {
        // Default fallback is a loading indicator
        render: () => {
          return {
            c: () => {
              const div = document.createElement('div');
              div.className = 'lazy-load-placeholder';
              div.innerHTML = '<div class="w-full h-full flex items-center justify-center"><div class="animate-pulse bg-[#0a7557]/50 w-8 h-8 rounded-full"></div></div>';
              return { div };
            },
            m: (target, anchor) => {
              target.insertBefore(div, anchor);
            },
            d: () => {
              div.remove();
            }
          };
        }
      }
    };
  };
}

/**
 * Preloads a component without rendering it
 * Useful for preloading components that will be needed soon
 * 
 * @param {Function} importFunc - Dynamic import function that returns a Promise resolving to a component
 * @returns {Promise} - Promise that resolves when the component is loaded
 */
export function preloadComponent(importFunc) {
  return importFunc();
}

/**
 * Determines if an element is in the viewport or about to be
 * 
 * @param {HTMLElement} el - Element to check
 * @param {number} offset - Offset in pixels to use as buffer
 * @returns {boolean} - True if element is in or near the viewport
 */
export function isInViewport(el, offset = 200) {
  if (!el || typeof window === 'undefined') return false;
  
  const rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight + offset &&
    rect.bottom > -offset &&
    rect.left < window.innerWidth + offset &&
    rect.right > -offset
  );
}