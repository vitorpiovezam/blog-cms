import { PostService } from '../../lib/post.service';

export const getPostBySlug = async (event: any) => {
  console.log(event);

  if (event.pathParameters.slug) {
    throw new Error('slug is not defined')
  }

  const postService: PostService = new PostService();
  const post = await postService.getPostBySlug(event.pathParameters.slug);
  
  return JSON.stringify(post);
};
