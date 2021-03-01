import * as fs from 'fs';
import { Post } from '../definitions/post';
import * as removeMd from 'remove-markdown';

export class PostService {
  posts: Post[] = [];
  filesPath = 'src/posts';

  private applyRegexAndVerifyIfExists(string: string, regex: RegExp): string {
    const x = regex.exec(string);
    if (x === null || x[0] === null) throw new Error('Cannot apply regex');
    return x[0];
  }

  private getPreview(markdownFile: String) {
    const markdownText = markdownFile;
    const textPreview = removeMd(markdownText, {
      stripListLeaders: true ,
      listUnicodeChar: '',
      gfm: true
    }).substring(0, 150) + '...';

  return textPreview;
  }

  public getAllPosts() {
    const posts = [] as Post[];
    const files = fs.readdirSync(this.filesPath);
    
    files.forEach((filename)=> {
      let markdown = fs.readFileSync(`${this.filesPath}/${filename}`, 'utf8');
      console.log(filename)
      const post: Post = {
        slug: this.applyRegexAndVerifyIfExists(filename, /[^#]*$/).toLocaleLowerCase(),
        title: this.applyRegexAndVerifyIfExists(filename, /[^#]*$/).replace(/-/g, ' ')
        .slice(0, -3),
        type: this.applyRegexAndVerifyIfExists(filename, /(['#])(?:(?=(\\?))\2.)+\1/).replace(/#/g, ' '),
        post: markdown,
        textPreview: this.getPreview(markdown),
        postDate: new Date(filename.substring(0,10))
      }
      console.log(post.postDate);
      posts.push(post);
    });
  
    return posts.sort((a,b) => a.postDate.getTime() - b.postDate.getTime()).reverse();
  }

  public getPostsPerPage(pageSize: number, pageNumber: number) {
    const posts: Post[] = this.getAllPosts();
    const pages = [] as any[];

    while (posts.length > 0)
      pages.push(posts.splice(0, pageSize));

    return pages[pageNumber + 1];
  }

  public getPostBySlug(slug: string): Post | undefined {
    const posts: Post[] = this.getAllPosts();
    return posts.filter((x: Post) => x.slug === slug)[0];
  }
}
