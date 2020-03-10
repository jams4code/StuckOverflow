import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from '../models/post';
import { map } from 'rxjs/operators';
import { ApiUrl } from 'src/app/common/ApiUrl';
import { Observable, observable } from 'rxjs';
import { Comment } from '../models/comment';
import { searchQuery } from '../models/searchQuery';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class PostService {
  post : Post;
  posts : Post[];
  query : string;
  constructor(private http: HttpClient) { }
  
  getQuestions() {
    return Observable.create(observer => {
      this.http.get<Post[]>(ApiUrl.getUrl('Posts')).subscribe((data : any) => {
        observer.next(data)
        observer.complete()
        this.posts = data;
      });
    });
  }
  getAll() {
    return this.http.get<Post[]>(ApiUrl.getUrl('Posts/questions/All'))
      .pipe(map(res => res.map(m => new Post(m.id, m.title, m.body, m.timestamp, m.editTimeStamp, m.replies, m.nbReplies, m.acceptedAnswerId, m.author, m.comments, m.score, m.nbViews, m.lastActivityTimeStamp, m.tags, m.votes, m.parentId))));
  }
  getLastQuestion() {
    return this.http.get<Post[]>(ApiUrl.getUrl('Posts/questions/Last'))
      .pipe(map(res => res.map(m => new Post(m.id, m.title, m.body, m.timestamp, m.editTimeStamp, m.replies, m.nbReplies, m.acceptedAnswerId, m.author, m.comments, m.score, m.nbViews, m.lastActivityTimeStamp,m.tags, m.votes, m.parentId))));
  }

  getPostById(id : number){
    return Observable.create(observer => {
      this.http.get<Post>(ApiUrl.getUrl('Posts/' + id)).subscribe((data: Post) => {
        this.post = data;
        observer.next(data)
        observer.complete()
      });
    }); 
  }

  createNewPost(post, parentId){
    return Observable.create(observer => {
      this.http.post(ApiUrl.getUrl('Posts/' + parentId), post).subscribe((data: any) => {
        observer.next(data)
        observer.complete()
      });
    });
  }

  updatePost(postId, post){
    return Observable.create(observer => {
      this.http.put(ApiUrl.getUrl('Posts/' + postId), post).subscribe((data : any) => {
        observer.next(data)
        observer.complete()
      });
    });
  }

  deletePost(postId){
    return Observable.create(observer => {
      this.http.delete(ApiUrl.getUrl('Posts/' + postId)).subscribe((data : any) => {
        observer.next({post: data})
        observer.complete()
      });
    });
  }
  //Comments to update directly the actual post
  createNewComment(comment : Comment, postId : number){
    comment.author = null; // Author =! user & we don't need it.
    return Observable.create(observer => {
      this.http.post(ApiUrl.getUrl('Comments/' + postId), comment).subscribe((data: Comment) => {
        observer.next(data)
        observer.complete()
      });
    });
  }

  updateComment(postId, comment : Comment){
    comment.author = null; // Author =! user & we don't need it.
    return Observable.create(observer => {
      this.http.put(ApiUrl.getUrl('Comments/' + postId), comment).subscribe((data : Comment) => {
        observer.next(data)
        observer.complete()
      });
    });
  }
  deleteComment(commentId){
    return Observable.create(observer => {
      this.http.delete(ApiUrl.getUrl('Comments/' + commentId)).subscribe((data : any) => {
        observer.next({comment: data})
        observer.complete()
      });
    });
  }

  search(searchQuery : searchQuery){
    console.log("search");
    var search = "?";
    if(searchQuery.keywords.length > 0){
      search += "keywords=" + searchQuery.keywords + "&"
    }
    search += "filter=" + searchQuery.filter;
    console.log(ApiUrl.getUrl('Posts/Filter' + search));
    return Observable.create(observer => {
      this.http.get<Post[]>(ApiUrl.getUrl('Posts/Filter' + search)).subscribe((data : any) => {
        observer.next(data)
        observer.complete()
        this.posts = data;
        console.log(this.posts);
        console.log(data);
      });
    });
      
  }
  getPostByTag(tagId : number){
    return Observable.create(observer => {
      this.http.get<Post[]>(ApiUrl.getUrl('Posts/Tag/' + tagId)).subscribe((data : any) => {
        observer.next(data)
        observer.complete()
        this.posts = data;
      });
    });
  }

}