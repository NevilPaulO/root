import { UserService } from '../../../services/userService'
import { validateBody, schemas } from '../../../utils/validation'
import { useDb } from '../../../models/db'

/**
 * @api {post} /api/auth/register Register a new user
 * @apiName RegisterUser
 * @apiGroup Auth
 * @apiDescription Register a new user account
 * 
 * @apiBody {String} email User's email address
 * @apiBody {String} password User's password (min 8 characters)
 * @apiBody {String} firstName User's first name
 * @apiBody {String} lastName User's last name
 * 
 * @apiSuccess {Object} user User information
 * @apiSuccess {Number} user.id User ID
 * @apiSuccess {String} user.email User email
 * @apiSuccess {String} user.firstName User first name
 * @apiSuccess {String} user.lastName User last name
 * @apiSuccess {String} user.role User role
 * @apiSuccess {Date} user.createdAt User creation date
 */
export default defineEventHandler(async (event) => {
  // Validate request body
  const data = await validateBody(event, schemas.registerUser)
  
  // Create user service
  const db = useDb()
  const userService = new UserService(db)
  
  // Register the user
  const user = await userService.register(data)
  
  // Return the user data
  return user
})

