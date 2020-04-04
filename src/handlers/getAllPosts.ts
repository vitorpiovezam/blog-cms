import { PostService } from '../services/post.service';

export const handler = async (_event: any, _context: any, _callback: any) => {
  const postService: PostService = new PostService();
  const posts = await postService.getAllPosts();

  _callback(null, {
    statusCode: 200,
    body: JSON.stringify(posts),
  });
};
