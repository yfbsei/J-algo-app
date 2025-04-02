/**
 * Utility functions for custom SVG charts
 */

/**
 * Converts polar coordinates to cartesian coordinates
 * @param {number} centerX - Center X position
 * @param {number} centerY - Center Y position
 * @param {number} radius - Radius length
 * @param {number} angleInDegrees - Angle in degrees
 * @returns {Object} - {x, y} coordinates
 */
export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }
  
  /**
   * Creates an SVG arc path
   * @param {number} x - Center X position
   * @param {number} y - Center Y position 
   * @param {number} radius - Radius of the arc
   * @param {number} startAngle - Starting angle in degrees
   * @param {number} endAngle - Ending angle in degrees
   * @returns {string} - SVG path command
   */
  export function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  }
  
  /**
   * Creates a donut segment path
   * @param {number} x - Center X position
   * @param {number} y - Center Y position
   * @param {number} outerRadius - Outer radius
   * @param {number} innerRadius - Inner radius (for cutout)
   * @param {number} startAngle - Starting angle in degrees
   * @param {number} endAngle - Ending angle in degrees
   * @returns {string} - Complete SVG path for a donut segment
   */
  export function createDonutPath(x, y, outerRadius, innerRadius, startAngle, endAngle) {
    const outerArc = describeArc(x, y, outerRadius, startAngle, endAngle);
    const innerArc = describeArc(x, y, innerRadius, endAngle, startAngle);
    
    const start = polarToCartesian(x, y, outerRadius, endAngle);
    const end = polarToCartesian(x, y, innerRadius, endAngle);
    const start2 = polarToCartesian(x, y, innerRadius, startAngle);
    const end2 = polarToCartesian(x, y, outerRadius, startAngle);
    
    return `${outerArc} L ${end.x} ${end.y} ${innerArc} L ${end2.x} ${end2.y} Z`;
  }
  
  /**
   * Formats a number with dollar sign and commas
   * @param {number} value - Number to format
   * @returns {string} - Formatted string (e.g. $1,234.56)
   */
  export function formatCurrency(value) {
    return '$' + value.toLocaleString();
  }
  
  /**
   * Formats a percentage value
   * @param {number} value - Number to format
   * @returns {string} - Formatted percentage (e.g. 34.5%)
   */
  export function formatPercentage(value) {
    return value.toFixed(1) + '%';
  }
  
  /**
   * Generates a sequence of numeric values between min and max
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @param {number} steps - Number of steps
   * @returns {Array} - Array of values
   */
  export function generateRange(min, max, steps) {
    const stepSize = (max - min) / (steps - 1);
    return Array.from({ length: steps }, (_, i) => min + i * stepSize);
  }
  
  /**
   * Creates a linear scale function
   * @param {number} domainMin - Input minimum value
   * @param {number} domainMax - Input maximum value
   * @param {number} rangeMin - Output minimum value
   * @param {number} rangeMax - Output maximum value
   * @returns {Function} - Scale function
   */
  export function createLinearScale(domainMin, domainMax, rangeMin, rangeMax) {
    const domainSize = domainMax - domainMin;
    const rangeSize = rangeMax - rangeMin;
    
    return (value) => {
      if (domainSize === 0) return rangeMin;
      const normalizedValue = (value - domainMin) / domainSize;
      return rangeMin + normalizedValue * rangeSize;
    };
  }