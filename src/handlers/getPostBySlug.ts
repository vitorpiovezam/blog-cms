import { PostService } from '../services/post.service';

export const handler = async (event: any, _context: any, _callback: any) => {
  if (!event.pathParameters.slug) {
    throw new Error('slug is not defined')
  }

  const postService: PostService = new PostService();
  const post = await postService.getPostBySlug(event.pathParameters.slug);
  
  if (!post) _callback(null, { body: JSON.stringify(post) });

  _callback(null, {
    statusCode: 200,
    body: JSON.stringify(post),
  });
};
