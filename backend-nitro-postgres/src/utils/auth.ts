import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { H3Event } from 'h3'

/**
 * Interface for JWT payload
 */
export interface JwtPayload {
  userId: number
  email: string
  role: string
  iat?: number
  exp?: number
}

/**
 * Generate a JWT token for a user
 * 
 * @param payload - The data to encode in the JWT
 * @returns The JWT token string
 */
export function generateToken(payload: JwtPayload): string {
  const config = useRuntimeConfig()
  const secret = config.jwtSecret as string
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  
  return jwt.sign(payload, secret, { expiresIn: '24h' })
}

/**
 * Verify and decode a JWT token
 * 
 * @param token - The JWT token to verify
 * @returns The decoded payload or null if invalid
 */
export function verifyToken(token: string): JwtPayload | null {
  const config = useRuntimeConfig()
  const secret = config.jwtSecret as string
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  
  try {
    return jwt.verify(token, secret) as JwtPayload
  } catch (error) {
    return null
  }
}

/**
 * Hash a password using bcrypt
 * 
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare a plain text password with a hashed password
 * 
 * @param password - The plain text password
 * @param hashedPassword - The hashed password to compare against
 * @returns True if the passwords match, false otherwise
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Get the authenticated user from the request
 * 
 * @param event - The H3 event object
 * @returns The authenticated user or null if not authenticated
 */
export function getAuthUser(event: H3Event): JwtPayload | null {
  // Get the authorization header
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  // Extract and verify the token
  const token = authHeader.substring(7)
  return verifyToken(token)
}

/**
 * Middleware to require authentication
 * 
 * @param event - The H3 event object
 */
export function requireAuth(event: H3Event): JwtPayload {
  const user = getAuthUser(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Authentication required',
    })
  }
  
  return user
}

/**
 * Middleware to require a specific role
 * 
 * @param event - The H3 event object
 * @param role - The required role
 */
export function requireRole(event: H3Event, role: string): JwtPayload {
  const user = requireAuth(event)
  
  if (user.role !== role) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Insufficient permissions',
    })
  }
  
  return user
}

