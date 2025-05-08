import { eq } from 'drizzle-orm'
import { users } from '../models/schema'
import { hashPassword, comparePasswords, generateToken, JwtPayload } from '../utils/auth'
import { Database } from '../models/db'

/**
 * User service for handling user-related business logic
 */
export class UserService {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  /**
   * Register a new user
   * 
   * @param userData - User registration data
   * @returns The created user (without password)
   */
  async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) {
    // Check if user already exists
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, userData.email),
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'User with this email already exists',
      })
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password)

    // Create the user
    const [newUser] = await this.db.insert(users).values({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      createdAt: users.createdAt,
    })

    return newUser
  }

  /**
   * Authenticate a user and generate a JWT token
   * 
   * @param email - User email
   * @param password - User password
   * @returns Authentication result with token
   */
  async login(email: string, password: string) {
    // Find the user
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid email or password',
      })
    }

    // Verify the password
    const isPasswordValid = await comparePasswords(password, user.password)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid email or password',
      })
    }

    // Generate a JWT token
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const token = generateToken(payload)

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    }
  }

  /**
   * Get a user by ID
   * 
   * @param id - User ID
   * @returns The user (without password)
   */
  async getUserById(id: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'User not found',
      })
    }

    return user
  }

  /**
   * Get all users (paginated)
   * 
   * @param page - Page number (1-based)
   * @param limit - Number of items per page
   * @returns Paginated list of users
   */
  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const usersList = await this.db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
      limit,
      offset,
      orderBy: users.id,
    })

    const totalCount = await this.db
      .select({ count: sql`count(*)` })
      .from(users)
      .then(result => Number(result[0].count))

    return {
      data: usersList,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    }
  }

  /**
   * Update a user
   * 
   * @param id - User ID
   * @param userData - User data to update
   * @returns The updated user (without password)
   */
  async updateUser(id: number, userData: Partial<{
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
    isActive: boolean
  }>) {
    // Check if user exists
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    })

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'User not found',
      })
    }

    // Prepare update data
    const updateData: any = {
      ...userData,
      updatedAt: new Date(),
    }

    // Hash password if provided
    if (userData.password) {
      updateData.password = await hashPassword(userData.password)
    }

    // Update the user
    const [updatedUser] = await this.db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })

    return updatedUser
  }

  /**
   * Delete a user
   * 
   * @param id - User ID
   * @returns Success message
   */
  async deleteUser(id: number) {
    // Check if user exists
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    })

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'User not found',
      })
    }

    // Delete the user
    await this.db.delete(users).where(eq(users.id, id))

    return { message: 'User deleted successfully' }
  }
}

