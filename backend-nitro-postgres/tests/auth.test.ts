import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { UserService } from '../src/services/userService'
import { hashPassword } from '../src/utils/auth'

// Mock the database
vi.mock('../src/models/db', () => {
  return {
    useDb: vi.fn(),
  }
})

// Mock createError
vi.mock('h3', () => {
  return {
    createError: vi.fn((options) => {
      throw new Error(options.message)
    }),
  }
})

describe('UserService', () => {
  let userService: UserService
  let mockDb: any

  beforeEach(() => {
    // Create a mock database
    mockDb = {
      query: {
        users: {
          findFirst: vi.fn(),
          findMany: vi.fn(),
        },
      },
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      select: vi.fn(),
    }

    // Initialize the user service with the mock database
    userService = new UserService(mockDb as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Mock the database responses
      mockDb.query.users.findFirst.mockResolvedValue(null)
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'user',
            createdAt: new Date(),
          }]),
        }),
      })

      // Call the register method
      const result = await userService.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })

      // Verify the result
      expect(result).toEqual(expect.objectContaining({
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
      }))

      // Verify that the database was called correctly
      expect(mockDb.query.users.findFirst).toHaveBeenCalledTimes(1)
      expect(mockDb.insert).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if the user already exists', async () => {
      // Mock the database to return an existing user
      mockDb.query.users.findFirst.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      })

      // Call the register method and expect it to throw
      await expect(userService.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })).rejects.toThrow('User with this email already exists')

      // Verify that the database was called correctly
      expect(mockDb.query.users.findFirst).toHaveBeenCalledTimes(1)
      expect(mockDb.insert).not.toHaveBeenCalled()
    })
  })

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Mock the hashPassword function
      vi.mock('../src/utils/auth', () => {
        return {
          hashPassword: vi.fn(),
          comparePasswords: vi.fn().mockResolvedValue(true),
          generateToken: vi.fn().mockReturnValue('mock_token'),
        }
      })

      // Mock the database to return a user
      mockDb.query.users.findFirst.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
      })

      // Call the login method
      const result = await userService.login('test@example.com', 'password123')

      // Verify the result
      expect(result).toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'user',
        },
        token: 'mock_token',
      })

      // Verify that the database was called correctly
      expect(mockDb.query.users.findFirst).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if the user does not exist', async () => {
      // Mock the database to return no user
      mockDb.query.users.findFirst.mockResolvedValue(null)

      // Call the login method and expect it to throw
      await expect(userService.login('test@example.com', 'password123'))
        .rejects.toThrow('Invalid email or password')

      // Verify that the database was called correctly
      expect(mockDb.query.users.findFirst).toHaveBeenCalledTimes(1)
    })
  })
})

