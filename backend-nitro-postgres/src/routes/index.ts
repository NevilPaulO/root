/**
 * Root route handler
 * 
 * @api {get} / API Information
 * @apiName GetApiInfo
 * @apiGroup Info
 * @apiDescription Get basic API information
 * 
 * @apiSuccess {String} name API name
 * @apiSuccess {String} version API version
 * @apiSuccess {String} description API description
 * @apiSuccess {String} docsUrl URL to API documentation
 */
export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  
  return {
    name: 'Nitro PostgreSQL API',
    version: '1.0.0',
    description: 'A well-documented backend application built with Nitro and PostgreSQL with database migrations',
    docsUrl: `${config.public.apiBase}/docs`,
  }
})

