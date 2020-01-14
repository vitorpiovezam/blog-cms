import { Post } from '../src/models/post';
import * as fs from 'fs';
const removeMd = require('@azu/remove-markdown');

export class PostService {
  posts: Post[] = [];
  filesPath: string;

  constructor(filesPath: string) {
    this.filesPath = filesPath;
  }

  private getSlug(slug: string): string {
    const text =  (/[^#]*$/.exec(slug)[0]);
    return text.slice(0, text.length-3);
  }
  
  private getTitle (slug: string): string {
    let text =  (/[^#]*$/.exec(slug)[0]);
    let title = (text.slice(0, text.length-3)).replace(/-/g,' ');
    title = title.charAt(0).toUpperCase() + title.slice(1)
    return title;
  } 
  
  private getType (slug: string): string {
    return (/(['#])(?:(?=(\\?))\2.)+\1/.exec(slug)[0]).replace('#','').slice(0, -1);
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
      
      const post: Post = {
        slug: this.getSlug(filename),
        title: this.getTitle(filename),
        type: this.getType(filename),
        post: markdown,
        textPreview: this.getPreview(markdown),
        postDate: new Date(filename.substring(0,10))
      }
  
      posts.push(post);
    });
  
    return posts.sort((a,b) => b.postDate.getTime() - a.postDate.getTime());
  }

  public getPostsPerPage(pageSize: number, pageNumber: number) {
    const posts: Post[] = this.getAllPosts();
    const pages = [] as any[];

    while (posts.length > 0)
      pages.push(posts.splice(0, pageSize));

    return pages[pageNumber + 1];
  }

  public getPostBySlug(slug: string) {
    const posts: Post[] = this.getAllPosts();
    return posts.filter((x: Post) => x.slug === slug);
  }
}
