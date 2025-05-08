import { UserService } from '../../../services/userService'
import { requireAuth } from '../../../utils/auth'
import { useDb } from '../../../models/db'

/**
 * @api {get} /api/auth/me Get current user
 * @apiName GetCurrentUser
 * @apiGroup Auth
 * @apiDescription Get the currently authenticated user's information
 * 
 * @apiHeader {String} Authorization Bearer JWT token
 * 
 * @apiSuccess {Object} user User information
 * @apiSuccess {Number} user.id User ID
 * @apiSuccess {String} user.email User email
 * @apiSuccess {String} user.firstName User first name
 * @apiSuccess {String} user.lastName User last name
 * @apiSuccess {String} user.role User role
 * @apiSuccess {Boolean} user.isActive Whether the user is active
 * @apiSuccess {Date} user.createdAt User creation date
 * @apiSuccess {Date} user.updatedAt User last update date
 */
export default defineEventHandler(async (event) => {
  // Require authentication
  const authUser = requireAuth(event)
  
  // Create user service
  const db = useDb()
  const userService = new UserService(db)
  
  // Get the user by ID
  const user = await userService.getUserById(authUser.userId)
  
  // Return the user data
  return user
})

