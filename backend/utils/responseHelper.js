
/**
 * Standardized API response helper function
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {any} data - Response data
 * @param {string} message - Response message
 */
const sendResponse = (res, statusCode, data, message = '') => {
    res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data
    });
  };
  
  /**
   * Success response helper
   * @param {Object} res - Express response object
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    sendResponse(res, statusCode, data, message);
  };
  
  /**
   * Error response helper
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 400)
   */
  const sendError = (res, message = 'Error', statusCode = 400) => {
    sendResponse(res, statusCode, null, message);
  };
  
  /**
   * Validation error response helper
   * @param {Object} res - Express response object
   * @param {Array|string} errors - Validation errors
   */
  const sendValidationError = (res, errors) => {
    const message = Array.isArray(errors) ? errors.join(', ') : errors;
    sendError(res, message, 400);
  };
  
  /**
   * Not found response helper
   * @param {Object} res - Express response object
   * @param {string} resource - Resource name (e.g., 'Product')
   */
  const sendNotFound = (res, resource = 'Resource') => {
    sendError(res, `${resource} not found`, 404);
  };
  
  module.exports = {
    sendResponse,
    sendSuccess,
    sendError,
    sendValidationError,
    sendNotFound
  };
