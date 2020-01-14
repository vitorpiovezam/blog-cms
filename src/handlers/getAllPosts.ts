import { PostService } from '../../lib/post.service';

export const getAllPosts = async (event: any) => {
  console.log(event)

  const postService: PostService = new PostService('../src/posts');
  const posts = await postService.getAllPosts();

  return JSON.stringify(posts);
};
