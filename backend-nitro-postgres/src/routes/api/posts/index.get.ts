import { PostService } from '../../../services/postService'
import { validateQuery, schemas } from '../../../utils/validation'
import { useDb } from '../../../models/db'

/**
 * @api {get} /api/posts Get all posts
 * @apiName GetPosts
 * @apiGroup Posts
 * @apiDescription Get a paginated list of published posts
 * 
 * @apiQuery {Number} [page=1] Page number
 * @apiQuery {Number} [limit=10] Number of posts per page
 * 
 * @apiSuccess {Object[]} data List of posts
 * @apiSuccess {Number} data.id Post ID
 * @apiSuccess {String} data.title Post title
 * @apiSuccess {String} data.content Post content
 * @apiSuccess {Boolean} data.published Whether the post is published
 * @apiSuccess {Date} data.createdAt Post creation date
 * @apiSuccess {Date} data.updatedAt Post last update date
 * @apiSuccess {Object} data.author Post author
 * @apiSuccess {Object} pagination Pagination information
 * @apiSuccess {Number} pagination.total Total number of posts
 * @apiSuccess {Number} pagination.page Current page
 * @apiSuccess {Number} pagination.limit Posts per page
 * @apiSuccess {Number} pagination.pages Total number of pages
 */
export default defineEventHandler(async (event) => {
  // Validate query parameters
  const { page = 1, limit = 10 } = validateQuery(event, schemas.pagination)
  
  // Create post service
  const db = useDb()
  const postService = new PostService(db)
  
  // Get all published posts
  const posts = await postService.getAllPosts(page, limit, true)
  
  // Return the posts
  return posts
})

