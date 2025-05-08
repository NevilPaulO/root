import { z } from 'zod'
import { H3Event } from 'h3'

/**
 * Validate request body against a Zod schema
 * 
 * @param event - The H3 event object
 * @param schema - The Zod schema to validate against
 * @returns The validated data
 * @throws Error if validation fails
 */
export async function validateBody<T extends z.ZodType>(
  event: H3Event,
  schema: T
): Promise<z.infer<T>> {
  const body = await readBody(event)
  
  try {
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: error.format(),
      })
    }
    throw error
  }
}

/**
 * Validate query parameters against a Zod schema
 * 
 * @param event - The H3 event object
 * @param schema - The Zod schema to validate against
 * @returns The validated data
 * @throws Error if validation fails
 */
export function validateQuery<T extends z.ZodType>(
  event: H3Event,
  schema: T
): z.infer<T> {
  const query = getQuery(event)
  
  try {
    return schema.parse(query)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: error.format(),
      })
    }
    throw error
  }
}

/**
 * Common validation schemas
 */
export const schemas = {
  // User schemas
  registerUser: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  }),
  
  loginUser: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
  
  // Post schemas
  createPost: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    content: z.string().min(1, 'Content is required'),
    published: z.boolean().optional(),
  }),
  
  updatePost: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
    content: z.string().min(1, 'Content is required').optional(),
    published: z.boolean().optional(),
  }),
  
  // Comment schemas
  createComment: z.object({
    content: z.string().min(1, 'Comment is required'),
    postId: z.number().int().positive('Post ID is required'),
  }),
  
  // Pagination schema
  pagination: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
}

