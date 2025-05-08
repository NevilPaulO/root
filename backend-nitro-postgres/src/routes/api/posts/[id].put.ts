import { PostService } from '../../../services/postService'
import { validateBody, schemas } from '../../../utils/validation'
import { requireAuth } from '../../../utils/auth'
import { useDb } from '../../../models/db'

/**
 * @api {put} /api/posts/:id Update a post
 * @apiName UpdatePost
 * @apiGroup Posts
 * @apiDescription Update a post by ID
 * 
 * @apiHeader {String} Authorization Bearer JWT token
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiBody {String} [title] Post title
 * @apiBody {String} [content] Post content
 * @apiBody {Boolean} [published] Whether the post is published
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
  
  // Get post ID from route params
  const id = parseInt(event.context.params?.id || '0')
  
  if (isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid post ID',
    })
  }
  
  // Validate request body
  const data = await validateBody(event, schemas.updatePost)
  
  // Create post service
  const db = useDb()
  const postService = new PostService(db)
  
  // Update the post
  const post = await postService.updatePost(id, authUser.userId, data)
  
  // Return the updated post
  return post
})

