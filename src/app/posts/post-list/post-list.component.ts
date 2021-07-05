import {Component, OnInit, Input, Injectable, OnDestroy} from '@angular/core';
import { Post } from "../post.model";
import {PostsService} from "../posts.service";
import { Subscription } from "rxjs";

@Injectable({providedIn: "root"})
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(public postService: PostsService) { }
  posts: Post[] = [];
  private postSub: Subscription;

  ngOnInit(): void {
    this.postService.getPosts();
     this.postSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }
  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
