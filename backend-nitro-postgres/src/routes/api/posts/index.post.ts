import { PostService } from '../../../services/postService'
import { validateBody, schemas } from '../../../utils/validation'
import { requireAuth } from '../../../utils/auth'
import { useDb } from '../../../models/db'

/**
 * @api {post} /api/posts Create a post
 * @apiName CreatePost
 * @apiGroup Posts
 * @apiDescription Create a new post
 * 
 * @apiHeader {String} Authorization Bearer JWT token
 * 
 * @apiBody {String} title Post title
 * @apiBody {String} content Post content
 * @apiBody {Boolean} [published=false] Whether the post is published
 * 
 * @apiSuccess {Number} id Post ID
 * @apiSuccess {String} title Post title
 * @apiSuccess {String} content Post content
 * @apiSuccess {Number} userId ID of the post author
 * @apiSuccess {Boolean} published Whether the post is published
 * @apiSuccess {Date} createdAt Post creation date
 * @apiSuccess {Date} updatedAt Post last update date
 */
export default defineEventHandler(async (event) => {
  // Require authentication
  const authUser = requireAuth(event)
  
  // Validate request body
  const data = await validateBody(event, schemas.createPost)
  
  // Create post service
  const db = useDb()
  const postService = new PostService(db)
  
  // Create the post
  const post = await postService.createPost(authUser.userId, data)
  
  // Return the post
  return post
})

