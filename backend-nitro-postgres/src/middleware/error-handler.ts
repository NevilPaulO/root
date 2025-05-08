import { defineEventHandler, H3Error } from 'h3'

/**
 * Global error handler middleware
 * 
 * This middleware catches all errors thrown in route handlers and formats them
 * into a consistent error response format.
 */
export default defineEventHandler((event) => {
  // Add a hook to handle errors
  event.context.onError = (error: H3Error) => {
    // Get status code from error or default to 500
    const statusCode = error.statusCode || 500
    const statusMessage = error.statusMessage || 'Internal Server Error'
    
    // Format the error response
    const response = {
      statusCode,
      statusMessage,
      message: error.message || 'An unexpected error occurred',
      data: error.data || undefined,
    }
    
    // Log server errors
    if (statusCode >= 500) {
      console.error('Server error:', error)
    }
    
    // Set the response status code and return the error response
    event.node.res.statusCode = statusCode
    return response
  }
})

