import { PostService } from '../../lib/post.service';

export const getAllPosts = async () => {
  const postService: PostService = new PostService();
  const posts = await postService.getAllPosts();

  return JSON.stringify(posts);
};
