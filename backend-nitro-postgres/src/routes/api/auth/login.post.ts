import { UserService } from '../../../services/userService'
import { validateBody, schemas } from '../../../utils/validation'
import { useDb } from '../../../models/db'

/**
 * @api {post} /api/auth/login Login
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiDescription Authenticate a user and get a JWT token
 * 
 * @apiBody {String} email User's email address
 * @apiBody {String} password User's password
 * 
 * @apiSuccess {Object} user User information
 * @apiSuccess {Number} user.id User ID
 * @apiSuccess {String} user.email User email
 * @apiSuccess {String} user.firstName User first name
 * @apiSuccess {String} user.lastName User last name
 * @apiSuccess {String} user.role User role
 * @apiSuccess {String} token JWT token for authentication
 */
export default defineEventHandler(async (event) => {
  // Validate request body
  const { email, password } = await validateBody(event, schemas.loginUser)
  
  // Create user service
  const db = useDb()
  const userService = new UserService(db)
  
  // Login the user
  const result = await userService.login(email, password)
  
  // Return the user data and token
  return result
})

