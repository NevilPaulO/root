import { eq, and, desc } from 'drizzle-orm'
import { posts, users } from '../models/schema'
import { Database } from '../models/db'

/**
 * Post service for handling post-related business logic
 */
export class PostService {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  /**
   * Create a new post
   * 
   * @param userId - ID of the user creating the post
   * @param postData - Post data
   * @returns The created post
   */
  async createPost(userId: number, postData: {
    title: string
    content: string
    published?: boolean
  }) {
    const [newPost] = await this.db.insert(posts).values({
      title: postData.title,
      content: postData.content,
      userId,
      published: postData.published ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return newPost
  }

  /**
   * Get a post by ID
   * 
   * @param id - Post ID
   * @returns The post with author information
   */
  async getPostById(id: number) {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        author: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: false,
          },
        },
      },
    })

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Post not found',
      })
    }

    return post
  }

  /**
   * Get all posts (paginated)
   * 
   * @param page - Page number (1-based)
   * @param limit - Number of items per page
   * @param publishedOnly - Whether to return only published posts
   * @returns Paginated list of posts
   */
  async getAllPosts(page = 1, limit = 10, publishedOnly = true) {
    const offset = (page - 1) * limit

    // Build the where clause
    const whereClause = publishedOnly ? eq(posts.published, true) : undefined

    const postsList = await this.db.query.posts.findMany({
      where: whereClause,
      with: {
        author: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: false,
          },
        },
      },
      limit,
      offset,
      orderBy: desc(posts.createdAt),
    })

    // Count total posts
    const totalCount = await this.db
      .select({ count: sql`count(*)` })
      .from(posts)
      .where(whereClause || sql`1=1`)
      .then(result => Number(result[0].count))

    return {
      data: postsList,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    }
  }

  /**
   * Get posts by user ID (paginated)
   * 
   * @param userId - User ID
   * @param page - Page number (1-based)
   * @param limit - Number of items per page
   * @returns Paginated list of posts by the user
   */
  async getPostsByUserId(userId: number, page = 1, limit = 10) {
    const offset = (page - 1) * limit

    const postsList = await this.db.query.posts.findMany({
      where: eq(posts.userId, userId),
      with: {
        author: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: false,
          },
        },
      },
      limit,
      offset,
      orderBy: desc(posts.createdAt),
    })

    // Count total posts by this user
    const totalCount = await this.db
      .select({ count: sql`count(*)` })
      .from(posts)
      .where(eq(posts.userId, userId))
      .then(result => Number(result[0].count))

    return {
      data: postsList,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    }
  }

  /**
   * Update a post
   * 
   * @param id - Post ID
   * @param userId - ID of the user updating the post (for authorization)
   * @param postData - Post data to update
   * @returns The updated post
   */
  async updatePost(id: number, userId: number, postData: Partial<{
    title: string
    content: string
    published: boolean
  }>) {
    // Check if post exists and belongs to the user
    const existingPost = await this.db.query.posts.findFirst({
      where: and(
        eq(posts.id, id),
        eq(posts.userId, userId)
      ),
    })

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Post not found or you do not have permission to update it',
      })
    }

    // Update the post
    const [updatedPost] = await this.db.update(posts)
      .set({
        ...postData,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning()

    return updatedPost
  }

  /**
   * Delete a post
   * 
   * @param id - Post ID
   * @param userId - ID of the user deleting the post (for authorization)
   * @returns Success message
   */
  async deletePost(id: number, userId: number) {
    // Check if post exists and belongs to the user
    const existingPost = await this.db.query.posts.findFirst({
      where: and(
        eq(posts.id, id),
        eq(posts.userId, userId)
      ),
    })

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Post not found or you do not have permission to delete it',
      })
    }

    // Delete the post
    await this.db.delete(posts).where(eq(posts.id, id))

    return { message: 'Post deleted successfully' }
  }
}

