/**
 * Utility helpers for TransitOps
 */

/**
 * Generate a unique trip code in format TRP-XXXX
 * @param {number} id - Trip ID to base code on
 * @returns {string} Trip code
 */
function generateTripCode(id) {
  const padded = String(id).padStart(4, '0');
  return `TRP-${padded}`;
}

/**
 * Format a date to ISO string without timezone
 * @param {Date} date 
 * @returns {string}
 */
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Format a datetime to ISO string
 * @param {Date} date 
 * @returns {string}
 */
function formatDateTime(date) {
  if (!date) return null;
  return new Date(date).toISOString();
}

/**
 * Check if a license is expired
 * @param {Date|string} expiryDate 
 * @returns {boolean}
 */
function isLicenseExpired(expiryDate) {
  if (!expiryDate) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
}

/**
 * Check if a date is expiring soon (within 30 days)
 * @param {Date|string} expiryDate 
 * @returns {boolean}
 */
function isExpiringSoon(expiryDate) {
  if (!expiryDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 30;
}

/**
 * Calculate fleet utilization percentage
 * @param {number} activeVehicles 
 * @param {number} totalVehicles 
 * @returns {number}
 */
function calculateFleetUtilization(activeVehicles, totalVehicles) {
  if (!totalVehicles || totalVehicles === 0) return 0;
  return Math.round((activeVehicles / totalVehicles) * 100);
}

/**
 * Generate CSV content from array of objects
 * @param {Array} data 
 * @param {Array} headers - Array of {key, label}
 * @returns {string}
 */
function generateCSV(data, headers) {
  const headerRow = headers.map(h => h.label).join(',');
  const rows = data.map(row => {
    return headers.map(h => {
      const val = row[h.key];
      if (val === null || val === undefined) return '';
      const str = String(val);
      // Escape quotes and wrap in quotes if contains comma
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',');
  });
  return [headerRow, ...rows].join('\n');
}

/**
 * Set CSV response headers
 * @param {object} res - Express response object
 * @param {string} filename 
 */
function setCSVHeaders(res, filename) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
}

module.exports = {
  generateTripCode,
  formatDate,
  formatDateTime,
  isLicenseExpired,
  isExpiringSoon,
  calculateFleetUtilization,
  generateCSV,
  setCSVHeaders
};
