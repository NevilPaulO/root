import { PostService } from '../../../services/postService'
import { requireAuth } from '../../../utils/auth'
import { useDb } from '../../../models/db'

/**
 * @api {delete} /api/posts/:id Delete a post
 * @apiName DeletePost
 * @apiGroup Posts
 * @apiDescription Delete a post by ID
 * 
 * @apiHeader {String} Authorization Bearer JWT token
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {String} message Success message
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
  
  // Create post service
  const db = useDb()
  const postService = new PostService(db)
  
  // Delete the post
  const result = await postService.deletePost(id, authUser.userId)
  
  // Return success message
  return result
})

