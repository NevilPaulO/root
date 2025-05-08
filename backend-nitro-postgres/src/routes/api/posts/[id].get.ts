import { PostService } from '../../../services/postService'
import { useDb } from '../../../models/db'

/**
 * @api {get} /api/posts/:id Get a post
 * @apiName GetPost
 * @apiGroup Posts
 * @apiDescription Get a post by ID
 * 
 * @apiParam {Number} id Post ID
 * 
 * @apiSuccess {Number} id Post ID
 * @apiSuccess {String} title Post title
 * @apiSuccess {String} content Post content
 * @apiSuccess {Number} userId ID of the post author
 * @apiSuccess {Boolean} published Whether the post is published
 * @apiSuccess {Date} createdAt Post creation date
 * @apiSuccess {Date} updatedAt Post last update date
 * @apiSuccess {Object} author Post author
 * @apiSuccess {Number} author.id Author ID
 * @apiSuccess {String} author.email Author email
 * @apiSuccess {String} author.firstName Author first name
 * @apiSuccess {String} author.lastName Author last name
 */
export default defineEventHandler(async (event) => {
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
  
  // Get the post
  const post = await postService.getPostById(id)
  
  // Return the post
  return post
})

